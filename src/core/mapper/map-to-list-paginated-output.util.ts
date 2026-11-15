export function mapToListPaginatedOutput<T>({
  pageNumber,
  pageSize,
  totalCount,
  items,
}: {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}): {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
} {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
}
