# PRD: Production-Shaped Todo App

## Problem

Developers need a small but realistic Next.js todo application that demonstrates core product behavior, persistence, validation, testing, and deployability without becoming a large project. The app should be useful as a reference implementation for common CRUD workflows and production-ready development practices.

## Goals

- Build a polished todo app using Next.js.
- Allow users to add, edit, complete, restore, delete, search, and filter todos.
- Persist todos across page reloads and sessions.
- Handle validation, loading, errors, and empty states clearly.
- Include automated tests for core workflows.
- Support deployment as a public preview environment.
- Keep the app simple, maintainable, and easy to understand.

## Non-goals

- User authentication or multi-user accounts.
- Team sharing, collaboration, comments, or assignments.
- Due dates, reminders, notifications, labels, or priorities.
- Offline-first sync across devices.
- Native mobile apps.
- Complex project management features.

## User Stories Or Workflows

### Add Todo

As a user, I can enter a todo title and create a new todo so that I can track something I need to do.

### Edit Todo

As a user, I can edit an existing todo so that I can correct or update its title.

### Complete Todo

As a user, I can mark a todo as complete so that it is removed from my active work.

### Restore Todo

As a user, I can restore a completed todo so that it becomes active again.

### Delete Todo

As a user, I can delete a todo so that I can permanently remove items I no longer need.

### Search Todos

As a user, I can search todos by title so that I can quickly find matching items.

### Filter Todos

As a user, I can filter todos by all, active, and completed states so that I can focus on the right subset.

### Empty States

As a user, I see helpful empty states when there are no todos, no active todos, no completed todos, or no search results.

## Functional Requirements

- The app must provide a todo list interface as the primary screen.
- Users must be able to create todos with a required title.
- Todo titles must be trimmed before saving.
- Empty or whitespace-only todo titles must be rejected with a clear validation message.
- Users must be able to edit todo titles inline or through a focused edit state.
- Edited titles must follow the same validation rules as newly created todos.
- Users must be able to mark active todos as completed.
- Users must be able to restore completed todos to active status.
- Users must be able to delete todos.
- Todos must persist across browser refreshes and sessions.
- Persistence must use a browser-local storage adapter backed by `localStorage`.
- The storage layer must be isolated behind a small typed module so it can be replaced later with a server or database backend.
- Public preview data is intentionally per-browser and not shared between users.
- Each todo must include at minimum:
  - Unique ID
  - Title
  - Completion status
  - Created timestamp
  - Updated timestamp
- The app must support filtering by:
  - All
  - Active
  - Completed
- The app must support case-insensitive search by todo title.
- Search and filters must work together.
- The UI must clearly distinguish active and completed todos.
- The UI must include clean empty states for each relevant list state.
- The app must handle persistence failures gracefully where applicable.
- Automated unit or component tests must cover core create, edit, complete, restore, delete, search, filter, validation, and empty-state behavior.
- The project must expose `npm run lint`, `npm test`, and `npm run build` scripts for Looper verification.
- The app must be deployable to a public preview URL.

## Acceptance Criteria

- A user can add a valid todo and see it appear in the list immediately.
- A user cannot add an empty or whitespace-only todo.
- A user can edit a todo and see the updated title persist.
- A user cannot save an edited todo with an empty or whitespace-only title.
- A user can mark a todo complete.
- A user can restore a completed todo.
- A user can delete a todo and it no longer appears after reload.
- Todos persist after refreshing the page.
- Filtering by all, active, and completed returns the correct todos.
- Searching by title returns case-insensitive matches.
- Search and filter combinations return the correct intersection of results.
- Empty states appear when there are no todos or no matching todos.
- Automated tests pass locally.
- The app can be deployed to a public preview environment.
- The preview deployment exposes the complete working todo app.

## Risks And Open Questions

- A database-backed implementation would be more production-like, but it would add credentials and deployment setup that distract from this Looper audit.
- Browser-local persistence does not support multi-device sync and is accepted for this disposable E2E target.
- End-to-end browser tests are optional; unit and component coverage plus lint and production build are required.
- Accessibility requirements should be clarified beyond basic keyboard and screen-reader usability.
- Deletion behavior should be confirmed: immediate permanent delete or confirmation before delete.
