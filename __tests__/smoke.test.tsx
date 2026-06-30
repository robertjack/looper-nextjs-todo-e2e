import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("todo app shell", () => {
  it("renders the primary todo screen", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /looper todo/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /new todo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add todo/i })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });
});
