"use client";

import type { TodoStatusFilter } from "@/lib/todos/selectors";

export type TodoEmptyStateKind =
  | "no-todos"
  | "no-active-todos"
  | "no-completed-todos"
  | "no-search-results";

export type TodoEmptyStateProps = {
  kind: TodoEmptyStateKind;
  search?: string;
  status?: TodoStatusFilter;
};

const emptyStateCopy: Record<
  Exclude<TodoEmptyStateKind, "no-search-results">,
  { title: string; description: string }
> = {
  "no-todos": {
    title: "No todos yet",
    description: "Add a todo to start building today's list.",
  },
  "no-active-todos": {
    title: "No active todos",
    description: "Everything visible here is complete.",
  },
  "no-completed-todos": {
    title: "No completed todos",
    description: "Finished todos will appear here.",
  },
};

export function TodoEmptyState({
  kind,
  search = "",
  status = "all",
}: TodoEmptyStateProps) {
  const copy =
    kind === "no-search-results"
      ? getSearchEmptyStateCopy(search, status)
      : emptyStateCopy[kind];

  return (
    <div className="empty-state" role="status" aria-live="polite">
      <p>{copy.title}</p>
      <span>{copy.description}</span>
    </div>
  );
}

function getSearchEmptyStateCopy(
  search: string,
  status: TodoStatusFilter,
): { title: string; description: string } {
  const query = search.trim();
  const subject =
    status === "active"
      ? "active todos"
      : status === "completed"
        ? "completed todos"
        : "todos";

  return {
    title: "No search results",
    description: query
      ? `No ${subject} match "${query}".`
      : `No ${subject} match your search.`,
  };
}

export default TodoEmptyState;
