import { useEffect, useMemo, useState } from "react";
import { stokKartiApi } from "../../../api/stokKarti.api";
import { Modal } from "../../../components/Modal";
import { Depo } from "../../../types/stokKarti.types";
import { depolariFiltrele, hataMesaji } from "../../../utils/_project/stokKarti";

interface DepoModalProps {
  acik: boolean;
  seciliDepoId?: number;
  onSec: (depo: Depo) => void;
  onKapat: () => void;
}

export function DepoModal({ acik, seciliDepoId, onSec, onKapat }: DepoModalProps) {
  const [depolar, setDepolar] = useState<Depo[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [arama, setArama] = useState("");
  const [yenile, setYenile] = useState(0);

  useEffect(() => {
    if (!acik) return;
    let iptal = false;
    setArama("");
    setYukleniyor(true);
    setHata(null);
    stokKartiApi
      .depolar()
      .then((veri) => {
        if (!iptal) setDepolar(veri);
      })
      .catch((e: unknown) => {
        if (!iptal) setHata(hataMesaji(e, "Depolar yüklenemedi."));
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });
    return () => {
      iptal = true;
    };
  }, [acik, yenile]);

  const filtreli = useMemo(() => depolariFiltrele(depolar, arama), [depolar, arama]);

  return (
    <Modal baslik="Depo Seç" acik={acik} onKapat={onKapat}>
      <input
        type="search"
        className="girdi"
        placeholder="Depo adı, kod veya şehir ara"
        value={arama}
        onChange={(e) => setArama(e.target.value)}
        autoFocus
      />

      {yukleniyor && <p className="durum-mesaji">Depolar yükleniyor...</p>}

      {hata && (
        <div className="durum-mesaji durum-mesaji--hata">
          <p>{hata}</p>
          <button type="button" className="btn" onClick={() => setYenile((n) => n + 1)}>
            Tekrar Dene
          </button>
        </div>
      )}

      {!yukleniyor && !hata && filtreli.length === 0 && (
        <p className="durum-mesaji">Depo bulunamadı.</p>
      )}

      {!yukleniyor && !hata && filtreli.length > 0 && (
        <ul className="depo-listesi">
          {filtreli.map((depo) => (
            <li key={depo.id}>
              <button
                type="button"
                className={`depo-listesi__oge${
                  depo.id === seciliDepoId ? " depo-listesi__oge--secili" : ""
                }`}
                onClick={() => onSec(depo)}
              >
                <span className="depo-listesi__ad">{depo.adi}</span>
                <span className="depo-listesi__meta">
                  {depo.kod} · {depo.sehir}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
