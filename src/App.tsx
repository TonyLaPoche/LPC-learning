import { useCallback, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { HomeScreen } from "@/components/HomeScreen";
import { PracticeArena } from "@/components/PracticeArena";
import type { LessonTrack } from "@/data/lpc-fr";
import { loadProgress, type ProgressState } from "@/lib/progress";

export default function App() {
  const [screen, setScreen] = useState<"home" | "practice">("home");
  const [track, setTrack] = useState<LessonTrack>("shapes");
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  const refreshProgress = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <AppShell
      compact={screen === "practice"}
      headerRight={
        <div className="rounded-full border border-panel-2/80 bg-panel/70 px-3 py-1.5 text-xs text-mist">
          <span className="text-teal">{progress.xp}</span> XP
        </div>
      }
    >
      {screen === "home" ? (
        <HomeScreen
          progress={progress}
          onStart={(t) => {
            setTrack(t);
            setScreen("practice");
          }}
        />
      ) : (
        <PracticeArena
          track={track}
          onExit={() => {
            refreshProgress();
            setScreen("home");
          }}
          onProgress={refreshProgress}
        />
      )}
    </AppShell>
  );
}
