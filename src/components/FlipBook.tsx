import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const PAGE_IMAGES = [
  './pages/page1.png',
  './pages/page2.png',
  './pages/page3.png',
  './pages/page4.png',
  './pages/page5.png',
  './pages/page6.png',
  './pages/page7.png',
  './pages/page8.png',
];

interface PageProps {
  image: string;
  pageNum: number;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ image, pageNum }, ref) => {
  return (
    <div className="page" ref={ref} data-page={pageNum}>
      <img src={image} alt={`Página ${pageNum}`} draggable={false} />
    </div>
  );
});
Page.displayName = 'Page';

export interface FlipBookHandle {
  flipNext: () => void;
  flipPrev: () => void;
  getCurrentPage: () => number;
}

interface FlipBookProps {
  onPageChange?: (page: number) => void;
  onLastPage?: () => void;
  onFinalTransition?: () => void;
}

const FlipBook = forwardRef<FlipBookHandle, FlipBookProps>(
  ({ onPageChange, onLastPage, onFinalTransition }, ref) => {
    const bookRef = useRef<any>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 400, height: 560 });
    const [showHint, setShowHint] = useState(true);
    const totalPages = PAGE_IMAGES.length;

    // Calculate responsive dimensions
    useEffect(() => {
      const updateDimensions = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMobile = vw < 768;

        let w: number, h: number;
        if (isMobile) {
          w = Math.min(vw * 0.85, 350);
          h = w * 1.4;
        } else {
          const maxH = vh * 0.72;
          h = Math.min(maxH, 680);
          w = h / 1.4;
          if (w * 2 > vw * 0.85) {
            w = (vw * 0.85) / 2;
            h = w * 1.4;
          }
        }

        setDimensions({ width: Math.round(w), height: Math.round(h) });
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Keyboard navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          bookRef.current?.pageFlip()?.flipNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          bookRef.current?.pageFlip()?.flipPrev();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Expose methods
    useImperativeHandle(ref, () => ({
      flipNext: () => bookRef.current?.pageFlip()?.flipNext(),
      flipPrev: () => bookRef.current?.pageFlip()?.flipPrev(),
      getCurrentPage: () => currentPage,
    }));

    const handleFlip = useCallback(
      (e: any) => {
        const page = e.data as number;
        setCurrentPage(page);
        setShowHint(false);
        onPageChange?.(page);

        // Check if we reached the last page
        if (page >= totalPages - 1) {
          onLastPage?.();
        }
      },
      [onPageChange, onLastPage, totalPages]
    );

    const handleChangeState = useCallback(
      (e: any) => {
        if (e.data === 'user_fold') {
          setShowHint(false);
        }
      },
      []
    );

    // Detect attempt to go past the last page
    const handleClickLastPage = useCallback(() => {
      if (currentPage >= totalPages - 2) {
        onFinalTransition?.();
      }
    }, [currentPage, totalPages, onFinalTransition]);

    return (
      <div className="relative flex items-center justify-center" style={{ zIndex: 10 }}>
        {/* Book container with shadow */}
        <div className="book-shadow rounded-lg relative">
          {/* @ts-ignore - react-pageflip types are incomplete */}
          <HTMLFlipBook
            ref={bookRef}
            width={dimensions.width}
            height={dimensions.height}
            size="fixed"
            minWidth={280}
            maxWidth={600}
            minHeight={400}
            maxHeight={840}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={handleFlip}
            onChangeState={handleChangeState}
            className="book"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={window.innerWidth < 768}
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.6}
            showPageCorners={true}
            disableFlipByClick={false}
            useMouseEvents={true}
            swipeDistance={30}
            clickEventForward={true}
          >
            {PAGE_IMAGES.map((img, i) => (
              <Page key={i} image={img} pageNum={i + 1} />
            ))}
          </HTMLFlipBook>

          {/* Page turn hint */}
          {showHint && currentPage === 0 && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 page-hint pointer-events-none">
              <div className="bg-black/40 backdrop-blur-sm text-white/80 px-3 py-2 rounded-lg text-xs font-body flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                Desliza
              </div>
            </div>
          )}

          {/* Click area for final transition (invisible, on last page) */}
          {currentPage >= totalPages - 2 && (
            <button
              className="absolute right-0 top-0 w-16 h-full cursor-pointer opacity-0 z-20"
              onClick={handleClickLastPage}
              aria-label="Ver composición final"
            />
          )}
        </div>

        {/* Page indicator */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.ceil(totalPages / 2) + 1 }, (_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  Math.floor(currentPage / 2) === i
                    ? 'w-6 h-1.5 bg-jungle-400'
                    : 'w-1.5 h-1.5 bg-jungle-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

FlipBook.displayName = 'FlipBook';

export default FlipBook;
