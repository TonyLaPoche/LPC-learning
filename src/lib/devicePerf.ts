/** Profil perf : mobile / tactile vs desktop. */

export function isMobilePerfProfile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
}

export function cameraConstraints(mobile: boolean): MediaTrackConstraints {
  if (mobile) {
    return {
      facingMode: "user",
      width: { ideal: 640, max: 960 },
      height: { ideal: 480, max: 540 },
      frameRate: { ideal: 24, max: 30 },
    };
  }
  return {
    facingMode: "user",
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
    frameRate: { ideal: 30, max: 60 },
  };
}

export type VisionPerfProfile = {
  handIntervalMs: number;
  faceIntervalMs: number;
  maxCanvasWidth: number;
  liteDraw: boolean;
  handDetection: number;
  handPresence: number;
  handTracking: number;
};

export function visionPerfProfile(mobile: boolean): VisionPerfProfile {
  if (mobile) {
    return {
      handIntervalMs: 40,
      faceIntervalMs: 100,
      maxCanvasWidth: 480,
      liteDraw: true,
      handDetection: 0.4,
      handPresence: 0.4,
      handTracking: 0.35,
    };
  }
  return {
    handIntervalMs: 0,
    faceIntervalMs: 33,
    maxCanvasWidth: 1280,
    liteDraw: false,
    handDetection: 0.5,
    handPresence: 0.5,
    handTracking: 0.5,
  };
}
