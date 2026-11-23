export type TipoUnidade = "upa" | "laboratorio";

export interface Unidade {
  nome: string;
  tipo: TipoUnidade;
}

export interface Cidade {
  nome: string;
  lat: number;
  lon: number;
  unidades: Unidade[];
  /** Deslocamento horizontal do rótulo no mapa 3D (evita sobreposição) */
  labelOffset?: number;
}

/** Sede administrativa (Salvador) — origem dos arcos no mapa */
export const sede: Cidade = {
  nome: "Salvador · Sede",
  lat: -12.97,
  lon: -38.5,
  unidades: [],
  labelOffset: -0.55,
};

/** Unidades sob gestão do ISIBA */
export const cidades: Cidade[] = [
  {
    nome: "Camaçari",
    lat: -12.7,
    lon: -38.32,
    labelOffset: 0.55,
    unidades: [
      { nome: "UPA Gleba A", tipo: "upa" },
      { nome: "Laboratório AMEX (na UPA Gleba A)", tipo: "laboratorio" },
    ],
  },
  {
    nome: "Dias d'Ávila",
    lat: -12.56,
    lon: -38.36,
    labelOffset: -0.5,
    unidades: [
      { nome: "UPA Lucas Evangelista", tipo: "upa" },
      { nome: "Laboratório LAMAC", tipo: "laboratorio" },
    ],
  },
];

const todas = cidades.flatMap((c) => c.unidades);
export const totalUnidades = todas.length;
export const totalUpas = todas.filter((u) => u.tipo === "upa").length;
export const totalLaboratorios = todas.filter((u) => u.tipo === "laboratorio").length;
