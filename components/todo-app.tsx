"use client";

import { TodoForm } from "@/components/todo-form";
import { TodoList } from "@/components/todo-list";
import { useTodos, type UseTodosOptions } from "@/lib/todos/useTodos";

export type TodoAppProps = {
  storage?: UseTodosOptions["storage"];
};

export function TodoApp({ storage }: TodoAppProps) {
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
        <TodoList
          todos={todos}
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
