import { Modal } from "./Modal";

interface ConfirmDialogProps {
  acik: boolean;
  baslik?: string;
  mesaj: string;
  onayMetni?: string;
  mesgul?: boolean;
  onOnay: () => void;
  onIptal: () => void;
}

export function ConfirmDialog({
  acik,
  baslik = "Onay",
  mesaj,
  onayMetni = "Sil",
  mesgul,
  onOnay,
  onIptal,
}: ConfirmDialogProps) {
  return (
    <Modal
      baslik={baslik}
      acik={acik}
      onKapat={onIptal}
      alt={
        <>
          <button type="button" className="btn" onClick={onIptal} disabled={mesgul}>
            Vazgeç
          </button>
          <button type="button" className="btn btn--danger" onClick={onOnay} disabled={mesgul}>
            {mesgul ? "Siliniyor..." : onayMetni}
          </button>
        </>
      }
    >
      <p>{mesaj}</p>
    </Modal>
  );
}
