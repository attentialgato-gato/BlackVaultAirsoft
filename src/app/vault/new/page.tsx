"use client";

import { useState, useRef } from "react";
import ImagePicker from "@/components/shared/ImagePicker";
import { HelpTip } from "@/components/shared/HelpTip";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FIREARM_TYPES, FIREARM_TYPE_LABELS, DRIVE_SYSTEMS } from "@/lib/types";
import { ArrowLeft, Plus, Loader2, AlertCircle } from "lucide-react";

const INPUT_CLASS =
  "w-full bg-vault-surface border border-vault-border text-vault-text rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#00C2FF] placeholder-vault-text-faint transition-colors";
const LABEL_CLASS = "block text-xs font-medium uppercase tracking-widest text-vault-text-muted mb-1.5";

export default function NewFirearmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [caliberInput, setCaliberInput] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const caliberRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const nameVal = (data.get("name") as string) ?? "";
    const errors: Record<string, string> = {};
    if (!nameVal.trim()) errors.name = "Name is required";
    if (!caliberInput.trim()) errors.caliber = "Drive System is required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }
    setFormErrors({});

    const payload = {
      name: data.get("name") as string,
      manufacturer: data.get("manufacturer") as string,
      model: data.get("model") as string,
      caliber: caliberInput,
      compatibleCalibers: null,
      serialNumber: data.get("serialNumber") as string,
      type: data.get("type") as string,
      acquisitionDate: data.get("acquisitionDate") as string,
      purchasePrice: data.get("purchasePrice") ? Number(data.get("purchasePrice")) : null,
      currentValue: data.get("currentValue") ? Number(data.get("currentValue")) : null,
      notes: (data.get("notes") as string) || null,
      imageUrl: imageUrl || null,
      imageSource: imageUrl ? "uploaded" : null,
      lastMaintenanceDate: (data.get("lastMaintenanceDate") as string) || null,
      maintenanceIntervalDays: data.get("maintenanceIntervalDays") ? Number(data.get("maintenanceIntervalDays")) : null,
      initialRoundCount: data.get("initialRoundCount") ? Number(data.get("initialRoundCount")) : null,
    };

    try {
      const res = await fetch("/api/firearms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to create firearm");
        setLoading(false);
        return;
      }

      router.push(`/vault/${json.id}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-vault-border">
        <Link
          href="/vault"
          className="flex items-center gap-1.5 text-vault-text-muted hover:text-vault-text text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vault
        </Link>
        <span className="text-vault-border">/</span>
        <h1 className="text-sm font-semibold text-vault-text tracking-wide uppercase">
          Add Replica
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-vault-text mb-1">New Replica Entry</h2>
          <p className="text-sm text-vault-text-muted">Register a new replica in the vault.</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-[#E53935]/10 border border-[#E53935]/30 rounded-lg px-4 py-3 mb-6">
            <AlertCircle className="w-4 h-4 text-[#E53935] shrink-0" />
            <p className="text-sm text-[#E53935]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity */}
          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#00C2FF] px-1 -ml-1">
              Identity
            </legend>

            <div>
              <label htmlFor="name" className={LABEL_CLASS}>
                Replica Name <span className="text-[#E53935]">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. My Tokyo Marui M4"
                className={INPUT_CLASS}
                onChange={() => setFormErrors(prev => ({ ...prev, name: "" }))}
              />
              {formErrors.name && <p className="text-xs mt-1" style={{ color: "#E53935" }}>{formErrors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="manufacturer" className={LABEL_CLASS}>
                  Manufacturer
                </label>
                <input
                  id="manufacturer"
                  name="manufacturer"
                  type="text"
                  placeholder="e.g. Tokyo Marui"
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="model" className={LABEL_CLASS}>
                  Model
                </label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  placeholder="e.g. M4A1 MWS"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Drive System */}
              <div ref={caliberRef}>
                <label className={LABEL_CLASS}>
                  Drive System <span className="text-[#E53935]">*</span>
                </label>
                <select
                  name="caliber"
                  value={caliberInput}
                  onChange={(e) => {
                    setCaliberInput(e.target.value);
                    setFormErrors(prev => ({ ...prev, caliber: "" }));
                  }}
                  className={INPUT_CLASS}
                >
                  <option value="">Select drive system...</option>
                  {DRIVE_SYSTEMS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {formErrors.caliber && (
                  <p className="text-xs mt-1" style={{ color: "#E53935" }}>
                    {formErrors.caliber}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className={LABEL_CLASS}>
                  Type
                </label>
                <select id="type" name="type" className={INPUT_CLASS}>
                  <option value="">Select type...</option>
                  {FIREARM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {FIREARM_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="serialNumber" className={LABEL_CLASS}>
                Serial Number
              </label>
              <input
                id="serialNumber"
                name="serialNumber"
                type="text"
                placeholder="e.g. ABC123456"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
          </fieldset>

          {/* Acquisition */}
          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#00C2FF] px-1 -ml-1">
              Acquisition
            </legend>

            <div>
              <label htmlFor="acquisitionDate" className={LABEL_CLASS}>
                Date Acquired
              </label>
              <input
                id="acquisitionDate"
                name="acquisitionDate"
                type="date"
                className={INPUT_CLASS}
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="purchasePrice" className={LABEL_CLASS}>
                  Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-text-faint text-sm">€</span>
                  <input
                    id="purchasePrice"
                    name="purchasePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`${INPUT_CLASS} pl-7`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="currentValue" className={LABEL_CLASS}>
                  Current Value
                  <HelpTip text="Estimated current market value." />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-text-faint text-sm">€</span>
                  <input
                    id="currentValue"
                    name="currentValue"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`${INPUT_CLASS} pl-7`}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Prior Use */}
          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#00C2FF] px-1 -ml-1">
              Prior Use
            </legend>
            <div>
              <label htmlFor="initialRoundCount" className={LABEL_CLASS}>
                Existing BB Count
                <HelpTip text="If this replica has already been used, enter the approximate BB count." />
              </label>
              <input
                id="initialRoundCount"
                name="initialRoundCount"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 5000 (leave blank if new)"
                className={INPUT_CLASS}
              />
            </div>
          </fieldset>

          {/* Maintenance */}
          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#00C2FF] px-1 -ml-1">
              Maintenance
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastMaintenanceDate" className={LABEL_CLASS}>Last Maintenance</label>
                <input id="lastMaintenanceDate" name="lastMaintenanceDate" type="date" className={INPUT_CLASS} />
              </div>
              <div>
                <label htmlFor="maintenanceIntervalDays" className={LABEL_CLASS}>
                  Maintenance Interval (days)
                  <HelpTip text="How often this replica should be cleaned and inspected." />
                </label>
                <input id="maintenanceIntervalDays" name="maintenanceIntervalDays" type="number" min="1" step="1" placeholder="e.g. 90" className={INPUT_CLASS} />
              </div>
            </div>
          </fieldset>

          {/* Image */}
          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#00C2FF] px-1 -ml-1">
              Image
            </legend>
            <ImagePicker entityType="firearm" value={imageUrl} onChange={setImageUrl} />
          </fieldset>

          {/* Notes */}
          <fieldset className="bg-vault-surface border border-vault-border rounded-lg p-5 space-y-4">
            <legend className="text-xs font-mono uppercase tracking-widest text-[#00C2FF] px-1 -ml-1">
              Notes
            </legend>
            <div>
              <label htmlFor="notes" className={LABEL_CLASS}>
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Any additional notes about this replica..."
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <Link
              href="/vault"
              className="w-full sm:w-auto text-center px-4 py-2 text-sm text-vault-text-muted hover:text-vault-text border border-vault-border rounded-md hover:border-vault-text-muted/30 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto justify-center flex items-center gap-2 bg-[#00C2FF]/10 border border-[#00C2FF]/30 text-[#00C2FF] hover:bg-[#00C2FF]/20 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {loading ? "Adding..." : "Add to Vault"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}