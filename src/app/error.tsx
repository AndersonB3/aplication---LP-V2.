"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 font-display mb-3">
          Algo deu errado
        </h1>
        <p className="text-slate-500 mb-8">
          Não foi possível carregar esta página. Tente novamente em instantes.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-7 py-3 bg-teal-500 text-white rounded-full font-semibold text-sm hover:bg-teal-600 transition-all"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
