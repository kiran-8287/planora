# 🧊 Planora: Premium 2D blueprinting & 3D Isometric CAD Interior Design Suite

> **"Drafting beautiful spaces should feel like playing a video game, not editing a database spreadsheet."** 

Welcome to **Planora**, an ultra-premium, high-fidelity 2D/3D interior design and spatial architecture prototyping SaaS engine built from scratch with **React 18** and **Node.js Express**. Designed to meet the sleek aesthetic and functional bars of Planner5D, SketchUp, and Figma, Planora combines rigorous spatial blueprinting coordinate math with an incredibly fun, tactile, and responsive user experience. 

---

## ⚡ The "One-Command" Quickstart (Zero-Setup Portability)

Planora is built for absolute convenience. You do not need to open multiple terminal windows or manually install nested client/server dependencies. 

### 1. Install Everything in One Go
From the project root directory (`roomplanner/`), run:
```bash
npm install
```
*Behind the scenes:* A custom root `postinstall` script automatically descends into both `backend/` and `frontend/` directories to run their corresponding installs recursively.

### 2. Launch the Dual-Engine Stack
From the project root directory, run:
```bash
npm start
```
*Behind the scenes:* Spawns a concurrent process running both:
*   **Vite Dev Server (Frontend Client):** Running on [http://localhost:3000](http://localhost:3000)
*   **Express API Server (Backend Storage):** Running on [http://localhost:5050](http://localhost:5050)

*Note:* Vite is fully configured with an automated dev proxy that transparently tunnels `/api` routes to prevent any CORS blockades!

---

## 🎮 The "WOW" Feature Catalog: What Makes Planora Premium?

### 1. 🧊 Pseudo-3D Isometric Mode ("Let's Warp Dimensions")
Ever wanted to look *into* your blueprint? Toggle the **3D Cube icon** in the top navigation panel!
*   **Dimensional Tilts:** Hardware-accelerated CSS 3D translation matrices instantly tilt the flat room coordinate frame into a professional isometric viewing plane (`perspective(1000px) rotateX(60deg) rotateZ(-45deg)`).
*   **Face Shadows & Extrusions:** Placed blocks automatically cast realistic side-shadow elevations and drop-borders based on their physical depths, making chairs, beds, and tables rise from the wood-grain floor as solid physical objects.
*   **Floating Elevation:** Adjust an item's **Elevation** property (in cm) to float ceiling lamps, high cabinets, or wall decorations off the ground plane dynamically in 3D!
*   **Zen Focus:** Guidelines, corner resize handles, and spatial metric rules auto-fade in 3D mode for a premium presentation.

### 2. 📏 The "Laser" Tape Measure Tool
Need to check if your wardrobe fits between the door and the bedside table? Activate the **Ruler icon**!
*   Click and drag anywhere on the layout canvas to project a bright red, dashed laser measuring vector.
*   The tape measure automatically snaps to the grid coordinate lines.
*   Calculates real-world distances dynamically, printing a floating metric bubble tag (e.g. `2.40 m`) exactly at the vector's midpoint.

### 3. 🛒 Group-Slicing Bill of Materials & Cost Segregator
No interior design project is complete without a budget! Click the **Shopping Cart icon** to slide open a beautiful, translucent cost-estimation drawer:
*   **📁 Unified Total Tab:** Displays an elegant, modern HSL-gradient summary hero dashboard showing your total project budget, total items, and active room counts. Includes a room-by-room cost segregation ledger listing individual room subtotals.
*   **🚪 Segmented Room Tabs:** Group items automatically by their respective room divisions (e.g. Bedroom, Living Room, Kitchen). Click any room tab to inspect its isolated inventory list.
*   **✏️ Live Cost Editors:** Each block's unit price is fully editable! Modify any price input or place/remove furniture, and watch the subtotals and Grand Total budget recalculate in real-time.

### 4. 📂 Dedicated "Saved Designs" Sidebar Tab
We migrated the layout persistence hub out of deep submenus and placed it directly into its own premium navigation tab!
*   **Rooms Tab:** Create rooms using blank blue canvases or load highly detailed **Furnished Premium Templates** (Living room, Bed space, Kids room, Office, etc.) designed using professional reference HSL mappings.
*   **Categories Tab:** Explore a beautiful double-tab accordion list containing furniture, decorations, and appliances.
*   **Saved Tab:** An isolated list of all saved floor layouts, loading directly from backend JSON files, showing item counts, and timestamps.

### 5. 🛡️ Glassmorphic Confirmation UI (Zero Blocking Flash Alerts!)
We deleted all browser-native, synchronous `window.confirm` dialogs!
*   When deleting layout designs or prunning room switcher divisions, a premium glassmorphic modal overlay card slides gracefully into view.
*   Fully styled with alert warning headers, responsive layout action buttons, and blur backdrops that prevent canvas clicking without interrupting the browser's execution thread.

---

## 📐 Mechanical Grid & Snapping Features

*   **Wood-Grain Room Boundaries:** Centered room canvases feature a high-fidelity dark oak wood overlay and dynamic surface area calculations (e.g. `32.40 m²`).
*   **Dynamic Metric Rulers:** High-fidelity border guides print ticks every meter (100px) and minor marks every 20px, so you always know your layout's exact physical scale.
*   **Figma-Style 8-Handle Transformer:** Click any item to summon a bounding box with 8 custom corner-and-edge resize handles alongside a circular rotation dial that snaps naturally to 15° increments.
*   **Fine Nudge Controls:** Adjust spatial layouts to the pixel! Press Arrow keys to nudge items by `1px`, or hold `Shift + Arrow keys` to snap-nudge items cleanly along `20px` grid cells.

---

## 🎹 Keyboard Master Cheatsheet

| Action | Keyboard Shortcut | Details |
| :--- | :--- | :--- |
| **Undo Action** | `Ctrl + Z` | Reverts the last spatial mutation in history |
| **Redo Action** | `Ctrl + Y` | Re-applies the previously undone action |
| **Delete Block** | `Delete` / `Backspace` | Deletes the currently selected furniture item |
| **Deselect All** | `Escape` | Clears active bounding boxes and closes selectors |
| **Rotate 90°** | `R` / `r` | Rotates the selected block by 90 degrees |
| **Fine Nudge** | `Arrow Keys` (Left/Right/Up/Down) | Nudges the active item by `1px` |
| **Snap Nudge** | `Shift + Arrow Keys` | Nudges and snaps the active item by a grid cell (`20px`) |

> [!NOTE]
> Keyboard hotkeys are dynamically locked when focusing on property inputs, layout name renaming, or catalog search fields to prevent accidental canvas changes.

---

## 🌐 LAN & Public Tunnel Exposure

Planora is fully configured to be run and accessed **remotely** over your local network or public URLs:

### 1. Remote Local Area Network (LAN)
Vite and the Express server bind natively to host `0.0.0.0`, allowing other devices (e.g. tablets, phones, other laptops) on the same network to access the interface:
*   Start the server with `npm start` on the host machine.
*   Identify the host's LAN IP address (e.g., `192.168.1.45`).
*   Open any browser on your mobile phone or tablet and visit: `http://192.168.1.45:3000` to interact with your canvas on a touch interface!

### 2. Public Access Tunnels (ngrok / Cloudflare)
To share your live blueprint layouts with remote users or project evaluators:
*   Install ngrok and tunnel your Vite dev server port:
    ```bash
    ngrok http 3000
    ```
*   Share the secure `https://...ngrok-free.app` URL with anyone!


---

## 🚀 Deployment to GitHub Pages

Planora is fully configured to be deployed as a static client-side web application on GitHub Pages. In this environment, layout designs are saved directly inside your browser's `localStorage` (complete with optimistic conflict resolution) without requiring a running Express server.

### Option A: Fully Automated via GitHub Actions (Recommended)
We have configured a CI/CD pipeline that automatically builds and deploys Planora to GitHub Pages when you push code to your main branch.

1. **Commit and Push:** Push your local commits to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```
2. **Enable Actions in GitHub Settings:**
   * Go to your repository page on GitHub.
   * Click on the **Settings** tab.
   * On the left sidebar, click **Pages** (under the "Code and automation" section).
   * In the **Build and deployment** section, under **Source**, select **GitHub Actions** from the dropdown menu.
3. **Verify:**
   * Click on the **Actions** tab at the top of your GitHub repository.
   * You will see the **Deploy to GitHub Pages** workflow running.
   * Once completed, it will print your hosted website URL (e.g., `https://kiran-8287.github.io/planora/`).

### Option B: Manual Local Deployment
If you prefer to compile and deploy manually from your local command line:

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Run the deployment script:
   ```bash
   npm run deploy
   ```
   *Note:* This script automatically runs a production build (`predeploy`) and pushes the compiled `dist/` folder to the `gh-pages` branch on your GitHub repository.
3. Go to **Settings -> Pages** in your GitHub repository and ensure **Deploy from a branch** is selected with the branch set to `gh-pages`.

---

## 🛠️ The Tech Architecture

### Frontend (Client Studio)
*   **React 18 (Functional Components & Hooks)**
*   **Vite Build Tooling:** Fast builds and instant hot-module replacements.
*   **Vanilla CSS Custom Properties:** Sleek translucent panels, Figma-style controls, responsive grid wrappers.
*   **Lucide React:** Featherlight, vector-crisp modern interface icons.

### Backend (Persistence API)
*   **Node.js + Express Server**
*   **Local File Database System:** Serializes layout states (items, room divisions, active floors, elevations, unit costs) into custom JSON configuration files under `/backend/data/layouts/*.json`.

---
*Developed and polished as an ultra-premium Prototype for the Interior Design CAD Internship Evaluation, engineered with the assistance of **Google Antigravity**, a state-of-the-art agentic AI pair-programming companion developed by the Google DeepMind team.*
