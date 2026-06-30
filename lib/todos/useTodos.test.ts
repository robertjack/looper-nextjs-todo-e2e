import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TodoStorage } from "./storage";
import { TODO_STORAGE_KEY } from "./storage";
import { useTodos } from "./useTodos";

describe("useTodos", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-30T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("creates a todo immediately and persists it", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      expect(result.current.createTodo("Plan the day")).toBe(true);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0]).toMatchObject({
      title: "Plan the day",
      completed: false,
      createdAt: "2026-06-30T12:00:00.000Z",
      updatedAt: "2026-06-30T12:00:00.000Z",
    });
    expect(result.current.todos[0]?.id).toEqual(expect.any(String));
    expect(readSavedTodos()).toEqual(result.current.todos);
  });

  it("edits a todo title and updated timestamp", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.createTodo("Plan the day");
    });

    const createdTodo = result.current.todos[0];
    vi.setSystemTime(new Date("2026-06-30T12:05:00.000Z"));

    act(() => {
      expect(result.current.editTodo(createdTodo.id, "Plan tomorrow")).toBe(true);
    });

    expect(result.current.todos[0]).toEqual({
      ...createdTodo,
      title: "Plan tomorrow",
      updatedAt: "2026-06-30T12:05:00.000Z",
    });
    expect(readSavedTodos()).toEqual(result.current.todos);
  });

  it("completes and restores a todo with updated timestamps", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.createTodo("Ship state actions");
    });

    const todoId = result.current.todos[0].id;
    vi.setSystemTime(new Date("2026-06-30T12:10:00.000Z"));

    act(() => {
      expect(result.current.completeTodo(todoId)).toBe(true);
    });

    expect(result.current.todos[0]).toMatchObject({
      id: todoId,
      completed: true,
      updatedAt: "2026-06-30T12:10:00.000Z",
    });

    vi.setSystemTime(new Date("2026-06-30T12:20:00.000Z"));

    act(() => {
      expect(result.current.restoreTodo(todoId)).toBe(true);
    });

    expect(result.current.todos[0]).toMatchObject({
      id: todoId,
      completed: false,
      updatedAt: "2026-06-30T12:20:00.000Z",
    });
    expect(readSavedTodos()).toEqual(result.current.todos);
  });

  it("deletes a todo from state and persisted storage", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.createTodo("Keep");
      result.current.createTodo("Delete");
    });

    const deletedTodo = result.current.todos[1];

    act(() => {
      expect(result.current.deleteTodo(deletedTodo.id)).toBe(true);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos).not.toContainEqual(deletedTodo);
    expect(readSavedTodos()).toEqual(result.current.todos);
  });

  it("hydrates saved todos after mount", () => {
    const firstRender = renderHook(() => useTodos());

    act(() => {
      firstRender.result.current.createTodo("Persist me");
    });

    const savedTodos = firstRender.result.current.todos;
    firstRender.unmount();

    const secondRender = renderHook(() => useTodos());

    expect(secondRender.result.current.todos).toEqual(savedTodos);
  });

  it("does not read storage during server render", () => {
    const storage: TodoStorage = {
      getItem: vi.fn(() => "[]"),
      setItem: vi.fn(),
    };

    function TodosCount() {
      return createElement("span", null, useTodos({ storage }).todos.length);
    }

    expect(renderToString(createElement(TodosCount))).toContain("<span>0</span>");
    expect(storage.getItem).not.toHaveBeenCalled();
  });

  it("does not persist no-op mutations", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(() => useTodos());

    act(() => {
      expect(result.current.editTodo("missing", "No-op")).toBe(false);
      expect(result.current.completeTodo("missing")).toBe(false);
      expect(result.current.restoreTodo("missing")).toBe(false);
      expect(result.current.deleteTodo("missing")).toBe(false);
    });

    expect(result.current.todos).toEqual([]);
    expect(setItem).not.toHaveBeenCalled();
  });
});

function readSavedTodos() {
  return JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) ?? "[]");
}
