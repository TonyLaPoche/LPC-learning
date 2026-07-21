import type { ReactNode } from "react";

export type AppPage = "home" | "about" | "support" | "profile";

type AppShellProps = {
  children: ReactNode;
  headerRight?: ReactNode;
  /** Mode pratique : plein écran, pas de footer */
  compact?: boolean;
  activePage?: AppPage;
  onNavigate?: (page: AppPage) => void;
  onHome?: () => void;
};

export function AppShell({
  children,
  headerRight,
  compact,
  activePage = "home",
  onNavigate,
  onHome,
}: AppShellProps) {
  return (
    <div
      className={`mx-auto flex max-w-3xl flex-col px-3 sm:px-5 ${
        compact ? "h-dvh overflow-hidden py-2" : "min-h-dvh py-4"
      }`}
    >
      <header
        className={`flex shrink-0 items-center justify-between gap-3 ${compact ? "mb-2" : "mb-4"}`}
      >
        <button
          type="button"
          onClick={onHome}
          className="text-left transition hover:opacity-90"
        >
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
        </button>
        {headerRight}
      </header>

      <main
        className={`min-h-0 min-w-0 flex-1 ${
          compact ? "overflow-hidden" : "overflow-y-auto pb-4"
        }`}
      >
        {children}
      </main>

      {!compact && onNavigate && (
        <footer className="mt-auto shrink-0 border-t border-panel-2/60 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
            aria-label="Pied de page"
          >
            <FooterLink
              label="Accueil"
              active={activePage === "home"}
              onClick={() => onNavigate("home")}
            />
            <FooterLink
              label="Profil"
              active={activePage === "profile"}
              onClick={() => onNavigate("profile")}
            />
            <FooterLink
              label="À propos"
              active={activePage === "about"}
              onClick={() => onNavigate("about")}
            />
            <FooterLink
              label="Soutien"
              active={activePage === "support"}
              onClick={() => onNavigate("support")}
            />
          </nav>
          <p className="mt-2 text-center text-[10px] text-mist/70">
            Financé par les dons · sans pub pour l’instant
          </p>
        </footer>
      )}
    </div>
  );
}

function FooterLink({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2 py-1 transition ${
        active
          ? "bg-teal/15 font-semibold text-teal"
          : "text-mist hover:text-foam"
      }`}
    >
      {label}
    </button>
  );
}
