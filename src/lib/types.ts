// ─── Firearm Types ─────────────────────────────────────────────
export const FIREARM_TYPES = [
  "PISTOL",
  "RIFLE",
  "SHOTGUN",
  "SMG",
  "PCC",
  "REVOLVER",
  "BOLT_ACTION",
  "LEVER_ACTION",
] as const;

export type FirearmType = (typeof FIREARM_TYPES)[number];

export const FIREARM_TYPE_LABELS: Record<FirearmType, string> = {
  PISTOL: "Pistol",
  RIFLE: "Rifle",
  SHOTGUN: "Shotgun",
  SMG: "SMG",
  PCC: "PCC",
  REVOLVER: "Revolver",
  BOLT_ACTION: "Bolt Action",
  LEVER_ACTION: "Lever Action",
};

// ─── Slot Types ────────────────────────────────────────────────
export const SLOT_TYPES = [
  "MUZZLE",
  "BARREL",
  "HANDGUARD",
  "STOCK",
  "BUFFER_TUBE",
  "GRIP",
  "OPTIC",
  "OPTIC_MOUNT",
  "UNDERBARREL",
  "MAGAZINE",
  "LIGHT",
  "LASER",
  "CHARGING_HANDLE",
  "TRIGGER",
  "LOWER_RECEIVER",
  "UPPER_RECEIVER",
  "SLIDE",
  "FRAME",
  "SUPPRESSOR",
  "BIPOD",
  "SLING",
  "COMPENSATOR",
] as const;

export type SlotType = (typeof SLOT_TYPES)[number];

export const SLOT_TYPE_LABELS: Record<SlotType, string> = {
  MUZZLE: "Muzzle",
  BARREL: "Barrel",
  HANDGUARD: "Handguard",
  STOCK: "Stock",
  BUFFER_TUBE: "Buffer Tube",
  GRIP: "Grip",
  OPTIC: "Optic",
  OPTIC_MOUNT: "Optic Mount",
  UNDERBARREL: "Underbarrel",
  MAGAZINE: "Magazine",
  LIGHT: "Light",
  LASER: "Laser",
  CHARGING_HANDLE: "Charging Handle",
  TRIGGER: "Trigger",
  LOWER_RECEIVER: "Lower Receiver",
  UPPER_RECEIVER: "Upper Receiver",
  SLIDE: "Slide",
  FRAME: "Frame",
  SUPPRESSOR: "Suppressor",
  BIPOD: "Bipod",
  SLING: "Sling",
  COMPENSATOR: "Compensator",
};

export const CUSTOM_SLOT_PREFIX = "CUSTOM:";

// Which slots are available per firearm type
export const SLOTS_BY_FIREARM_TYPE: Record<FirearmType, SlotType[]> = {
  RIFLE: [
    "MUZZLE",
    "BARREL",
    "HANDGUARD",
    "STOCK",
    "BUFFER_TUBE",
    "GRIP",
    "OPTIC",
    "OPTIC_MOUNT",
    "UNDERBARREL",
    "MAGAZINE",
    "LIGHT",
    "LASER",
    "CHARGING_HANDLE",
    "TRIGGER",
    "LOWER_RECEIVER",
    "UPPER_RECEIVER",
    "SUPPRESSOR",
    "BIPOD",
    "SLING",
    "COMPENSATOR",
  ],
  PISTOL: [
    "MUZZLE",
    "BARREL",
    "SLIDE",
    "FRAME",
    "GRIP",
    "OPTIC",
    "OPTIC_MOUNT",
    "MAGAZINE",
    "LIGHT",
    "LASER",
    "TRIGGER",
    "SUPPRESSOR",
    "COMPENSATOR",
  ],
  SHOTGUN: [
    "MUZZLE",
    "BARREL",
    "STOCK",
    "GRIP",
    "OPTIC",
    "OPTIC_MOUNT",
    "UNDERBARREL",
    "MAGAZINE",
    "LIGHT",
    "LASER",
    "TRIGGER",
    "SLING",
    "COMPENSATOR",
  ],
  SMG: [
    "MUZZLE",
    "BARREL",
    "HANDGUARD",
    "STOCK",
    "GRIP",
    "OPTIC",
    "OPTIC_MOUNT",
    "UNDERBARREL",
    "MAGAZINE",
    "LIGHT",
    "LASER",
    "CHARGING_HANDLE",
    "TRIGGER",
    "SUPPRESSOR",
    "SLING",
    "COMPENSATOR",
  ],
  PCC: [
    "MUZZLE",
    "BARREL",
    "HANDGUARD",
    "STOCK",
    "BUFFER_TUBE",
    "GRIP",
    "OPTIC",
    "OPTIC_MOUNT",
    "UNDERBARREL",
    "MAGAZINE",
    "LIGHT",
    "LASER",
    "CHARGING_HANDLE",
    "TRIGGER",
    "SUPPRESSOR",
    "SLING",
    "COMPENSATOR",
  ],
  REVOLVER: [
    "BARREL",
    "GRIP",
    "OPTIC",
    "OPTIC_MOUNT",
    "TRIGGER",
    "COMPENSATOR",
  ],
  BOLT_ACTION: [
    "MUZZLE",
    "BARREL",
    "STOCK",
    "GRIP",
    "OPTIC",
    "OPTIC_MOUNT",
    "MAGAZINE",
    "TRIGGER",
    "BIPOD",
    "SLING",
    "SUPPRESSOR",
  ],
  LEVER_ACTION: [
    "MUZZLE",
    "BARREL",
    "STOCK",
    "GRIP",
    "OPTIC",
    "OPTIC_MOUNT",
    "TRIGGER",
    "SLING",
  ],
};

export const SUGGESTED_SLOTS_BY_FIREARM_TYPE: Record<FirearmType, SlotType[]> = {
  RIFLE:        ["OPTIC", "BARREL", "MUZZLE", "STOCK", "HANDGUARD", "TRIGGER", "GRIP"],
  PISTOL:       ["OPTIC", "BARREL", "SLIDE", "TRIGGER", "LIGHT", "LASER"],
  BOLT_ACTION:  ["OPTIC", "OPTIC_MOUNT", "BARREL", "STOCK", "BIPOD", "SUPPRESSOR"],
  SHOTGUN:      ["OPTIC", "BARREL", "STOCK", "LIGHT", "SLING"],
  SMG:          ["OPTIC", "BARREL", "STOCK", "LIGHT", "SUPPRESSOR", "GRIP"],
  PCC:          ["OPTIC", "BARREL", "MUZZLE", "STOCK", "HANDGUARD", "TRIGGER"],
  REVOLVER:     ["OPTIC", "BARREL", "GRIP", "COMPENSATOR"],
  LEVER_ACTION: ["OPTIC", "BARREL", "STOCK", "SLING"],
};

// ─── Ammo Transaction Types ────────────────────────────────────
export const TRANSACTION_TYPES = [
  "PURCHASE",
  "RANGE_USE",
  "TRANSFER_OUT",
  "INVENTORY_CORRECTION",
  "EXPENDED",
] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  PURCHASE: "Purchase",
  RANGE_USE: "Range Use",
  TRANSFER_OUT: "Transfer Out",
  INVENTORY_CORRECTION: "Inventory Correction",
  EXPENDED: "Expended",
};

// ─── Common Calibers ──────────────────────────────────────────
// ─── Common Calibers (BB Weights for Airsoft) ─────────────────
export const COMMON_CALIBERS = [
  "0.12g",
  "0.20g",
  "0.23g",
  "0.25g",
  "0.28g",
  "0.30g",
  "0.32g",
  "0.36g",
  "0.40g",
];

export const BULLET_TYPES = [
  "Non-Bio",
  "Bio",
  "Tracer Non-Bio",
  "Tracer Bio",
  "Other",
] as const;

// ─── AIRSOFT FORK: Drive Systems ──────────────────────────────
export const DRIVE_SYSTEMS = [
  "AEG",
  "AEP",
  "GBB",
  "HPA",
  "Spring",
  "CO2",
] as const;


export type BulletType = (typeof BULLET_TYPES)[number];
