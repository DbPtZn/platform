import { Article } from '../article.entity'

export type ArticleFilter = Pick<
  Article,
  'columnId' | 'type' | 'isParsed' | 'isPublish' | 'removed' | 'penname' | 'email'
>

// export interface GetArticleDto {
//   filter: Partial<ArticleFilter> // 查询条件
// }
