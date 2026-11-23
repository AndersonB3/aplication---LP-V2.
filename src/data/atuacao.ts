export interface Cidade {
  nome: string;
  lat: number;
  lon: number;
  unidades: string[];
  /** Deslocamento horizontal do rótulo no mapa 3D (evita sobreposição) */
  labelOffset?: number;
}

/** Sede administrativa (Salvador) — origem dos arcos no mapa */
export const sede: Cidade = {
  nome: "Salvador · Sede",
  lat: -12.97,
  lon: -38.5,
  unidades: [],
  labelOffset: 0.35,
};

/** Unidades geridas — fonte: apresentação institucional ("Atuação de Excelência") */
export const cidades: Cidade[] = [
  {
    nome: "Camaçari",
    lat: -12.7,
    lon: -38.32,
    labelOffset: 0.45,
    unidades: [
      "UPA Gleba A",
      "Centro de Atenção à Saúde da Criança",
      "UPA de Arembepe",
      "UPA de Abrantes",
      "UPA de Monte Gordo",
    ],
  },
  {
    nome: "Dias d'Ávila",
    lat: -12.56,
    lon: -38.36,
    labelOffset: -0.4,
    unidades: ["Hospital Dilton Bispo de Santana", "UPA Lucas Evangelista"],
  },
  {
    nome: "Morro do Chapéu",
    lat: -11.55,
    lon: -41.16,
    unidades: ["UPA Tolentino Oliver Guimarães"],
  },
  {
    nome: "Jacobina",
    lat: -11.18,
    lon: -40.51,
    unidades: ["UPA Josefa Maia da Silva"],
  },
];

export const totalUnidades = cidades.reduce((n, c) => n + c.unidades.length, 0);
