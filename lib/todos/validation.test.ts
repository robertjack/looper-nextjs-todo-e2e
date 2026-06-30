import { describe, expect, it } from "vitest";
import { todosReducer } from "./reducer";
import type { Todo } from "./types";
import {
  TODO_TITLE_REQUIRED_MESSAGE,
  validateTodoTitle,
} from "./validation";

const now = new Date("2026-06-30T12:00:00.000Z");
const later = new Date("2026-06-30T12:05:00.000Z");

const existingTodo: Todo = {
  id: "todo-1",
  title: "Plan the day",
  completed: false,
  createdAt: "2026-06-30T12:00:00.000Z",
  updatedAt: "2026-06-30T12:00:00.000Z",
};

describe("todo title validation", () => {
  it("trims valid new todo titles before saving", () => {
    const nextTodos = todosReducer([], {
      type: "create",
      title: "  Plan the day  ",
      id: "todo-1",
      now,
    });

    expect(nextTodos[0]?.title).toBe("Plan the day");
  });

  it("trims valid edited todo titles before saving", () => {
    const nextTodos = todosReducer([existingTodo], {
      type: "edit",
      id: existingTodo.id,
      title: "  Plan tomorrow  ",
      now: later,
    });

    expect(nextTodos[0]).toEqual({
      ...existingTodo,
      title: "Plan tomorrow",
      updatedAt: later.toISOString(),
    });
  });

  it("rejects empty new todo titles", () => {
    const todos: Todo[] = [];
    const nextTodos = todosReducer(todos, {
      type: "create",
      title: "",
      now,
    });

    expect(nextTodos).toBe(todos);
  });

  it("rejects whitespace-only new todo titles", () => {
    const todos: Todo[] = [];
    const nextTodos = todosReducer(todos, {
      type: "create",
      title: "   ",
      now,
    });

    expect(nextTodos).toBe(todos);
  });

  it("rejects empty edited todo titles", () => {
    const todos = [existingTodo];
    const nextTodos = todosReducer(todos, {
      type: "edit",
      id: existingTodo.id,
      title: "",
      now: later,
    });

    expect(nextTodos).toBe(todos);
  });

  it("rejects whitespace-only edited todo titles", () => {
    const todos = [existingTodo];
    const nextTodos = todosReducer(todos, {
      type: "edit",
      id: existingTodo.id,
      title: "   ",
      now: later,
    });

    expect(nextTodos).toBe(todos);
  });

  it("returns a clear required-title message", () => {
    expect(validateTodoTitle("")).toEqual({
      valid: false,
      message: TODO_TITLE_REQUIRED_MESSAGE,
    });
  });
});
