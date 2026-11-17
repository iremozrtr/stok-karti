import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { stokKartiApi } from "../../../api/stokKarti.api";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { Modal } from "../../../components/Modal";
import { useNotification } from "../../../components/Notification";
import {
  BIRIM_LABEL,
  DURUM_LABEL,
  Durum,
  KATEGORI_LABEL,
  KATEGORI_OPTIONS,
  DURUM_OPTIONS,
  StokFiltre,
  StokKarti,
} from "../../../types/stokKarti.types";
import {
  formatMiktar,
  formatPara,
  hataMesaji,
  hesaplaStokDegeri,
  hesaplaToplamStokDegeri,
  kartlariFiltrele,
} from "../../../utils/_project/stokKarti";
import { StokKartiCard } from "../card/StokKartiCard";
import "./StokKartiList.scss";

type Sekme = "liste" | "rapor";

const BOS_FILTRE: StokFiltre = { arama: "", kategori: "", durum: "" };

export function StokKartiList() {
  const navigate = useNavigate();
  const bildirim = useNotification();
  const [kartlar, setKartlar] = useState<StokKarti[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<StokFiltre>(BOS_FILTRE);
  const [sekme, setSekme] = useState<Sekme>("liste");
  const [hizliEkleAcik, setHizliEkleAcik] = useState(false);
  const [silinecek, setSilinecek] = useState<StokKarti | null>(null);
  const [siliniyor, setSiliniyor] = useState(false);

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      setKartlar(await stokKartiApi.liste());
    } catch (e) {
      setHata(hataMesaji(e, "Liste yüklenemedi."));
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    yukle();
  }, [yukle]);

  const filtreli = useMemo(() => kartlariFiltrele(kartlar, filtre), [kartlar, filtre]);
  const toplamDeger = useMemo(() => hesaplaToplamStokDegeri(filtreli), [filtreli]);

  const kategoriOzeti = useMemo(
    () =>
      KATEGORI_OPTIONS.map((o) => {
        const grup = filtreli.filter((k) => k.kategori === o.value);
        return {
          kategori: o.value,
          adet: grup.length,
          deger: hesaplaToplamStokDegeri(grup),
        };
      }),
    [filtreli]
  );

  const filtreAktif = filtre.arama !== "" || filtre.kategori !== "" || filtre.durum !== "";

  const sil = async () => {
    if (!silinecek) return;
    setSiliniyor(true);
    try {
      await stokKartiApi.sil(silinecek.id);
      setKartlar((onceki) => onceki.filter((k) => k.id !== silinecek.id));
      setSilinecek(null);
      bildirim.basari("Kayıt silindi");
    } catch (e) {
      setSilinecek(null);
      bildirim.hata(hataMesaji(e, "Kayıt silinemedi."));
    } finally {
      setSiliniyor(false);
    }
  };

  const hizliKaydedildi = () => {
    setHizliEkleAcik(false);
    yukle();
  };

  return (
    <div className="stok-list">
      <header className="stok-list__header">
        <h1 className="stok-list__baslik">Stok Kartları</h1>
        <div className="stok-list__header-aksiyon">
          <button type="button" className="btn" onClick={() => setHizliEkleAcik(true)}>
            Hızlı Ekle
          </button>
          <Link to="/stok/yeni" className="btn btn--birincil">
            + Yeni Stok Kartı
          </Link>
        </div>
      </header>

      <div className="stok-list__sekmeler" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={sekme === "liste"}
          className={`stok-list__sekme${sekme === "liste" ? " stok-list__sekme--aktif" : ""}`}
          onClick={() => setSekme("liste")}
        >
          Liste
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sekme === "rapor"}
          className={`stok-list__sekme${sekme === "rapor" ? " stok-list__sekme--aktif" : ""}`}
          onClick={() => setSekme("rapor")}
        >
          Stok Raporu
        </button>
      </div>

      <div className="stok-list__filtre">
        <input
          type="search"
          className="girdi stok-list__arama"
          placeholder="Ad veya kod ara"
          value={filtre.arama}
          onChange={(e) => setFiltre({ ...filtre, arama: e.target.value })}
        />
        <select
          className="girdi"
          aria-label="Kategori filtresi"
          value={filtre.kategori}
          onChange={(e) =>
            setFiltre({ ...filtre, kategori: e.target.value as StokFiltre["kategori"] })
          }
        >
          <option value="">Tüm kategoriler</option>
          {KATEGORI_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className="girdi"
          aria-label="Durum filtresi"
          value={filtre.durum}
          onChange={(e) => setFiltre({ ...filtre, durum: e.target.value as StokFiltre["durum"] })}
        >
          <option value="">Tüm durumlar</option>
          {DURUM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {filtreAktif && (
          <button type="button" className="btn" onClick={() => setFiltre(BOS_FILTRE)}>
            Temizle
          </button>
        )}
      </div>

      {yukleniyor && <div className="durum-mesaji">Liste yükleniyor...</div>}

      {!yukleniyor && hata && (
        <div className="durum-mesaji durum-mesaji--hata">
          <p>{hata}</p>
          <button type="button" className="btn" onClick={yukle}>
            Tekrar Dene
          </button>
        </div>
      )}

      {!yukleniyor && !hata && kartlar.length === 0 && (
        <div className="durum-mesaji">
          <p>Henüz stok kartı yok.</p>
          <Link to="/stok/yeni" className="btn btn--birincil">
            İlk kartı oluştur
          </Link>
        </div>
      )}

      {!yukleniyor && !hata && kartlar.length > 0 && filtreli.length === 0 && (
        <div className="durum-mesaji">
          <p>Filtreye uygun kayıt bulunamadı.</p>
          <button type="button" className="btn" onClick={() => setFiltre(BOS_FILTRE)}>
            Filtreleri temizle
          </button>
        </div>
      )}

      {!yukleniyor && !hata && filtreli.length > 0 && sekme === "liste" && (
        <div className="stok-list__tablo-kap">
          <table className="stok-list__tablo">
            <thead>
              <tr>
                <th>Kod</th>
                <th>Ad</th>
                <th>Kategori</th>
                <th className="sayi">Miktar</th>
                <th className="sayi">Birim Fiyat</th>
                <th className="sayi">Stok Değeri</th>
                <th>Depo</th>
                <th>Durum</th>
                <th className="aksiyon">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtreli.map((k) => (
                <tr
                  key={k.id}
                  className="stok-list__satir"
                  onClick={() => navigate(`/stok/${k.id}`)}
                >
                  <td data-etiket="Kod">{k.kod}</td>
                  <td data-etiket="Ad">{k.ad}</td>
                  <td data-etiket="Kategori">{KATEGORI_LABEL[k.kategori]}</td>
                  <td data-etiket="Miktar" className="sayi">
                    {formatMiktar(k.stokMiktari)} {BIRIM_LABEL[k.birim]}
                  </td>
                  <td data-etiket="Birim Fiyat" className="sayi">
                    {formatPara(k.birimFiyat)}
                  </td>
                  <td data-etiket="Stok Değeri" className="sayi">
                    {formatPara(hesaplaStokDegeri(k.stokMiktari, k.birimFiyat))}
                  </td>
                  <td data-etiket="Depo">{k.depoAdi || "—"}</td>
                  <td data-etiket="Durum">
                    <span
                      className={`rozet ${k.durum === Durum.Aktif ? "rozet--aktif" : "rozet--pasif"}`}
                    >
                      {DURUM_LABEL[k.durum]}
                    </span>
                  </td>
                  <td className="aksiyon" onClick={(e) => e.stopPropagation()}>
                    <div className="aksiyon__kap">
                      <Link to={`/stok/${k.id}`} className="btn btn--kucuk">
                        Düzenle
                      </Link>
                      <button
                        type="button"
                        className="btn btn--kucuk btn--danger"
                        onClick={() => setSilinecek(k)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!yukleniyor && !hata && filtreli.length > 0 && sekme === "rapor" && (
        <div className="stok-rapor">
          <div className="stok-rapor__kutular">
            <div className="stok-rapor__kutu">
              <span className="stok-rapor__etiket">Toplam Stok Değeri</span>
              <strong className="stok-rapor__deger">{formatPara(toplamDeger)}</strong>
            </div>
            <div className="stok-rapor__kutu">
              <span className="stok-rapor__etiket">Kayıt Sayısı</span>
              <strong className="stok-rapor__deger">{filtreli.length}</strong>
            </div>
          </div>

          <table className="stok-list__tablo">
            <thead>
              <tr>
                <th>Kategori</th>
                <th className="sayi">Kayıt</th>
                <th className="sayi">Stok Değeri</th>
              </tr>
            </thead>
            <tbody>
              {kategoriOzeti.map((o) => (
                <tr key={o.kategori}>
                  <td data-etiket="Kategori">{KATEGORI_LABEL[o.kategori]}</td>
                  <td data-etiket="Kayıt" className="sayi">
                    {o.adet}
                  </td>
                  <td data-etiket="Stok Değeri" className="sayi">
                    {formatPara(o.deger)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        baslik="Hızlı Stok Kartı"
        acik={hizliEkleAcik}
        genis
        onKapat={() => setHizliEkleAcik(false)}
      >
        <StokKartiCard
          isInModal
          onKaydedildi={hizliKaydedildi}
          onVazgec={() => setHizliEkleAcik(false)}
        />
      </Modal>

      <ConfirmDialog
        acik={silinecek !== null}
        mesaj={`"${silinecek?.ad ?? ""}" silinecek. Bu işlem geri alınamaz.`}
        mesgul={siliniyor}
        onOnay={sil}
        onIptal={() => setSilinecek(null)}
      />
    </div>
  );
}
