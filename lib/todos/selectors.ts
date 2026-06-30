import type { Todo } from "./types";

export const TODO_STATUS_FILTERS = ["all", "active", "completed"] as const;

export type TodoStatusFilter = (typeof TODO_STATUS_FILTERS)[number];

export type TodoVisibilityQuery = {
  status: TodoStatusFilter;
  search: string;
};

export function selectVisibleTodos(
  todos: Todo[],
  { status, search }: TodoVisibilityQuery,
): Todo[] {
  const normalizedSearch = search.trim().toLowerCase();

  return todos.filter((todo) => {
    if (!matchesStatus(todo, status)) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return todo.title.toLowerCase().includes(normalizedSearch);
  });
}

function matchesStatus(todo: Todo, status: TodoStatusFilter): boolean {
  switch (status) {
    case "all":
      return true;
    case "active":
      return !todo.completed;
    case "completed":
      return todo.completed;
  }
}
