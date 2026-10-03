import { useEffect, useRef, useState } from 'react';
import { AXES, type AxisContent } from '../content/axes';
import { findProfile, profileAxes, PROFILES, typeCode } from '../content/profiles';
import { copyText, downloadText, toCss, toJson } from '../export/exportTheme';
import { store } from '../state/axesStore';
import { useAppState } from '../state/useAppState';
import { computeTokens } from '../tokens/computeTokens';
import { NEUTRAL_AXES, type Axes } from '../tokens/types';
import { QuizModal } from './QuizModal';
import './MbtiPanel.css';

const pct = (v: number) => Math.round(v * 100);

function InfoTip({ axis }: { axis: AxisContent }) {
  const [open, setOpen] = useState(false);
  const id = `info-${axis.key}`;
  return (
    <span className="info" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="info__btn"
        aria-label={`À propos de l’axe ${axis.name}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      >
        ⓘ
      </button>
      <span id={id} role="tooltip" className="info__bubble" hidden={!open}>
        <strong>Ce que ça mesure.</strong> {axis.info.measures}
        <br />
        <strong>Ce que ça change ici.</strong> {axis.info.visual}
      </span>
    </span>
  );
}

function AxisControl({ axis, value, onMove }: { axis: AxisContent; value: number; onMove: () => void }) {
  const rightPct = pct(value);
  const leftPct = 100 - rightPct;
  const dominant = value <= 0.5 ? axis.left : axis.right;
  return (
    <div className="axis">
      <div className="axis__head">
        <span className="axis__name">{axis.name}</span>
        <InfoTip axis={axis} />
      </div>
      <div className="axis__poles" aria-hidden="true">
        <span>
          {axis.left.label} <b>({axis.left.letter})</b>
        </span>
        <span>
          <b>({axis.right.letter})</b> {axis.right.label}
        </span>
      </div>
      <input
        type="range"
        className="axis__range"
        min={0}
        max={100}
        step={0.1}
        value={value * 100}
        data-axis={axis.key}
        aria-label={`${axis.name} : ${axis.left.label} (${axis.left.letter}) ou ${axis.right.label} (${axis.right.letter})`}
        aria-valuetext={`${Math.max(leftPct, rightPct)} % ${dominant.label} (${dominant.letter})`}
        onChange={(e) => {
          store.setAxes({ [axis.key]: Number(e.target.value) / 100 });
          onMove();
        }}
      />
      <div className="axis__pct" aria-hidden="true">
        {/* Keyed so width changes remount the text instead of shifting it. */}
        <span key={`l${leftPct}`} className={value <= 0.5 ? 'is-dominant' : ''}>
          {axis.left.letter} {leftPct} %
        </span>
        <span key={`r${rightPct}`} className={value > 0.5 ? 'is-dominant' : ''}>
          {rightPct} % {axis.right.letter}
        </span>
      </div>
      <div className="axis__examples">
        <p>
          <b>{axis.left.letter} :</b> {axis.left.example}
        </p>
        <p>
          <b>{axis.right.letter} :</b> {axis.right.example}
        </p>
      </div>
    </div>
  );
}

const randomAxes = (): Axes => ({ ei: Math.random(), sn: Math.random(), tf: Math.random(), jp: Math.random() });

const PANEL_FONT = '420 14px Recursive';
type FontState = 'pending' | 'ready' | 'fallback';

// Keeps the panel hidden until Recursive is usable, else locks it on the system font: no swap reflow.
function usePanelFont(): FontState {
  const [state, setState] = useState<FontState>(() => (document.fonts.check(PANEL_FONT) ? 'ready' : 'pending'));
  useEffect(() => {
    if (state !== 'pending') return;
    let done = false;
    const settle = (s: FontState) => {
      if (!done) {
        done = true;
        setState(s);
      }
    };
    const timer = setTimeout(() => settle('fallback'), 1500);
    document.fonts.load(PANEL_FONT).then(
      (faces) => settle(faces.length ? 'ready' : 'fallback'),
      () => settle('fallback'),
    );
    return () => {
      done = true;
      clearTimeout(timer);
    };
  }, [state]);
  return state;
}

export function MbtiPanel() {
  const { axes, theme } = useAppState();
  const [status, setStatus] = useState('');
  const [quizOpen, setQuizOpen] = useState(false);
  const [moving, setMoving] = useState<AxisContent | null>(null);
  const font = usePanelFont();
  const movingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(movingTimer.current), []);
  const code = typeCode(axes);
  const profile = findProfile(code);

  const notify = (msg: string) => {
    setStatus(msg);
    window.setTimeout(() => setStatus((s) => (s === msg ? '' : s)), 2500);
  };

  const showMoving = (axis: AxisContent) => {
    setMoving(axis);
    clearTimeout(movingTimer.current);
    movingTimer.current = setTimeout(() => setMoving(null), 1400);
  };

  const exportTokens = () => computeTokens(axes, theme);
  const fileBase = `morphing-ui-${code.toLowerCase()}-${theme}`;
  const meta = () => ({
    name: `Morphing UI — ${code}`,
    theme,
    axes: { ei: pct(axes.ei), sn: pct(axes.sn), tf: pct(axes.tf), jp: pct(axes.jp) },
  });

  return (
    <aside className="panel" data-font={font} aria-label="Réglages de personnalité">
      <div className="panel__type" data-testid="type-code">
        <div className="panel__letters" aria-label={`Type ${code}`}>
          {AXES.map((a) => {
            const v = axes[a.key];
            const pole = v <= 0.5 ? a.left : a.right;
            const share = Math.max(pct(v), 100 - pct(v));
            return (
              <span key={a.key} className="panel__letter">
                <span key={`c${pole.letter}`} className="panel__letter-char">
                  {pole.letter}
                </span>
                <span key={`p${share}`} className="panel__letter-pct">
                  {share} %
                </span>
              </span>
            );
          })}
        </div>
        <div className="panel__portrait" aria-live="polite">
          <p key={code} data-testid="portrait">
            <b>
              {code} — {profile.nickname}.
            </b>{' '}
            {profile.description}
          </p>
        </div>
      </div>

      <div className="panel__actions">
        <button type="button" className="pbtn pbtn--primary" onClick={() => setQuizOpen(true)}>
          Trouve ton profil
        </button>
        <button type="button" className="pbtn" onClick={() => store.setAxes(randomAxes())}>
          Aléatoire
        </button>
        <button type="button" className="pbtn" onClick={() => store.setAxes(NEUTRAL_AXES)}>
          Réinitialiser
        </button>
      </div>

      <div className="panel__axes">
        {AXES.map((a) => (
          <AxisControl key={a.key} axis={a} value={axes[a.key]} onMove={() => showMoving(a)} />
        ))}
      </div>

      {moving && (
        <div className="morph-hint" aria-hidden="true" key={moving.key}>
          <span className="morph-hint__axis">{moving.name} transforme :</span>
          {moving.effects.map((fx) => (
            <span key={fx} className="morph-hint__tag">
              {fx}
            </span>
          ))}
        </div>
      )}

      <section className="panel__section" aria-labelledby="shortcuts-title">
        <h2 id="shortcuts-title" className="panel__h">
          Les 16 profils
        </h2>
        <div className="panel__profiles">
          {PROFILES.map((p) => (
            <button
              key={p.code}
              type="button"
              className="pchip"
              aria-pressed={p.code === code}
              title={p.nickname}
              onClick={() => store.setAxes(profileAxes(p.code))}
            >
              {p.code}
            </button>
          ))}
        </div>
      </section>

      <section className="panel__section" aria-labelledby="display-title">
        <h2 id="display-title" className="panel__h">
          Affichage et partage
        </h2>
        <div className="panel__row">
          <button
            type="button"
            role="switch"
            aria-checked={theme === 'dark'}
            className="pswitch"
            onClick={() => store.setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <span className="pswitch__track" aria-hidden="true">
              <span className="pswitch__thumb" />
            </span>
            Mode sombre
          </button>
          <button
            type="button"
            className="pbtn"
            onClick={async () => notify((await copyText(location.href)) ? 'Lien copié !' : 'Copie impossible.')}
          >
            Copier le lien
          </button>
        </div>
      </section>

      <section className="panel__section" aria-labelledby="export-title">
        <h2 id="export-title" className="panel__h">
          Exporter le thème
        </h2>
        <div className="panel__export">
          <span>CSS</span>
          <button
            type="button"
            className="pbtn pbtn--small"
            onClick={async () => notify((await copyText(toCss(exportTokens()))) ? 'CSS copié !' : 'Copie impossible.')}
          >
            Copier
          </button>
          <button
            type="button"
            className="pbtn pbtn--small"
            onClick={() => downloadText(`${fileBase}.css`, toCss(exportTokens()), 'text/css')}
          >
            Télécharger
          </button>
          <span>JSON</span>
          <button
            type="button"
            className="pbtn pbtn--small"
            onClick={async () =>
              notify((await copyText(toJson(exportTokens(), meta()))) ? 'JSON copié !' : 'Copie impossible.')
            }
          >
            Copier
          </button>
          <button
            type="button"
            className="pbtn pbtn--small"
            onClick={() => downloadText(`${fileBase}.json`, toJson(exportTokens(), meta()), 'application/json')}
          >
            Télécharger
          </button>
        </div>
      </section>

      <p className="panel__status" role="status">
        {status}
      </p>

      <QuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onResult={(result) => {
          setQuizOpen(false);
          store.setAxes(result);
        }}
      />
    </aside>
  );
}
