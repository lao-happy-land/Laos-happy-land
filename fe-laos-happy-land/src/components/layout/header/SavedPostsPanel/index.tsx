"use client";

import { useEffect, useRef, useState } from "react";

type SavedPostsPanelProps = {
  isScrolled: boolean;
};

export default function SavedPostsPanel({ isScrolled }: SavedPostsPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tạo class cho icon:
  // Dưới lg thì luôn nhỏ (h-5 w-5)
  // Trên lg thì dựa vào isScrolled (true => h-5 w-5, false => h-6 w-6)
  const iconSizeClass = isScrolled
    ? "h-5 w-5 lg:h-5 lg:w-5"
    : "h-5 w-5 lg:h-6 lg:w-6";
  return (
    <div className="relative z-10 inline-block" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer rounded-lg px-4 py-3 font-medium text-stone-950 transition-colors hover:bg-gray-100"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg
          className={`text-stone-950 transition-all duration-300 ${iconSizeClass}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-1/2 z-20 mt-3 w-70 max-w-xs -translate-x-1/2 rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-3 text-center text-base font-semibold">
            Tin đăng đã lưu
          </div>
          <hr className="mb-4" />
          <div className="text-center text-sm text-gray-600">
            <div className="mb-2 flex justify-center">
              <svg
                className="h-16 w-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6M9 16h4M9 8h6"
                />
              </svg>
            </div>
            <p>
              Bấm <span className="font-semibold">♡</span> để lưu tin
              <br />
              và xem lại tin đã lưu tại đây
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
