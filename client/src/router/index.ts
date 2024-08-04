import { RouteNameEnum, RoutePathEnum } from '@/enums'
// import useStore from '@/store'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import blogRoutes from './blog'
import managerRoutes from './manage'
import platformRoutes from './platform'
// import useStore from '@/store'
// import errorRoutes from './error'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: RouteNameEnum.BLOG },
  },
  ...managerRoutes,
  ...blogRoutes,
  ...platformRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
