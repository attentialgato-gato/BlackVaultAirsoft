# AirsoftVault

A self-hosted, local-only web app for tracking airsoft replicas, accessories, BB stocks and game sessions. All data stays on your machine.

> 🎯 **This is an airsoft fork of [BlackVault](https://github.com/theaveragedeveloper/BlackVaultArmory)** by theaveragedeveloper.
> All credits for the original project go to the original author.

---

## Airsoft-specific features (vs original BlackVault)

- **Replicas** instead of firearms — with Drive System (AEG, GBB, HPA, Spring, CO2...)
- **BB stock management** — by weight (0.20g, 0.25g, 0.28g, 0.30g, 0.32g, 0.36g, 0.40g)
- **BB types** — Bio, Non-Bio, Tracer Bio, Tracer Non-Bio
- **BB color** tracking
- **Bag-based inventory** — stock tracked in bags (e.g. 5 bags × 4000 BBs)
- **Low stock alert in bags** — alert when bags fall below a set number
- **€ currency** instead of $
- Range/drill section hidden (not relevant for airsoft)
- Compatible Calibers field removed

---

## Features

- Replica and accessory tracking
- Loadout configurations
- Document uploads
- BB stock levels and usage tracking
- Maintenance log
- Global search
- CSV and PDF export
- Dashboard
- Mobile access via local network

---

## Before You Start

**The only thing you need to install is Docker Desktop.** It's free.

| Platform | Download Link |
|----------|--------------|
| 🪟 Windows | [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/) |
| 🍎 Mac | [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/) |
| 🐧 Linux | [Docker Engine install guide](https://docs.docker.com/engine/install/) |

After installing, **open Docker Desktop and wait for it to fully load** before continuing.

---

## Installation — Windows 🪟

### Step 1 — Download AirsoftVault

Go to the [AirsoftVault GitHub page](https://github.com/attentialgato-gato/BlackVaultAirsoft), click **Code → Download ZIP**, and save it somewhere you'll find it (e.g. your Desktop).

### Step 2 — Extract the ZIP

Right-click the downloaded ZIP and choose **Extract All**.

### Step 3 — Run the installer

Open the extracted folder and **double-click `install.bat`**.

The installer will ask two questions — press **Enter** to accept the defaults:
- Where to store your data → press Enter
- Which port to use → press Enter

**This can take 5–10 minutes the first time.**

### Step 4 — Open AirsoftVault
http://localhost:3000

✅ **AirsoftVault is running.**

---

## Installation — Mac 🍎
```bash
git clone https://github.com/attentialgato-gato/BlackVaultAirsoft.git
cd BlackVaultAirsoft
chmod +x install.sh && ./install.sh
```
http://localhost:3000

✅ **AirsoftVault is running.**

---

## Installation — Linux 🐧
```bash
git clone https://github.com/attentialgato-gato/BlackVaultAirsoft.git
cd BlackVaultAirsoft
chmod +x install.sh && ./install.sh
```
http://localhost:3000

✅ **AirsoftVault is running.**

---

## Stopping and Starting

**To stop:**
```bash
docker compose down
```

**To start again:**
```bash
docker compose up -d
```

**To update to the latest version:**

Windows — double-click `update.bat`

Mac / Linux:
```bash
./update.sh
```

---

## BB Stock Management

AirsoftVault tracks BBs by **weight group** (e.g. 0.25g) and within each group by **brand and type**.

When adding a new BB stock you enter:
- **BB Weight** — 0.20g to 0.40g
- **Brand** — BLS, Geoffs, G&G, Valken...
- **Type** — Bio, Non-Bio, Tracer Bio, Tracer Non-Bio
- **Color** — White, Green, Black...
- **Number of bags** + **BBs per bag** → total calculated automatically
- **Low stock alert** in number of bags

---

## Mobile Access (Same Network)

1. Open AirsoftVault and go to **Settings**
2. The Settings page will display a QR code with your local IP
3. Scan with your phone

---

## Data & Backups

### Where your data lives
data/
├── db/
│   └── vault.db        ← your database
└── uploads/
└── ...             ← uploaded images and documents

### Backing up

**Mac / Linux:**
```bash
cp -r ./data ~/airsoftvault-backup-$(date +%Y%m%d)
```

**Windows:** Copy the `data` folder to another location in File Explorer.

---

## Syncing with upstream BlackVault

This fork tracks the original BlackVault project. To merge new upstream updates:
```bash
git fetch upstream
git merge upstream/V1.2
# resolve any conflicts
git push origin V1-pub-release
```

---

## Notes

- All data is stored locally — nothing leaves your network
- No cloud connection required
- No login or authentication
- Intended for private, local use only

---

## Credits

Original project: [BlackVault](https://github.com/theaveragedeveloper/BlackVaultArmory) by [theaveragedeveloper](https://github.com/theaveragedeveloper)

---

## License

MIT License. See [LICENSE](LICENSE) for details.