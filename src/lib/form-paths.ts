export const getTodoPath = (
  pageIndex: number,
  itemIndex: number
): `todos.${number}.items.${number}.value` =>
  `todos.${pageIndex}.items.${itemIndex}.value` as `todos.${number}.items.${number}.value`
