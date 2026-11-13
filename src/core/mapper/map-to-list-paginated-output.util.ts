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
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  items: T[];
} {
  const meta = {
    page: pageNumber,
    pageSize,
    pageCount: Math.ceil(totalCount / pageSize),
    totalCount,
  };
  return { items, ...meta };
}
