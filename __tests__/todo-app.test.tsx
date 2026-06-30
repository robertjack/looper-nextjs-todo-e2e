import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("todo app page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("wires the page to the core todo workflow", () => {
    render(<Home />);

    addTodo("Plan the day");
    fireEvent.click(screen.getByRole("button", { name: /complete plan the day/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Completed$/i }));

    const item = screen.getByText("Plan the day").closest("li");

    expect(item).toBeInTheDocument();
    expect(within(item as HTMLElement).getByText("Completed")).toBeInTheDocument();

    fireEvent.click(
      within(item as HTMLElement).getByRole("button", {
        name: /restore plan the day/i,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: /^Active$/i }));

    expect(screen.getByText("Plan the day")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /delete plan the day/i }));

    expect(screen.getByRole("status")).toHaveTextContent("No todos yet");
  });
});

function addTodo(title: string) {
  fireEvent.change(screen.getByRole("textbox", { name: /new todo/i }), {
    target: { value: title },
  });
  fireEvent.click(screen.getByRole("button", { name: /add todo/i }));
}
