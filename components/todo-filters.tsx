"use client";

import {
  TODO_STATUS_FILTERS,
  type TodoStatusFilter,
} from "@/lib/todos/selectors";

export type TodoFiltersProps = {
  value: TodoStatusFilter;
  onChange: (value: TodoStatusFilter) => void;
};

const labels: Record<TodoStatusFilter, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export function TodoFilters({ value, onChange }: TodoFiltersProps) {
  return (
    <div className="filter-group" role="group" aria-label="Todo status filter">
      {TODO_STATUS_FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          aria-pressed={value === filter}
          onClick={() => onChange(filter)}
        >
          {labels[filter]}
        </button>
      ))}
    </div>
  );
}

export default TodoFilters;
