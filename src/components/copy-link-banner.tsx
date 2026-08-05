"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLinkBanner() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href.split("?")[0]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-brand-whatsapp/30 bg-brand-whatsapp/[0.06] p-5 text-center sm:flex-row sm:justify-between sm:text-left">
      <p className="font-sans text-sm text-white/80">
        Relatório criado! Copie o link abaixo e envie para o cliente.
      </p>
      <button
        onClick={handleCopy}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-whatsapp px-5 font-medium text-white transition-colors hover:bg-brand-whatsapp-dark"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
