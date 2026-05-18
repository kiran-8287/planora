# Planora: Premium 2D Interior Layout Generator & Planner

**Planora** is an ultra-premium, interactive 2D Interior Design prototyping SaaS platform built from scratch with React and Node.js. Styled to the professional visual standards of platforms like Planner5D, it utilizes a gorgeous modern **Blue Palette** (`#2563EB`) and features an empty room editor with a rich wood-grain overlay, dynamic metric rulers, a horizontal action pill toolbar, a slide-up property panel, a real-time minimap, and automated coordinate grid snapping.

The state is serialized and persisted to a Node.js Express server which writes layouts directly to local files.

---

## 🚀 One-Command Quick Start

The project is built for **100% portability**. The grading/evaluation team can install all dependencies and start both the frontend and backend using single-line commands in a single directory.

### 1. Install All Dependencies (Frontend, Backend, and Root)
Open your terminal in the project root directory (`roomplanner/`) and run:
```bash
npm install
```
> **How it works:** A custom `postinstall` script in the root `package.json` automatically triggers `npm install` inside both the `backend/` and `frontend/` folders. You do not need to install them individually!

### 2. Start Both Servers Simultaneously
From the project root, run:
```bash
npm start
```
> **How it works:** This runs `concurrently`, spawning:
> - **React Frontend (Vite) Dev Server** on [http://localhost:3000](http://localhost:3000)
> - **Node.js Express Backend API** on [http://localhost:5050](http://localhost:5050)
>
> Vite is configured to transparently proxy all `/api` calls to the Express server to prevent CORS issues.

---

## 📐 Professional UI & Layout System

We have completely overhauled the application to include the following specifications:
1. **Top Navigation Bar (Height: 52px):**
   - **Left:** App logo with blue house icon, bold "Planora" branding, a thin vertical divider, and a clickable inline breadcrumb floor name.
   - **Center:** Premium rounded pill toggle supporting 2D blueprinting and 3D visual mock modes.
   - **Right:** High-end quick-action shortcuts (Camera, Share, Settings, Layout-Grid) followed by a **pulsing dirty indicator** on the Save Layout button and user avatar initials.
2. **Promotional Banner (Height: 36px):**
   - Blue promotional banner offering upgrades to premium elements, dismissible via a close button.
3. **Multi-Room Tab Bar (Height: 40px):**
   - Toggle or spawn new floor divisions dynamically using the "+" add button. Tracks item count per division live.
4. **Left Sidebar Catalog (Width: 300px):**
   - Double tab header separating "Rooms" (preloaded room sizing templates) and "Categories" (furniture blocks).
   - High-fidelity Unsplash cover photography cards with smooth staggered mounting animations (40ms staggering per card).
   - "Saved Layouts" persistence list inside the drawer for continued visual session reloading.
5. **Canvas Dot Grid Background:**
   - Background matching coordinates utilizing a custom dot grid: dots at every 20px, dot size 1px, in cool gray.
6. **Room Box with Wood Floor:**
   - Centered room box displaying wood flooring, dynamic surface area calculations, and custom bounding borders (3px slate unselected, 3px solid blue when active).
7. **Metric Rulers & Scale Indicator:**
   - Ticks printed along the top and left room edges every 100px (= 1m) and minor ticks every 20px. Includes a bottom arrow scale guide.
8. **8-Handle Transformer Box:**
   - Select any item to activate a bounding box containing 8 custom resize handles (4 corners + 4 edge midpoints) supporting absolute spatial constraints, as well as a circular rotation handle snapping to 15° increments.
9. **Horizontal Selection Radial Menu:**
   - Centered horizontal action menu floating above the selected item for View, Flip, Favorite, Rotate, and Delete. Below the item, a "⊕ Duplicate" action pill is anchored.
10. **Slide-Up Properties Bar (Height: 48px):**
    - Selecting any item slides up a panel from the bottom containing inputs for Width, Depth, Height, Angle, and Elevation in cm with 2 decimal places. Values bind live on Enter or Blur events.
11. **Real-time Minimap:**
    - Bottom-left miniature preview card showing miniature scaled replica rects for placed furniture, toggleable via a custom pin button.

---

## 🧠 Handled Edge Cases & Future Enhancements

As part of the **Bonus Challenges**, we identified, documented, and solved crucial engineering edge cases in 2D layout generators:

### 1. Jigsaw Canvas Snapping
* **Problem:** Aligning furniture blocks exactly edge-to-edge can be tedious with pure manual dragging, resulting in overlapping pixels or tiny visual gaps.
* **Handled Solution:** Implemented coordinate and dimension snapping in increments of `20px`. Placed furniture locks edge-to-edge seamlessly like jigsaw puzzle pieces.

### 2. Canvas Boundary Containment (Edge Bleeding)
* **Problem:** Dragging or resizing furniture items outside the visual borders of the empty room, making them unreachable or breaking page layout.
* **Handled Solution:** Coordinates are clamped on every frame during dragging and resizing. The maximum bounds are restricted as:
  - `x = Math.max(0, Math.min(roomWidth - item.width, x))`
  - `y = Math.max(0, Math.min(roomHeight - item.height, y))`

### 3. Z-Index Layering Collisions
* **Problem:** Placed items overlapping and clipping underneath each other without a visual stack order.
* **Handled Solution:** Selecting an item automatically increments its `zIndex` value to sit strictly higher than existing canvas elements.

### 4. Trigonometric Rotation Center
* **Problem:** Standard mathematical rotation (`Math.atan2`) can cause coordinate jumping if rotation is calculated relative to the item's top-left coordinates.
* **Handled Solution:** The rotate trigger computes coordinates relative to the object's center via `.getBoundingClientRect()`, giving natural rotation control that locks in 15° increments.

### 5. Accidental State Resets
* **Problem:** Users spending hours designing a room only to accidentally close the page, reload, or click "Clear Room".
* **Handled Solution:**
  - Implemented an **Undo & Redo History System** using standard serialization states. A deep-copy stack tracks items, letting users revert any mistake.
  - Enabled **continued editing reload mechanism**. Saving does not reset the screen; rather, it updates the backend file, so the user can continue editing and re-save the exact same layout file under the same active session ID.

### 6. Keyboard Hotkeys vs Input Element Focus Collision
* **Problem:** Pressing keys like "Delete" or "Backspace" when renaming the floor name or updating dimensional inputs inside input tags would trigger canvas keydown handlers, deleting the selected item.
* **Handled Solution:** The hotkey event handlers dynamically check `document.activeElement.tagName`. Keydown events are immediately short-circuited if the cursor is focused inside any input or textarea element, preventing accidental destructive mutations.

### 7. Aspect Ratio Sizing on Miniature Room Previews
* **Problem:** Rerendering different room dimensions (e.g. 900x600 vs 600x800) in a fixed-size minimap can cause item markers to stretch, break aspect ratios, or bleed out.
* **Handled Solution:** Constructed responsive aspect-ratio wrappers where the minimap viewport scales automatically using relative width/height ratios, ensuring accurate rendering of elements at any grid dimension.

### 8. Draggable Component Boundary Clamping
* **Problem:** Enabling the user to place the floating Room Switcher or Minimap panel anywhere on screen could lead to users dragging panels completely off-screen, rendering them inaccessible.
* **Handled Solution:** Registered mouse-event listener tracking with boundary checking, clamping coordinates within the exact viewport height and width limits.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Client)
- **Core Library:** React 18
- **Build Engine:** Vite (ultra-fast build and hot reloads)
- **Styling:** Premium Vanilla CSS Custom Properties (Sleek dark theme, Figma-style floating glassmorphic panels, curved inputs, responsive canvas)
- **Icons:** Lucide React (featherlight, crisp modern vectors)

### Backend (Server)
- **Framework:** Node.js + Express
- **Database:** Local File Persistence (`/backend/data/layouts/*.json`). Serializes and writes each layout configuration with precise spatial dimensions and timestamps to individual files.

---
*Developed as a high-fidelity Prototype for the Interior Design Internship Evaluation.*
