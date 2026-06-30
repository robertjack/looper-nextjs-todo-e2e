"use client";

import { type FormEvent, useId, useState } from "react";
import { validateTodoTitle } from "@/lib/todos/validation";

export type TodoFormProps = {
  onCreateTodo: (title: string) => boolean;
};

export function TodoForm({ onCreateTodo }: TodoFormProps) {
  const generatedId = useId();
  const inputId = `${generatedId}-new-todo`;
  const errorId = `${inputId}-error`;
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateTodoTitle(title);

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    if (onCreateTodo(validation.title)) {
      setTitle("");
      setError(null);
    }
  }

  return (
    <form className="todo-entry" aria-label="Add a todo" onSubmit={handleSubmit}>
      <label htmlFor={inputId}>New todo</label>
      <div className="entry-row">
        <input
          id={inputId}
          name="todo"
          type="text"
          placeholder="Add a todo"
          autoComplete="off"
          value={title}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setTitle(event.target.value);
            setError(null);
          }}
        />
        <button type="submit">Add todo</button>
      </div>
      {error ? (
        <p className="validation-message" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export default TodoForm;
