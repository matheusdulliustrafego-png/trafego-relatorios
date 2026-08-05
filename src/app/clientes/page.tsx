import Link from "next/link";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    include: {
      reports: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  clientes.sort((a, b) => {
    const aDate = a.reports[0]?.createdAt ?? a.createdAt;
    const bDate = b.reports[0]?.createdAt ?? b.createdAt;
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-white">Clientes</h1>
          <p className="mt-2 font-sans text-sm text-white/50">
            {clientes.length} cliente(s), agrupados por empresa.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 font-sans text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
        >
          Novo relatório
        </Link>
      </div>

      {clientes.length === 0 ? (
        <p className="font-sans text-sm text-white/40">Nenhum relatório gerado ainda.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-white">{cliente.nome}</h2>
                <span className="font-sans text-xs text-white/40">
                  {cliente.reports.length} relatório(s)
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {cliente.reports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/relatorio/${report.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:border-brand-silver/25 hover:bg-white/[0.05]"
                  >
                    <span className="flex items-center gap-2.5 font-sans text-sm text-white/80">
                      <FileText className="size-4 text-brand-silver" strokeWidth={1.75} />
                      {report.campanha || "Relatório"}
                    </span>
                    <span className="font-sans text-xs text-white/40">
                      {formatDate(report.periodoInicio)} — {formatDate(report.periodoFim)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
