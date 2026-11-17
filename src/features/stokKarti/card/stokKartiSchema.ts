import * as Yup from "yup";
import { Birim, Durum, Kategori } from "../../../types/stokKarti.types";

export const stokKartiSchema = Yup.object({
  ad: Yup.string().trim().required("Ad zorunludur"),
  kod: Yup.string().trim().required("Stok kodu zorunludur"),
  kategori: Yup.mixed<Kategori>()
    .oneOf(Object.values(Kategori), "Geçerli bir kategori seçiniz")
    .required("Kategori zorunludur"),
  birim: Yup.mixed<Birim>()
    .oneOf(Object.values(Birim), "Geçerli bir birim seçiniz")
    .required("Birim zorunludur"),
  durum: Yup.mixed<Durum>()
    .oneOf(Object.values(Durum), "Geçerli bir durum seçiniz")
    .required("Durum zorunludur"),
  stokMiktari: Yup.number()
    .typeError("Geçerli bir sayı giriniz")
    .min(0, "Stok miktarı 0'dan küçük olamaz")
    .required("Stok miktarı zorunludur"),
  birimFiyat: Yup.number()
    .typeError("Geçerli bir sayı giriniz")
    .min(0, "Birim fiyat 0'dan küçük olamaz")
    .required("Birim fiyat zorunludur"),
  depoId: Yup.number().min(1, "Depo seçiniz").required("Depo seçiniz"),
  depoAdi: Yup.string(),
});
