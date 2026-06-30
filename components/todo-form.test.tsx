import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TODO_TITLE_REQUIRED_MESSAGE } from "@/lib/todos/validation";
import { TodoForm } from "./todo-form";

describe("TodoForm", () => {
  it("submits trimmed valid titles", () => {
    const onCreateTodo = vi.fn(() => true);

    render(<TodoForm onCreateTodo={onCreateTodo} />);

    fireEvent.change(screen.getByRole("textbox", { name: /new todo/i }), {
      target: { value: "  Plan the day  " },
    });
    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));

    expect(onCreateTodo).toHaveBeenCalledWith("Plan the day");
    expect(screen.getByRole("textbox", { name: /new todo/i })).toHaveValue("");
  });

  it("rejects empty titles with a message near the input", () => {
    const onCreateTodo = vi.fn(() => true);

    render(<TodoForm onCreateTodo={onCreateTodo} />);

    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));

    const input = screen.getByRole("textbox", { name: /new todo/i });
    const alert = screen.getByRole("alert");

    expect(onCreateTodo).not.toHaveBeenCalled();
    expect(alert).toHaveTextContent(TODO_TITLE_REQUIRED_MESSAGE);
    expect(input).toHaveAttribute("aria-describedby", alert.id);
  });

  it("rejects whitespace-only titles", () => {
    const onCreateTodo = vi.fn(() => true);

    render(<TodoForm onCreateTodo={onCreateTodo} />);

    fireEvent.change(screen.getByRole("textbox", { name: /new todo/i }), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));

    expect(onCreateTodo).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      TODO_TITLE_REQUIRED_MESSAGE,
    );
  });
});
