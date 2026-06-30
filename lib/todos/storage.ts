import type { Todo } from "./types";

export const TODO_STORAGE_KEY = "looper.todos.v1";

export type TodoStorage = Pick<Storage, "getItem" | "setItem">;

export function loadTodos(
  storage: TodoStorage | null = getClientStorage(),
): Todo[] {
  if (!storage) {
    return [];
  }

  try {
    const savedTodos = storage.getItem(TODO_STORAGE_KEY);

    if (!savedTodos) {
      return [];
    }

    const parsedTodos: unknown = JSON.parse(savedTodos);

    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos.filter(isTodo);
  } catch {
    return [];
  }
}

export function saveTodos(
  todos: readonly Todo[],
  storage: TodoStorage | null = getClientStorage(),
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
    return true;
  } catch {
    return false;
  }
}

function getClientStorage(): TodoStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isTodo(value: unknown): value is Todo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const todo = value as Record<string, unknown>;

  return (
    typeof todo.id === "string" &&
    typeof todo.title === "string" &&
    typeof todo.completed === "boolean" &&
    typeof todo.createdAt === "string" &&
    typeof todo.updatedAt === "string"
  );
}
