import { House, Share, SquarePlus } from "lucide-react";
import { Modal } from "../Modal";
import type { Messages } from "../i18n";
/**
 * Safari cannot offer an install button, so the share-sheet route is spelled
 * out step by step, with the icons the user is looking for on screen.
 */
export function AddToHome({ t, close }: { t: Messages; close: () => void }) {
  return (
    <Modal title={t.addToHomeTitle} close={close} closeLabel={t.close}>
      <p>{t.addToHomeBody}</p>
      <ol className="install-steps">
        <li>
          <Share size={16} aria-hidden="true" />
          {t.addToHomeStep1}
        </li>
        <li>
          <SquarePlus size={16} aria-hidden="true" />
          {t.addToHomeStep2}
        </li>
        <li>
          <House size={16} aria-hidden="true" />
          {t.addToHomeStep3}
        </li>
      </ol>
      <p className="muted">{t.addToHomeNote}</p>
      <button className="primary" onClick={close}>
        {t.close}
      </button>
    </Modal>
  );
}
