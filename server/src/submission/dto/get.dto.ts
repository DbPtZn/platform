import { Article } from "src/article/article.entity";


export type ArticleFilter = Pick<
  Article,
  'albumId' | 'type' | 'isParsed' | 'isPublished' | 'isDisplayed' | 'removed' | 'penname' | 'email'
>

// export interface GetArticleDto {
//   filter: Partial<ArticleFilter> // 查询条件
// }
