export type TipoUnidade = "upa" | "laboratorio" | "sede";

export interface Unidade {
  nome: string;
  tipo: TipoUnidade;
  lat: number;
  lon: number;
  /** Texto de busca no Google Maps ("Como chegar") */
  mapa: string;
}

export interface Cidade {
  nome: string;
  unidades: Unidade[];
}

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const linkMapa = (u: Unidade) => maps(u.mapa);

/** Sede administrativa — origem das linhas no mapa */
export const sede: Unidade = {
  nome: "Sede · Salvador",
  tipo: "sede",
  lat: -12.9826,
  lon: -38.4569,
  mapa: "Av. Tancredo Neves, 1189, Caminho das Árvores, Salvador - BA",
};

/**
 * UPAs sob gestão do ISIBA e laboratórios do Grupo ISIBA que atendem cada
 * município. Posições aproximadas (bairro/centro) até a confirmação dos
 * endereços exatos.
 */
export const cidades: Cidade[] = [
  {
    nome: "Camaçari",
    unidades: [
      { nome: "UPA Gleba A", tipo: "upa", lat: -12.692, lon: -38.313, mapa: "UPA Gleba A, Camaçari - BA" },
      {
        nome: "Laboratório AMEX, do Grupo ISIBA (na UPA Gleba A)",
        tipo: "laboratorio",
        lat: -12.6905,
        lon: -38.3105,
        mapa: "UPA Gleba A, Camaçari - BA",
      },
    ],
  },
  {
    nome: "Dias d'Ávila",
    unidades: [
      {
        nome: "UPA Lucas Evangelista",
        tipo: "upa",
        lat: -12.6129,
        lon: -38.2971,
        mapa: "UPA Lucas Evangelista, Dias d'Ávila - BA",
      },
      {
        nome: "Laboratório LAMAC, do Grupo ISIBA",
        tipo: "laboratorio",
        lat: -12.6165,
        lon: -38.2905,
        mapa: "LAMAC Laboratório, Dias d'Ávila - BA",
      },
    ],
  },
];

const todas = cidades.flatMap((c) => c.unidades);
export const totalUnidades = todas.length;
export const totalUpas = todas.filter((u) => u.tipo === "upa").length;
export const totalLaboratorios = todas.filter((u) => u.tipo === "laboratorio").length;
