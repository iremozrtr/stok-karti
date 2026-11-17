import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { NotificationProvider } from "./components/Notification";
import { StokKartiSayfasi } from "./features/stokKarti/card/StokKartiCard";
import { StokKartiList } from "./features/stokKarti/list/StokKartiList";

function BulunamadiSayfasi() {
  return (
    <div className="durum-mesaji">
      <p>Sayfa bulunamadı.</p>
      <Link to="/" className="btn btn--birincil">
        Listeye Dön
      </Link>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <div className="uygulama">
          <nav className="uygulama__ust">
            <Link to="/" className="uygulama__marka">
              Datasoft · Stok
            </Link>
          </nav>
          <main className="uygulama__icerik">
            <Routes>
              <Route path="/" element={<StokKartiList />} />
              <Route path="/stok/yeni" element={<StokKartiSayfasi />} />
              <Route path="/stok/:id" element={<StokKartiSayfasi />} />
              <Route path="*" element={<BulunamadiSayfasi />} />
            </Routes>
          </main>
        </div>
      </NotificationProvider>
    </BrowserRouter>
  );
}
