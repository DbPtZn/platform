import { Article } from '../article.entity'

export type ArticleTypeFilter = Pick<
  Article,
  'albumId' | 'type' | 'isParsed' | 'isPublished' | 'isDisplayed' | 'removed' | 'penname' | 'email'
>

// export interface GetArticleDto {
//   filter: Partial<ArticleFilter> // 查询条件
// }
