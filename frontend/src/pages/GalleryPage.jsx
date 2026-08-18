import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { galleryPhotos } from '../data/siteData';

/* Captions describe only what is visible in each photograph. The tag is a
   subject label, not a location: which bay or aisle a shot was taken in is not
   something the photographs establish. */
const FACILITY_SECTIONS = [
  {
    ...galleryPhotos[0],
    num: "Parts Store",
    tag: "Stock Control",
    description: "Checking boxed spares against paperwork, on shelving of labelled Siemens and allied components."
  },
  {
    ...galleryPhotos[1],
    num: "Warehouse Team",
    tag: "Our People",
    description: "The warehouse team on the storage floor, among the racked and crated stock they handle each day."
  },
  {
    ...galleryPhotos[2],
    num: "Materials Handling",
    tag: "Operations",
    description: "Moving crated equipment across the warehouse floor on a hydraulic pallet truck."
  },
  {
    ...galleryPhotos[3],
    num: "Team Gathering",
    tag: "Our People",
    description: "The team together on the lawn outside, photographed at dusk."
  },
  {
    ...galleryPhotos[4],
    num: "Planning Meeting",
    tag: "Coordination",
    description: "Working through orders and schedules around the table in the office meeting room."
  },
  {
    ...galleryPhotos[5],
    num: "Office Team",
    tag: "Our People",
    description: "The office team photographed in the meeting room at the company premises."
  },
  {
    ...galleryPhotos[6],
    num: "The Full Team",
    tag: "Our People",
    description: "A full team photograph taken outdoors beside the compound's boundary wall."
  }
];

/* Physical sheets of the book. Sheet N's front is the right-hand page of spread N,
   its back is the left-hand page of spread N+1. */
const SHEETS = [
  {
    front: { kind: 'cover' },
    back: { kind: 'intro', page: 1, gradient: 'from-[#111e30] to-[#0a101b]' }
  },
  {
    front: { kind: 'photo', section: FACILITY_SECTIONS[0], page: 2, gradient: 'from-[#16253b] to-[#0e172a]' },
    back: { kind: 'photo', section: FACILITY_SECTIONS[1], page: 3, gradient: 'from-[#0f172a] to-[#0a0e15]' }
  },
  {
    front: { kind: 'photo', section: FACILITY_SECTIONS[2], page: 4, gradient: 'from-[#1e293b] to-[#111e30]' },
    back: { kind: 'photo', section: FACILITY_SECTIONS[3], page: 5, gradient: 'from-[#111e30] to-[#0e1a2b]' }
  },
  {
    front: { kind: 'photo', section: FACILITY_SECTIONS[4], page: 6, gradient: 'from-[#16253b] to-[#1c2d46]' },
    back: { kind: 'photo', section: FACILITY_SECTIONS[5], page: 7, gradient: 'from-[#1c2d46] to-[#0e1a2b]' }
  },
  {
    front: { kind: 'photo', section: FACILITY_SECTIONS[6], page: 8, gradient: 'from-[#0e1a2b] to-[#0a0e15]' },
    back: { kind: 'outro', page: 9 }
  }
];

const TOTAL_SHEETS = SHEETS.length;   // 5 sheets => spread indices 0..5
const LAST_SPREAD = TOTAL_SHEETS;
const FLIP_MS = 900;                  // must match the CSS transition duration

/* Intrinsic size of the book; every other dimension is derived from these by
   scaling, so the spread keeps its proportions on any display. */
const BOOK_W = 940;
const BOOK_H = 580;

/* Clear space kept between the book and the edges of its stage. Held here
   rather than as CSS padding on the stage so the fit calculation and the gap
   can never disagree — the book is centred, so half of each lands on a side. */
const STAGE_GUTTER_X = 40;
const STAGE_GUTTER_Y = 44;

/* Names the two pages actually on screen at each spread: the left page is the
   previous sheet's back, the right page is the current sheet's front. */
const SPREAD_LABELS = [
  "Book Front Cover",
  "Welcome & Parts Store",
  "Warehouse Team & Materials Handling",
  "Team Gathering & Planning Meeting",
  "Office Team & The Full Team",
  "Tour Summary & Back Cover"
];

/* A facility photo page. The image box flexes so the page never overflows its
   sheet, regardless of caption length or the scale the book is rendered at. */
function PhotoFace({ face, side }) {
  const isBack = side === 'back';
  const { section, page, gradient } = face;

  return (
    <div
      className={`page-face ${isBack ? 'page-face-back' : 'page-face-front'} p-6 flex flex-col bg-gradient-to-br ${gradient} text-white border border-white/5`}
    >
      <div className={`flex justify-between items-start gap-3 shrink-0 ${isBack ? 'flex-row-reverse' : ''}`}>
        <h3 className={`text-xl font-display text-white tracking-wide uppercase leading-tight ${isBack ? 'text-right' : ''}`}>
          {section.num}
        </h3>
        <span className="inline-flex items-center gap-1 shrink-0 text-[10px] font-bold uppercase tracking-wider text-orange bg-orange/10 px-2.5 py-1 rounded-full border border-orange/20">
          <Tag className="w-3 h-3 text-orange shrink-0" />
          {section.tag}
        </span>
      </div>

      <div className="flex-1 min-h-0 my-3 border border-white/10 p-1 rounded-xl bg-black/30 overflow-hidden">
        <img
          src={section.image.src}
          alt={section.alt}
          width={section.image.width}
          height={section.image.height}
          decoding="async"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <p className="text-xs text-white/80 leading-relaxed shrink-0">
        {section.description}
      </p>

      <div className={`flex justify-between items-center text-[10px] text-white/40 border-t border-white/10 pt-3 mt-3 shrink-0 ${isBack ? 'flex-row-reverse' : ''}`}>
        <span>FACILITY GALLERY</span>
        <span>PAGE {page}</span>
      </div>
    </div>
  );
}

function CoverFace() {
  return (
    <div className="page-face page-face-front flex flex-col justify-between p-8 bg-radial from-[#1e293b] to-[#0a0f18] text-white border border-white/5 shadow-2xl">
      <div className="text-center pt-8">
        <span className="eyebrow eyebrow-orange mb-3">Facility Tour</span>
        <h2 className="text-4xl sm:text-5xl font-display uppercase tracking-wider text-orange leading-none">
          SHREE RAJ <br /> TRADERS
        </h2>
        <div className="h-0.5 w-16 bg-orange mx-auto my-4"></div>
        <p className="text-xs tracking-widest text-white/50 uppercase font-bold">
          Ahmedabad, Gujarat
        </p>
      </div>

      {/* Embossed Motif */}
      <div className="border border-white/10 bg-white/5 p-6 rounded-xl max-w-[260px] mx-auto text-center shadow-lg">
        <div className="text-3xl font-display text-orange">10,000+</div>
        <div className="text-[10px] text-white/40 tracking-wider mt-1 uppercase">SKUs in Stock</div>
      </div>

      <div className="text-center pb-4 animate-bounce">
        <span className="text-[10px] uppercase tracking-widest text-orange font-bold">
          Scroll Down to Open Book ↓
        </span>
      </div>
    </div>
  );
}

function IntroFace({ face }) {
  return (
    <div className={`page-face page-face-back p-8 flex flex-col justify-between bg-gradient-to-br ${face.gradient} text-white border border-white/5 shadow-2xl`}>
      <div className="space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-orange bg-orange/10 px-2 py-1 rounded border border-orange/20 inline-block">
          Welcome
        </span>
        <h3 className="text-2xl font-display text-white tracking-wide">INSIDE SHREE RAJ TRADERS</h3>
        <div className="h-0.5 w-12 bg-orange"></div>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-2">
          A look at how we work in Vatva, Ahmedabad — the stores and the warehouse floor, and the people who run them.
        </p>
        <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed">
          As authorized channel partners for Siemens, Crompton Greaves (CGL), and Hindustan Electric Motors, our warehouses store and manage over 10,000 SKUs to minimize operational downtime for clients.
        </p>
        <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed">
          Turn the pages to see stock control, materials handling and day-to-day coordination — and to meet the team behind every order.
        </p>
      </div>
      <div className="flex justify-between items-center text-[10px] text-white/40 border-t border-white/10 pt-4">
        <span>SHREE RAJ TRADERS</span>
        <span>PAGE {face.page}</span>
      </div>
    </div>
  );
}

function OutroFace({ face }) {
  return (
    <div className="page-face page-face-back p-8 flex flex-col justify-between bg-radial from-[#1e293b] to-[#0a0f18] text-white border border-white/5 shadow-2xl">
      <div className="space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-orange bg-orange/10 px-2.5 py-1 rounded border border-orange/20 inline-block">
          Tour Complete
        </span>
        <h3 className="text-2xl font-display text-orange tracking-wide">THANK YOU</h3>
        <div className="h-0.5 w-12 bg-orange"></div>

        <p className="text-xs text-white/70 leading-relaxed">
          Shree Raj Traders is committed to providing industry-leading electromechanical products and logistics support across India.
        </p>

        <div className="pt-2 space-y-2 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span className="text-orange font-bold">Sales Hotline:</span>
            <span>+91-97267 88690</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange font-bold">Email:</span>
            <span>sales@shreerajtraders.in</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange font-bold shrink-0">Address:</span>
            <span className="leading-tight">39, Mahalaxmi Industrial Estate, Vatva Phase 1, Ahmedabad</span>
          </div>
        </div>

        <div className="pt-3 flex gap-2">
          <Link
            to="/products/"
            className="inline-flex items-center justify-center px-3 py-1.5 rounded bg-orange hover:bg-orange/80 text-white font-bold text-xs uppercase tracking-wider transition-colors duration-200"
          >
            Products Catalog
          </Link>
          <Link
            to="/contact/"
            className="inline-flex items-center justify-center px-3 py-1.5 rounded border border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
      <div className="flex justify-between items-center text-[10px] text-white/40 border-t border-white/10 pt-4">
        <span>PAGE {face.page}</span>
        <span>SHREE RAJ TRADERS</span>
      </div>
    </div>
  );
}

function SheetFace({ face, side }) {
  if (face.kind === 'cover') return <CoverFace />;
  if (face.kind === 'intro') return <IntroFace face={face} />;
  if (face.kind === 'outro') return <OutroFace face={face} />;
  return <PhotoFace face={face} side={side} />;
}

export default function GalleryPage() {
  const mainContainerRef = useRef(null);
  const stageRef = useRef(null);
  const bookRef = useRef(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [flippingPage, setFlippingPage] = useState(null);
  const [bookScale, setBookScale] = useState(1);

  const lastScrollTime = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const flipTimerRef = useRef(null);

  // Prevent body scrolling when the gallery page is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => () => clearTimeout(flipTimerRef.current), []);

  /* Fit the book to the space the flex layout actually gives it. Measuring the
     stage beats deriving it from window.innerHeight minus a guess at the header
     and control-bar heights: those change with font size, wrapped text and zoom,
     and any error shows up as dead space above and below the book — or as a
     spread clipped at the top and bottom. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const availW = stage.clientWidth - STAGE_GUTTER_X;
      const availH = stage.clientHeight - STAGE_GUTTER_Y;
      if (availW <= 0 || availH <= 0) return;

      // Never enlarge past the intrinsic size: the spread is laid out for 940x580
      // and upscaling only softens the photographs.
      const fit = Math.min(availW / BOOK_W, availH / BOOK_H, 1);
      setBookScale(Math.max(0.3, fit));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  /* Every navigation goes through here. The fallback timer guarantees the book
     can never lock up if a `transitionend` is dropped (interrupted flip, a tab
     that was backgrounded mid-turn, reduced-motion overrides, etc.). */
  const goToSpread = useCallback((targetIdx) => {
    if (flippingPage !== null) return;
    if (targetIdx < 0 || targetIdx > LAST_SPREAD || targetIdx === currentPageIndex) return;

    lastScrollTime.current = Date.now();
    setFlippingPage(targetIdx > currentPageIndex ? targetIdx - 1 : targetIdx);
    setCurrentPageIndex(targetIdx);

    clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => setFlippingPage(null), FLIP_MS + 120);
  }, [currentPageIndex, flippingPage]);

  const handlePageNext = useCallback(() => goToSpread(currentPageIndex + 1), [goToSpread, currentPageIndex]);
  const handlePagePrev = useCallback(() => goToSpread(currentPageIndex - 1), [goToSpread, currentPageIndex]);

  // Wheel listener to lock browser scroll and trigger flips
  useEffect(() => {
    const container = mainContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Prevent default page scroll
      e.preventDefault();

      if (flippingPage !== null) return;

      // Throttling page flips to the CSS transition duration
      if (Date.now() - lastScrollTime.current < FLIP_MS) return;

      if (e.deltaY > 30) {
        handlePageNext();
      } else if (e.deltaY < -30) {
        handlePagePrev();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [flippingPage, handlePageNext, handlePagePrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') handlePageNext();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') handlePagePrev();
      else return;
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlePageNext, handlePagePrev]);

  // Touch handlers for mobile swipe flips
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const handleTouchEnd = (e) => {
    if (flippingPage !== null) return;
    if (Date.now() - lastScrollTime.current < FLIP_MS) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Swipe gesture threshold
    if (Math.max(absX, absY) > 55) {
      if (deltaX < -55 || deltaY < -55) {
        handlePageNext();
      } else if (deltaX > 55 || deltaY > 55) {
        handlePagePrev();
      }
    }
  };

  // Reset flipping state when the turning sheet settles
  const handleTransitionEnd = (e, idx) => {
    if (e.target === e.currentTarget && e.propertyName === 'transform' && idx === flippingPage) {
      clearTimeout(flipTimerRef.current);
      setFlippingPage(null);
    }
  };

  /* Stack order. The turned (left) and untuned (right) stacks occupy disjoint
     z-index ranges so the two halves can never tie, and the sheet in flight is
     lifted above both. `depth` is the sheet's distance from the open spread,
     which gives the stacks real thickness and keeps the 3D sort deterministic. */
  const sheetStyle = (idx) => {
    const flipped = idx < currentPageIndex;
    const isFlipping = idx === flippingPage;
    const depth = -(flipped ? currentPageIndex - 1 - idx : idx - currentPageIndex) * 1.5;

    return {
      transform: `translateZ(${depth}px) rotateY(${flipped ? -180 : 0}deg)`,
      zIndex: isFlipping ? 100 : (flipped ? TOTAL_SHEETS + 1 + idx : TOTAL_SHEETS - idx)
    };
  };

  return (
    <div
      ref={mainContainerRef}
      className="bg-[#0a0e15] h-screen min-h-screen text-white font-sans overflow-hidden flex flex-col justify-between select-none pt-[80px]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* Compact header — every pixel spent here is a pixel the book loses, so
          the eyebrow sits inline with the title rather than stacked above it. */}
      <header className="w-full text-center py-2 px-6 bg-[#0a0e15] border-b border-[rgba(255,255,255,0.03)] shrink-0 z-10">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="eyebrow eyebrow-teal mb-0 text-[9px] py-0.5 px-2.5 hidden sm:inline-flex">
            Inside Shree Raj Traders
          </span>
          <h1 className="text-xl sm:text-2xl font-display uppercase tracking-wider text-white leading-tight">
            FACILITY <span className="text-orange">GALLERY</span>
          </h1>
        </div>
        <p className="text-[10px] text-[rgba(255,255,255,0.45)] leading-tight">
          Use Mouse Scroll, Trackpad, Swipe, Arrow Keys, or Controls below to turn book pages.
        </p>
      </header>

      {/* Book Presentation Viewport. No padding here — STAGE_GUTTER_X/Y own the
          clear space, so the measured slot and the visible gap stay in step. */}
      <div
        ref={stageRef}
        className="flex-grow flex items-center justify-center relative w-full min-h-0 overflow-hidden"
      >

        {/* 3D Book Layout Container */}
        <div className="book-viewport">

          <div
            ref={bookRef}
            className="book-container-3d relative"
            style={{
              transform: `scale(${bookScale}) translateX(${currentPageIndex === 0 ? '-235px' : '0px'})`
            }}
          >
            {/* Central binding spine */}
            <div
              className="book-spine-3d"
              style={{ opacity: currentPageIndex > 0 ? 1 : 0.5 }}
            ></div>

            {/* Hardcover backing plates — static backdrops, never rotated. */}
            <div
              className="book-cover-left"
              style={{ opacity: currentPageIndex > 0 ? 1 : 0, pointerEvents: 'none' }}
            ></div>
            <div className="book-cover-right" style={{ pointerEvents: 'none' }}></div>

            {/* Paper sheets — every sheet stays mounted so a flip is never
                interrupted by a display toggle, which would drop its transition. */}
            {SHEETS.map((sheet, idx) => (
              <div
                key={idx}
                className={`book-page-3d${idx === flippingPage ? ' is-flipping' : ''}`}
                style={sheetStyle(idx)}
                onTransitionEnd={(e) => handleTransitionEnd(e, idx)}
              >
                <SheetFace face={sheet.front} side="front" />
                <SheetFace face={sheet.back} side="back" />
              </div>
            ))}

            {/* Edge Stack layers (page thickness effect) */}
            <div
              className="page-edge-thickness-left"
              style={{ opacity: currentPageIndex > 0 ? 0.85 : 0 }}
            ></div>
            <div
              className="page-edge-thickness-right"
              style={{ opacity: currentPageIndex < LAST_SPREAD ? 0.85 : 0 }}
            ></div>

          </div>

        </div>

      </div>

      {/* Interactive Navigation Panel */}
      <div className="w-full py-3 bg-[#0a0e15]/90 border-t border-white/5 backdrop-blur-md flex flex-col items-center space-y-1.5 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePagePrev}
            disabled={currentPageIndex === 0 || flippingPage !== null}
            className="p-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-orange hover:border-orange disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 transition-all duration-300 cursor-pointer"
            aria-label="Previous Page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/5 bg-black/40">
            {SPREAD_LABELS.map((label, idx) => (
              <button
                key={idx}
                onClick={() => goToSpread(idx)}
                disabled={flippingPage !== null}
                className="w-3.5 h-3.5 rounded-full transition-all duration-300 relative group cursor-pointer"
                style={{
                  backgroundColor: currentPageIndex === idx ? 'var(--accent-orange)' : 'rgba(255,255,255,0.2)',
                  transform: currentPageIndex === idx ? 'scale(1.25)' : 'scale(1)'
                }}
                title={label}
                aria-label={label}
              >
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2 py-1 bg-black text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                  {label}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handlePageNext}
            disabled={currentPageIndex === LAST_SPREAD || flippingPage !== null}
            className="p-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-orange hover:border-orange disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 transition-all duration-300 cursor-pointer"
            aria-label="Next Page"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 text-center select-none">
          {SPREAD_LABELS[currentPageIndex]}
        </div>
      </div>

    </div>
  );
}
