import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { TodoApp } from "./todo-app";

describe("TodoApp", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds a valid todo and renders it immediately", () => {
    render(<TodoApp storage={null} />);

    fireEvent.change(screen.getByRole("textbox", { name: /new todo/i }), {
      target: { value: "  Plan the day  " },
    });
    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));

    const item = screen.getByText("Plan the day").closest("li");

    expect(item).toBeInTheDocument();
    expect(screen.getByText("1 todo")).toBeInTheDocument();
    expect(within(item as HTMLElement).getByText("Active")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /new todo/i })).toHaveValue("");
  });
});
