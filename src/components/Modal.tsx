import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./Modal.scss";

interface ModalProps {
  baslik: string;
  acik: boolean;
  onKapat: () => void;
  genis?: boolean;
  children: ReactNode;
  alt?: ReactNode;
}

const acikModaller: number[] = [];
let modalSayaci = 0;

export function Modal({ baslik, acik, onKapat, genis, children, alt }: ModalProps) {
  const idRef = useRef(0);
  const kapatRef = useRef(onKapat);
  kapatRef.current = onKapat;

  useEffect(() => {
    if (!acik) return;
    modalSayaci += 1;
    const id = modalSayaci;
    idRef.current = id;
    acikModaller.push(id);

    const tusDinle = (e: KeyboardEvent) => {
      if (e.key === "Escape" && acikModaller[acikModaller.length - 1] === id) {
        kapatRef.current();
      }
    };
    document.addEventListener("keydown", tusDinle);

    return () => {
      document.removeEventListener("keydown", tusDinle);
      const index = acikModaller.indexOf(id);
      if (index >= 0) acikModaller.splice(index, 1);
    };
  }, [acik]);

  if (!acik) return null;

  return createPortal(
    <div className="modal-overlay" onMouseDown={onKapat}>
      <div
        className={`modal${genis ? " modal--genis" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={baslik}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">{baslik}</h2>
          <button type="button" className="modal__close" aria-label="Kapat" onClick={onKapat}>
            ×
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {alt && <div className="modal__footer">{alt}</div>}
      </div>
    </div>,
    document.body
  );
}
