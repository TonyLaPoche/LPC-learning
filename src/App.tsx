import { useCallback, useEffect, useState } from "react";
import { AboutPage } from "@/components/AboutPage";
import { AppShell, type AppPage } from "@/components/AppShell";
import { BuyMeCoffeeWidget } from "@/components/BuyMeCoffeeWidget";
import { CookieBanner } from "@/components/CookieBanner";
import { CustomPhraseArena } from "@/components/CustomPhraseArena";
import { DebugHandsArena } from "@/components/DebugHandsArena";
import { DebugPositionsArena } from "@/components/DebugPositionsArena";
import { DebugSyllablesArena } from "@/components/DebugSyllablesArena";
import { DebugZoneEditorArena } from "@/components/DebugZoneEditorArena";
import { DebugZonesArena } from "@/components/DebugZonesArena";
import { FeedbackPage } from "@/components/FeedbackPage";
import { FreePlayArena } from "@/components/FreePlayArena";
import { HomeScreen } from "@/components/HomeScreen";
import { LegalPage, type LegalDoc } from "@/components/LegalPage";
import { PracticeArena } from "@/components/PracticeArena";
import { ProfilePage } from "@/components/ProfilePage";
import { SupportPage } from "@/components/SupportPage";
import type { LessonTrack } from "@/data/lpc-fr";
import { loadPack, savePack, PACK_WIP, type PackId } from "@/data/packs";
import { loadProgress, type ProgressState } from "@/lib/progress";
import posthog from "@/lib/posthog";
import { markFreeVisited } from "@/lib/visits";

const LEGAL_PAGES = new Set<AppPage>(["privacy", "terms", "cookies"]);

function pageFromUrl(): AppPage | null {
  try {
    const p = new URLSearchParams(window.location.search).get("page");
    if (
      p === "privacy" ||
      p === "terms" ||
      p === "cookies" ||
      p === "about" ||
      p === "support" ||
      p === "profile" ||
      p === "feedback" ||
      p === "home"
    ) {
      return p;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function syncPageToUrl(page: AppPage) {
  try {
    const url = new URL(window.location.href);
    if (page === "home") url.searchParams.delete("page");
    else url.searchParams.set("page", page);
    window.history.replaceState({}, "", url);
  } catch {
    /* ignore */
  }
}

const DEBUG_MENU_KEY = "cle-lpc-debug-menu-v1";

function loadDebugMenu(): boolean {
  try {
    return sessionStorage.getItem(DEBUG_MENU_KEY) === "1";
  } catch {
    return false;
  }
}

function persistDebugMenu(on: boolean) {
  try {
    if (on) sessionStorage.setItem(DEBUG_MENU_KEY, "1");
    else sessionStorage.removeItem(DEBUG_MENU_KEY);
  } catch {
    /* ignore */
  }
}

type Screen =
  | "browse"
  | "practice"
  | "debug-zones"
  | "debug-zone-editor"
  | "debug-hands"
  | "debug-positions"
  | "debug-syllables";

export default function App() {
  const [screen, setScreen] = useState<Screen>("browse");
  const [page, setPage] = useState<AppPage>(() => pageFromUrl() ?? "home");
  const [track, setTrack] = useState<LessonTrack>("shapes");
  const [resumeIndex, setResumeIndex] = useState(0);
  const [pack, setPack] = useState<PackId>(() => loadPack());
  const [progress, setProgress] = useState<ProgressState>(() =>
    loadProgress(loadPack()),
  );
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  /** Menu Debug (dev ouvert par défaut ; en prod via code clavier « debug »). */
  const [debugMenu, setDebugMenu] = useState(
    () => import.meta.env.DEV || loadDebugMenu(),
  );

  useEffect(() => {
    syncPageToUrl(page);
  }, [page]);

  const toggleDebugMenu = useCallback(() => {
    setDebugMenu((prev) => {
      const next = !prev;
      persistDebugMenu(next);
      return next;
    });
  }, []);

  const refreshProgress = useCallback(() => {
    setProgress(loadProgress(pack));
  }, [pack]);

  const changePack = (next: PackId) => {
    if (PACK_WIP[next] || next === pack) return;
    savePack(next);
    posthog?.capture("learning_pack_selected", { pack: next });
    setPack(next);
    setProgress(loadProgress(next));
  };

  const goHome = () => {
    refreshProgress();
    setScreen("browse");
    setPage("home");
  };

  const browse = (next: AppPage) => {
    refreshProgress();
    setScreen("browse");
    setPage(next);
  };

  const inCamera =
    screen === "practice" ||
    screen === "debug-zones" ||
    screen === "debug-zone-editor" ||
    screen === "debug-hands" ||
    screen === "debug-positions" ||
    screen === "debug-syllables";

  return (
    <>
      <AppShell
        compact={inCamera}
        activePage={page}
        onNavigate={browse}
        onHome={goHome}
        onOpenCookieSettings={() => setCookieSettingsOpen(true)}
        headerRight={
          <button
            type="button"
            onClick={() => browse("profile")}
            className="rounded-full border border-panel-2/80 bg-panel/70 px-3 py-1.5 text-xs text-mist transition hover:border-teal/40 hover:text-foam"
            title="Voir le profil"
          >
            <span className="mr-1.5 text-[10px] uppercase text-sky">{pack}</span>
            <span className="text-teal">{progress.xp}</span> XP
          </button>
        }
      >
        {screen === "debug-zones" ? (
          <DebugZonesArena onExit={goHome} />
        ) : screen === "debug-zone-editor" ? (
          <DebugZoneEditorArena onExit={goHome} />
        ) : screen === "debug-hands" ? (
          <DebugHandsArena onExit={goHome} />
        ) : screen === "debug-positions" ? (
          <DebugPositionsArena onExit={goHome} />
        ) : screen === "debug-syllables" ? (
          <DebugSyllablesArena pack={pack} onExit={goHome} />
        ) : screen === "practice" ? (
          track === "free" ? (
            <FreePlayArena onExit={goHome} />
          ) : track === "custom" ? (
            <CustomPhraseArena
              pack={pack}
              onExit={goHome}
              onProgress={refreshProgress}
            />
          ) : (
            <PracticeArena
              track={track}
              pack={pack}
              initialIndex={resumeIndex}
              onExit={goHome}
              onProgress={refreshProgress}
            />
          )
        ) : LEGAL_PAGES.has(page) ? (
          <LegalPage
            doc={page as LegalDoc}
            onOpenCookiesSettings={() => setCookieSettingsOpen(true)}
            onNavigate={(doc) => browse(doc)}
          />
        ) : page === "about" ? (
          <AboutPage />
        ) : page === "feedback" ? (
          <FeedbackPage pack={pack} />
        ) : page === "support" ? (
          <SupportPage />
        ) : page === "profile" ? (
          <ProfilePage
            progress={progress}
            pack={pack}
            onProgressChange={setProgress}
          />
        ) : (
          <HomeScreen
            progress={progress}
            pack={pack}
            onPackChange={changePack}
            onStart={(t, at) => {
              if (t === "free") markFreeVisited();
              posthog?.capture("learning_session_started", {
                track: t,
                pack,
                resumed: at != null && at > 0,
              });
              setTrack(t);
              setResumeIndex(at ?? 0);
              setScreen("practice");
            }}
            onToggleDebugMenu={toggleDebugMenu}
            debugMenuOpen={debugMenu}
            onOpenDebugZones={
              debugMenu ? () => setScreen("debug-zones") : undefined
            }
            onOpenDebugZoneEditor={
              debugMenu ? () => setScreen("debug-zone-editor") : undefined
            }
            onOpenDebugHands={
              debugMenu ? () => setScreen("debug-hands") : undefined
            }
            onOpenDebugPositions={
              debugMenu ? () => setScreen("debug-positions") : undefined
            }
            onOpenDebugSyllables={
              debugMenu ? () => setScreen("debug-syllables") : undefined
            }
          />
        )}
      </AppShell>
      {!inCamera && (
        <CookieBanner
          forceOpen={cookieSettingsOpen}
          onCloseSettings={() => setCookieSettingsOpen(false)}
          onNavigateCookies={() => {
            setCookieSettingsOpen(false);
            browse("cookies");
          }}
        />
      )}
      <BuyMeCoffeeWidget enabled={!inCamera} />
    </>
  );
}
