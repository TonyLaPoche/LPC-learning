import { useMemo, useState } from "react";
import { HANDSHAPES, POSITIONS } from "@/data/lpc-fr";
import type { PackId } from "@/data/packs";
import {
  FEEDBACK_EMAIL,
  buildFeedbackPayload,
  downloadFeedbackJson,
  emptyCorrection,
  openFeedbackMailto,
  type FeedbackCorrection,
  type FeedbackCorrectionType,
} from "@/lib/feedback";

type FeedbackPageProps = {
  pack: PackId;
};

const TYPE_OPTIONS: Array<{ id: FeedbackCorrectionType; label: string }> = [
  { id: "cue_correction", label: "Correction de clé (forme / zone)" },
  { id: "form_label", label: "Libellé / consigne trompeuse" },
  { id: "bug", label: "Bug technique (caméra, détection…)" },
  { id: "other", label: "Autre" },
];

const NONE = "";

export function FeedbackPage({ pack }: FeedbackPageProps) {
  const [contact, setContact] = useState("");
  const [freeText, setFreeText] = useState("");
  const [items, setItems] = useState<FeedbackCorrection[]>([emptyCorrection()]);
  const [status, setStatus] = useState<string | null>(null);

  const shapeOptions = useMemo(
    () =>
      HANDSHAPES.map((h) => ({
        value: h.id,
        label: `${h.label} (${h.consonants.join(", ")})`,
      })),
    [],
  );
  const posOptions = useMemo(
    () => POSITIONS.map((p) => ({ value: p.id, label: p.label })),
    [],
  );

  const updateItem = (id: string, patch: Partial<FeedbackCorrection>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((it) => it.id !== id)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, emptyCorrection()]);
    setStatus(null);
  };

  const canSend =
    freeText.trim().length > 0 ||
    items.some(
      (it) =>
        it.target.trim() ||
        it.comment.trim() ||
        it.proposedHandshape ||
        it.proposedPosition,
    );

  const submit = () => {
    if (!canSend) {
      setStatus("Ajoute au moins une correction ou un message libre.");
      return;
    }
    const usable = items.filter(
      (it) =>
        it.target.trim() ||
        it.comment.trim() ||
        it.proposedHandshape ||
        it.proposedPosition ||
        it.appHandshape ||
        it.appPosition,
    );
    const payload = buildFeedbackPayload({
      contact,
      pack,
      freeText,
      corrections: usable.length > 0 ? usable : items,
    });
    const filename = downloadFeedbackJson(payload);
    openFeedbackMailto(payload, filename);
    setStatus(
      `Fichier « ${filename} » téléchargé. Ton client mail s’ouvre pour ${FEEDBACK_EMAIL} — pense à joindre le JSON si besoin.`,
    );
  };

  return (
    <div className="space-y-6 pb-2">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">
          Retours
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foam">
          Feedback codeur
        </h1>
        <p className="mt-2 text-sm text-mist">
          Tu pratiques le LPC et tu vois une erreur dans l’app ? Ajoute autant de
          retours que tu veux, puis envoie le JSON à{" "}
          <a
            className="text-teal underline-offset-2 hover:underline"
            href={`mailto:${FEEDBACK_EMAIL}`}
          >
            {FEEDBACK_EMAIL}
          </a>
          .
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky">
            Ton prénom / pseudo (optionnel)
          </span>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Ex. Marie (Suisse)"
            className="w-full rounded-xl border border-panel-2/80 bg-ink/40 px-3 py-2.5 text-sm text-foam placeholder:text-mist/50 outline-none focus:border-teal/50"
          />
        </label>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-foam">
            Corrections
          </h2>
          <button
            type="button"
            onClick={addItem}
            className="rounded-full border border-teal/40 bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal transition hover:bg-teal/20"
          >
            + Ajouter un retour
          </button>
        </div>

        <p className="text-sm text-mist">
          Exemple : pour « ma », si l’app montre « Index + majeur · bouche » mais
          tu codes « Cinq doigts · côté », indique la cible et ta proposition.
        </p>

        {items.map((it, idx) => (
          <article
            key={it.id}
            className="space-y-3 rounded-2xl border border-panel-2/70 bg-panel/50 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky">
                Retour {idx + 1}
              </p>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="text-xs text-mist/80 transition hover:text-rose-300"
                >
                  Retirer
                </button>
              )}
            </div>

            <label className="block space-y-1">
              <span className="text-xs text-mist">Type</span>
              <select
                value={it.type}
                onChange={(e) =>
                  updateItem(it.id, {
                    type: e.target.value as FeedbackCorrectionType,
                  })
                }
                className="w-full rounded-xl border border-panel-2/80 bg-ink/40 px-3 py-2.5 text-sm text-foam outline-none focus:border-teal/50"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-xs text-mist">
                Cible (syllabe, mot, forme…)
              </span>
              <input
                type="text"
                value={it.target}
                onChange={(e) => updateItem(it.id, { target: e.target.value })}
                placeholder='Ex. ma · bonjour · forme « Trois doigts »'
                className="w-full rounded-xl border border-panel-2/80 bg-ink/40 px-3 py-2.5 text-sm text-foam placeholder:text-mist/50 outline-none focus:border-teal/50"
              />
            </label>

            {it.type === "cue_correction" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <fieldset className="space-y-2 rounded-xl border border-panel-2/50 bg-ink/20 p-3">
                  <legend className="px-1 text-xs font-semibold text-mist">
                    Ce que dit l’app
                  </legend>
                  <select
                    value={it.appHandshape}
                    onChange={(e) =>
                      updateItem(it.id, { appHandshape: e.target.value })
                    }
                    className="w-full rounded-lg border border-panel-2/70 bg-ink/40 px-2 py-2 text-sm text-foam outline-none"
                  >
                    <option value={NONE}>Forme —</option>
                    {shapeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={it.appPosition}
                    onChange={(e) =>
                      updateItem(it.id, { appPosition: e.target.value })
                    }
                    className="w-full rounded-lg border border-panel-2/70 bg-ink/40 px-2 py-2 text-sm text-foam outline-none"
                  >
                    <option value={NONE}>Zone —</option>
                    {posOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <fieldset className="space-y-2 rounded-xl border border-teal/30 bg-teal/5 p-3">
                  <legend className="px-1 text-xs font-semibold text-teal">
                    Ce que ça devrait être
                  </legend>
                  <select
                    value={it.proposedHandshape}
                    onChange={(e) =>
                      updateItem(it.id, { proposedHandshape: e.target.value })
                    }
                    className="w-full rounded-lg border border-teal/40 bg-ink/40 px-2 py-2 text-sm text-foam outline-none"
                  >
                    <option value={NONE}>Forme —</option>
                    {shapeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={it.proposedPosition}
                    onChange={(e) =>
                      updateItem(it.id, { proposedPosition: e.target.value })
                    }
                    className="w-full rounded-lg border border-teal/40 bg-ink/40 px-2 py-2 text-sm text-foam outline-none"
                  >
                    <option value={NONE}>Zone —</option>
                    {posOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </fieldset>
              </div>
            )}

            <label className="block space-y-1">
              <span className="text-xs text-mist">Précision (optionnel)</span>
              <textarea
                value={it.comment}
                onChange={(e) => updateItem(it.id, { comment: e.target.value })}
                rows={2}
                placeholder="Ex. En Suisse on code ma avec cinq doigts au côté."
                className="w-full resize-y rounded-xl border border-panel-2/80 bg-ink/40 px-3 py-2.5 text-sm text-foam placeholder:text-mist/50 outline-none focus:border-teal/50"
              />
            </label>
          </article>
        ))}
      </section>

      <section className="space-y-2 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky">
            Message libre
          </span>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={4}
            placeholder="Tout ce que tu veux dire : idées, priorités, contexte de pratique…"
            className="w-full resize-y rounded-xl border border-panel-2/80 bg-ink/40 px-3 py-2.5 text-sm text-foam placeholder:text-mist/50 outline-none focus:border-teal/50"
          />
        </label>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className="w-full rounded-2xl bg-teal px-4 py-3.5 font-display text-base font-bold text-ink transition hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Télécharger le JSON et ouvrir l’e-mail
        </button>
        <p className="text-center text-xs text-mist/80">
          1) le fichier JSON se télécharge · 2) ton appli mail s’ouvre vers{" "}
          {FEEDBACK_EMAIL} · 3) joins le fichier si ton mail ne l’inclut pas
          automatiquement.
        </p>
        {status && (
          <p className="rounded-xl border border-teal/30 bg-teal/10 px-3 py-2 text-sm text-foam">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
