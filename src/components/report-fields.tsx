import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface ReportFieldsDefaultValues {
  cliente?: string;
  campanha?: string;
  periodoInicio?: string;
  periodoFim?: string;
  investimento?: number | string;
  leads?: number | string;
  alcance?: number | string;
  impressoes?: number | string;
  cliques?: number | string;
  visualizacoesPagina?: number | string;
  observacoes?: string;
}

export function ReportFields({
  clientes,
  defaultValues = {},
}: {
  clientes: { nome: string }[];
  defaultValues?: ReportFieldsDefaultValues;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cliente">Nome do cliente *</Label>
          <Input
            id="cliente"
            name="cliente"
            required
            className="h-11"
            placeholder="Ex: Studio Bella"
            list="clientes-existentes"
            autoComplete="off"
            defaultValue={defaultValues.cliente ?? ""}
          />
          <datalist id="clientes-existentes">
            {clientes.map((c) => (
              <option key={c.nome} value={c.nome} />
            ))}
          </datalist>
          <p className="font-sans text-xs text-white/35">
            Use o mesmo nome de antes para agrupar com os relatórios já existentes desse cliente.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="campanha">Nome da campanha</Label>
          <Input
            id="campanha"
            name="campanha"
            className="h-11"
            placeholder="Ex: Lançamento Agosto"
            defaultValue={defaultValues.campanha ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="periodoInicio">Período — início *</Label>
          <Input
            id="periodoInicio"
            name="periodoInicio"
            type="date"
            required
            className="h-11"
            defaultValue={defaultValues.periodoInicio ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="periodoFim">Período — fim *</Label>
          <Input
            id="periodoFim"
            name="periodoFim"
            type="date"
            required
            className="h-11"
            defaultValue={defaultValues.periodoFim ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="investimento">Investimento (R$)</Label>
          <Input
            id="investimento"
            name="investimento"
            type="number"
            step="0.01"
            min="0"
            className="h-11"
            defaultValue={defaultValues.investimento ?? 0}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="leads">Resultados (leads, conversas, compras...)</Label>
          <Input
            id="leads"
            name="leads"
            type="number"
            min="0"
            className="h-11"
            defaultValue={defaultValues.leads ?? 0}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="alcance">Alcance</Label>
          <Input
            id="alcance"
            name="alcance"
            type="number"
            min="0"
            className="h-11"
            defaultValue={defaultValues.alcance ?? 0}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="impressoes">Impressões</Label>
          <Input
            id="impressoes"
            name="impressoes"
            type="number"
            min="0"
            className="h-11"
            defaultValue={defaultValues.impressoes ?? 0}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cliques">Cliques no link</Label>
          <Input
            id="cliques"
            name="cliques"
            type="number"
            min="0"
            className="h-11"
            defaultValue={defaultValues.cliques ?? 0}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visualizacoesPagina">Visualizações da página de destino</Label>
          <Input
            id="visualizacoesPagina"
            name="visualizacoesPagina"
            type="number"
            min="0"
            className="h-11"
            defaultValue={defaultValues.visualizacoesPagina ?? 0}
          />
          <p className="font-sans text-xs text-white/35">
            Só preencha se a campanha tinha objetivo de tráfego/site. Deixe 0 se não tiver essa
            métrica.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="observacoes">Observações para o cliente</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          rows={4}
          placeholder="Ex: Nessa primeira semana focamos em testar públicos e criativos. Já identificamos os melhores ângulos para escalar a partir de agora."
          defaultValue={defaultValues.observacoes ?? ""}
        />
      </div>
    </>
  );
}
