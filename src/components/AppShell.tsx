import type { ReactNode } from "react";

export type AppPage = "home" | "about" | "support" | "profile";

type AppShellProps = {
  children: ReactNode;
  headerRight?: ReactNode;
  /** Mode pratique : plein écran, sans nav */
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
  if (compact) {
    return (
      <div className="mx-auto flex h-dvh max-w-3xl flex-col overflow-hidden px-3 py-2 sm:px-5">
        <header className="mb-2 flex shrink-0 items-center justify-between gap-3">
          <button
            type="button"
            onClick={onHome}
            className="text-left transition hover:opacity-90"
          >
            <p className="font-display text-xl font-extrabold tracking-tight text-foam">
              Clé<span className="text-teal">LPC</span>
            </p>
          </button>
          {headerRight}
        </header>
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-4 sm:px-5 sm:py-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <button
          type="button"
          onClick={onHome}
          className="text-left transition hover:opacity-90"
        >
          <p className="font-display text-2xl font-extrabold tracking-tight text-foam sm:text-3xl">
            Clé<span className="text-teal">LPC</span>
          </p>
          <p className="text-sm text-mist">
            Apprendre le LPC français — caméra locale
          </p>
        </button>
        {headerRight}
      </header>

      {onNavigate && (
        <nav
          className="mb-5 flex flex-wrap items-center gap-1.5 sm:gap-2"
          aria-label="Navigation principale"
        >
          <NavLink
            label="Accueil"
            active={activePage === "home"}
            onClick={() => onNavigate("home")}
          />
          <NavLink
            label="Profil"
            active={activePage === "profile"}
            onClick={() => onNavigate("profile")}
          />
          <NavLink
            label="À propos"
            active={activePage === "about"}
            onClick={() => onNavigate("about")}
          />
          <NavLink
            label="Soutien"
            active={activePage === "support"}
            onClick={() => onNavigate("support")}
          />
        </nav>
      )}

      <main>{children}</main>

      <p className="mt-10 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-[10px] text-mist/60">
        Financé par les dons · sans pub pour l’instant
      </p>
    </div>
  );
}

function NavLink({
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
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? "bg-teal/20 font-semibold text-teal"
          : "text-mist hover:bg-panel/60 hover:text-foam"
      }`}
    >
      {label}
    </button>
  );
}
