import { BUY_ME_A_COFFEE_URL, SUPPORT_COPY } from "@/lib/support";

export function SupportPage() {
  return (
    <div className="space-y-6 pb-2">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">
          Soutien
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foam">
          {SUPPORT_COPY.title}
        </h1>
        <p className="mt-2 text-mist">{SUPPORT_COPY.intro}</p>
      </header>

      <section className="space-y-3 rounded-2xl border border-teal/35 bg-teal/10 p-5">
        <h2 className="font-display text-lg font-bold text-teal">
          {SUPPORT_COPY.whyTitle}
        </h2>
        <p className="text-sm leading-relaxed text-foam/90">
          {SUPPORT_COPY.whyLead}
        </p>
        <p className="text-sm leading-relaxed text-mist">
          {SUPPORT_COPY.whyBody}
        </p>
        <p className="text-sm leading-relaxed text-foam/85">
          {SUPPORT_COPY.whyCredits}
        </p>
      </section>

      <section className="rounded-2xl border border-panel-2/70 bg-panel/60 p-5 text-center">
        <p className="text-sm text-mist">{SUPPORT_COPY.thanks}</p>
        {BUY_ME_A_COFFEE_URL ? (
          <a
            href={BUY_ME_A_COFFEE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full bg-[#FFDD00] px-5 py-2.5 text-sm font-bold text-[#1a1a1a] shadow-sm transition hover:brightness-105"
          >
            Buy me a coffee
          </a>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-panel-2 px-4 py-3 text-sm text-mist">
            Lien <strong className="text-foam">Buy me a coffee</strong> à venir.
          </p>
        )}
      </section>

      <p className="text-xs text-mist/80">{SUPPORT_COPY.footer}</p>
    </div>
  );
}
