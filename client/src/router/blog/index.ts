import { RoutePathEnum, RouteNameEnum } from '@/enums'
// import { BloggerPage, HomePage } from '@/pages'
import { RouteRecordRaw } from 'vue-router'

const blogRoutes: Array<RouteRecordRaw> = [
  {
    name: 'blog',
    path: `/:UID`,
    component: () => import(/* webpackChunkName: "about" */ '@/views/blog/Blog.vue'),
    children: [
      {
        // name: RouteNameEnum.HOME,
        path: '',
        name: 'list',
        component: () => import(/* webpackChunkName: "about" */ '@/views/blog/list/AllArticleList.vue'),
      },
      {
        path: `album`,
        name: 'album',
        component: () => import(/* webpackChunkName: "about" */ '@/views/blog/album/Album.vue'),
      },
      {
        name: 'album-detail',
        path: `album/:id`,
        component: () => import(/* webpackChunkName: "about" */ '@/views/blog/album/AlbumDetail.vue'),
        beforeEnter: async (to, from, next) => {
          console.log('album-detail')
          next()
        },
      },
      {
        path: `tag`,
        component: () => import(/* webpackChunkName: "about" */ '@/views/blog/tag/Tag.vue'),
      },
      {
        path: `about`,
        component: () => import(/* webpackChunkName: "about" */ '@/views/blog/about/About.vue'),
      },
    ]
    // 思考作品页面的链接上要不要加博客UID
    // 考虑博客页不添加 blogger 作为头部，仅使用 UID
    // 作品页不添加UID
  },
  {
    name: 'agent',
    path: '/article/:id',
    component: () => import(/* webpackChunkName: "about" */ '@/views/blog/article/Article.vue'),
  },
  {
    name: 'article',
    path: '/article',
    component: () => import(/* webpackChunkName: "about" */ '@/views/blog/article/Article.vue'),
  }
]

export default blogRoutes
