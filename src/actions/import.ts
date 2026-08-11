"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { levenshteinRatio } from "@/lib/similarity";
import { parseMetaExport, type ParsedMetaExport } from "@/lib/parse-meta-export";

export type ImportState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "parsed"; data: ParsedMetaExport & { clienteSugerido: string } };

async function suggestClienteExistente(
  guessBruto: string,
  clientes: { nome: string }[]
): Promise<string> {
  if (!guessBruto) return "";
  const guessSlug = slugify(guessBruto);
  if (!guessSlug) return guessBruto;

  for (const c of clientes) {
    const nomeSlug = slugify(c.nome);
    if (nomeSlug === guessSlug) return c.nome;
  }
  for (const c of clientes) {
    const nomeSlug = slugify(c.nome);
    if (nomeSlug.includes(guessSlug) || guessSlug.includes(nomeSlug)) return c.nome;
  }

  let best = { nome: "", score: 0 };
  for (const c of clientes) {
    const score = levenshteinRatio(guessSlug, slugify(c.nome));
    if (score > best.score) best = { nome: c.nome, score };
  }
  return best.score >= 0.72 ? best.nome : guessBruto;
}

export async function parseImportFile(
  _prev: ImportState,
  formData: FormData
): Promise<ImportState> {
  const file = formData.get("arquivo");
  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      message: "Selecione um arquivo .xlsx ou .csv exportado do Gerenciador de Anúncios.",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = parseMetaExport(buffer, file.name);

  if (!result.ok) {
    return { status: "error", message: result.error };
  }

  const clientes = await prisma.cliente.findMany({ select: { nome: true } });
  const clienteSugerido = await suggestClienteExistente(result.clienteSugeridoBruto, clientes);

  return { status: "parsed", data: { ...result, clienteSugerido } };
}
