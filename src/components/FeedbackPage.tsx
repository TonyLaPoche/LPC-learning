import { useMemo, useState } from "react";
import { CueExample } from "@/components/CueExample";
import {
  HANDSHAPES,
  POSITIONS,
  type HandshapeId,
  type PositionId,
} from "@/data/lpc-fr";
import type { PackId } from "@/data/packs";
import posthog from "@/lib/posthog";
import {
  FEEDBACK_EMAIL,
  ZONE_ISSUE_OPTIONS,
  buildFeedbackPayload,
  downloadFeedbackJson,
  emptyCorrection,
  emptyCueSlot,
  isCorrectionFilled,
  openFeedbackMailto,
  openSimpleContactMailto,
  type FeedbackCorrection,
  type FeedbackCorrectionType,
  type ZoneIssueId,
} from "@/lib/feedback";

type FeedbackPageProps = {
  pack: PackId;
};

const MODE_CARDS: Array<{
  id: FeedbackCorrectionType;
  title: string;
  blurb: string;
  accent: string;
}> = [
  {
    id: "key_cue",
    title: "Ajuster une clé",
    blurb: "Forme de main ou zone visage incorrecte pour une syllabe.",
    accent: "border-teal/40 bg-teal/10 text-teal",
  },
  {
    id: "detection_zone",
    title: "Zone de détection",
    blurb: "La caméra rate ou se trompe sur une zone du visage.",
    accent: "border-sky/40 bg-sky/10 text-sky",
  },
  {
    id: "word_keys",
    title: "Mot → clés",
    blurb: "L’app découpe mal un mot (2 clés au lieu de 3…). Tu annonces les bonnes.",
    accent: "border-amber-300/40 bg-amber-300/10 text-amber-200",
  },
  {
    id: "other",
    title: "Autre retour",
    blurb: "Libellé, bug, idée… tout ce qui n’entre pas dans les cases.",
    accent: "border-panel-2/80 bg-panel/40 text-mist",
  },
];

const NONE = "";

const HANDSHAPE_IDS = new Set(HANDSHAPES.map((h) => h.id));
const POSITION_IDS = new Set(POSITIONS.map((p) => p.id));

function asHandshape(id: string): HandshapeId | null {
  return HANDSHAPE_IDS.has(id as HandshapeId) ? (id as HandshapeId) : null;
}

function asPosition(id: string): PositionId | null {
  return POSITION_IDS.has(id as PositionId) ? (id as PositionId) : null;
}

function selectClass(extra = "") {
  return `w-full rounded-xl border border-panel-2/80 bg-ink/40 px-3 py-2.5 text-sm text-foam outline-none focus:border-teal/50 ${extra}`;
}

function inputClass() {
  return "w-full rounded-xl border border-panel-2/80 bg-ink/40 px-3 py-2.5 text-sm text-foam placeholder:text-mist/50 outline-none focus:border-teal/50";
}

export function FeedbackPage({ pack }: FeedbackPageProps) {
  const [contact, setContact] = useState("");
  const [testedSummary, setTestedSummary] = useState("");
  const [freeText, setFreeText] = useState("");
  const [items, setItems] = useState<FeedbackCorrection[]>([]);
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
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const addItem = (type: FeedbackCorrectionType) => {
    setItems((prev) => [...prev, emptyCorrection(type)]);
    setStatus(null);
  };

  const updateCue = (
    itemId: string,
    cueId: string,
    patch: Partial<FeedbackCorrection["proposedKeys"][number]>,
  ) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id !== itemId
          ? it
          : {
              ...it,
              proposedKeys: it.proposedKeys.map((k) =>
                k.id === cueId ? { ...k, ...patch } : k,
              ),
            },
      ),
    );
  };

  const addCue = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id !== itemId
          ? it
          : { ...it, proposedKeys: [...it.proposedKeys, emptyCueSlot()] },
      ),
    );
  };

  const removeCue = (itemId: string, cueId: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id !== itemId
          ? it
          : {
              ...it,
              proposedKeys:
                it.proposedKeys.length <= 1
                  ? it.proposedKeys
                  : it.proposedKeys.filter((k) => k.id !== cueId),
            },
      ),
    );
  };

  const filled = items.filter(isCorrectionFilled);
  const canSend =
    testedSummary.trim().length > 0 ||
    freeText.trim().length > 0 ||
    filled.length > 0;

  const submit = () => {
    if (!canSend) {
      setStatus("Ajoute un résumé, une correction, ou un message libre.");
      return;
    }
    const payload = buildFeedbackPayload({
      contact,
      pack,
      testedSummary,
      freeText,
      corrections: filled,
    });
    const filename = downloadFeedbackJson(payload);
    posthog?.capture("feedback_submitted", {
      pack,
      correction_count: filled.length,
      has_tested_summary: testedSummary.trim().length > 0,
      has_free_text: freeText.trim().length > 0,
      types: filled.map((c) => c.type),
    });
    openFeedbackMailto(payload, filename);
    setStatus(
      `Bravo — « ${filename} » est téléchargé. Ton mail s’ouvre pour ${FEEDBACK_EMAIL} : joins le JSON si besoin.`,
    );
  };

  const sendSimpleContact = () => {
    if (!freeText.trim()) {
      setStatus("Écris d’abord ton message dans la zone contact / suggestions.");
      return;
    }
    openSimpleContactMailto({ contact, message: freeText });
    posthog?.capture("feedback_contact_mailto", { pack });
    setStatus(`Client mail ouvert vers ${FEEDBACK_EMAIL}.`);
  };

  return (
    <div className="space-y-7 pb-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">
          Atelier retours
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foam">
          Aide-nous à peaufiner CléLPC
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          Choisis un type de retour, enchaîne-en autant que tu veux, puis envoie
          le tout à{" "}
          <a
            className="text-teal underline-offset-2 hover:underline"
            href={`mailto:${FEEDBACK_EMAIL}`}
          >
            {FEEDBACK_EMAIL}
          </a>
          . Ludique, pas besoin d’être expert — chaque détail compte.
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
            placeholder="Ex. Marie · codeuse LPC"
            className={inputClass()}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky">
            Qu’as-tu testé ?
          </span>
          <textarea
            value={testedSummary}
            onChange={(e) => setTestedSummary(e.target.value)}
            rows={3}
            placeholder="Ex. Parcours syllabes puis mot « bonjour » — la caméra confond menton et gorge en lumière faible."
            className={`${inputClass()} resize-y`}
          />
          <span className="block text-xs text-mist/70">
            Un petit récit suffit : parcours, appareil, lumière, ce que tu
            attendais.
          </span>
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold text-foam">
          Ajouter une correction
        </h2>
        <p className="text-sm text-mist">
          Tape une carte pour l’empiler dans ta liste — tu peux mélanger clés,
          zones et mots.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {MODE_CARDS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => addItem(m.id)}
              className={`rounded-2xl border p-4 text-left transition hover:brightness-110 ${m.accent}`}
            >
              <p className="font-display text-base font-bold text-foam">
                {m.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-mist">{m.blurb}</p>
            </button>
          ))}
        </div>
      </section>

      {items.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-foam">
              Ta pile ({items.length})
            </h2>
          </div>

          {items.map((it, idx) => {
            const mode = MODE_CARDS.find((m) => m.id === it.type);
            return (
              <article
                key={it.id}
                className="space-y-3 rounded-2xl border border-panel-2/70 bg-panel/50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky">
                    #{idx + 1} · {mode?.title ?? it.type}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="text-xs text-mist/80 transition hover:text-rose-300"
                  >
                    Retirer
                  </button>
                </div>

                {it.type !== "detection_zone" && (
                  <label className="block space-y-1">
                    <span className="text-xs text-mist">
                      {it.type === "word_keys"
                        ? "Le mot concerné"
                        : "Cible (syllabe, forme…)"}
                    </span>
                    <input
                      type="text"
                      value={it.target}
                      onChange={(e) =>
                        updateItem(it.id, { target: e.target.value })
                      }
                      placeholder={
                        it.type === "word_keys"
                          ? "Ex. bonjour"
                          : 'Ex. ma · forme « Trois doigts »'
                      }
                      className={inputClass()}
                    />
                  </label>
                )}

                {it.type === "key_cue" && (
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
                        className={selectClass()}
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
                        className={selectClass()}
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
                          updateItem(it.id, {
                            proposedHandshape: e.target.value,
                          })
                        }
                        className={selectClass("border-teal/40")}
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
                          updateItem(it.id, {
                            proposedPosition: e.target.value,
                          })
                        }
                        className={selectClass("border-teal/40")}
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

                {it.type === "detection_zone" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block space-y-1">
                      <span className="text-xs text-mist">Zone concernée</span>
                      <select
                        value={it.zoneId}
                        onChange={(e) => {
                          const zoneId = e.target.value;
                          const label =
                            posOptions.find((p) => p.value === zoneId)?.label ??
                            "";
                          updateItem(it.id, {
                            zoneId,
                            target: label || it.target,
                          });
                        }}
                        className={selectClass()}
                      >
                        <option value={NONE}>Choisir…</option>
                        {posOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs text-mist">Quel souci ?</span>
                      <select
                        value={it.zoneIssue}
                        onChange={(e) =>
                          updateItem(it.id, {
                            zoneIssue: e.target.value as ZoneIssueId | "",
                          })
                        }
                        className={selectClass()}
                      >
                        <option value={NONE}>Choisir…</option>
                        {ZONE_ISSUE_OPTIONS.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                {it.type === "word_keys" && (
                  <div className="space-y-3">
                    <label className="block space-y-1">
                      <span className="text-xs text-mist">
                        Combien de clés l’app a-t-elle utilisées ?
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={it.appKeyCount ?? ""}
                        onChange={(e) =>
                          updateItem(it.id, {
                            appKeyCount:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          })
                        }
                        placeholder="Ex. 2"
                        className={inputClass()}
                      />
                    </label>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-teal">
                          Annonce les bonnes clés
                        </p>
                        <button
                          type="button"
                          onClick={() => addCue(it.id)}
                          className="rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal"
                        >
                          + Clé
                        </button>
                      </div>
                      <p className="text-xs text-mist">
                        Ex. « bonjour » → clé 1 « bon » · clé 2 « jour » (forme +
                        zone chacune).
                      </p>
                      {it.proposedKeys.map((cue, cueIdx) => (
                        <div
                          key={cue.id}
                          className="space-y-2 rounded-xl border border-teal/25 bg-teal/5 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-teal">
                              Clé {cueIdx + 1}
                            </p>
                            {it.proposedKeys.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCue(it.id, cue.id)}
                                className="text-xs text-mist/80 hover:text-rose-300"
                              >
                                Retirer
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={cue.syllable}
                            onChange={(e) =>
                              updateCue(it.id, cue.id, {
                                syllable: e.target.value,
                              })
                            }
                            placeholder="Syllabe / son (ex. bon)"
                            className={inputClass()}
                          />
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                            <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                              <label className="block space-y-1">
                                <span className="text-[11px] text-mist">
                                  Forme de main
                                </span>
                                <select
                                  value={cue.handshape}
                                  onChange={(e) =>
                                    updateCue(it.id, cue.id, {
                                      handshape: e.target.value,
                                    })
                                  }
                                  className={selectClass()}
                                >
                                  <option value={NONE}>Choisir…</option>
                                  {shapeOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="block space-y-1">
                                <span className="text-[11px] text-mist">
                                  Zone visage
                                </span>
                                <select
                                  value={cue.position}
                                  onChange={(e) =>
                                    updateCue(it.id, cue.id, {
                                      position: e.target.value,
                                    })
                                  }
                                  className={selectClass()}
                                >
                                  <option value={NONE}>Choisir…</option>
                                  {posOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            {(cue.handshape || cue.position) && (
                              <div className="flex shrink-0 justify-center rounded-xl border border-panel-2/50 bg-ink/30 px-2 py-1.5 sm:justify-start">
                                <CueExample
                                  handshape={asHandshape(cue.handshape)}
                                  position={asPosition(cue.position)}
                                  lipsLabel={cue.syllable || null}
                                  size="sm"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label className="block space-y-1">
                  <span className="text-xs text-mist">
                    Précision (optionnel)
                  </span>
                  <textarea
                    value={it.comment}
                    onChange={(e) =>
                      updateItem(it.id, { comment: e.target.value })
                    }
                    rows={2}
                    placeholder="Ex. En Suisse on code autrement · lumière du salon…"
                    className={`${inputClass()} resize-y`}
                  />
                </label>
              </article>
            );
          })}
        </section>
      )}

      <section className="space-y-3 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <h2 className="font-display text-lg font-bold text-foam">
          Message libre / contact
        </h2>
        <p className="text-sm text-mist">
          Contact commercial, suggestion d’amélioration, ou simplement écrire —
          sans forcément joindre un JSON.
        </p>
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          rows={4}
          placeholder="Écris-moi ici… je lis tout sur terrade.antoine.pro@gmail.com"
          className={`${inputClass()} resize-y`}
        />
        <button
          type="button"
          onClick={sendSimpleContact}
          className="w-full rounded-2xl border border-sky/40 bg-sky/10 px-4 py-3 text-sm font-semibold text-sky transition hover:bg-sky/20"
        >
          Ouvrir un e-mail simple (sans JSON)
        </button>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className="w-full rounded-2xl bg-teal px-4 py-3.5 font-display text-base font-bold text-ink transition hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Envoyer le dossier (JSON + e-mail)
        </button>
        <p className="text-center text-xs leading-relaxed text-mist/80">
          1) résumé + corrections → fichier JSON · 2) ton appli mail s’ouvre vers{" "}
          {FEEDBACK_EMAIL} · 3) joins le fichier si besoin.
        </p>
        {status && (
          <p
            role="status"
            className="rounded-xl border border-teal/30 bg-teal/10 px-3 py-2 text-sm text-foam"
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
