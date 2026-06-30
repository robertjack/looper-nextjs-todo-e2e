import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTodo, type Todo } from "./types";
import {
  loadTodos,
  saveTodos,
  TODO_STORAGE_KEY,
  type TodoStorage,
} from "./storage";

const firstTodo: Todo = {
  id: "todo-1",
  title: "Plan the day",
  completed: false,
  createdAt: "2026-06-30T12:00:00.000Z",
  updatedAt: "2026-06-30T12:00:00.000Z",
};

const secondTodo: Todo = {
  id: "todo-2",
  title: "Ship storage",
  completed: true,
  createdAt: "2026-06-30T13:00:00.000Z",
  updatedAt: "2026-06-30T14:00:00.000Z",
};

describe("todo storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("creates todos with unique IDs and timestamps", () => {
    const now = new Date("2026-06-30T12:00:00.000Z");

    const first = createTodo("Plan the day", { now });
    const second = createTodo("Ship storage", { now });

    expect(first).toMatchObject({
      title: "Plan the day",
      completed: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
    expect(first.id).toEqual(expect.any(String));
    expect(first.id).not.toBe(second.id);
  });

  it("loads empty storage as an empty todo list", () => {
    expect(loadTodos()).toEqual([]);
  });

  it("loads saved todos from localStorage", () => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify([firstTodo, secondTodo]));

    expect(loadTodos()).toEqual([firstTodo, secondTodo]);
  });

  it("saves todos to localStorage", () => {
    expect(saveTodos([firstTodo, secondTodo])).toBe(true);

    expect(JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) ?? "")).toEqual([
      firstTodo,
      secondTodo,
    ]);
  });

  it("handles unavailable storage without throwing", () => {
    expect(loadTodos(null)).toEqual([]);
    expect(saveTodos([firstTodo], null)).toBe(false);
  });

  it("handles storage failures without throwing", () => {
    const failingStorage: TodoStorage = {
      getItem: vi.fn(() => {
        throw new Error("storage read failed");
      }),
      setItem: vi.fn(() => {
        throw new Error("storage write failed");
      }),
    };

    expect(loadTodos(failingStorage)).toEqual([]);
    expect(saveTodos([firstTodo], failingStorage)).toBe(false);
  });
});
