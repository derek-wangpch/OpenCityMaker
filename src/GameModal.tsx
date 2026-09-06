import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  House,
  Landmark,
  LockKeyhole,
  Plus,
} from "lucide-react";
import { Modal } from "./Modal";
import { buildingReference } from "./cities/references";
import { History } from "./History";
import { ModelCanvas } from "./scene/Canvas";
import type { GameController } from "./game/useGame";
import type { GameRepository } from "./game/repository";
/** Help, restart, match history and building detail dialogs, shared by every layout. */
export function GameModal({
  game,
  repository,
}: {
  game: GameController;
  repository: GameRepository;
}) {
  const { modal, setModal, city, current, locale, t, restart } = game;
  if (!modal) return null;
  return (
    <Modal
      title={
        modal === "help"
          ? t.helpTitle
          : modal === "restart"
            ? t.restartTitle
            : modal === "history"
              ? t.history
              : modal.name[locale]
      }
      close={() => setModal(null)}
      closeLabel={t.close}
    >
      {modal === "history" ? (
        <History repository={repository} locale={locale} />
      ) : modal === "help" ? (
        <>
          <div className="help-illustration">
            <House />
            <Plus />
            <House />
            <ArrowRight />
            <Landmark />
          </div>
          <p>{t.helpBody}</p>
          <p className="muted">{t.controls}</p>
          <button className="primary" onClick={() => setModal(null)}>
            {t.play}
            <ArrowRight size={16} />
          </button>
        </>
      ) : modal === "restart" ? (
        <>
          <p>{t.restartBody}</p>
          <div className="modal-buttons">
            <button className="secondary" onClick={() => setModal(null)}>
              {t.cancel}
            </button>
            <button className="primary" onClick={restart}>
              {t.confirm}
            </button>
          </div>
        </>
      ) : (
        <>
          <ModelCanvas
            city={city}
            value={modal.value}
            fallback={t.webgl}
            label={modal.name[locale]}
          />
          <div className="viewer-meta">
            <span>{modal.value}</span>
            <span>{t.rotate}</span>
          </div>
          <p>{modal.description[locale]}</p>
          {!current.discovered.includes(modal.value) && (
            <p className="muted">
              <LockKeyhole size={13} /> {t.atlasEmpty}
            </p>
          )}
          <a
            className="reference"
            href={buildingReference(modal, locale)}
            target="_blank"
            rel="noreferrer"
          >
            <BookOpen size={14} />
            {t.reference}
            <ArrowUpRight size={14} />
          </a>
        </>
      )}
    </Modal>
  );
}
