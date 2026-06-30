export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoOptions = {
  completed?: boolean;
  id?: string;
  now?: Date;
};

export function createTodo(
  title: string,
  { completed = false, id, now = new Date() }: CreateTodoOptions = {},
): Todo {
  const timestamp = now.toISOString();

  return {
    id: id ?? createTodoId(),
    title,
    completed,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createTodoId(): string {
  const randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto);

  if (randomUUID) {
    return randomUUID();
  }

  return `todo_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}
