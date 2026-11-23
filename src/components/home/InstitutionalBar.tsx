/** Faixa de credenciais institucionais logo abaixo do hero */
const itens = [
  { titulo: "Utilidade Pública", texto: "Reconhecimento do Governo do Estado da Bahia" },
  { titulo: "Sem fins lucrativos", texto: "Organização social dedicada ao SUS" },
  { titulo: "Atenção integral", texto: "Primária, média e alta complexidade" },
  { titulo: "Laboratório certificado", texto: "LAMAC afiliado ao PNCQ e à SBAC" },
];

export function InstitutionalBar() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <ul className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 px-4 sm:grid-cols-2 sm:divide-y-0 sm:px-6 lg:grid-cols-4 lg:divide-x lg:px-8">
        {itens.map((i) => (
          <li key={i.titulo} className="py-6 sm:px-6 sm:first:pl-0 lg:py-8">
            <p className="font-display text-base font-semibold text-ink-900">{i.titulo}</p>
            <p className="mt-1 text-sm text-slate-500">{i.texto}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
