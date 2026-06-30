import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TodoEmptyState } from "./todo-empty-state";

describe("TodoEmptyState", () => {
  it("renders the no-todos empty state", () => {
    render(<TodoEmptyState kind="no-todos" />);

    expect(screen.getByRole("status")).toHaveTextContent("No todos yet");
    expect(
      screen.getByText("Add a todo to start building today's list."),
    ).toBeInTheDocument();
  });

  it("renders the active-filter empty state", () => {
    render(<TodoEmptyState kind="no-active-todos" />);

    expect(screen.getByRole("status")).toHaveTextContent("No active todos");
    expect(
      screen.getByText("Everything visible here is complete."),
    ).toBeInTheDocument();
  });

  it("renders the completed-filter empty state", () => {
    render(<TodoEmptyState kind="no-completed-todos" />);

    expect(screen.getByRole("status")).toHaveTextContent("No completed todos");
    expect(
      screen.getByText("Finished todos will appear here."),
    ).toBeInTheDocument();
  });

  it("renders search empty state copy for the current status filter", () => {
    render(
      <TodoEmptyState
        kind="no-search-results"
        search="  ship  "
        status="completed"
      />,
    );

    const emptyState = screen.getByRole("status");

    expect(emptyState).toHaveTextContent("No search results");
    expect(emptyState).toHaveTextContent('No completed todos match "ship".');
  });
});
