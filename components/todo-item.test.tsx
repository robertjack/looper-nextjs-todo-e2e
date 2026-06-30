import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Todo } from "@/lib/todos/types";
import { TODO_TITLE_REQUIRED_MESSAGE } from "@/lib/todos/validation";
import { TodoItem } from "./todo-item";

const todo: Todo = {
  id: "todo-1",
  title: "Plan the day",
  completed: false,
  createdAt: "2026-06-30T12:00:00.000Z",
  updatedAt: "2026-06-30T12:00:00.000Z",
};

describe("TodoItem", () => {
  it("submits trimmed valid edited titles", () => {
    const onEditTodo = vi.fn(() => true);

    render(<TodoItem todo={todo} onEditTodo={onEditTodo} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /edit todo/i }), {
      target: { value: "  Plan tomorrow  " },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(onEditTodo).toHaveBeenCalledWith(todo.id, "Plan tomorrow");
  });

  it("rejects empty edited titles with a message near the input", () => {
    const onEditTodo = vi.fn(() => true);

    render(<TodoItem todo={todo} onEditTodo={onEditTodo} />);

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

    render(<TodoItem todo={todo} onEditTodo={onEditTodo} />);

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
});
