import { useCallback, useState } from "react";
import { AboutPage } from "@/components/AboutPage";
import { AppShell, type AppPage } from "@/components/AppShell";
import { CustomPhraseArena } from "@/components/CustomPhraseArena";
import { FreePlayArena } from "@/components/FreePlayArena";
import { HomeScreen } from "@/components/HomeScreen";
import { PracticeArena } from "@/components/PracticeArena";
import { ProfilePage } from "@/components/ProfilePage";
import { SupportPage } from "@/components/SupportPage";
import type { LessonTrack } from "@/data/lpc-fr";
import { loadPack, savePack, type PackId } from "@/data/packs";
import { loadProgress, type ProgressState } from "@/lib/progress";
import { markFreeVisited } from "@/lib/visits";

type Screen = "browse" | "practice";

export default function App() {
  const [screen, setScreen] = useState<Screen>("browse");
  const [page, setPage] = useState<AppPage>("home");
  const [track, setTrack] = useState<LessonTrack>("shapes");
  const [pack, setPack] = useState<PackId>(() => loadPack());
  const [progress, setProgress] = useState<ProgressState>(() =>
    loadProgress(loadPack()),
  );

  const refreshProgress = useCallback(() => {
    setProgress(loadProgress(pack));
  }, [pack]);

  const changePack = (next: PackId) => {
    savePack(next);
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

  const inPractice = screen === "practice";

  return (
    <AppShell
      compact={inPractice}
      activePage={page}
      onNavigate={browse}
      onHome={goHome}
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
      {inPractice ? (
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
            onExit={goHome}
            onProgress={refreshProgress}
          />
        )
      ) : page === "about" ? (
        <AboutPage />
      ) : page === "support" ? (
        <SupportPage />
      ) : page === "profile" ? (
        <ProfilePage progress={progress} pack={pack} />
      ) : (
        <HomeScreen
          progress={progress}
          pack={pack}
          onPackChange={changePack}
          onStart={(t) => {
            if (t === "free") markFreeVisited();
            setTrack(t);
            setScreen("practice");
          }}
        />
      )}
    </AppShell>
  );
}
