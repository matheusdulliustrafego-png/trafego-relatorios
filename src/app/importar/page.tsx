import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ImportForm } from "@/components/import-form";

export const dynamic = "force-dynamic";

export default async function ImportarPage() {
  const clientes = await prisma.cliente.findMany({
    select: { nome: true },
    orderBy: { nome: "asc" },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-white">
            Importar do Gerenciador de Anúncios
          </h1>
          <p className="mt-2 font-sans text-sm text-white/50">
            Envie o arquivo exportado do Meta e a gente preenche o relatório pra você.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 font-sans text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
        >
          Preencher manualmente
        </Link>
      </div>

      <ImportForm clientes={clientes} />
    </main>
  );
}
