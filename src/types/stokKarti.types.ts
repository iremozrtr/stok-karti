export enum Kategori {
  Hammadde = "HAMMADDE",
  YariMamul = "YARI_MAMUL",
  Mamul = "MAMUL",
  Ticari = "TICARI",
}

export enum Birim {
  Adet = "ADET",
  Kg = "KG",
  Litre = "LITRE",
  Metre = "METRE",
}

export enum Durum {
  Aktif = "AKTIF",
  Pasif = "PASIF",
}

export const KATEGORI_LABEL: Record<Kategori, string> = {
  [Kategori.Hammadde]: "Hammadde",
  [Kategori.YariMamul]: "Yarı Mamul",
  [Kategori.Mamul]: "Mamul",
  [Kategori.Ticari]: "Ticari Mal",
};

export const BIRIM_LABEL: Record<Birim, string> = {
  [Birim.Adet]: "Adet",
  [Birim.Kg]: "Kg",
  [Birim.Litre]: "Litre",
  [Birim.Metre]: "Metre",
};

export const DURUM_LABEL: Record<Durum, string> = {
  [Durum.Aktif]: "Aktif",
  [Durum.Pasif]: "Pasif",
};

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export function enumToOptions<T extends string>(
  labels: Record<T, string>
): SelectOption<T>[] {
  return (Object.keys(labels) as T[]).map((value) => ({
    value,
    label: labels[value],
  }));
}

export const KATEGORI_OPTIONS = enumToOptions(KATEGORI_LABEL);
export const BIRIM_OPTIONS = enumToOptions(BIRIM_LABEL);
export const DURUM_OPTIONS = enumToOptions(DURUM_LABEL);

export interface StokKarti {
  id: number;
  ad: string;
  kod: string;
  kategori: Kategori;
  birim: Birim;
  stokMiktari: number;
  birimFiyat: number;
  durum: Durum;
  depoId: number;
  depoAdi: string;
}

export type StokKartiForm = Omit<StokKarti, "id">;

export interface Depo {
  id: number;
  kod: string;
  adi: string;
  sehir: string;
}

export interface StokFiltre {
  arama: string;
  kategori: Kategori | "";
  durum: Durum | "";
}
