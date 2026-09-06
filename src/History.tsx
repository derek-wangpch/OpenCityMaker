import { useEffect, useState } from "react";
import { cities } from "./cities/packs";
import type { Locale } from "./cities/types";
import type { BattleRecord, GameRepository } from "./game/repository";
import { messages } from "./i18n";
export function History({
  repository,
  locale,
}: {
  repository: GameRepository;
  locale: Locale;
}) {
  const t = messages[locale];
  const [records, setRecords] = useState<BattleRecord[] | null>(null),
    [error, setError] = useState(false),
    [filter, setFilter] = useState("all"),
    [limit, setLimit] = useState(30);
  useEffect(() => {
    let active = true;
    repository
      .history()
      .then((value) => {
        if (active) setRecords(value);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [repository]);
  const visible = (records ?? []).filter(
    (r) => filter === "all" || r.city === filter,
  );
  return (
    <div className="history-content">
      <p className="muted">{t.historyHint}</p>
      <label className="history-filter">
        {t.cityLabel}
        <select
          aria-label={t.cityLabel}
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setLimit(30);
          }}
        >
          <option value="all">{t.allCities}</option>
          {cities.map((c) => (
            <option value={c.id} key={c.id}>
              {c.name[locale]}
            </option>
          ))}
        </select>
      </label>
      {error ? (
        <p role="alert">{t.historyError}</p>
      ) : records === null ? (
        <p role="status">{t.loading}</p>
      ) : !visible.length ? (
        <p className="history-empty">{t.historyEmpty}</p>
      ) : (
        <div className="history-list">
          {visible.slice(0, limit).map((record) => {
            const city = cities.find((c) => c.id === record.city);
            return (
              <article key={record.id} className="history-row">
                <div className="history-row-heading">
                  <strong>{city?.name[locale] ?? record.city}</strong>
                  <span className={`outcome ${record.outcome}`}>
                    {record.outcome === "won"
                      ? t.historyWon
                      : record.outcome === "lost"
                        ? t.historyLost
                        : t.historyRestarted}
                  </span>
                </div>
                <dl>
                  <div>
                    <dt>{t.score}</dt>
                    <dd>{record.score.toLocaleString(locale)}</dd>
                  </div>
                  <div>
                    <dt>{t.highestBuilding}</dt>
                    <dd
                      title={
                        city?.buildings.find((b) => b.value === record.highest)
                          ?.name[locale]
                      }
                    >
                      {record.highest}
                    </dd>
                  </div>
                  <div>
                    <dt>{t.moves}</dt>
                    <dd>{record.moves}</dd>
                  </div>
                </dl>
                <div className="history-dates">
                  <span>
                    {t.startedAt}:{" "}
                    {new Date(record.startedAt).toLocaleString(locale)}
                  </span>
                  <span>
                    {t.endedAt}:{" "}
                    {new Date(record.endedAt!).toLocaleString(locale)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {visible.length > limit && (
        <button className="secondary" onClick={() => setLimit((n) => n + 30)}>
          {t.loadMore}
        </button>
      )}
    </div>
  );
}
