/**
 * Navigation / écrans CléLPC → PostHog (Paths, funnels, replay).
 * Pas de PII, pas de texte libre, pas de frames caméra.
 */

import type { AppPage } from "@/components/AppShell";
import type { LessonTrack } from "@/data/lpc-fr";
import type { PackId } from "@/data/packs";
import posthog from "@/lib/posthog";
import { APP_VERSION } from "@/lib/version";

export type AppScreen =
  | "browse"
  | "practice"
  | "debug-zones"
  | "debug-zone-editor"
  | "debug-hands"
  | "debug-positions"
  | "debug-syllables";

export type ScreenContext = {
  screen: AppScreen;
  page: AppPage;
  track?: LessonTrack;
  pack: PackId;
};

/** Chemin logique stable pour Paths / $pageview (indépendant du base Vite). */
export function screenPath(ctx: ScreenContext): string {
  if (ctx.screen === "practice") {
    return `/practice/${ctx.track ?? "unknown"}`;
  }
  if (ctx.screen.startsWith("debug")) {
    return `/debug/${ctx.screen.replace(/^debug-?/, "") || "zones"}`;
  }
  return `/${ctx.page === "home" ? "" : ctx.page}`.replace(/\/$/, "") || "/";
}

/** Nom lisible pour insights / dashboards. */
export function screenName(ctx: ScreenContext): string {
  if (ctx.screen === "practice") {
    return `practice_${ctx.track ?? "unknown"}`;
  }
  if (ctx.screen.startsWith("debug")) {
    return ctx.screen;
  }
  return ctx.page;
}

/** Met à jour l’URL (history) pour que PostHog voie chaque écran SPA. */
export function syncScreenToUrl(ctx: ScreenContext): string {
  const url = new URL(window.location.href);
  url.searchParams.delete("page");
  url.searchParams.delete("screen");
  url.searchParams.delete("track");

  if (ctx.screen === "practice") {
    url.searchParams.set("screen", "practice");
    if (ctx.track) url.searchParams.set("track", ctx.track);
  } else if (ctx.screen.startsWith("debug")) {
    url.searchParams.set("screen", ctx.screen);
  } else if (ctx.page !== "home") {
    url.searchParams.set("page", ctx.page);
  }

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.replaceState({ cleLpcScreen: screenName(ctx) }, "", next);
  }
  return next;
}

/** Contexte global (pack, version) attaché à tous les events suivants. */
export function registerAnalyticsContext(pack: PackId): void {
  posthog?.register({
    pack,
    app_version: APP_VERSION,
    app_name: "cle-lpc",
  });
}

/**
 * Enregistre une vue d’écran.
 * - met à jour l’URL
 * - envoie `screen_viewed` (dashboard produit)
 * - `$pageview` est aussi capturé via history_change si analytics opt-in
 */
export function trackScreenView(ctx: ScreenContext): void {
  registerAnalyticsContext(ctx.pack);
  syncScreenToUrl(ctx);

  const path = screenPath(ctx);
  const name = screenName(ctx);

  posthog?.capture("screen_viewed", {
    screen: name,
    screen_kind: ctx.screen === "browse" ? "page" : ctx.screen.startsWith("debug") ? "debug" : "practice",
    page: ctx.page,
    track: ctx.track ?? null,
    pack: ctx.pack,
    path,
  });

  // Pageview explicite avec chemin logique (utile même si history_change rate).
  posthog?.capture("$pageview", {
    $current_url: window.location.href,
    path,
    screen: name,
    pack: ctx.pack,
  });
}
