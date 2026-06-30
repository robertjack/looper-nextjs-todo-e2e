import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Todo } from "@/lib/todos/types";
import { TODO_TITLE_REQUIRED_MESSAGE } from "@/lib/todos/validation";
import { TodoItem, type TodoItemProps } from "./todo-item";

const todo: Todo = {
  id: "todo-1",
  title: "Plan the day",
  completed: false,
  createdAt: "2026-06-30T12:00:00.000Z",
  updatedAt: "2026-06-30T12:00:00.000Z",
};

function renderTodoItem(overrides: Partial<TodoItemProps> = {}) {
  const props: TodoItemProps = {
    todo,
    onEditTodo: vi.fn(() => true),
    onCompleteTodo: vi.fn(() => true),
    onRestoreTodo: vi.fn(() => true),
    onDeleteTodo: vi.fn(() => true),
    ...overrides,
  };

  render(<TodoItem {...props} />);

  return props;
}

describe("TodoItem", () => {
  it("marks an active todo complete", () => {
    const onCompleteTodo = vi.fn(() => true);

    renderTodoItem({ onCompleteTodo });

    fireEvent.click(
      screen.getByRole("button", { name: /complete plan the day/i }),
    );

    expect(onCompleteTodo).toHaveBeenCalledWith(todo.id);
  });

  it("restores a completed todo", () => {
    const onRestoreTodo = vi.fn(() => true);

    renderTodoItem({ todo: { ...todo, completed: true }, onRestoreTodo });

    fireEvent.click(
      screen.getByRole("button", { name: /restore plan the day/i }),
    );

    expect(onRestoreTodo).toHaveBeenCalledWith(todo.id);
  });

  it("deletes a todo", () => {
    const onDeleteTodo = vi.fn(() => true);

    renderTodoItem({ onDeleteTodo });

    fireEvent.click(
      screen.getByRole("button", { name: /delete plan the day/i }),
    );

    expect(onDeleteTodo).toHaveBeenCalledWith(todo.id);
  });

  it("submits trimmed valid edited titles", () => {
    const onEditTodo = vi.fn(() => true);

    renderTodoItem({ onEditTodo });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /edit todo/i }), {
      target: { value: "  Plan tomorrow  " },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(onEditTodo).toHaveBeenCalledWith(todo.id, "Plan tomorrow");
  });

  it("focuses the edit field when editing starts", () => {
    const onEditTodo = vi.fn(() => true);

    renderTodoItem({ onEditTodo });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(screen.getByRole("textbox", { name: /edit todo/i })).toHaveFocus();
  });

  it("rejects empty edited titles with a message near the input", () => {
    const onEditTodo = vi.fn(() => true);

    renderTodoItem({ onEditTodo });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /edit todo/i }), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    const input = screen.getByRole("textbox", { name: /edit todo/i });
    const alert = screen.getByRole("alert");

    expect(onEditTodo).not.toHaveBeenCalled();
    expect(alert).toHaveTextContent(TODO_TITLE_REQUIRED_MESSAGE);
    expect(input).toHaveAttribute("aria-describedby", alert.id);
  });

  it("rejects whitespace-only edited titles", () => {
    const onEditTodo = vi.fn(() => true);

    renderTodoItem({ onEditTodo });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /edit todo/i }), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(onEditTodo).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      TODO_TITLE_REQUIRED_MESSAGE,
    );
  });

  it("cancels editing without saving changed text", () => {
    const onEditTodo = vi.fn(() => true);

    renderTodoItem({ onEditTodo });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /edit todo/i }), {
      target: { value: "Plan tomorrow" },
    });
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onEditTodo).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("textbox", { name: /edit todo/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(todo.title)).toBeInTheDocument();
  });

  it("cancels editing with Escape", () => {
    const onEditTodo = vi.fn(() => true);

    renderTodoItem({ onEditTodo });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /edit todo/i }), {
      target: { value: "Plan tomorrow" },
    });
    fireEvent.keyDown(screen.getByRole("textbox", { name: /edit todo/i }), {
      key: "Escape",
    });

    expect(onEditTodo).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("textbox", { name: /edit todo/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(todo.title)).toBeInTheDocument();
  });
});
