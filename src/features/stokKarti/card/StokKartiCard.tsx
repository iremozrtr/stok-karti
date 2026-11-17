import { FormikProvider, useFormik } from "formik";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { stokKartiApi } from "../../../api/stokKarti.api";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { useNotification } from "../../../components/Notification";
import { Depo, StokKarti, StokKartiForm } from "../../../types/stokKarti.types";
import {
  bosStokKarti,
  formatPara,
  formuTemizle,
  hataMesaji,
  hesaplaStokDegeri,
  kartiFormaDonustur,
} from "../../../utils/_project/stokKarti";
import { DepoModal } from "../modal/DepoModal";
import { DepoStokBilgileri } from "./DepoStokBilgileri";
import { GenelBilgiler } from "./GenelBilgiler";
import { stokKartiSchema } from "./stokKartiSchema";
import "./StokKartiCard.scss";

type Sekme = "genel" | "depo";

const GENEL_ALANLAR: (keyof StokKartiForm)[] = ["ad", "kod", "kategori", "birim", "durum"];

interface StokKartiCardProps {
  id?: number;
  isInModal?: boolean;
  onKaydedildi?: (kart: StokKarti) => void;
  onSilindi?: () => void;
  onVazgec?: () => void;
}

export function StokKartiCard({
  id,
  isInModal = false,
  onKaydedildi,
  onSilindi,
  onVazgec,
}: StokKartiCardProps) {
  const bildirim = useNotification();
  const [baslangic, setBaslangic] = useState<StokKartiForm>(bosStokKarti);
  const [yukleniyor, setYukleniyor] = useState(Boolean(id));
  const [yuklemeHatasi, setYuklemeHatasi] = useState<string | null>(null);
  const [yenile, setYenile] = useState(0);
  const [sekme, setSekme] = useState<Sekme>("genel");
  const [depoModalAcik, setDepoModalAcik] = useState(false);
  const [silOnayAcik, setSilOnayAcik] = useState(false);
  const [siliniyor, setSiliniyor] = useState(false);
  const [kaydetmeHatasi, setKaydetmeHatasi] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setBaslangic(bosStokKarti());
      setYukleniyor(false);
      setYuklemeHatasi(null);
      return;
    }
    let iptal = false;
    setYukleniyor(true);
    setYuklemeHatasi(null);
    stokKartiApi
      .getir(id)
      .then((kart) => {
        if (!iptal) setBaslangic(kartiFormaDonustur(kart));
      })
      .catch((e: unknown) => {
        if (!iptal) setYuklemeHatasi(hataMesaji(e, "Stok kartı yüklenemedi."));
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });
    return () => {
      iptal = true;
    };
  }, [id, yenile]);

  const formik = useFormik<StokKartiForm>({
    initialValues: baslangic,
    enableReinitialize: true,
    validationSchema: stokKartiSchema,
    onSubmit: async (values) => {
      setKaydetmeHatasi(null);
      const temiz = formuTemizle(values);
      try {
        const kart = id
          ? await stokKartiApi.guncelle(id, temiz)
          : await stokKartiApi.olustur(temiz);
        bildirim.basari(id ? "Stok kartı güncellendi" : "Stok kartı oluşturuldu", {
          to: `/stok/${kart.id}`,
          label: "Kartı aç",
        });
        onKaydedildi?.(kart);
      } catch (e) {
        const mesaj = hataMesaji(e, "Kayıt sırasında bir hata oluştu.");
        setKaydetmeHatasi(mesaj);
        bildirim.hata(mesaj);
      }
    },
  });

  const { values, errors, submitCount, isSubmitting, setValues } = formik;

  const stokDegeri = useMemo(
    () => hesaplaStokDegeri(values.stokMiktari, values.birimFiyat),
    [values.stokMiktari, values.birimFiyat]
  );

  const depoSecildi = useCallback(
    (depo: Depo) => {
      setValues({
        ...values,
        depoId: depo.id,
        depoAdi: depo.adi,
      });
      setDepoModalAcik(false);
    },
    [values, setValues]
  );

  const sil = async () => {
    if (!id) return;
    setSiliniyor(true);
    try {
      await stokKartiApi.sil(id);
      setSilOnayAcik(false);
      bildirim.basari("Kayıt silindi");
      onSilindi?.();
    } catch (e) {
      setSilOnayAcik(false);
      bildirim.hata(hataMesaji(e, "Kayıt silinemedi."));
    } finally {
      setSiliniyor(false);
    }
  };

  const kaydet = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hatalar = await formik.validateForm();
    if (Object.keys(hatalar).length > 0) {
      const genelHata = GENEL_ALANLAR.some((alan) => hatalar[alan]);
      setSekme(genelHata ? "genel" : "depo");
    }
    formik.handleSubmit();
  };

  const hataSayisi = Object.keys(errors).length;

  if (yukleniyor) {
    return <div className="durum-mesaji">Stok kartı yükleniyor...</div>;
  }

  if (yuklemeHatasi) {
    return (
      <div className="durum-mesaji durum-mesaji--hata">
        <p>{yuklemeHatasi}</p>
        <div className="stok-card__aksiyonlar">
          <button type="button" className="btn" onClick={() => setYenile((n) => n + 1)}>
            Tekrar Dene
          </button>
          {onVazgec && (
            <button type="button" className="btn" onClick={onVazgec}>
              Listeye Dön
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <FormikProvider value={formik}>
      <form
        className={`stok-card${isInModal ? " stok-card--modal" : ""}`}
        onSubmit={kaydet}
        noValidate
      >
        {!isInModal && (
          <header className="stok-card__header">
            <div>
              <Link to="/" className="stok-card__geri">
                ← Listeye dön
              </Link>
              <h1 className="stok-card__baslik">
                {id ? values.ad || "Stok Kartı" : "Yeni Stok Kartı"}
              </h1>
            </div>
            <div className="stok-card__ozet">
              <span className="stok-card__ozet-etiket">Stok Değeri</span>
              <strong className="stok-card__ozet-deger">{formatPara(stokDegeri)}</strong>
            </div>
          </header>
        )}

        <div className="stok-card__sekmeler" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={sekme === "genel"}
            className={`stok-card__sekme${sekme === "genel" ? " stok-card__sekme--aktif" : ""}`}
            onClick={() => setSekme("genel")}
          >
            Genel Bilgiler
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sekme === "depo"}
            className={`stok-card__sekme${sekme === "depo" ? " stok-card__sekme--aktif" : ""}`}
            onClick={() => setSekme("depo")}
          >
            Depo / Stok Bilgileri
          </button>
        </div>

        {submitCount > 0 && hataSayisi > 0 && (
          <div className="uyari uyari--hata" role="alert">
            Formda {hataSayisi} hata var. Lütfen işaretli alanları düzeltin.
          </div>
        )}

        {kaydetmeHatasi && (
          <div className="uyari uyari--hata" role="alert">
            {kaydetmeHatasi}
          </div>
        )}

        {sekme === "genel" ? (
          <GenelBilgiler />
        ) : (
          <DepoStokBilgileri
            stokDegeri={stokDegeri}
            onDepoSec={() => setDepoModalAcik(true)}
          />
        )}

        <footer className="stok-card__aksiyonlar">
          {id && (
            <button
              type="button"
              className="btn btn--danger btn--sol"
              onClick={() => setSilOnayAcik(true)}
              disabled={isSubmitting}
            >
              Sil
            </button>
          )}
          {onVazgec && (
            <button type="button" className="btn" onClick={onVazgec} disabled={isSubmitting}>
              Vazgeç
            </button>
          )}
          <button type="submit" className="btn btn--birincil" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </footer>

        <DepoModal
          acik={depoModalAcik}
          seciliDepoId={values.depoId}
          onSec={depoSecildi}
          onKapat={() => setDepoModalAcik(false)}
        />

        <ConfirmDialog
          acik={silOnayAcik}
          mesaj={`"${values.ad || "Bu kayıt"}" silinecek. Bu işlem geri alınamaz.`}
          mesgul={siliniyor}
          onOnay={sil}
          onIptal={() => setSilOnayAcik(false)}
        />
      </form>
    </FormikProvider>
  );
}

export function StokKartiSayfasi() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const kartId = id ? Number(id) : undefined;

  if (id && (!Number.isInteger(kartId) || (kartId ?? 0) <= 0)) {
    return (
      <div className="durum-mesaji durum-mesaji--hata">
        <p>Geçersiz stok kartı numarası.</p>
        <Link to="/" className="btn">
          Listeye Dön
        </Link>
      </div>
    );
  }

  return (
    <StokKartiCard
      key={kartId ?? "yeni"}
      id={kartId}
      onKaydedildi={() => navigate("/")}
      onSilindi={() => navigate("/")}
      onVazgec={() => navigate("/")}
    />
  );
}
