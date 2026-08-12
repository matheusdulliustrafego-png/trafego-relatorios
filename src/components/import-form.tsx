"use client";

import { useActionState } from "react";
import Link from "next/link";
import { parseImportFile, type ImportState } from "@/actions/import";
import { createReport } from "@/actions/report";
import { ReportFields } from "@/components/report-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ImportState = { status: "idle" };

export function ImportForm({ clientes }: { clientes: { nome: string }[] }) {
  const [state, formAction, isPending] = useActionState(parseImportFile, initialState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="arquivo">Arquivo exportado do Gerenciador de Anúncios</Label>
          <Input id="arquivo" name="arquivo" type="file" accept=".xlsx,.csv" required className="h-11" />
          <p className="font-sans text-xs text-white/35">
            No Gerenciador de Anúncios: Exportar → Exportar dados da tabela → Relatório de dados
            brutos (.xlsx ou .csv).
          </p>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-11 w-fit rounded-full text-base"
          disabled={isPending}
        >
          {isPending ? "Lendo arquivo..." : "Ler arquivo"}
        </Button>
      </form>

      {state.status === "error" && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p>{state.message}</p>
          <Link href="/" className="mt-2 inline-block underline">
            Preencher manualmente
          </Link>
        </div>
      )}

      {state.status === "parsed" && (
        <div className="flex flex-col gap-6 border-t border-white/10 pt-6">
          {state.data.warnings.length > 0 && (
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs text-amber-200">
              <ul className="list-disc pl-4">
                {state.data.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="font-sans text-xs text-white/35">
            {state.data.linhas} linha(s) lida(s) da aba &quot;{state.data.sheetUsada}&quot;. Confira os
            campos abaixo e gere o relatório.
          </p>
          <form key={JSON.stringify(state.data)} action={createReport} className="flex flex-col gap-6">
            <ReportFields
              clientes={clientes}
              defaultValues={{
                cliente: state.data.clienteSugerido,
                campanha: state.data.campanha,
                periodoInicio: state.data.periodoInicio,
                periodoFim: state.data.periodoFim,
                investimento: state.data.investimento,
                leads: state.data.leads,
                alcance: state.data.alcance,
                impressoes: state.data.impressoes,
                cliques: state.data.cliques,
                visualizacoesPagina: state.data.visualizacoesPagina,
                observacoes: state.data.observacoesSugeridas,
              }}
            />
            <Button type="submit" size="lg" className="h-12 rounded-full text-base">
              Gerar relatório
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
