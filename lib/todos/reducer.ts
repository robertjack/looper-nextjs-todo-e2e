import { createTodo, type Todo } from "./types";

export type TodosAction =
  | { type: "hydrate"; todos: Todo[] }
  | {
      type: "create";
      title: string;
      now: Date;
      completed?: boolean;
      id?: string;
    }
  | { type: "edit"; id: string; title: string; now: Date }
  | { type: "complete"; id: string; now: Date }
  | { type: "restore"; id: string; now: Date }
  | { type: "delete"; id: string };

export function todosReducer(todos: Todo[], action: TodosAction): Todo[] {
  switch (action.type) {
    case "hydrate":
      return action.todos;

    case "create":
      return [
        ...todos,
        createTodo(action.title, {
          completed: action.completed,
          id: action.id,
          now: action.now,
        }),
      ];

    case "edit":
      return updateTodo(todos, action.id, (todo) => ({
        ...todo,
        title: action.title,
        updatedAt: action.now.toISOString(),
      }));

    case "complete":
      return updateTodo(todos, action.id, (todo) => {
        if (todo.completed) {
          return todo;
        }

        return {
          ...todo,
          completed: true,
          updatedAt: action.now.toISOString(),
        };
      });

    case "restore":
      return updateTodo(todos, action.id, (todo) => {
        if (!todo.completed) {
          return todo;
        }

        return {
          ...todo,
          completed: false,
          updatedAt: action.now.toISOString(),
        };
      });

    case "delete": {
      const nextTodos = todos.filter((todo) => todo.id !== action.id);

      return nextTodos.length === todos.length ? todos : nextTodos;
    }
  }
}

function updateTodo(
  todos: Todo[],
  id: string,
  update: (todo: Todo) => Todo,
): Todo[] {
  let didUpdate = false;
  const nextTodos = todos.map((todo) => {
    if (todo.id !== id) {
      return todo;
    }

    const nextTodo = update(todo);

    if (nextTodo !== todo) {
      didUpdate = true;
    }

    return nextTodo;
  });

  return didUpdate ? nextTodos : todos;
}
