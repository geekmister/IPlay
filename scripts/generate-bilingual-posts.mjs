import fs from 'node:fs';
import path from 'node:path';

const postsRoot = path.join(process.cwd(), 'content-src', 'posts');
const zhDir = path.join(postsRoot, 'zh');
const enDir = path.join(postsRoot, 'en');

const referencePool = [
  { name: 'Denoising Diffusion Probabilistic Models', year: 2020, url: 'https://arxiv.org/abs/2006.11239' },
  { name: 'Imagen', year: 2022, url: 'https://arxiv.org/abs/2205.11487' },
  { name: 'InstructPix2Pix', year: 2022, url: 'https://arxiv.org/abs/2211.09800' },
  { name: 'Zero-DCE', year: 2020, url: 'https://arxiv.org/abs/2001.06826' },
  { name: 'MIRNet', year: 2020, url: 'https://arxiv.org/abs/2003.06792' },
  { name: 'Restormer', year: 2021, url: 'https://arxiv.org/abs/2111.09881' },
  { name: 'SwinIR', year: 2021, url: 'https://arxiv.org/abs/2108.10257' },
  { name: 'RT-DETR', year: 2023, url: 'https://arxiv.org/abs/2304.08069' },
  { name: 'TransUNet', year: 2021, url: 'https://arxiv.org/abs/2102.04306' },
  { name: 'ChangeFormer', year: 2022, url: 'https://arxiv.org/abs/2201.01293' },
  { name: 'CLIP', year: 2021, url: 'https://arxiv.org/abs/2103.00020' },
  { name: 'LLaVA', year: 2023, url: 'https://arxiv.org/abs/2304.08485' },
  { name: 'PatchCore', year: 2022, url: 'https://arxiv.org/abs/2106.08265' },
  { name: 'CodeFormer', year: 2022, url: 'https://arxiv.org/abs/2206.11253' },
  { name: 'NeRF', year: 2020, url: 'https://arxiv.org/abs/2003.08934' },
  { name: 'SatMAE', year: 2022, url: 'https://arxiv.org/abs/2207.08051' },
  { name: 'OpenMax', year: 2016, url: 'https://arxiv.org/abs/1511.06233' },
  { name: 'TRADES', year: 2019, url: 'https://arxiv.org/abs/1901.08573' },
  { name: 'ByteTrack', year: 2021, url: 'https://arxiv.org/abs/2110.06864' },
  { name: 'U2-Net', year: 2020, url: 'https://arxiv.org/abs/2005.09007' },
  { name: 'BLIP', year: 2022, url: 'https://arxiv.org/abs/2201.12086' },
  { name: 'LaMa', year: 2021, url: 'https://arxiv.org/abs/2109.07161' },
  { name: 'MTAN', year: 2019, url: 'https://arxiv.org/abs/1803.10704' },
  { name: 'BiSeNet', year: 2018, url: 'https://arxiv.org/abs/1808.00897' },
  { name: 'DELG', year: 2020, url: 'https://arxiv.org/abs/2001.05027' },
  { name: 'NTS-Net', year: 2018, url: 'https://arxiv.org/abs/1809.00287' },
  { name: 'AutoAugment', year: 2019, url: 'https://arxiv.org/abs/1805.09501' },
  { name: 'FedAvg', year: 2017, url: 'https://arxiv.org/abs/1602.05629' }
];

const papers = [
  { zh: '基于扩散模型的高保真图像生成与可控编辑研究', en: 'High-Fidelity Image Generation and Controllable Editing with Diffusion Models', topicZh: '扩散模型', topicEn: 'diffusion models', viewZh: '我认为高保真不是像真就够了，编辑一致性和可复现性才是落地关键。', viewEn: 'High fidelity is not only visual realism; edit consistency and reproducibility decide real-world value.' },
  { zh: '面向低光场景的图像增强网络设计与性能评估', en: 'Low-Light Image Enhancement Network Design and Evaluation', topicZh: '低光增强', topicEn: 'low-light enhancement', viewZh: '我更关注亮度提升后的噪声放大与色偏问题，主观好看不等于可用。', viewEn: 'Brightness gains must be judged together with noise amplification and color shift, not aesthetics alone.' },
  { zh: '结合频域先验的单图像去噪方法研究', en: 'Single-Image Denoising with Frequency-Domain Priors', topicZh: '频域去噪', topicEn: 'frequency-aware denoising', viewZh: '频域约束能抑制伪细节，我倾向把它作为守门员而不是主干。', viewEn: 'Frequency constraints are best used as a stabilizing guardrail rather than the only backbone.' },
  { zh: '多尺度注意力机制在图像超分辨率中的应用', en: 'Multi-Scale Attention for Image Super-Resolution', topicZh: '图像超分', topicEn: 'super-resolution', viewZh: '我建议以可解释的细节恢复评价超分，而不是只看峰值指标。', viewEn: 'Super-resolution should be evaluated by interpretable detail recovery, not only peak metrics.' },
  { zh: '轻量化目标检测模型在边缘设备上的部署优化', en: 'Lightweight Object Detection Optimization on Edge Devices', topicZh: '边缘检测', topicEn: 'edge detection deployment', viewZh: '边缘端优化里，延迟抖动比平均 FPS 更影响真实体验。', viewEn: 'On-device user experience is often more sensitive to latency jitter than average FPS.' },
  { zh: '医学影像分割中 Transformer 与 CNN 融合方法研究', en: 'Transformer-CNN Fusion for Medical Image Segmentation', topicZh: '医学分割', topicEn: 'medical segmentation', viewZh: '医学场景下模型可信度和失败模式分析，和精度一样重要。', viewEn: 'Clinical value depends on uncertainty and failure analysis as much as segmentation accuracy.' },
  { zh: '遥感图像变化检测的时空特征建模方法', en: 'Spatiotemporal Modeling for Remote Sensing Change Detection', topicZh: '遥感变化检测', topicEn: 'remote sensing change detection', viewZh: '我主张把误报成本纳入目标函数，而不是只追求召回。', viewEn: 'False alarm cost should be modeled explicitly instead of optimizing recall alone.' },
  { zh: '面向复杂天气的图像去雾与去雨联合学习框架', en: 'Joint Learning Framework for Dehazing and Deraining', topicZh: '复杂天气恢复', topicEn: 'adverse-weather restoration', viewZh: '联合任务能共享先验，但要避免任务互相拖累的负迁移。', viewEn: 'Joint learning can share priors, but negative transfer must be controlled carefully.' },
  { zh: '弱监督语义分割中伪标签质量提升策略研究', en: 'Pseudo-Label Quality Improvement in Weakly Supervised Segmentation', topicZh: '弱监督分割', topicEn: 'weakly supervised segmentation', viewZh: '伪标签策略里，我更看重稳定迭代而非第一轮精度高低。', viewEn: 'Stable iterative refinement is more valuable than high first-round pseudo-label scores.' },
  { zh: '基于对比学习的图像表征学习方法与应用', en: 'Contrastive Learning Methods for Visual Representation', topicZh: '对比学习', topicEn: 'contrastive representation learning', viewZh: '对比学习成功关键是负样本构造质量，而不是盲目增大 batch。', viewEn: 'Negative sample design matters more than blindly increasing batch size.' },
  { zh: '跨模态图文检索中的视觉语义对齐机制研究', en: 'Visual-Semantic Alignment for Cross-Modal Retrieval', topicZh: '图文检索', topicEn: 'cross-modal retrieval', viewZh: '对齐机制应强调细粒度实体，而不只是句子级相似度。', viewEn: 'Alignment should focus on entity-level grounding beyond sentence-level similarity.' },
  { zh: '视觉问答任务中的多模态融合与推理方法', en: 'Multimodal Fusion and Reasoning in Visual Question Answering', topicZh: '视觉问答', topicEn: 'visual question answering', viewZh: '我认为可解释推理链比单次答对率更能体现系统价值。', viewEn: 'Transparent reasoning chains are often more valuable than one-shot answer accuracy.' },
  { zh: '面向工业缺陷检测的小样本学习模型研究', en: 'Few-Shot Learning for Industrial Defect Detection', topicZh: '工业质检', topicEn: 'industrial defect detection', viewZh: '小样本场景里，数据采集策略常比模型结构更决定上限。', viewEn: 'In few-shot settings, data acquisition strategy often dominates architecture choices.' },
  { zh: '图像风格迁移中的内容保持与风格一致性优化', en: 'Content Preservation and Style Consistency in Style Transfer', topicZh: '风格迁移', topicEn: 'style transfer', viewZh: '风格迁移应设内容不可破坏边界，否则可用性很差。', viewEn: 'Style transfer needs explicit content-preservation constraints for practical use.' },
  { zh: '生成对抗网络在人脸修复中的稳定训练策略', en: 'Stable Training Strategies for GAN-based Face Restoration', topicZh: 'GAN 修复', topicEn: 'GAN face restoration', viewZh: '我倾向加入身份约束，避免修复后像另一个人。', viewEn: 'Identity constraints are crucial to prevent identity drift in restored faces.' },
  { zh: '基于知识蒸馏的图像分类模型压缩方法研究', en: 'Knowledge Distillation for Image Classification Compression', topicZh: '模型压缩', topicEn: 'model compression', viewZh: '蒸馏收益应和部署成本一并报告，单看精度提升不完整。', viewEn: 'Compression gains should be reported with deployment costs, not accuracy alone.' },
  { zh: '三维重建中的神经辐射场方法及改进方向', en: 'Neural Radiance Fields for 3D Reconstruction and Improvements', topicZh: 'NeRF 重建', topicEn: 'NeRF reconstruction', viewZh: 'NeRF 的瓶颈在训练效率，工程上要优先解决重建时延。', viewEn: 'The main bottleneck in NeRF is training efficiency and reconstruction latency.' },
  { zh: '自监督学习在遥感图像分类中的有效性分析', en: 'Effectiveness of Self-Supervised Learning in Remote Sensing Classification', topicZh: '自监督遥感', topicEn: 'self-supervised remote sensing', viewZh: '我建议用跨季节和跨地域测试来验证表征泛化能力。', viewEn: 'Cross-season and cross-region tests are necessary to validate representation generalization.' },
  { zh: '开集识别场景下的图像分类鲁棒性研究', en: 'Robust Image Classification for Open-Set Recognition', topicZh: '开集识别', topicEn: 'open-set recognition', viewZh: '真实场景里拒识能力比闭集准确率更接近业务需求。', viewEn: 'Reject-option quality is often more important than closed-set accuracy in production.' },
  { zh: '对抗样本攻击与图像模型防御方法综述', en: 'Adversarial Attacks and Defenses in Vision Models', topicZh: '对抗鲁棒性', topicEn: 'adversarial robustness', viewZh: '防御评估必须跨攻击类型，否则很容易出现伪鲁棒。', viewEn: 'Defense claims should be validated across attack families to avoid pseudo-robustness.' },
  { zh: '面向视频监控的多目标跟踪算法研究与改进', en: 'Multi-Object Tracking for Video Surveillance', topicZh: '多目标跟踪', topicEn: 'multi-object tracking', viewZh: '监控场景最难的是长时遮挡后的身份一致性恢复。', viewEn: 'Identity consistency recovery after long occlusions is the core challenge in surveillance MOT.' },
  { zh: '视觉显著性检测中的边界细化方法研究', en: 'Boundary Refinement in Visual Saliency Detection', topicZh: '显著性检测', topicEn: 'saliency detection', viewZh: '边界质量会直接影响后续抠图与编辑任务的体验。', viewEn: 'Boundary quality directly impacts downstream cutout and editing experience.' },
  { zh: '图像描述生成中视觉注意力机制的可解释性分析', en: 'Interpretability of Visual Attention in Image Captioning', topicZh: '图像描述', topicEn: 'image captioning', viewZh: '描述模型应避免流畅但失真的幻觉型叙述。', viewEn: 'Captioning systems should minimize fluent but factually wrong hallucinations.' },
  { zh: '基于扩散先验的图像修复与缺失区域补全研究', en: 'Image Inpainting with Diffusion Priors', topicZh: '图像补全', topicEn: 'image inpainting', viewZh: '补全任务里全局语义一致性比局部纹理更难也更关键。', viewEn: 'Global semantic coherence is harder and more important than local texture realism.' },
  { zh: '多任务学习在图像分割与深度估计中的协同优化', en: 'Co-Optimization of Segmentation and Depth via Multi-Task Learning', topicZh: '多任务学习', topicEn: 'multi-task learning', viewZh: '任务权重动态调节是协同学习能否成功的关键变量。', viewEn: 'Dynamic task weighting is a key factor in successful multi-task optimization.' },
  { zh: '面向移动端的实时图像分割网络架构设计', en: 'Real-Time Image Segmentation Architectures for Mobile', topicZh: '移动端分割', topicEn: 'mobile segmentation', viewZh: '我建议把功耗曲线加入指标，不然实时难以持续。', viewEn: 'Power-consumption curves should be part of real-time mobile segmentation metrics.' },
  { zh: '图像检索中的局部特征聚合与重排序方法研究', en: 'Local Feature Aggregation and Re-ranking for Image Retrieval', topicZh: '图像检索', topicEn: 'image retrieval', viewZh: '重排序阶段应结合业务语义，不应只依赖视觉相似度。', viewEn: 'Re-ranking should incorporate business semantics beyond visual similarity.' },
  { zh: '细粒度图像识别中的部件建模与关系推理方法', en: 'Part Modeling and Relational Reasoning for Fine-Grained Recognition', topicZh: '细粒度识别', topicEn: 'fine-grained recognition', viewZh: '细粒度识别对标注依赖强，弱标注方案值得重点投入。', viewEn: 'Annotation dependency is high; weak supervision is worth serious investment.' },
  { zh: '数据增广策略对图像分类泛化能力的影响研究', en: 'Impact of Data Augmentation on Classification Generalization', topicZh: '数据增广', topicEn: 'data augmentation', viewZh: '增广策略应和数据分布联动，固定配方常常效果不稳。', viewEn: 'Augmentation should adapt to data distribution; fixed recipes are often unstable.' },
  { zh: '面向隐私保护的联邦学习图像识别方法研究', en: 'Federated Learning for Privacy-Preserving Image Recognition', topicZh: '联邦学习视觉', topicEn: 'federated vision learning', viewZh: '联邦学习里通信开销与性能平衡，是落地成败分水岭。', viewEn: 'Communication-performance trade-off is the decisive factor in federated deployment.' },
];

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48)
    .replace(/(^-|-$)/g, '');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function clearMdxFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (name.endsWith('.mdx')) fs.rmSync(path.join(dir, name));
  }
}

function pickRefs(index) {
  const total = referencePool.length;
  const a = referencePool[index % total];
  const b = referencePool[(index * 3 + 5) % total];
  const c = referencePool[(index * 7 + 11) % total];
  return [a, b, c];
}

function renderRefs(refs) {
  return refs.map((ref) => `- [${ref.name} (${ref.year})](${ref.url})`).join('\n');
}

function sharedMedia(isEnglish = false) {
  if (isEnglish) {
    return `<div className="paper-media-grid">
  <img src="https://dummyimage.com/1200x675/dbeafe/0f172a&text=Visual+Overview" alt="visual overview" />
  <video controls loop muted playsInline poster="https://dummyimage.com/1200x675/bfdbfe/0f172a&text=Demo+Video">
    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
  </video>
</div>

<div className="pulse-line"><span></span></div>

<details>
  <summary>Quick Quiz</summary>
  <p>What matters most for your use case: accuracy, speed, or interpretability? Rank them first, then compare with the analysis.</p>
</details>`;
  }
  return `<div className="paper-media-grid">
  <img src="https://dummyimage.com/1200x675/e0e7ff/1e293b&text=Visual+Overview" alt="visual overview" />
  <video controls loop muted playsInline poster="https://dummyimage.com/1200x675/c7d2fe/111827&text=Demo+Video">
    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
  </video>
</div>

<div className="pulse-line"><span></span></div>

<details>
  <summary>交互问答</summary>
  <p>你更看重精度、速度还是可解释性？先写下你的排序，再回看文中观点。</p>
</details>`;
}

function renderZh(p, refs) {
  return `---
title: ${p.zh}
description: 围绕${p.topicZh}展开，讨论方法设计、评估指标与工程可用性。
date: 2026-03-31
lang: zh-CN
category: 图像论文
tags:
  - 图像
  - 论文
  - ${p.topicZh}
seo_keywords: ${p.topicZh}, 图像论文, 方法评估, 工程落地
readTime: 6
---

# ${p.zh}

> 个人观点：${p.viewZh}

## 研究问题

本文聚焦 ${p.topicZh} 的核心问题：如何在保证效果的同时，提升可解释性、稳定性与部署可行性。

## 方法框架（我的理解）

1. 以任务约束定义模型边界，而不是先堆复杂结构。
2. 把主观体验指标和客观指标同时纳入评估。
3. 在训练阶段引入失败样本回放，降低边缘场景风险。

## 评估建议

- 指标不只看单点峰值，还要看波动和最差分位表现。
- 建议增加跨数据源验证，避免只在单一数据集过拟合。
- 报告推理时延和显存开销，方便工程团队决策。

## 代表论文与链接

${renderRefs(refs)}

## 业务落地观察

${p.viewZh} 在真实项目中，建议把“异常样本回放 + 指标看板 + 回滚预案”作为最小上线闭环。

${sharedMedia(false)}
`;
}

function renderEn(p, refs) {
  return `---
title: ${p.en}
description: A study on ${p.topicEn}, covering method design, evaluation metrics, and practical usability.
date: 2026-03-31
lang: en
category: Image Papers
tags:
  - image
  - paper
  - ${p.topicEn}
seo_keywords: ${p.topicEn}, image papers, model evaluation, deployment
readTime: 6
---

# ${p.en}

> Perspective: ${p.viewEn}

## Research Question

This article focuses on ${p.topicEn}: improving interpretability, stability, and deployability while preserving strong performance.

## Method Perspective

1. Define task constraints before increasing model complexity.
2. Use both perceptual and objective metrics for evaluation.
3. Replay failure cases during training to reduce tail-risk.

## Evaluation Suggestions

- Report not only peak scores, but also variance and worst-case behavior.
- Add cross-domain validation to avoid single-dataset overfitting.
- Include latency and memory costs for engineering decisions.

## Representative Papers and Links

${renderRefs(refs)}

## Production Insight

${p.viewEn} In practical delivery, I strongly recommend using a minimum loop of failure replay, metric dashboarding, and rollback plans.

${sharedMedia(true)}
`;
}

ensureDir(zhDir);
ensureDir(enDir);
clearMdxFiles(zhDir);
clearMdxFiles(enDir);

for (const [index, p] of papers.entries()) {
  const refs = pickRefs(index);
  const slug = slugify(p.en);
  fs.writeFileSync(path.join(zhDir, `${slug}-zh.mdx`), renderZh(p, refs), 'utf8');
  fs.writeFileSync(path.join(enDir, `${slug}-en.mdx`), renderEn(p, refs), 'utf8');
}

console.log(`Generated ${papers.length} Chinese + ${papers.length} English posts.`);
