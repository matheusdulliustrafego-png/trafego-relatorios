import * as XLSX from "xlsx";

export interface ParsedMetaExport {
  ok: true;
  campanha: string;
  investimento: number;
  alcance: number;
  impressoes: number;
  cliques: number;
  leads: number;
  visualizacoesPagina: number;
  periodoInicio: string;
  periodoFim: string;
  observacoesSugeridas: string;
  clienteSugeridoBruto: string;
  linhas: number;
  sheetUsada: string;
  warnings: string[];
}

export interface ParsedMetaExportError {
  ok: false;
  error: string;
}

export type ParseMetaExportResult = ParsedMetaExport | ParsedMetaExportError;

type Row = Record<string, unknown>;

const CORE_COLUMNS = [
  "Alcance",
  "Impressões",
  "Valor usado (BRL)",
  "Cliques no link",
  "Resultados",
];

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase();
}

function pickField(row: Row, ...candidates: string[]): unknown {
  for (const candidate of candidates) {
    if (candidate in row) return row[candidate];
  }
  const normalizedTargets = candidates.map(normalizeHeader);
  for (const key of Object.keys(row)) {
    if (normalizedTargets.includes(normalizeHeader(key))) return row[key];
  }
  return undefined;
}

function toNumberFlexible(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    if (/^-?\d{1,3}(\.\d{3})*,\d+$/.test(trimmed) || /^-?\d+,\d+$/.test(trimmed)) {
      const n = Number(trimmed.replace(/\./g, "").replace(",", "."));
      return Number.isFinite(n) ? n : 0;
    }
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function toISODateFlexible(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  return "";
}

const STOPWORDS = new Set([
  "camp",
  "campanha",
  "conjunto",
  "anuncio",
  "anúncio",
  "ad",
  "ads",
  "adset",
  "relatorio",
  "relatório",
  "report",
  "raw",
  "data",
  "export",
  "sem",
  "titulo",
  "título",
  "untitled",
  "novo",
  "copy",
  "cópia",
  "copia",
]);

const LOWER_CONNECTORS = new Set(["de", "da", "do", "das", "dos", "e"]);

function cleanCandidate(raw: string): string {
  const s = raw
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, " ")
    .replace(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g, " ");

  const tokens = s
    .split(/[-_|]+|\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const kept = tokens.filter(
    (t) => !STOPWORDS.has(t.toLowerCase()) && !/^\d+$/.test(t)
  );

  if (kept.length === 0) return "";

  return kept
    .map((t, i) =>
      i > 0 && LOWER_CONNECTORS.has(t.toLowerCase())
        ? t.toLowerCase()
        : t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
    )
    .join(" ")
    .trim();
}

function guessClienteName(campanha: string, filename: string): string {
  for (const raw of [campanha, filename]) {
    const cleaned = cleanCandidate(raw);
    if (cleaned) return cleaned;
  }
  return "";
}

function countCoreColumns(row: Row): number {
  return CORE_COLUMNS.filter((col) => pickField(row, col) !== undefined).length;
}

export function parseMetaExport(
  buffer: Buffer,
  filename: string
): ParseMetaExportResult {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  } catch {
    return {
      ok: false,
      error:
        "Não conseguimos ler esse arquivo. Envie o .xlsx ou .csv exportado do Gerenciador de Anúncios (Relatório de dados brutos).",
    };
  }

  const sheetNames = workbook.SheetNames;
  const ranked = [...sheetNames].sort((a, b) => {
    const score = (name: string) => {
      if (normalizeHeader(name) === "raw data report") return 0;
      if (/creative/i.test(name)) return 2;
      return 1;
    };
    return score(a) - score(b);
  });

  let bestSheet: { name: string; rows: Row[] } | null = null;

  for (const name of ranked) {
    const sheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" });
    if (rows.length === 0) continue;
    if (countCoreColumns(rows[0]) >= 2) {
      bestSheet = { name, rows };
      break;
    }
  }

  if (!bestSheet) {
    return {
      ok: false,
      error:
        "Não encontramos dados de campanha nesse arquivo. Verifique se exportou o 'Relatório de dados brutos' (Raw Data Report) no Gerenciador de Anúncios, e não o relatório de 'Criativos' (Creative Reporting).",
    };
  }

  const { name: sheetUsada, rows } = bestSheet;
  const warnings: string[] = [];

  function sumField(label: string, ...candidates: string[]): number {
    let found = false;
    let total = 0;
    for (const row of rows) {
      const value = pickField(row, ...candidates);
      if (value !== undefined && value !== "") found = true;
      total += toNumberFlexible(value);
    }
    if (!found) warnings.push(`Coluna '${label}' não encontrada — usando 0.`);
    return total;
  }

  function sumOptionalField(...candidates: string[]): number {
    let total = 0;
    for (const row of rows) total += toNumberFlexible(pickField(row, ...candidates));
    return total;
  }

  const investimento = sumField("Valor usado (BRL)", "Valor usado (BRL)");
  const alcance = Math.round(sumField("Alcance", "Alcance"));
  const impressoes = Math.round(sumField("Impressões", "Impressões"));
  const cliques = Math.round(sumField("Cliques no link", "Cliques no link"));
  const leads = Math.round(sumField("Resultados", "Resultados"));
  const visualizacoesPagina = Math.round(
    sumOptionalField("Visualizações da página de destino")
  );

  const campanhas = new Set<string>();
  for (const row of rows) {
    const value = pickField(row, "Nome da campanha");
    if (typeof value === "string" && value.trim()) campanhas.add(value.trim());
  }
  let campanha = "";
  if (campanhas.size === 1) campanha = [...campanhas][0];
  else if (campanhas.size >= 2 && campanhas.size <= 3) campanha = [...campanhas].join(", ");
  else if (campanhas.size > 3) campanha = "Múltiplas campanhas";

  const inicios: string[] = [];
  const fins: string[] = [];
  for (const row of rows) {
    const inicio = toISODateFlexible(pickField(row, "Início dos relatórios"));
    const fim = toISODateFlexible(pickField(row, "Encerramento dos relatórios"));
    if (inicio) inicios.push(inicio);
    if (fim) fins.push(fim);
  }
  const periodoInicio = inicios.length ? inicios.sort()[0] : "";
  const periodoFim = fins.length ? fins.sort().at(-1)! : "";
  if (!periodoInicio || !periodoFim) {
    warnings.push("Período não detectado no arquivo — preencha manualmente.");
  }

  const tiposResultado = new Set<string>();
  for (const row of rows) {
    const value = pickField(row, "Tipo de resultado");
    if (typeof value === "string" && value.trim()) tiposResultado.add(value.trim());
  }
  const observacoesSugeridas =
    tiposResultado.size === 1 ? `Objetivo: ${[...tiposResultado][0]}` : "";

  const clienteSugeridoBruto = guessClienteName(campanha, filename);

  return {
    ok: true,
    campanha,
    investimento,
    alcance,
    impressoes,
    cliques,
    leads,
    visualizacoesPagina,
    periodoInicio,
    periodoFim,
    observacoesSugeridas,
    clienteSugeridoBruto,
    linhas: rows.length,
    sheetUsada,
    warnings,
  };
}
