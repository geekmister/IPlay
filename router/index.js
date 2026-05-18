import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/info'
  },
  {
    path: '/info',
    name: 'Info',
    component: () => import('../pages/PageInfo.vue')
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../pages/PageTools.vue')
  },
  {
    path: '/image',
    name: 'Image',
    component: () => import('../pages/PageImage.vue')
  },
  {
    path: '/face',
    name: 'Face',
    component: () => import('../pages/PageFace.vue')
  },
  {
    path: '/portrait',
    name: 'Portrait',
    component: () => import('../pages/PagePortrait.vue')
  },
  {
    path: '/enhance',
    name: 'Enhance',
    component: () => import('../pages/PageEnhance.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('../pages/PagePrivacy.vue')
  },
  {
    path: '/workflow',
    name: 'Workflow',
    component: () => import('../pages/PageWorkflow.vue')
  },
  {
    path: '/advanced',
    name: 'Advanced',
    component: () => import('../pages/PageAdvanced.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
