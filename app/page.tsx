const overviewItems = [
  { label: "All", value: "0" },
  { label: "Active", value: "0" },
  { label: "Completed", value: "0" },
];

export default function Home() {
  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="app-title">
        <div className="hero-copy">
          <p className="eyebrow">Personal task board</p>
          <h1 id="app-title">Looper Todo</h1>
          <p className="intro">
            Capture the next thing, keep active work visible, and clear finished
            tasks from the day.
          </p>
        </div>

        <dl className="overview" aria-label="Todo summary">
          {overviewItems.map((item) => (
            <div className="overview-item" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="workspace" aria-label="Todo workspace">
        <form className="todo-entry" aria-label="Add a todo">
          <label htmlFor="new-todo">New todo</label>
          <div className="entry-row">
            <input
              id="new-todo"
              name="todo"
              type="text"
              placeholder="Add a todo"
              autoComplete="off"
            />
            <button type="button">Add todo</button>
          </div>
        </form>

        <div className="toolbar" aria-label="Todo filters">
          <div className="search-field">
            <label htmlFor="todo-search">Search</label>
            <input
              id="todo-search"
              name="search"
              type="search"
              placeholder="Search todos"
            />
          </div>
          <div className="filter-group" aria-label="Status filter">
            <button type="button" aria-pressed="true">
              All
            </button>
            <button type="button" aria-pressed="false">
              Active
            </button>
            <button type="button" aria-pressed="false">
              Completed
            </button>
          </div>
        </div>

        <section className="todo-list" aria-labelledby="todo-list-title">
          <div className="list-header">
            <h2 id="todo-list-title">Today</h2>
            <span>0 todos</span>
          </div>

          <div className="empty-state">
            <p>No todos yet</p>
            <span>Your active todos will appear here.</span>
          </div>
        </section>
      </section>
    </main>
  );
}
