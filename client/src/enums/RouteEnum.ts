export enum RouteNameEnum {
  // blog
  HOME = 'home',
  BLOG = 'blog',
  DEFAULT = 'default',
  ARTICLE = 'article',
  COLLECTION = 'collection',

  // manage
  MANAGE = 'manage',
  LOGIN = 'login',
  REGISTER = 'register',
  PRODUCT = 'product',
  _400 = '400',
  _403 = '403',
  _404 = '404'
}

export enum RoutePathEnum {
  // blog
  BLOG = '/blog',
  HOME = '/home', // 注意，子路由不能带 '/'
  ARTICLE = '/article',
  COLLECTION = '/collection',

  //manage
  MANAGE = '/manage',
  LOGIN = '/login',
  REGISTER = '/register',
  PRODUCT = '/product',
  DEFAULT = '/default',
  _400 = '/400',
  _403 = '/403',
  _404 = '/404'
}
