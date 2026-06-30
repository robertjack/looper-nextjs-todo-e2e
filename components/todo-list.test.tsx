import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Todo } from "@/lib/todos/types";
import { TodoList } from "./todo-list";

const activeTodo: Todo = {
  id: "todo-1",
  title: "Plan the day",
  completed: false,
  createdAt: "2026-06-30T12:00:00.000Z",
  updatedAt: "2026-06-30T12:00:00.000Z",
};

const completedTodo: Todo = {
  id: "todo-2",
  title: "Ship the state layer",
  completed: true,
  createdAt: "2026-06-30T13:00:00.000Z",
  updatedAt: "2026-06-30T13:30:00.000Z",
};

const handlers = {
  onEditTodo: vi.fn(() => true),
  onCompleteTodo: vi.fn(() => true),
  onRestoreTodo: vi.fn(() => true),
  onDeleteTodo: vi.fn(() => true),
};

describe("TodoList", () => {
  it("renders active and completed todos with distinct states", () => {
    render(<TodoList todos={[activeTodo, completedTodo]} {...handlers} />);

    const activeItem = screen.getByText(activeTodo.title).closest("li");
    const completedItem = screen.getByText(completedTodo.title).closest("li");

    expect(activeItem).toBeInTheDocument();
    expect(completedItem).toBeInTheDocument();
    expect(activeItem).not.toHaveClass("is-completed");
    expect(completedItem).toHaveClass("is-completed");
    expect(within(activeItem as HTMLElement).getByText("Active")).toBeInTheDocument();
    expect(
      within(completedItem as HTMLElement).getByText("Completed"),
    ).toBeInTheDocument();
    expect(screen.getByText("2 todos")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders the supplied empty state when no todos are visible", () => {
    render(
      <TodoList
        todos={[]}
        emptyState={{ kind: "no-completed-todos" }}
        {...handlers}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("No completed todos");
    expect(screen.getByText("0 todos")).toBeInTheDocument();
  });
});
