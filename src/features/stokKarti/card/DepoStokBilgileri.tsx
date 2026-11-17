import { useFormikContext } from "formik";
import { FormAlani } from "../../../components/FormAlani";
import { StokKartiForm } from "../../../types/stokKarti.types";
import { formatPara } from "../../../utils/_project/stokKarti";

interface DepoStokBilgileriProps {
  stokDegeri: number;
  onDepoSec: () => void;
}

export function DepoStokBilgileri({ stokDegeri, onDepoSec }: DepoStokBilgileriProps) {
  const { values, errors, touched, submitCount, handleChange, handleBlur } =
    useFormikContext<StokKartiForm>();

  const hataGetir = (alan: keyof StokKartiForm): string | undefined =>
    touched[alan] || submitCount > 0 ? (errors[alan] as string | undefined) : undefined;

  return (
    <section className="stok-card__bolum">
      <h3 className="stok-card__bolum-baslik">Depo / Stok Bilgileri</h3>
      <div className="stok-card__grid">
        <FormAlani
          etiket="Stok Miktarı"
          htmlFor="stokMiktari"
          zorunlu
          hata={hataGetir("stokMiktari")}
        >
          <input
            id="stokMiktari"
            name="stokMiktari"
            type="number"
            min={0}
            step="any"
            className="girdi"
            value={values.stokMiktari}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormAlani>

        <FormAlani
          etiket="Birim Fiyat (₺)"
          htmlFor="birimFiyat"
          zorunlu
          hata={hataGetir("birimFiyat")}
        >
          <input
            id="birimFiyat"
            name="birimFiyat"
            type="number"
            min={0}
            step="any"
            className="girdi"
            value={values.birimFiyat}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormAlani>

        <FormAlani etiket="Stok Değeri" htmlFor="stokDegeri">
          <input
            id="stokDegeri"
            type="text"
            className="girdi girdi--salt-okunur"
            value={formatPara(stokDegeri)}
            readOnly
            tabIndex={-1}
          />
        </FormAlani>

        <FormAlani etiket="Depo" htmlFor="depoAdi" zorunlu hata={hataGetir("depoId")}>
          <div className="depo-secici">
            <input
              id="depoAdi"
              type="text"
              className="girdi girdi--salt-okunur"
              value={values.depoAdi}
              placeholder="Depo seçilmedi"
              readOnly
              onClick={onDepoSec}
            />
            <button type="button" className="btn" onClick={onDepoSec}>
              {values.depoId ? "Değiştir" : "Depo Seç"}
            </button>
          </div>
        </FormAlani>
      </div>
    </section>
  );
}

