import { ReactNode } from "react";

interface FormAlaniProps {
  etiket: string;
  htmlFor: string;
  zorunlu?: boolean;
  hata?: string;
  children: ReactNode;
}

export function FormAlani({ etiket, htmlFor, zorunlu, hata, children }: FormAlaniProps) {
  return (
    <div className={`form-alani${hata ? " form-alani--hatali" : ""}`}>
      <label className="form-alani__etiket" htmlFor={htmlFor}>
        {etiket}
        {zorunlu && <span className="form-alani__zorunlu"> *</span>}
      </label>
      {children}
      {hata && (
        <span className="form-alani__hata" role="alert">
          {hata}
        </span>
      )}
    </div>
  );
}
