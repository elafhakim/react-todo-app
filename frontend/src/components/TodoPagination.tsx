type TodoPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export default function TodoPagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TodoPaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const buttonClasses =
    "flex size-10 items-center justify-center rounded-full text-2xl font-medium text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <nav
      aria-label="Todo pagination"
      className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-6"
    >
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={isFirstPage}
        aria-label="Go to first page"
        className={buttonClasses}
      >
        «
      </button>

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="Go to previous page"
        className={buttonClasses}
      >
        ‹
      </button>

      <span
        aria-current="page"
        className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-lg font-semibold text-emerald-700"
      >
        {currentPage}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        aria-label="Go to next page"
        className={buttonClasses}
      >
        ›
      </button>

      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={isLastPage}
        aria-label="Go to last page"
        className={buttonClasses}
      >
        »
      </button>

      <label className="ml-2">
        <span className="sr-only">Todos per page</span>

        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          aria-label="Todos per page"
          className="h-12 rounded-xl border-2 border-slate-300 bg-white px-4 text-lg text-slate-700 outline-none transition focus:border-blue-500"
        >
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
        </select>
      </label>
    </nav>
  );
}
