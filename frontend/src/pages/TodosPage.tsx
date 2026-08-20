export default function TodosPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Todo App</h1>

          <p className="mt-3 text-slate-600">
            Manage your tasks and deadlines.
          </p>
        </header>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-800">My Todos</h2>

          <p className="mt-2 text-slate-500">Your todos will appear here.</p>
        </div>
      </section>
    </main>
  );
}
