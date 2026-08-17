"use client";

import type { ReactNode } from "react";

/** Game dialogue layer: docks to the bottom so the 3D lab stays visible. */
export function Screen({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-end px-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[8.25rem] sm:px-6 sm:pt-[9.5rem] sm:pb-6">
      <div
        className={`pointer-events-auto mx-auto max-h-full w-full overflow-y-auto overscroll-contain [scrollbar-width:thin] ${
          wide ? "max-w-[940px]" : "max-w-[760px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function Dialog({
  title,
  children,
  tone = "light",
  className = "",
}: {
  title?: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={`rise ${tone === "dark" ? "panel-dark" : "panel"} p-3.5 sm:p-6 ${className}`}>
      {title && <p className="sys mb-3 text-[0.65rem] text-burgundy">{title}</p>}
      {children}
    </div>
  );
}

export function Choice({
  label,
  onClick,
  disabled,
  variant = "cream",
  sub,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "cream" | "pink" | "danger" | "lime";
  sub?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} w-full flex-col !items-start !justify-center gap-0.5 !rounded-xl !px-4 text-left`}
    >
      <span className="leading-snug normal-case tracking-normal" style={{ fontFamily: "var(--font-ui)", fontSize: "0.95rem", fontWeight: 500 }}>
        {label}
      </span>
      {sub && (
        <span className="sys text-[0.55rem] opacity-70">{sub}</span>
      )}
    </button>
  );
}
