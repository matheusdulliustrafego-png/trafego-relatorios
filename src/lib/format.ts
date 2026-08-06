export function ctr(cliques: number, impressoes: number): number {
  if (!impressoes) return 0;
  return (cliques / impressoes) * 100;
}

export function cpl(investimento: number, leads: number): number {
  if (!leads) return 0;
  return investimento / leads;
}

export function cpc(investimento: number, cliques: number): number {
  if (!cliques) return 0;
  return investimento / cliques;
}

export function cpm(investimento: number, impressoes: number): number {
  if (!impressoes) return 0;
  return (investimento / impressoes) * 1000;
}

export function percentChange(atual: number, anterior: number): number {
  if (!anterior) return 0;
  return ((atual - anterior) / anterior) * 100;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR");
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const MESES_ABREV = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export function formatMonthShort(date: Date): string {
  const mes = MESES_ABREV[date.getUTCMonth()];
  const ano = String(date.getUTCFullYear()).slice(-2);
  return `${mes}/${ano}`;
}
