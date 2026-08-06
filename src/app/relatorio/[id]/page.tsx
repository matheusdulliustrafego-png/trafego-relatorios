import { notFound } from "next/navigation";
import { Wallet, Users, Eye, MousePointerClick, Percent, Target, Coins, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  ctr,
  cpl,
  cpc,
  cpm,
  percentChange,
  formatCurrency,
  formatDate,
  formatMonthShort,
  formatNumber,
} from "@/lib/format";
import { Reveal } from "@/components/reveal";
import { StatCard } from "@/components/stat-card";
import { FunnelBars } from "@/components/funnel-bars";
import { EvolutionBars } from "@/components/evolution-bars";
import { DeltaBadge } from "@/components/delta-badge";
import { AnimatedCounter } from "@/components/animated-counter";
import { CopyLinkBanner } from "@/components/copy-link-banner";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ criado?: string }>;
}) {
  const { id } = await params;
  const { criado } = await searchParams;
  const report = await prisma.report.findUnique({ where: { id }, include: { cliente: true } });

  if (!report) notFound();

  const taxaCtr = ctr(report.cliques, report.impressoes);
  const custoLead = cpl(report.investimento, report.leads);
  const custoClique = cpc(report.investimento, report.cliques);
  const custoMil = cpm(report.investimento, report.impressoes);
  const whatsappLink = "https://wa.me/5551993133997?text=" + encodeURIComponent("Olá! Vi meu relatório de campanha, vamos continuar crescendo?");

  const historico = await prisma.report.findMany({
    where: { clienteId: report.clienteId },
    orderBy: { periodoInicio: "asc" },
  });

  const totalInvestido = historico.reduce((acc, r) => acc + r.investimento, 0);
  const totalLeads = historico.reduce((acc, r) => acc + r.leads, 0);
  const totalCampanhas = historico.length;

  const indiceAtual = historico.findIndex((r) => r.id === report.id);
  const anterior = indiceAtual > 0 ? historico[indiceAtual - 1] : null;
  const custoLeadAnterior = anterior ? cpl(anterior.investimento, anterior.leads) : 0;

  const periodos = historico.map((r) => ({
    label: formatMonthShort(r.periodoInicio),
    value: r.leads,
    isCurrent: r.id === report.id,
  }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-black pb-24">
      <div
        className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-silver/[0.07] blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black_10%,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-14 px-6 pt-16">
        {criado ? <CopyLinkBanner /> : null}

        <Reveal className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-11 items-center justify-center rounded-lg border border-brand-silver/25 bg-gradient-to-br from-brand-charcoal to-brand-black">
            <span className="font-heading text-sm font-semibold tracking-tight text-gradient-silver">
              TR
            </span>
          </span>
          <span className="rounded-full border border-brand-silver/25 bg-white/[0.03] px-4 py-1.5 font-subheading text-xs font-semibold uppercase tracking-[0.2em] text-brand-silver">
            Relatório de Performance
          </span>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {report.cliente.nome}
          </h1>
          {report.campanha ? (
            <p className="font-sans text-white/50">{report.campanha}</p>
          ) : null}
          <p className="font-sans text-sm text-white/40">
            {formatDate(report.periodoInicio)} — {formatDate(report.periodoFim)}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-panel flex flex-col items-center gap-3 rounded-3xl p-10 text-center shadow-2xl">
            <p className="font-subheading text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Leads gerados no período
            </p>
            <p className="font-heading text-6xl font-semibold text-gradient-silver sm:text-7xl">
              <AnimatedCounter value={report.leads} />
            </p>
            <p className="font-sans text-sm text-white/50">
              Custo por lead: <span className="font-medium text-white">{formatCurrency(custoLead)}</span>
            </p>
            {anterior ? (
              <DeltaBadge
                label="Leads"
                pct={percentChange(report.leads, anterior.leads)}
                goodDirection="up"
              />
            ) : null}
          </div>
        </Reveal>

        {totalCampanhas > 1 ? (
          <Reveal delay={0.12}>
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-5 text-center sm:flex-row sm:justify-center sm:gap-10">
              <p className="font-subheading text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Desde o início com a Tráfego Real
              </p>
              <div className="flex items-center gap-8">
                <div>
                  <p className="font-heading text-xl font-semibold text-white">{formatCurrency(totalInvestido)}</p>
                  <p className="font-sans text-xs text-white/45">Investido</p>
                </div>
                <div>
                  <p className="font-heading text-xl font-semibold text-white">{formatNumber(totalLeads)}</p>
                  <p className="font-sans text-xs text-white/45">Leads gerados</p>
                </div>
                <div>
                  <p className="font-heading text-xl font-semibold text-white">{formatNumber(totalCampanhas)}</p>
                  <p className="font-sans text-xs text-white/45">Relatórios</p>
                </div>
              </div>
            </div>
          </Reveal>
        ) : null}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Wallet} label="Investimento" value={report.investimento} prefix="R$ " decimals={2} delay={0} />
          <StatCard icon={Users} label="Alcance" value={report.alcance} delay={0.04} />
          <StatCard icon={Eye} label="Impressões" value={report.impressoes} delay={0.08} />
          <StatCard icon={MousePointerClick} label="Cliques" value={report.cliques} delay={0.12} />
          <StatCard icon={Percent} label="CTR" value={taxaCtr} suffix="%" decimals={2} delay={0.16} />
          <StatCard icon={Target} label="Mensagens / Leads" value={report.leads} delay={0.2} />
          <StatCard icon={Coins} label="Custo por clique" value={custoClique} prefix="R$ " decimals={2} delay={0.24} />
          <StatCard icon={TrendingUp} label="Custo por mil impressões" value={custoMil} prefix="R$ " decimals={2} delay={0.28} />
        </div>

        {anterior ? (
          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-5">
              <DeltaBadge
                label="Investimento"
                pct={percentChange(report.investimento, anterior.investimento)}
                goodDirection="neutral"
              />
              <DeltaBadge
                label="Custo por lead"
                pct={percentChange(custoLead, custoLeadAnterior)}
                goodDirection="down"
              />
              <DeltaBadge
                label="CTR"
                pct={percentChange(taxaCtr, ctr(anterior.cliques, anterior.impressoes))}
                goodDirection="up"
              />
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6">
            <h2 className="font-heading text-lg font-semibold text-white">Funil da campanha</h2>
            <p className="mt-1 font-sans text-sm text-white/50">
              Do alcance até o resultado final.
            </p>
            <div className="mt-6">
              <FunnelBars
                steps={[
                  { label: "Alcance", value: report.alcance },
                  { label: "Impressões", value: report.impressoes },
                  { label: "Cliques", value: report.cliques },
                  { label: "Leads / Mensagens", value: report.leads },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {totalCampanhas > 1 ? (
          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6">
              <h2 className="font-heading text-lg font-semibold text-white">Evolução de leads</h2>
              <p className="mt-1 font-sans text-sm text-white/50">
                Leads gerados em cada período de campanha.
              </p>
              <div className="mt-6">
                <EvolutionBars periods={periodos} />
              </div>
            </div>
          </Reveal>
        ) : null}

        {report.observacoes ? (
          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <h2 className="font-heading text-lg font-semibold text-white">
                Observações da Tráfego Real
              </h2>
              <p className="mt-3 whitespace-pre-line font-sans text-sm leading-relaxed text-white/65">
                {report.observacoes}
              </p>
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.2} className="flex flex-col items-center gap-4 pt-4 text-center">
          <p className="font-sans text-sm text-white/40">
            Relatório gerado por Tráfego Real — {formatNumber(report.leads)} novos contatos e contando.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand-whatsapp px-8 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-whatsapp-dark"
          >
            Falar com a Tráfego Real
          </a>
        </Reveal>
      </div>
    </main>
  );
}
