import { createReport } from "@/actions/report";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-white">
          Novo relatório de campanha
        </h1>
        <p className="mt-2 font-sans text-sm text-white/50">
          Preencha os números da campanha (do Gerenciador de Anúncios) e gere um link para
          enviar ao cliente.
        </p>
      </div>

      <form action={createReport} className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cliente">Nome do cliente *</Label>
            <Input id="cliente" name="cliente" required className="h-11" placeholder="Ex: Studio Bella" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="campanha">Nome da campanha</Label>
            <Input id="campanha" name="campanha" className="h-11" placeholder="Ex: Lançamento Agosto" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="periodoInicio">Período — início *</Label>
            <Input id="periodoInicio" name="periodoInicio" type="date" required className="h-11" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="periodoFim">Período — fim *</Label>
            <Input id="periodoFim" name="periodoFim" type="date" required className="h-11" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="investimento">Investimento (R$)</Label>
            <Input id="investimento" name="investimento" type="number" step="0.01" min="0" defaultValue="0" className="h-11" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="leads">Mensagens / Leads gerados</Label>
            <Input id="leads" name="leads" type="number" min="0" defaultValue="0" className="h-11" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alcance">Alcance</Label>
            <Input id="alcance" name="alcance" type="number" min="0" defaultValue="0" className="h-11" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="impressoes">Impressões</Label>
            <Input id="impressoes" name="impressoes" type="number" min="0" defaultValue="0" className="h-11" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cliques">Cliques</Label>
            <Input id="cliques" name="cliques" type="number" min="0" defaultValue="0" className="h-11" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="observacoes">Observações para o cliente</Label>
          <Textarea
            id="observacoes"
            name="observacoes"
            rows={4}
            placeholder="Ex: Nessa primeira semana focamos em testar públicos e criativos. Já identificamos os melhores ângulos para escalar a partir de agora."
          />
        </div>

        <Button type="submit" size="lg" className="h-12 rounded-full text-base">
          Gerar relatório
        </Button>
      </form>
    </main>
  );
}
