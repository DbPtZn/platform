import { RoutePathEnum, RouteNameEnum } from '@/enums'
// import { BloggerPage, HomePage } from '@/pages'
import { RouteRecordRaw } from 'vue-router'

const blogRoutes: Array<RouteRecordRaw> = [
  {
    name: RouteNameEnum.BLOG,
    path: `/:UID`,
    component: () => import(/* webpackChunkName: "about" */ '@/views/blog/Blog.vue'),
    children: [
      {
        // name: RouteNameEnum.HOME,
        path: '',
        name: 'list',
        component: () => import(/* webpackChunkName: "about" */ '@/views/blog/list/AllArticleList.vue'),
      },
      // {
      //   path: `/`,
      //   component: () => import(/* webpackChunkName: "about" */ '@/pages/blog/ColumnPage.vue'),
      // },
      // {
      //   path: `/:UID/column`,
      //   component: () => import(/* webpackChunkName: "about" */ '@/pages/blog/ColumnPage.vue'),
      // },
      // {
      //   path: `/:UID/article/:AID`,
      //   component: () => import(/* webpackChunkName: "about" */ '@/pages/blog/ArticlePage.vue'),
      // },
    ]
    // 思考作品页面的链接上要不要加博客UID
    // 考虑博客页不添加 blogger 作为头部，仅使用 UID
    // 作品页不添加UID
  },
  {
    name: RouteNameEnum.ARTICLE,
    path: '/article/:id',
    component: () => import(/* webpackChunkName: "about" */ '@/views/blog/article/Article.vue'),
  }
]

export default blogRoutes
