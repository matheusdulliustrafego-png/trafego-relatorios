import Link from "next/link";
import { createReport } from "@/actions/report";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ReportFields } from "@/components/report-fields";

export const dynamic = "force-dynamic";

export default async function Home() {
  const clientes = await prisma.cliente.findMany({
    select: { nome: true },
    orderBy: { nome: "asc" },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-white">
            Novo relatório de campanha
          </h1>
          <p className="mt-2 font-sans text-sm text-white/50">
            Preencha os números da campanha (do Gerenciador de Anúncios) e gere um link para
            enviar ao cliente.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Link
            href="/importar"
            className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 font-sans text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            Importar do Gerenciador
          </Link>
          <Link
            href="/clientes"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 font-sans text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
          >
            Ver clientes
          </Link>
        </div>
      </div>

      <form action={createReport} className="flex flex-col gap-6">
        <ReportFields clientes={clientes} />

        <Button type="submit" size="lg" className="h-12 rounded-full text-base">
          Gerar relatório
        </Button>
      </form>
    </main>
  );
}
