import { describe, expect, it } from "vitest";
import type { Todo } from "./types";
import { selectVisibleTodos } from "./selectors";

const todos: Todo[] = [
  {
    id: "todo-1",
    title: "Plan the day",
    completed: false,
    createdAt: "2026-06-30T12:00:00.000Z",
    updatedAt: "2026-06-30T12:00:00.000Z",
  },
  {
    id: "todo-2",
    title: "Ship State Layer",
    completed: true,
    createdAt: "2026-06-30T13:00:00.000Z",
    updatedAt: "2026-06-30T13:30:00.000Z",
  },
  {
    id: "todo-3",
    title: "ship docs",
    completed: false,
    createdAt: "2026-06-30T14:00:00.000Z",
    updatedAt: "2026-06-30T14:00:00.000Z",
  },
];

describe("selectVisibleTodos", () => {
  it("returns every todo for the all filter with no search", () => {
    expect(selectVisibleTodos(todos, { status: "all", search: "" })).toEqual(
      todos,
    );
  });

  it("filters active todos", () => {
    expect(selectVisibleTodos(todos, { status: "active", search: "" })).toEqual(
      [todos[0], todos[2]],
    );
  });

  it("filters completed todos", () => {
    expect(
      selectVisibleTodos(todos, { status: "completed", search: "" }),
    ).toEqual([todos[1]]);
  });

  it("searches todo titles case-insensitively", () => {
    expect(selectVisibleTodos(todos, { status: "all", search: "PLAN" })).toEqual(
      [todos[0]],
    );
  });

  it("returns the intersection of search and status filters", () => {
    expect(
      selectVisibleTodos(todos, { status: "active", search: "SHIP" }),
    ).toEqual([todos[2]]);
  });
});
