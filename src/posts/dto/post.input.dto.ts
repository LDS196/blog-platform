export type TPostByBlogInputDto = {
  title: string;
  shortDescription: string;
  content: string;
};

export type TPostInputDto = TPostByBlogInputDto & {
  blogId: string;
};
