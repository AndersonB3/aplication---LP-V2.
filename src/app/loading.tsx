export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div
        role="status"
        aria-label="Carregando"
        className="w-10 h-10 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin"
      />
    </div>
  );
}
