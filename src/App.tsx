import React, { useCallback, useRef, useState } from 'react';
import JungleBackground from './components/JungleBackground';
import ImagePreloader from './components/ImagePreloader';
import FlipBook, { FlipBookHandle } from './components/FlipBook';
import NavigationControls from './components/NavigationControls';
import CalendarAnimation from './components/CalendarAnimation';

const ALL_IMAGES = [
  './pages/page1.png',
  './pages/page2.png',
  './pages/page3.png',
  './pages/page4.png',
  './pages/page5.png',
  './pages/page6.png',
  './pages/page7.png',
  './pages/page8.png',
  './pages/calendar-final.png',
];

const TOTAL_BOOK_PAGES = 8;

const App: React.FC = () => {
  const bookRef = useRef<FlipBookHandle>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showCalendarAnimation, setShowCalendarAnimation] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleFinalTransition = useCallback(() => {
    setShowCalendarAnimation(true);
  }, []);

  const handleBackToBook = useCallback(() => {
    setShowCalendarAnimation(false);
  }, []);

  const handleImagesLoaded = useCallback(() => {
    setImagesReady(true);
  }, []);

  return (
    <ImagePreloader images={ALL_IMAGES} onLoaded={handleImagesLoaded}>
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Jungle background */}
        <JungleBackground />

        {/* Title */}
        <div
          className="relative text-center mb-4 md:mb-6"
          style={{ zIndex: 10 }}
        >
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-white/90 tracking-wider">
            Fanzine Digital
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-jungle-500 to-transparent mx-auto mt-2" />
        </div>

        {/* FlipBook */}
        {imagesReady && (
          <FlipBook
            ref={bookRef}
            onPageChange={handlePageChange}
            onFinalTransition={handleFinalTransition}
          />
        )}

        {/* Navigation Controls */}
        <NavigationControls
          onPrev={() => bookRef.current?.flipPrev()}
          onNext={() => bookRef.current?.flipNext()}
          currentPage={currentPage}
          totalPages={TOTAL_BOOK_PAGES}
          onViewCalendar={handleFinalTransition}
        />

        {/* Keyboard hint */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 text-jungle-800 font-body text-xs"
          style={{ zIndex: 10 }}
        >
          <kbd className="px-1.5 py-0.5 rounded border border-jungle-900/50 bg-black/20 text-jungle-600 text-[10px]">
            ←
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-jungle-900/50 bg-black/20 text-jungle-600 text-[10px]">
            →
          </kbd>
          <span className="ml-1">para navegar</span>
        </div>

        {/* Calendar final animation overlay */}
        <CalendarAnimation
          active={showCalendarAnimation}
          onBack={handleBackToBook}
        />
      </div>
    </ImagePreloader>
  );
};

export default App;
