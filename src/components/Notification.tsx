import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import "./Notification.scss";

export type NotificationTipi = "success" | "error" | "info";

export interface NotificationLink {
  to: string;
  label: string;
}

export interface NotificationOptions {
  message: string;
  type?: NotificationTipi;
  link?: NotificationLink;
  sure?: number;
}

interface NotificationItem extends NotificationOptions {
  id: number;
  type: NotificationTipi;
}

interface NotificationContextValue {
  bildir: (options: NotificationOptions) => void;
  basari: (message: string, link?: NotificationLink) => void;
  hata: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const sayac = useRef(0);

  const kapat = useCallback((id: number) => {
    setItems((onceki) => onceki.filter((i) => i.id !== id));
  }, []);

  const bildir = useCallback(
    (options: NotificationOptions) => {
      sayac.current += 1;
      const id = sayac.current;
      const item: NotificationItem = { ...options, id, type: options.type ?? "info" };
      setItems((onceki) => [...onceki, item]);
      window.setTimeout(() => kapat(id), options.sure ?? 5000);
    },
    [kapat]
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      bildir,
      basari: (message, link) => bildir({ message, type: "success", link }),
      hata: (message) => bildir({ message, type: "error", sure: 7000 }),
    }),
    [bildir]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notification-stack" role="status" aria-live="polite">
        {items.map((item) => (
          <div key={item.id} className={`notification notification--${item.type}`}>
            <span className="notification__message">{item.message}</span>
            {item.link && (
              <Link
                className="notification__link"
                to={item.link.to}
                onClick={() => kapat(item.id)}
              >
                {item.link.label}
              </Link>
            )}
            <button
              type="button"
              className="notification__close"
              aria-label="Kapat"
              onClick={() => kapat(item.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification yalnızca NotificationProvider içinde kullanılabilir.");
  }
  return ctx;
}
