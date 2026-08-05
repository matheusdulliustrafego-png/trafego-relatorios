export function ctr(cliques: number, impressoes: number): number {
  if (!impressoes) return 0;
  return (cliques / impressoes) * 100;
}

export function cpl(investimento: number, leads: number): number {
  if (!leads) return 0;
  return investimento / leads;
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
