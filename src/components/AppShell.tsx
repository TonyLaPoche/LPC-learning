import type { ReactNode } from "react";

export type AppPage =
  | "home"
  | "about"
  | "support"
  | "profile"
  | "feedback"
  | "privacy"
  | "terms"
  | "cookies";

type AppShellProps = {
  children: ReactNode;
  headerRight?: ReactNode;
  /** Mode pratique : plein écran, sans nav */
  compact?: boolean;
  activePage?: AppPage;
  onNavigate?: (page: AppPage) => void;
  onHome?: () => void;
  onOpenCookieSettings?: () => void;
};

export function AppShell({
  children,
  headerRight,
  compact,
  activePage = "home",
  onNavigate,
  onHome,
  onOpenCookieSettings,
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
            label="Feedback"
            active={activePage === "feedback"}
            onClick={() => onNavigate("feedback")}
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

      <footer className="mt-10 space-y-3 border-t border-panel-2/40 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))] text-center">
        {onNavigate && (
          <nav
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-mist/80"
            aria-label="Mentions légales"
          >
            <FooterLink
              label="Confidentialité"
              active={activePage === "privacy"}
              onClick={() => onNavigate("privacy")}
            />
            <span aria-hidden className="text-mist/30">
              ·
            </span>
            <FooterLink
              label="CGU"
              active={activePage === "terms"}
              onClick={() => onNavigate("terms")}
            />
            <span aria-hidden className="text-mist/30">
              ·
            </span>
            <FooterLink
              label="Cookies"
              active={activePage === "cookies"}
              onClick={() => onNavigate("cookies")}
            />
            {onOpenCookieSettings && (
              <>
                <span aria-hidden className="text-mist/30">
                  ·
                </span>
                <FooterLink
                  label="Gérer les cookies"
                  onClick={onOpenCookieSettings}
                />
              </>
            )}
          </nav>
        )}
        <p className="text-[10px] text-mist/60">
          Financé par les{" "}
          <span className="relative inline-block">
            <span className="line-through decoration-mist/70">dons</span>
          </span>{" "}
          café — sans pub tant qu’il reste du café
        </p>
      </footer>
    </div>
  );
}

function FooterLink({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`transition hover:text-teal ${
        active ? "font-semibold text-teal" : ""
      }`}
    >
      {label}
    </button>
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
