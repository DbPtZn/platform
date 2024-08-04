import { RouteNameEnum, RoutePathEnum } from '@/enums'
import { RouteRecordRaw } from 'vue-router'

const managerRoutes: Array<RouteRecordRaw> = [
  /** 主页 */
  {
    path: RoutePathEnum.MANAGE,
    name: RouteNameEnum.MANAGE,
    component: () => import(/* webpackChunkName: "about" */ '@/views/manage/Manage.vue'),
    children: [
      {
        path: '',
        name: 'default',
        component: () => import(/* webpackChunkName: "about" */ '@/pages/manage/DefaultPage.vue')
      },
      {
        path: 'auth',
        name: 'auth',
        component: () => import(/* webpackChunkName: "about" */ '@/views/manage/authcode/Authcode.vue')
      },
      {
        path: 'article/:id',
        name: 'article',
        component: () => import(/* webpackChunkName: "about" */ '@/views/manage/m-article/MArticle.vue')
      },
      {
        path: 'submission',
        name: 'submission',
        component: () => import(/* webpackChunkName: "about" */ '@/views/manage/submission/Submission.vue')
      },
    ]
  },
  {
    path: RoutePathEnum.LOGIN,
    name: RouteNameEnum.LOGIN,
    component: () => import(/* webpackChunkName: "about" */ '@/views/login/Login.vue'),
    // 访问该路由之前执行：
    beforeEnter(to, from, next) {
      const token = sessionStorage.getItem('managerToken')
      token ? next(RoutePathEnum.MANAGE) : next()
    }
  },
  {
    path: RoutePathEnum.REGISTER,
    name: RouteNameEnum.REGISTER,
    component: () => import(/* webpackChunkName: "about" */ '@/views/login/Register.vue'),
  },
].map((route, index, arr) => {
  if (![RouteNameEnum.REGISTER, RouteNameEnum.LOGIN].includes(route.name)) {
    arr[index].beforeEnter = (to, from, next) => {
      const token = sessionStorage.getItem('managerToken')
      if (token || to.name === RouteNameEnum.LOGIN || to.name === RouteNameEnum.REGISTER) {
        next()
      } else {
        next(RoutePathEnum.LOGIN)
      }
    }
  }
  return route
})

export default managerRoutes

// 登录状态导航守卫：
// router.beforeEach((to, from, next) => {
//   // to 跳转的路由
//   // from 从哪个路由来
//   // next() 继续执行
//   // 验证 token ，仅在 token 存在的时候，可以跳转到其它页面。（如果是前往登录页面或注册页面则不做限制）
//   const token = sessionStorage.getItem('managerToken')
//   // const { userStore } = useStore()
//   if (token || to.name === RouteNameEnum.LOGIN || to.name === RouteNameEnum.REGISTER) {
//     // to.name === RouteNameEnum.LOGIN || to.name === RouteNameEnum.REGISTER ? '' : userStore.getInfo()
//     next()
//   } else {
//     next(RouteNameEnum.LOGIN)
//   }
// })