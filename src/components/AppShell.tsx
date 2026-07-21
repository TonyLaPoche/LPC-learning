import type { ReactNode } from "react";
import { AdSlot } from "@/components/AdSlot";

type AppShellProps = {
  children: ReactNode;
  headerRight?: ReactNode;
  /** Mode pratique : header compact, pubs latérales seulement desktop large */
  compact?: boolean;
};

export function AppShell({ children, headerRight, compact }: AppShellProps) {
  return (
    <div
      className={`mx-auto flex max-w-[1400px] flex-col px-3 sm:px-5 ${
        compact ? "h-dvh overflow-hidden py-2" : "min-h-full py-4"
      }`}
    >
      <header
        className={`flex shrink-0 items-center justify-between gap-3 ${compact ? "mb-2" : "mb-4"}`}
      >
        <div>
          <p
            className={`font-display font-extrabold tracking-tight text-foam ${
              compact ? "text-xl" : "text-2xl sm:text-3xl"
            }`}
          >
            Clé<span className="text-teal">LPC</span>
          </p>
          {!compact && (
            <p className="text-sm text-mist">
              Apprendre le LPC français — caméra locale
            </p>
          )}
        </div>
        {headerRight}
      </header>

      <div className={`flex min-h-0 flex-1 gap-3 ${compact ? "overflow-hidden" : ""}`}>
        {!compact && <AdSlot side="left" />}
        {compact && (
          <div className="hidden xl:block">
            <AdSlot side="left" />
          </div>
        )}
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
        {!compact && <AdSlot side="right" />}
        {compact && (
          <div className="hidden xl:block">
            <AdSlot side="right" />
          </div>
        )}
      </div>

      {!compact && (
        <div className="lg:hidden">
          <AdSlot side="bottom" />
        </div>
      )}
    </div>
  );
}
