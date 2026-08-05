"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

function toNumber(value: FormDataEntryValue | null): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function createReport(formData: FormData) {
  const nomeCliente = String(formData.get("cliente") ?? "").trim();
  const campanha = String(formData.get("campanha") ?? "").trim();
  const periodoInicio = String(formData.get("periodoInicio") ?? "");
  const periodoFim = String(formData.get("periodoFim") ?? "");
  const observacoes = String(formData.get("observacoes") ?? "").trim();

  if (!nomeCliente || !periodoInicio || !periodoFim) {
    throw new Error("Preencha ao menos cliente e período.");
  }

  const slug = slugify(nomeCliente);
  const cliente = await prisma.cliente.upsert({
    where: { slug },
    update: {},
    create: { nome: nomeCliente, slug },
  });

  const report = await prisma.report.create({
    data: {
      clienteId: cliente.id,
      campanha,
      periodoInicio: new Date(periodoInicio),
      periodoFim: new Date(periodoFim),
      investimento: toNumber(formData.get("investimento")),
      alcance: Math.round(toNumber(formData.get("alcance"))),
      impressoes: Math.round(toNumber(formData.get("impressoes"))),
      cliques: Math.round(toNumber(formData.get("cliques"))),
      leads: Math.round(toNumber(formData.get("leads"))),
      observacoes,
    },
  });

  redirect(`/relatorio/${report.id}?criado=1`);
}
