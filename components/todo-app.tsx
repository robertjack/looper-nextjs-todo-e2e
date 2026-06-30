"use client";

import { useMemo, useState } from "react";
import { TodoFilters } from "@/components/todo-filters";
import { TodoForm } from "@/components/todo-form";
import { TodoList } from "@/components/todo-list";
import { TodoSearch } from "@/components/todo-search";
import {
  selectVisibleTodos,
  type TodoStatusFilter,
} from "@/lib/todos/selectors";
import { useTodos, type UseTodosOptions } from "@/lib/todos/useTodos";

export type TodoAppProps = {
  storage?: UseTodosOptions["storage"];
};

export function TodoApp({ storage }: TodoAppProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>("all");
  const {
    todos,
    createTodo,
    editTodo,
    completeTodo,
    restoreTodo,
    deleteTodo,
  } = useTodos({ storage });
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const overviewItems = [
    { label: "All", value: todos.length },
    { label: "Active", value: activeCount },
    { label: "Completed", value: completedCount },
  ];
  const visibleTodos = useMemo(
    () => selectVisibleTodos(todos, { status: statusFilter, search }),
    [search, statusFilter, todos],
  );

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="app-title">
        <div className="hero-copy">
          <p className="eyebrow">Personal task board</p>
          <h1 id="app-title">Looper Todo</h1>
          <p className="intro">
            Capture the next thing, keep active work visible, and clear finished
            tasks from the day.
          </p>
        </div>

        <dl className="overview" aria-label="Todo summary">
          {overviewItems.map((item) => (
            <div className="overview-item" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="workspace" aria-label="Todo workspace">
        <TodoForm onCreateTodo={createTodo} />
        <section className="toolbar" aria-label="Search and filter todos">
          <TodoSearch value={search} onChange={setSearch} />
          <TodoFilters value={statusFilter} onChange={setStatusFilter} />
        </section>
        <TodoList
          todos={visibleTodos}
          onEditTodo={editTodo}
          onCompleteTodo={completeTodo}
          onRestoreTodo={restoreTodo}
          onDeleteTodo={deleteTodo}
        />
      </section>
    </main>
  );
}

export default TodoApp;
