import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function getEnv(mode) {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    VEIMAGE_HOST: env.VEIMAGE_HOST || 'imagex.volcengineapi.com',
    VEIMAGE_REGION: env.VEIMAGE_REGION || 'cn-north-1',
    VEIMAGE_SERVICE: env.VEIMAGE_SERVICE || 'imagex',
    VEIMAGE_AK: env.VEIMAGE_AK || '',
    VEIMAGE_SK: env.VEIMAGE_SK || '',
  };
}

const ACTION = 'GetImageEraseResult';
const VERSION = '2023-05-01';

function rfc3986Encode(str) {
  return Array.from(str, (char) => {
    const code = char.codePointAt(0);
    if (
      (code >= 0x30 && code <= 0x39) ||
      (code >= 0x41 && code <= 0x5A) ||
      (code >= 0x61 && code <= 0x7A) ||
      code === 0x2D ||
      code === 0x2E ||
      code === 0x5F ||
      code === 0x7E
    ) {
      return char;
    }
    const buf = Buffer.from(char, 'utf8');
    return Array.from(buf)
      .map((byte) => `%${byte.toString(16).toUpperCase().padStart(2, '0')}`)
      .join('');
  }).join('');
}

function sha256Hex(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function hmacSha256(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function hmacSha256Hex(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

function buildSigningKey(secret, date, region, service) {
  const kDate = hmacSha256(secret, date);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, service);
  return hmacSha256(kService, 'request');
}

function buildCanonicalQueryString(params) {
  return Object.keys(params)
    .sort()
    .map((key) => `${rfc3986Encode(key)}=${rfc3986Encode(params[key])}`)
    .join('&');
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function parseConfigFile(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...rest] = line.split('=');
      if (!key) return acc;
      acc[key.trim()] = rest.join('=').trim();
      return acc;
    }, {});
}

export default defineConfig(({ mode }) => {
  const {
    VEIMAGE_HOST,
    VEIMAGE_REGION,
    VEIMAGE_SERVICE,
    VEIMAGE_AK,
    VEIMAGE_SK,
  } = getEnv(mode);

  return {
    plugins: [
      vue(),
      {
        name: 'veimagex-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.method === 'GET' && req.url === '/config-txt') {
              const configPath = path.resolve(process.cwd(), 'config.txt');
              try {
                const content = fs.readFileSync(configPath, 'utf8');
                const parsed = parseConfigFile(content);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, data: parsed }));
              } catch (err) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'config.txt not found or unreadable.' }));
              }
              return;
            }

            if (req.method !== 'POST' || req.url !== '/veimagex') {
              return next();
            }

            if (!VEIMAGE_AK || !VEIMAGE_SK) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'VEIMAGE_AK and VEIMAGE_SK must be configured as environment variables.' }));
              return;
            }

            try {
              const body = await parseJsonBody(req);
              const host = VEIMAGE_HOST;
              const queryParams = {
                Action,
                Version,
              };
              const queryString = buildCanonicalQueryString(queryParams);
              const endpoint = `https://${host}/?${queryString}`;
              const method = 'POST';
              const xDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '') + 'Z';
              const shortDate = xDate.slice(0, 8);
              const payload = JSON.stringify(body);
              const payloadHash = sha256Hex(payload);
              const canonicalHeaders = `host:${host}\n` +
                `x-date:${xDate}\n` +
                `x-content-sha256:${payloadHash}\n` +
                `content-type:application/json\n`;
              const signedHeaders = 'host;x-date;x-content-sha256;content-type';
              const canonicalRequest = [
                method,
                '/',
                queryString,
                canonicalHeaders,
                signedHeaders,
                payloadHash,
              ].join('\n');
              const hashedCanonicalRequest = sha256Hex(canonicalRequest);
              const credentialScope = `${shortDate}/${VEIMAGE_REGION}/${VEIMAGE_SERVICE}/request`;
              const stringToSign = ['HMAC-SHA256', xDate, credentialScope, hashedCanonicalRequest].join('\n');
              const signingKey = buildSigningKey(VEIMAGE_SK, shortDate, VEIMAGE_REGION, VEIMAGE_SERVICE);
              const signature = hmacSha256Hex(signingKey, stringToSign);
              const authorization = `HMAC-SHA256 Credential=${VEIMAGE_AK}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

              const fetchResponse = await fetch(endpoint, {
                method,
                headers: {
                  Host: host,
                  'Content-Type': 'application/json',
                  'X-Date': xDate,
                  'X-Content-Sha256': payloadHash,
                  Authorization: authorization,
                },
                body: payload,
              });
              const data = await fetchResponse.text();
              res.statusCode = fetchResponse.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
        },
      },
    ],
    root: '.',
    server: {
      port: 5173,
      open: true,
    },
  };
});
