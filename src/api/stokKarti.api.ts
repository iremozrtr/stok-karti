import { Depo, StokKarti, StokKartiForm } from "../types/stokKarti.types";

const BASE_URL = "/api";

async function istek<T>(yol: string, init?: RequestInit): Promise<T> {
  let yanit: Response;
  try {
    yanit = await fetch(`${BASE_URL}${yol}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new Error("Sunucuya ulaşılamadı. Mock API çalışıyor mu?");
  }
  if (!yanit.ok) {
    if (yanit.status === 404) throw new Error("Kayıt bulunamadı.");
    throw new Error(`İstek başarısız oldu (${yanit.status}).`);
  }
  if (yanit.status === 204) return undefined as T;
  return (await yanit.json()) as T;
}

export const stokKartiApi = {
  liste: () => istek<StokKarti[]>("/stoklar?_sort=id&_order=desc"),
  getir: (id: number) => istek<StokKarti>(`/stoklar/${id}`),
  olustur: (form: StokKartiForm) =>
    istek<StokKarti>("/stoklar", { method: "POST", body: JSON.stringify(form) }),
  guncelle: (id: number, form: StokKartiForm) =>
    istek<StokKarti>(`/stoklar/${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, ...form }),
    }),
  sil: (id: number) => istek<void>(`/stoklar/${id}`, { method: "DELETE" }),
  depolar: () => istek<Depo[]>("/depolar"),
};
