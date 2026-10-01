export type PostByBlogInputDto = {
  title: string;
  shortDescription: string;
  content: string;
};

export type PostInputDto = PostByBlogInputDto & {
  blogId: string;
};
