"use client";

import { TodoItem } from "@/components/todo-item";
import type { Todo } from "@/lib/todos/types";

export type TodoListProps = {
  todos: Todo[];
  onEditTodo: (id: string, title: string) => boolean;
  onCompleteTodo: (id: string) => boolean;
  onRestoreTodo: (id: string) => boolean;
  onDeleteTodo: (id: string) => boolean;
};

export function TodoList({
  todos,
  onEditTodo,
  onCompleteTodo,
  onRestoreTodo,
  onDeleteTodo,
}: TodoListProps) {
  const todoCountLabel = `${todos.length} ${todos.length === 1 ? "todo" : "todos"}`;

  return (
    <section className="todo-list" aria-labelledby="todo-list-title">
      <div className="list-header">
        <h2 id="todo-list-title">Today</h2>
        <span>{todoCountLabel}</span>
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">
          <p>No todos yet</p>
          <span>Your active todos will appear here.</span>
        </div>
      ) : (
        <ul className="todo-items" aria-label="Todos">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEditTodo={onEditTodo}
              onCompleteTodo={onCompleteTodo}
              onRestoreTodo={onRestoreTodo}
              onDeleteTodo={onDeleteTodo}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TodoList;
