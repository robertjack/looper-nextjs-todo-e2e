"use client";

import { type FormEvent, useId, useState } from "react";
import type { Todo } from "@/lib/todos/types";
import { validateTodoTitle } from "@/lib/todos/validation";

export type TodoItemProps = {
  todo: Todo;
  onEditTodo: (id: string, title: string) => boolean;
  onCompleteTodo?: (id: string) => boolean;
  onRestoreTodo?: (id: string) => boolean;
  onDeleteTodo?: (id: string) => boolean;
};

export function TodoItem({
  todo,
  onEditTodo,
  onCompleteTodo,
  onRestoreTodo,
  onDeleteTodo,
}: TodoItemProps) {
  const generatedId = useId();
  const inputId = `${generatedId}-edit-todo`;
  const errorId = `${inputId}-error`;
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [error, setError] = useState<string | null>(null);

  function beginEditing() {
    setDraftTitle(todo.title);
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftTitle(todo.title);
    setError(null);
    setIsEditing(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateTodoTitle(draftTitle);

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    if (onEditTodo(todo.id, validation.title)) {
      setDraftTitle(validation.title);
      setError(null);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <li className="todo-item is-editing">
        <form className="todo-edit" onSubmit={handleSubmit}>
          <label htmlFor={inputId}>Edit todo</label>
          <div className="entry-row">
            <input
              id={inputId}
              name="todo-title"
              type="text"
              value={draftTitle}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => {
                setDraftTitle(event.target.value);
                setError(null);
              }}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={cancelEditing}>
              Cancel
            </button>
          </div>
          {error ? (
            <p className="validation-message" id={errorId} role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </li>
    );
  }

  return (
    <li className={`todo-item${todo.completed ? " is-completed" : ""}`}>
      <div className="todo-content">
        <span className="todo-title">{todo.title}</span>
        <span className="todo-status">
          {todo.completed ? "Completed" : "Active"}
        </span>
      </div>
      <div className="todo-actions">
        {todo.completed ? (
          <button
            type="button"
            aria-label={`Restore ${todo.title}`}
            onClick={() => onRestoreTodo?.(todo.id)}
          >
            Restore
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Complete ${todo.title}`}
            onClick={() => onCompleteTodo?.(todo.id)}
          >
            Complete
          </button>
        )}
        <button
          type="button"
          aria-label={`Edit ${todo.title}`}
          onClick={beginEditing}
        >
          Edit
        </button>
        <button
          type="button"
          aria-label={`Delete ${todo.title}`}
          onClick={() => onDeleteTodo?.(todo.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
