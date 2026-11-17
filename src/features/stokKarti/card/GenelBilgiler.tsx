import { useFormikContext } from "formik";
import { FormAlani } from "../../../components/FormAlani";
import {
  BIRIM_OPTIONS,
  DURUM_OPTIONS,
  KATEGORI_OPTIONS,
  StokKartiForm,
} from "../../../types/stokKarti.types";

export function GenelBilgiler() {
  const { values, errors, touched, submitCount, handleChange, handleBlur } =
    useFormikContext<StokKartiForm>();

  const hataGetir = (alan: keyof StokKartiForm): string | undefined =>
    touched[alan] || submitCount > 0 ? (errors[alan] as string | undefined) : undefined;

  return (
    <section className="stok-card__bolum">
      <h3 className="stok-card__bolum-baslik">Genel Bilgiler</h3>
      <div className="stok-card__grid">
        <FormAlani etiket="Ad" htmlFor="ad" zorunlu hata={hataGetir("ad")}>
          <input
            id="ad"
            name="ad"
            type="text"
            className="girdi"
            value={values.ad}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
          />
        </FormAlani>

        <FormAlani etiket="Stok Kodu (SKU)" htmlFor="kod" zorunlu hata={hataGetir("kod")}>
          <input
            id="kod"
            name="kod"
            type="text"
            className="girdi"
            value={values.kod}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
          />
        </FormAlani>

        <FormAlani etiket="Kategori" htmlFor="kategori" zorunlu hata={hataGetir("kategori")}>
          <select
            id="kategori"
            name="kategori"
            className="girdi"
            value={values.kategori}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {KATEGORI_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormAlani>

        <FormAlani etiket="Birim" htmlFor="birim" zorunlu hata={hataGetir("birim")}>
          <select
            id="birim"
            name="birim"
            className="girdi"
            value={values.birim}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {BIRIM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormAlani>

        <FormAlani etiket="Durum" htmlFor="durum" zorunlu hata={hataGetir("durum")}>
          <select
            id="durum"
            name="durum"
            className="girdi"
            value={values.durum}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {DURUM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormAlani>
      </div>
    </section>
  );
}
