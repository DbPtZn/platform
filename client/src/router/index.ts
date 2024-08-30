import { RouteNameEnum, RoutePathEnum } from '@/enums'
// import useStore from '@/store'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import blogRoutes from './blog'
import manageRoutes from './manage'
import platformRoutes from './platform'
import errorRoutes from './error'
// import useStore from '@/store'
// import errorRoutes from './error'
const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   redirect: { name: RouteNameEnum },
  // },
  ...manageRoutes,
  ...blogRoutes,
  ...platformRoutes,
  ...errorRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
