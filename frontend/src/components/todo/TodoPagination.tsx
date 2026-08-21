type TodoPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const buttonClasses = [
  "flex size-12 items-center justify-center rounded-full",
  "text-slate-600 transition",
  "hover:bg-slate-200 hover:text-slate-900",
  "disabled:cursor-not-allowed disabled:text-slate-300",
  "disabled:hover:bg-transparent",
].join(" ");

const iconClasses = "size-8";

export default function TodoPagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TodoPaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav
      aria-label="Todo pagination"
      className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-slate-200 pt-6"
    >
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={isFirstPage}
        aria-label="Go to first page"
        className={buttonClasses}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClasses}
          aria-hidden="true"
        >
          <path d="m11 17-5-5 5-5" />
          <path d="m18 17-5-5 5-5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="Go to previous page"
        className={buttonClasses}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClasses}
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <span
        aria-current="page"
        className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-xl font-semibold text-emerald-700"
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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClasses}
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={isLastPage}
        aria-label="Go to last page"
        className={buttonClasses}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClasses}
          aria-hidden="true"
        >
          <path d="m6 17 5-5-5-5" />
          <path d="m13 17 5-5-5-5" />
        </svg>
      </button>

      <label className="relative ml-2">
        <span className="sr-only">Todos per page</span>

        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          aria-label="Todos per page"
          className="h-12 appearance-none rounded-xl border-2 border-slate-300 bg-white py-2 pl-5 pr-12 text-lg text-slate-700 outline-none transition focus:border-blue-500"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-600"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </label>
    </nav>
  );
}
