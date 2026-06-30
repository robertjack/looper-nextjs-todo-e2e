"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadTodos, saveTodos, type TodoStorage } from "./storage";
import { todosReducer, type TodosAction } from "./reducer";
import type { Todo } from "./types";

export type UseTodosOptions = {
  storage?: TodoStorage | null;
};

export type UseTodosResult = {
  todos: Todo[];
  createTodo: (title: string) => boolean;
  editTodo: (id: string, title: string) => boolean;
  completeTodo: (id: string) => boolean;
  restoreTodo: (id: string) => boolean;
  deleteTodo: (id: string) => boolean;
};

export function useTodos({
  storage,
}: UseTodosOptions = {}): UseTodosResult {
  const [todos, setTodos] = useState<Todo[]>([]);
  const todosRef = useRef(todos);

  useEffect(() => {
    const hydratedTodos = loadTodos(storage);

    todosRef.current = hydratedTodos;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Storage hydration must wait until after mount to keep SSR and client first render aligned.
    setTodos(hydratedTodos);
  }, [storage]);

  const commit = useCallback(
    (action: TodosAction) => {
      const nextTodos = todosReducer(todosRef.current, action);

      if (nextTodos === todosRef.current) {
        return false;
      }

      todosRef.current = nextTodos;
      setTodos(nextTodos);
      saveTodos(nextTodos, storage);

      return true;
    },
    [storage],
  );

  const createTodoAction = useCallback(
    (title: string) =>
      commit({
        type: "create",
        title,
        now: new Date(),
      }),
    [commit],
  );

  const editTodo = useCallback(
    (id: string, title: string) =>
      commit({
        type: "edit",
        id,
        title,
        now: new Date(),
      }),
    [commit],
  );

  const completeTodo = useCallback(
    (id: string) =>
      commit({
        type: "complete",
        id,
        now: new Date(),
      }),
    [commit],
  );

  const restoreTodo = useCallback(
    (id: string) =>
      commit({
        type: "restore",
        id,
        now: new Date(),
      }),
    [commit],
  );

  const deleteTodo = useCallback(
    (id: string) =>
      commit({
        type: "delete",
        id,
      }),
    [commit],
  );

  return useMemo(
    () => ({
      todos,
      createTodo: createTodoAction,
      editTodo,
      completeTodo,
      restoreTodo,
      deleteTodo,
    }),
    [completeTodo, createTodoAction, deleteTodo, editTodo, restoreTodo, todos],
  );
}
