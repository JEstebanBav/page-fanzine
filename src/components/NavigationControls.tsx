import React from 'react';

interface NavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
  currentPage: number;
  totalPages: number;
  onViewCalendar: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrev,
  onNext,
  currentPage,
  totalPages,
  onViewCalendar,
}) => {
  const isFirstPage = currentPage <= 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <div className="flex items-center justify-center gap-4 mt-6" style={{ zIndex: 20 }}>
      {/* Previous button */}
      <button
        onClick={onPrev}
        disabled={isFirstPage}
        className={`nav-button flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 ${
          isFirstPage
            ? 'border-jungle-900/30 text-jungle-900/30 cursor-not-allowed'
            : 'border-jungle-700/50 text-jungle-400 hover:border-jungle-500 hover:text-jungle-300 bg-black/20 backdrop-blur-sm'
        }`}
        aria-label="Página anterior"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Page counter */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm border border-jungle-900/30">
        <span className="font-body text-sm text-jungle-400 tabular-nums">
          {currentPage + 1}
        </span>
        <span className="text-jungle-800">/</span>
        <span className="font-body text-sm text-jungle-600 tabular-nums">
          {totalPages}
        </span>
      </div>

      {/* Next / Calendar button */}
      {isLastPage ? (
        <button
          onClick={onViewCalendar}
          className="nav-button flex items-center justify-center gap-2 h-12 px-5 rounded-full border border-jungle-500/50 text-jungle-300 hover:border-jungle-400 hover:text-jungle-200 bg-jungle-950/50 backdrop-blur-sm transition-all duration-300"
          aria-label="Ver calendario final"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="font-body text-sm">Final</span>
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={isLastPage}
          className={`nav-button flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 ${
            isLastPage
              ? 'border-jungle-900/30 text-jungle-900/30 cursor-not-allowed'
              : 'border-jungle-700/50 text-jungle-400 hover:border-jungle-500 hover:text-jungle-300 bg-black/20 backdrop-blur-sm'
          }`}
          aria-label="Página siguiente"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default NavigationControls;
