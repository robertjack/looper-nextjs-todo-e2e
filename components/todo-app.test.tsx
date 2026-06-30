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

  it("edits a todo title immediately and persists the edit after remount", () => {
    const { unmount } = render(<TodoApp />);

    fireEvent.change(screen.getByRole("textbox", { name: /new todo/i }), {
      target: { value: "Plan the day" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit plan the day/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /edit todo/i }), {
      target: { value: "Plan tomorrow" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText("Plan tomorrow")).toBeInTheDocument();
    expect(screen.queryByText("Plan the day")).not.toBeInTheDocument();

    unmount();
    render(<TodoApp />);

    expect(screen.getByText("Plan tomorrow")).toBeInTheDocument();
    expect(screen.queryByText("Plan the day")).not.toBeInTheDocument();
  });

  it("marks an active todo complete and restores it to active", () => {
    render(<TodoApp storage={null} />);

    fireEvent.change(screen.getByRole("textbox", { name: /new todo/i }), {
      target: { value: "Plan the day" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));

    const item = screen.getByText("Plan the day").closest("li");

    fireEvent.click(
      within(item as HTMLElement).getByRole("button", {
        name: /complete plan the day/i,
      }),
    );

    expect(item).toHaveClass("is-completed");
    expect(
      within(item as HTMLElement).getByText("Completed"),
    ).toBeInTheDocument();

    fireEvent.click(
      within(item as HTMLElement).getByRole("button", {
        name: /restore plan the day/i,
      }),
    );

    expect(item).not.toHaveClass("is-completed");
    expect(within(item as HTMLElement).getByText("Active")).toBeInTheDocument();
  });

  it("deletes a todo and keeps it deleted after remount", () => {
    const { unmount } = render(<TodoApp />);

    fireEvent.change(screen.getByRole("textbox", { name: /new todo/i }), {
      target: { value: "Keep this" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /new todo/i }), {
      target: { value: "Delete this" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /delete delete this/i }),
    );

    expect(screen.getByText("Keep this")).toBeInTheDocument();
    expect(screen.queryByText("Delete this")).not.toBeInTheDocument();

    unmount();
    render(<TodoApp />);

    expect(screen.getByText("Keep this")).toBeInTheDocument();
    expect(screen.queryByText("Delete this")).not.toBeInTheDocument();
  });

  it("filters todos by all, active, and completed immediately", () => {
    render(<TodoApp storage={null} />);

    createTodo("Active task");
    createTodo("Completed task");
    fireEvent.click(
      screen.getByRole("button", { name: /complete completed task/i }),
    );

    fireEvent.click(screen.getByRole("button", { name: /^Active$/i }));

    expect(screen.getByText("Active task")).toBeInTheDocument();
    expect(screen.queryByText("Completed task")).not.toBeInTheDocument();
    expect(screen.getByText("1 todo")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Completed$/i }));

    expect(screen.queryByText("Active task")).not.toBeInTheDocument();
    expect(screen.getByText("Completed task")).toBeInTheDocument();
    expect(screen.getByText("1 todo")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^All$/i }));

    expect(screen.getByText("Active task")).toBeInTheDocument();
    expect(screen.getByText("Completed task")).toBeInTheDocument();
    expect(screen.getByText("2 todos")).toBeInTheDocument();
  });

  it("searches todos by title case-insensitively and updates immediately", () => {
    render(<TodoApp storage={null} />);

    createTodo("Review PR");
    createTodo("Buy milk");

    fireEvent.change(screen.getByRole("searchbox", { name: /search todos/i }), {
      target: { value: "MILK" },
    });

    expect(screen.queryByText("Review PR")).not.toBeInTheDocument();
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("1 todo")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: /search todos/i }), {
      target: { value: "review" },
    });

    expect(screen.getByText("Review PR")).toBeInTheDocument();
    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
    expect(screen.getByText("1 todo")).toBeInTheDocument();
  });

  it("intersects search text with the active status filter", () => {
    render(<TodoApp storage={null} />);

    createTodo("Ship active docs");
    createTodo("Ship completed release");
    createTodo("Plan backlog");
    fireEvent.click(
      screen.getByRole("button", {
        name: /complete ship completed release/i,
      }),
    );

    fireEvent.change(screen.getByRole("searchbox", { name: /search todos/i }), {
      target: { value: "ship" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Active$/i }));

    expect(screen.getByText("Ship active docs")).toBeInTheDocument();
    expect(screen.queryByText("Ship completed release")).not.toBeInTheDocument();
    expect(screen.queryByText("Plan backlog")).not.toBeInTheDocument();
    expect(screen.getByText("1 todo")).toBeInTheDocument();
  });
});

function createTodo(title: string) {
  fireEvent.change(screen.getByRole("textbox", { name: /new todo/i }), {
    target: { value: title },
  });
  fireEvent.click(screen.getByRole("button", { name: /add todo/i }));
}
