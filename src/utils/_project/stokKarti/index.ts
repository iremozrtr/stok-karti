import {
  Birim,
  Depo,
  Durum,
  Kategori,
  StokFiltre,
  StokKarti,
  StokKartiForm,
} from "../../../types/stokKarti.types";

export function toSayi(deger: number | string | null | undefined): number {
  const sayi = Number(deger);
  return Number.isFinite(sayi) ? sayi : 0;
}

export function hesaplaStokDegeri(
  stokMiktari: number | string,
  birimFiyat: number | string
): number {
  return toSayi(stokMiktari) * toSayi(birimFiyat);
}

export function hesaplaToplamStokDegeri(kartlar: StokKarti[]): number {
  return kartlar.reduce(
    (toplam, k) => toplam + hesaplaStokDegeri(k.stokMiktari, k.birimFiyat),
    0
  );
}

const paraFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const miktarFormatter = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 3,
});

export function formatPara(deger: number | string): string {
  return paraFormatter.format(toSayi(deger));
}

export function formatMiktar(deger: number | string): string {
  return miktarFormatter.format(toSayi(deger));
}

export function bosStokKarti(): StokKartiForm {
  return {
    ad: "",
    kod: "",
    kategori: Kategori.Hammadde,
    birim: Birim.Adet,
    stokMiktari: 0,
    birimFiyat: 0,
    durum: Durum.Aktif,
    depoId: 0,
    depoAdi: "",
  };
}

export function kartiFormaDonustur(kart: StokKarti): StokKartiForm {
  const { id: _id, ...form } = kart;
  return form;
}

export function formuTemizle(form: StokKartiForm): StokKartiForm {
  return {
    ...form,
    ad: form.ad.trim(),
    kod: form.kod.trim(),
    stokMiktari: toSayi(form.stokMiktari),
    birimFiyat: toSayi(form.birimFiyat),
  };
}

export function kartlariFiltrele(
  kartlar: StokKarti[],
  filtre: StokFiltre
): StokKarti[] {
  const arama = filtre.arama.trim().toLocaleLowerCase("tr-TR");
  return kartlar.filter((k) => {
    if (filtre.kategori && k.kategori !== filtre.kategori) return false;
    if (filtre.durum && k.durum !== filtre.durum) return false;
    if (!arama) return true;
    return (
      k.ad.toLocaleLowerCase("tr-TR").includes(arama) ||
      k.kod.toLocaleLowerCase("tr-TR").includes(arama)
    );
  });
}

export function depolariFiltrele(depolar: Depo[], arama: string): Depo[] {
  const aranan = arama.trim().toLocaleLowerCase("tr-TR");
  if (!aranan) return depolar;
  return depolar.filter(
    (d) =>
      d.adi.toLocaleLowerCase("tr-TR").includes(aranan) ||
      d.kod.toLocaleLowerCase("tr-TR").includes(aranan) ||
      d.sehir.toLocaleLowerCase("tr-TR").includes(aranan)
  );
}

export function hataMesaji(hata: unknown, varsayilan: string): string {
  if (hata instanceof Error && hata.message) return hata.message;
  return varsayilan;
}
