// App.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchPlayers } from './lib/supabase';
import { MODES, MODE_LABELS, summarizePlayer, type Mode, type PlayerSummary } from './lib/tiers';
import { Leaderboard } from './components/Leaderboard';
import { TierGrid } from './components/TierGrid';
import { PlayerModal } from './components/PlayerModal';
import { ModeIcon } from './components/ModeIcon';
import { Spinner } from './components/Spinner';

type Tab = 'overall' | Mode;
// const TABS: Tab[] = ['overall', ...MODES];

const SHOW_ELO_RECALC_NOTICE = false;

export default function App() {
  const [players, setPlayers] = useState<PlayerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true); // controls fade-out, stays mou nted briefly after loading flips false
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('overall');
  const [selected, setSelected] = useState<PlayerSummary | null>(null);
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    let cancelled = false;
    fetchPlayers()
      .then((rows) => {
        if (cancelled) return;
        setPlayers(rows.map(summarizePlayer));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load players');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the loader mounted a bit longer than `loading` so the fade-out
  // transition actually gets to play instead of the loader just vanishing.
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setShowLoader(false), 300);
      return () => clearTimeout(t);
    }
  }, [loading]);

  // Slide the active-tab indicator under whichever tab button is active.
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>(`[data-tab="${tab}"]`);
    if (!activeEl) return;
    setIndicator({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
  }, [tab, players.length]); // re-measure once content/width can change (players.length ~ layout settling)

  const sorted = useMemo(() => [...players].sort((a, b) => b.points - a.points), [players]);
  const selectedRank = selected ? sorted.findIndex((p) => p.discordId === selected.discordId) + 1 : 0;

  return (
    <div className="page">

      {SHOW_ELO_RECALC_NOTICE && !noticeDismissed && (
        <div className="elo-notice">
          <span className="elo-notice__text">
            ⚠️ Elo is currently being recalculated due to a change in the elo algorithm. Displayed elo values may not be accurate.
          </span>
          <button
            className="elo-notice__close"
            onClick={() => setNoticeDismissed(true)}
            aria-label="Dismiss notice"
          >
            ✕
          </button>
        </div>
      )}

      <header className="page__header">
        <h1 className="page__title">AZMCTiers</h1>
      </header>

      <div className="page__tabs" ref={tabsRef}>
        <span
          className="page__tab-indicator"
          style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
        />
        <button
          data-tab="overall"
          className={`page__tab ${tab === 'overall' ? 'page__tab--active' : ''}`}
          onClick={() => setTab('overall')}
        >
          <TrophyIcon />
          <span>Overall</span>
        </button>
        {MODES.map((mode) => (
          <button
            key={mode}
            data-tab={mode}
            className={`page__tab ${tab === mode ? 'page__tab--active' : ''}`}
            onClick={() => setTab(mode)}
          >
            <ModeIcon mode={mode} size={22} />
            <span>{MODE_LABELS[mode]}</span>
          </button>
        ))}
      </div>

      <main className="page__content">
        {error && (
          <div className="page__status page__status--error">
            Couldn't load players: {error}
            <br />
            Check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.
          </div>
        )}

        {!error && !loading && (
          <div key={tab} className="page__tab-panel">
            {tab === 'overall' && <Leaderboard players={players} onSelect={setSelected} />}
            {tab !== 'overall' && <TierGrid mode={tab} players={players} onSelect={setSelected} />}
          </div>
        )}
      </main>

      {showLoader && (
        <div className={`page__loader ${!loading ? 'page__loader--fading' : ''}`}>
          <Spinner size={56} />
        </div>
      )}

      {selected && <PlayerModal player={selected} rank={selectedRank} onClose={() => setSelected(null)} />}

      <style>{`
        .page {
          max-width: 1500px;
          margin: 0 auto;
          padding: 32px 24px 80px;
          position: relative;
        }
        .page__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }
        .page__title {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin: 0;
          background: linear-gradient(90deg, var(--purple-light), var(--purple-mid));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .page__tabs {
          position: relative;
          display: flex;
          overflow-x: hidden;
          background: var(--bg-panel);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .page__tab-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: var(--purple-light);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .page__tab {
          flex: 1 1 0;
          min-width: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 6px;
          background: var(--bg-panel-raised);
          border: none;
          border-bottom: 3px solid transparent;
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
        }
        .page__tab:first-child {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        .page__tab:last-child {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        .page__tab:hover {
          background: var(--bg-card);
        }
        .page__tab:active {
          transform: scale(0.97);
        }
        .page__tab--active {
          background: var(--bg-void);
          color: var(--purple-light);
          border-bottom-color: transparent;
        }
        .page__tab-panel {
          animation: tab-fade-in 0.25s ease both;
        }
        @keyframes tab-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .page__status {
          padding: 60px 20px;
          text-align: center;
          color: var(--text-secondary);
          font-size: 16px;
        }
        .page__status--error {
          color: #f87171;
        }
        .page__loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-void, #0b0416);
          z-index: 100;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .page__loader--fading {
          opacity: 0;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .page__tab-panel { animation: none; }
        }
        .elo-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 10px 16px;
          margin-bottom: 20px;
          background: rgba(250, 204, 21, 0.1);
          border: 1px solid rgba(250, 204, 21, 0.35);
          border-radius: 10px;
          color: #facc15;
          font-size: 14px;
          text-align: center;
        }
        .elo-notice__text {
          flex: 1;
        }
        .elo-notice__close {
          background: transparent;
          border: none;
          color: #facc15;
          font-size: 14px;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 6px;
          opacity: 0.8;
          transition: opacity 0.15s ease, background 0.15s ease;
        }
        .elo-notice__close:hover {
          opacity: 1;
          background: rgba(250, 204, 21, 0.15);
        }
      `}</style>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--tier-1, #ffd166)" aria-hidden="true">
      <path d="M6 3h12v2h3v3a4 4 0 01-4 4h-.3A6 6 0 0113 15.9V19h3v2H8v-2h3v-3.1A6 6 0 017.3 12H7a4 4 0 01-4-4V5h3V3zm0 4H5v1a2 2 0 002 2V7zm12 0v3a2 2 0 002-2V7h-2z" />
    </svg>
  );
}