"use client";

import { useId } from "react";

export type TodoSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TodoSearch({ value, onChange }: TodoSearchProps) {
  const generatedId = useId();
  const inputId = `${generatedId}-todo-search`;

  return (
    <div className="search-field">
      <label htmlFor={inputId}>Search todos</label>
      <input
        id={inputId}
        name="todo-search"
        type="search"
        placeholder="Search by title"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default TodoSearch;
