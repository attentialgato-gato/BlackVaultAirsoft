"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BULLET_TYPES } from "@/lib/types";
import { HelpTip } from "@/components/shared/HelpTip";
import { ArrowLeft, Plus, Loader2, AlertCircle } from "lucide-react";

const BB_WEIGHTS = ["0.20g", "0.23g", "0.25g", "0.28g", "0.30g", "0.32g", "0.36g", "0.40g"];

const INPUT_CLASS =
  "w-full bg-vault-surface border border-vault-border text-vault-text rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#00C2FF] placeholder-vault-text-faint transition-colors";
const LABEL_CLASS = "block text-xs font-medium uppercase tracking-widest text-vault-text-muted mb-1.5";

function matchesDuplicate(
  existing: { caliber: string; brand: string; grainWeight: number | null; bulletType: string | null },
  payload: { caliber: string; brand: string; grainWeight: number | null; bulletType: string | null }
): boolean {
  const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
  const sameNullable = (a: number | string | null, b: number | string | null) =>
    a === null && b === null ? true : a !== null && b !== null && String(a) === String(b);
  return (
    same(existing.caliber, payload.caliber) &&
    same(existing.brand, payload.brand) &&
    sameNullable(existing.grainWeight, payload.grainWeight) &&
    sameNullable(existing.bulletType, payload.bulletType)
  );
}

export default function NewAmmoStockPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [caliberInput, setCaliberInput] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [pricePerRound, setPricePerRound] = useState("");
const [numBags, setNumBags] = useState("");
const [bbPerBag, setBbPerBag] = useState("");
const [quantityValue, setQuantityValue] = useState("");
const [duplicateMatch, setDuplicateMatch] = useState<{
  id: string;
  brand: string;
  caliber: string;
  grainWeight: number | null;
  bulletType: string | null;
  quantity: number;
} | null>(null);
const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);

  const totalBBs = numBags && bbPerBag ? Number(numBags) * Number(bbPerBag) : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      caliber: caliberInput,
      brand: data.get("brand") as string,
      grainWeight: bbPerBag ? Number(bbPerBag) : null,
      bulletType: (data.get("bulletType") as string) || null,
      quantity: totalBBs,
      purchasePrice: totalCost ? Number(totalCost) : null,
      pricePerRound: pricePerRound ? Number(pricePerRound) : null,
      purchaseDate: (data.get("purchaseDate") as string) || null,
      storageLocation: (data.get("storageLocation") as string) || null,
      lowStockAlert: data.get("lowStockAlert")
        ? Number(data.get("lowStockAlert")) * Number(bbPerBag || 1)
        : null,
      notes: (data.get("notes") as string) || null,
    };

    const fieldErrors: Record<string, string> = {};
    if (!payload.caliber) fieldErrors.caliber = "BB Weight is required";
    if (!payload.brand?.trim()) fieldErrors.brand = "Brand is required";
    if (totalBBs <= 0) fieldErrors.bags = "Enter number of bags and BBs per bag";
    if (Object.keys(fieldErrors).length > 0) {
      setFormErrors(fieldErrors);
      setLoading(false);
      return;
    }
    setFormErrors({});

    // Check for duplicates before creating
    try {
      const existing = await fetch("/api/ammo").then((r) => r.json());
      // GET /api/ammo returns { grouped: [...], all: [...] }
      const allStocks: Array<{ id: string; caliber: string; brand: string; grainWeight: number | null; bulletType: string | null; quantity: number }> =
        existing?.all ?? [];
      const match = allStocks.find((s) => matchesDuplicate(s, payload));
      if (match) {
        setPendingPayload(payload);
        setDuplicateMatch(match);
        setLoading(false);
        return; // Stop here — wait for user decision
      }
    } catch {
      // If check fails, proceed with normal create
    }

    try {
      const res = await fetch("/api/ammo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to create BB stock");
        setLoading(false);
        return;
      }
      router.push("/ammo");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  async function handleMergeConfirm() {
    if (!duplicateMatch || !pendingPayload) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/ammo/${duplicateMatch.id}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "PURCHASE",
        quantity: Number(pendingPayload.quantity),
        purchasePrice: pendingPayload.purchasePrice ?? undefined,
        pricePerRound: pendingPayload.pricePerRound ?? undefined,
        purchaseDate: pendingPayload.purchaseDate ?? undefined,
        note: pendingPayload.notes ? String(pendingPayload.notes) : undefined,
      }),
    });
    if (res.ok) {
      router.push("/ammo");
    } else {
      const json = await res.json();
      setError(json.error ?? "Failed to add rounds to existing stock.");
      setLoading(false);
      setDuplicateMatch(null);
      setPendingPayload(null);
    }
  }

  return (
    <div className="min-h-full">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4 border-b border-vault-border">
        <Link href="/ammo" className="flex items-center gap-1.5 text-vault-text-muted hover:text-vault-text text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to BB Depot
        </Link>
        <span className="text-vault-border">/</span>
        <h1 className="text-sm font-semibold text-vault-text tracking-wide uppercase">Add BB Stock</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-vault-text mb-1">New BB Stock</h2>
          <p className="text-sm text-vault-text-muted">Add a new BB stock to the depot.</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-[#E53935]/10 border border-[#E53935]/30 rounded-lg px-4 py-3 mb-6">
            <AlertCircle className="w-4 h-4 text-[#E53935] shrink-0" />
            <p className="text-sm text-[#E53935]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#F5A623] px-1 -ml-1">BB Identity</legend>

            <div>
              <label className={LABEL_CLASS}>BB Weight <span className="text-[#E53935]">*</span></label>
              <select value={caliberInput} onChange={(e) => { setCaliberInput(e.target.value); setFormErrors(prev => ({ ...prev, caliber: "" })); }} className={INPUT_CLASS}>
                <option value="">Select weight...</option>
                {BB_WEIGHTS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              {formErrors.caliber && <p className="text-xs mt-1" style={{ color: "#E53935" }}>{formErrors.caliber}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand" className={LABEL_CLASS}>Brand <span className="text-[#E53935]">*</span></label>
                <input id="brand" name="brand" type="text" required placeholder="e.g. BLS, Geoffs, G&G" className={INPUT_CLASS} onChange={() => setFormErrors(prev => ({ ...prev, brand: "" }))} />
                {formErrors.brand && <p className="text-xs mt-1" style={{ color: "#E53935" }}>{formErrors.brand}</p>}
              </div>
              <div>
                <label htmlFor="bulletType" className={LABEL_CLASS}>Type</label>
                <select id="bulletType" name="bulletType" className={INPUT_CLASS}>
                  <option value="">Select type...</option>
                  {BULLET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#F5A623] px-1 -ml-1">Bags & Quantity</legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="numBags" className={LABEL_CLASS}>Number of Bags <span className="text-[#E53935]">*</span></label>
                <input
                  id="numBags" type="number" min="1" placeholder="e.g. 5" value={numBags}
                  onChange={(e) => {
                    setNumBags(e.target.value);
                    setFormErrors(prev => ({ ...prev, bags: "" }));
                    const total = Number(e.target.value) * Number(bbPerBag);
                    if (total > 0 && totalCost) setPricePerRound((Number(totalCost) / total).toFixed(4));
                  }}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="bbPerBag" className={LABEL_CLASS}>
                  BBs per Bag <span className="text-[#E53935]">*</span>
                  <HelpTip text="How many BBs are in each bag (e.g. 4000, 5000). Saved to calculate bag counts later." />
                </label>
                <input
                  id="bbPerBag" type="number" min="1" placeholder="e.g. 4000" value={bbPerBag}
                  onChange={(e) => {
                    setBbPerBag(e.target.value);
                    setFormErrors(prev => ({ ...prev, bags: "" }));
                    const total = Number(numBags) * Number(e.target.value);
                    if (total > 0 && totalCost) setPricePerRound((Number(totalCost) / total).toFixed(4));
                  }}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            {totalBBs > 0 && (
              <div className="flex items-center gap-3 bg-[#00C2FF]/5 border border-[#00C2FF]/20 rounded-lg px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-vault-text-faint mb-0.5">Total BBs</p>
                  <p className="text-lg font-bold font-mono text-[#00C2FF]">{totalBBs.toLocaleString()}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] uppercase tracking-widest text-vault-text-faint mb-0.5">Bags</p>
                  <p className="text-lg font-bold font-mono text-vault-text">{numBags}</p>
                </div>
              </div>
            )}
            {formErrors.bags && <p className="text-xs mt-1" style={{ color: "#E53935" }}>{formErrors.bags}</p>}
          </fieldset>

          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#F5A623] px-1 -ml-1">Purchase Details</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="totalCost" className={LABEL_CLASS}>Total Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-text-faint text-sm">€</span>
                  <input id="totalCost" type="number" min="0" step="0.01" placeholder="0.00" value={totalCost}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTotalCost(val);
                      if (totalBBs > 0 && val) setPricePerRound((Number(val) / totalBBs).toFixed(4));
                      else if (!val) setPricePerRound("");
                    }}
                    className={`${INPUT_CLASS} pl-7`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="pricePerRound" className={LABEL_CLASS}>Price per BB</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-text-faint text-sm">€</span>
                  <input id="pricePerRound" type="number" min="0" step="0.0001" placeholder="0.0000" value={pricePerRound}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPricePerRound(val);
                      if (totalBBs > 0 && val) setTotalCost((Number(val) * totalBBs).toFixed(2));
                      else if (!val) setTotalCost("");
                    }}
                    className={`${INPUT_CLASS} pl-7`}
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="purchaseDate" className={LABEL_CLASS}>Purchase Date</label>
              <input id="purchaseDate" name="purchaseDate" type="date" className={INPUT_CLASS} />
            </div>
          </fieldset>

          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#F5A623] px-1 -ml-1">Storage & Alerts</legend>
            <div>
              <label htmlFor="storageLocation" className={LABEL_CLASS}>Storage Location</label>
              <input id="storageLocation" name="storageLocation" type="text" placeholder="e.g. Shelf A · Box 2" className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="lowStockAlert" className={LABEL_CLASS}>
                Low Stock Alert (bags)
                <HelpTip text="Alert when stock falls below this number of bags." />
              </label>
              <input id="lowStockAlert" name="lowStockAlert" type="number" min="0" placeholder="e.g. 2" className={INPUT_CLASS} />
              <p className="text-xs text-vault-text-faint mt-1">
                {bbPerBag ? `= ${(Number(bbPerBag)).toLocaleString()} BBs × bags` : "Enter BBs per bag to see threshold."}
              </p>
            </div>
          </fieldset>

          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#F5A623] px-1 -ml-1">Notes</legend>
            <div>
              <label htmlFor="notes" className={LABEL_CLASS}>Notes</label>
              <textarea id="notes" name="notes" rows={3} placeholder="Any additional notes..." className={`${INPUT_CLASS} resize-none`} />
            </div>
          </fieldset>

{duplicateMatch && (
  <div className="bg-[#F5A623]/10 border border-[#F5A623]/40 rounded-lg p-4 space-y-3">
    <p className="text-sm text-vault-text">
      You already have{" "}
      <span className="font-semibold">
        {duplicateMatch.brand} {duplicateMatch.caliber}
        {duplicateMatch.bulletType ? ` ${duplicateMatch.bulletType}` : ""}
      </span>{" "}
      in stock ({duplicateMatch.quantity.toLocaleString()} BBs). Add these BBs to existing stock instead?
    </p>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleMergeConfirm}
        disabled={loading}
        className="flex items-center gap-2 bg-[#00C853]/10 border border-[#00C853]/30 text-[#00C853] hover:bg-[#00C853]/20 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        Yes, add to existing
      </button>
      <button
        type="button"
        onClick={() => {
          setDuplicateMatch(null);
          setPendingPayload(null);
          if (pendingPayload) {
            setLoading(true);
            fetch("/api/ammo", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(pendingPayload),
            })
              .then((r) => r.json())
              .then((json) => {
                if (json.id) router.push("/ammo");
                else setError(json.error ?? "Failed to create BB stock.");
              })
              .catch(() => setError("Network error."))
              .finally(() => setLoading(false));
          }
        }}
        className="flex items-center gap-2 bg-transparent border border-vault-border text-vault-text-muted hover:text-vault-text hover:border-vault-text-muted/50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        No, create separate lot
      </button>
    </div>
  </div>
)}
{/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <Link href="/ammo" className="w-full sm:w-auto text-center px-4 py-2 text-sm text-vault-text-muted hover:text-vault-text border border-vault-border rounded-md hover:border-vault-text-muted/30 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/20 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-md text-sm font-medium transition-colors">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {loading ? "Adding..." : "Add BB Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}