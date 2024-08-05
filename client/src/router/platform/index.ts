import { RoutePathEnum, RouteNameEnum } from '@/enums'
// import { BloggerPage, HomePage } from '@/pages'
import { RouteRecordRaw } from 'vue-router'

const platformRoutes: Array<RouteRecordRaw> = [
  {
    name: RouteNameEnum.PLATFORM,
    path: RoutePathEnum.PLATFORM,
    component: () => import(/* webpackChunkName: "about" */ '@/views/platform/home/Home.vue'),
  }
]

export default platformRoutes
