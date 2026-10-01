import { BlogOutputDto } from '../../dto/blog.output.dto';
import { TBlog } from '../../types/blog';

// Ответ со списком (JSON:API list). Каждый элемент маппится тем же
// mapDriverToResource, что и одиночный ресурс — без дублирования логики.
export const mapToBlogsListOutput = (blogs: TBlog[]): BlogOutputDto[] => {
  // some logic
  return blogs.map((b) => b);
};
