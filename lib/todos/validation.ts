export const TODO_TITLE_REQUIRED_MESSAGE = "Todo title is required.";

export type TodoTitleValidationResult =
  | { valid: true; title: string }
  | { valid: false; message: string };

export function validateTodoTitle(title: string): TodoTitleValidationResult {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) {
    return {
      valid: false,
      message: TODO_TITLE_REQUIRED_MESSAGE,
    };
  }

  return {
    valid: true,
    title: normalizedTitle,
  };
}
