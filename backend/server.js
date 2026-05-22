const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS and JSON body parsing
app.use(cors());
// Increase JSON body limit to handle larger layouts
app.use(express.json({ limit: '5mb' }));

// Path to store layouts
const DATA_DIR = path.join(__dirname, 'data');
const LAYOUTS_DIR = path.join(DATA_DIR, 'layouts');

// Ensure directories exist
async function ensureDirectoriesExist() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(LAYOUTS_DIR, { recursive: true });
    console.log('✓ Storage directories initialized successfully:', LAYOUTS_DIR);
  } catch (err) {
    console.error('✗ Failed to initialize storage directories:', err);
  }
}
ensureDirectoriesExist();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// GET /api/layouts - Fetch all saved layouts
app.get('/api/layouts', async (req, res) => {
  try {
    const files = await fs.readdir(LAYOUTS_DIR);
    const layouts = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(LAYOUTS_DIR, file);
        const data = await fs.readFile(filePath, 'utf8');
        try {
          layouts.push(JSON.parse(data));
        } catch (parseErr) {
          console.error(`Error parsing layout file ${file}:`, parseErr);
        }
      }
    }

    // Sort by lastUpdated timestamp desc
    layouts.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    res.json(layouts);
  } catch (err) {
    console.error('Error fetching layouts:', err);
    res.status(500).json({ error: 'Failed to retrieve saved layouts.' });
  }
});

// POST /api/layouts - Save a layout
app.post('/api/layouts', async (req, res) => {
  const { 
    id, 
    name, 
    items, 
    rooms,
    activeRoomId,
    roomWidth, 
    roomHeight, 
    floors,
    activeFloorId,
    roomFloor, 
    gridEnabled, 
    snapToGrid 
  } = req.body;

  // Basic payload validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Layout name is required and must be a non‑empty string.' });
  }
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items must be an array.' });
  }
  if (items.length > 500) {
    return res.status(400).json({ error: 'Layout cannot contain more than 500 items.' });
  }

  // Use a UUID for guaranteed uniqueness (prevents duplicate IDs on rapid saves)
  const layoutId = id || randomUUID();
  const filePath = path.join(LAYOUTS_DIR, `${layoutId}.json`);

  // Optimistic locking check (F-6)
  if (id) {
    try {
      const existingData = await fs.readFile(filePath, 'utf8');
      const existingLayout = JSON.parse(existingData);
      if (existingLayout && existingLayout.lastUpdated) {
        const clientTime = req.body.lastUpdated ? new Date(req.body.lastUpdated).getTime() : 0;
        const serverTime = new Date(existingLayout.lastUpdated).getTime();
        if (clientTime < serverTime) {
          return res.status(409).json({
            error: 'Conflict: This layout has been modified by another session. Please reload.',
            lastUpdated: existingLayout.lastUpdated
          });
        }
      }
    } catch (readErr) {
      if (readErr.code !== 'ENOENT') {
        console.error('Error checking existing layout:', readErr);
      }
    }
  }

  // Create layout object
  const newLayout = {
    id: layoutId,
    name,
    items: items || [],
    rooms: rooms || [],
    activeRoomId: activeRoomId || null,
    roomWidth: roomWidth || 800,
    roomHeight: roomHeight || 600,
    floors: floors || [],
    activeFloorId: activeFloorId || null,
    roomFloor: roomFloor || 'wood',
    gridEnabled: gridEnabled !== undefined ? gridEnabled : true,
    snapToGrid: snapToGrid !== undefined ? snapToGrid : false,
    lastUpdated: new Date().toISOString()
  };

  try {
    await fs.writeFile(filePath, JSON.stringify(newLayout, null, 2), 'utf8');
    console.log(`✓ Saved layout "${name}" (${layoutId}) successfully.`);
    res.json({ message: 'Layout saved successfully!', layout: newLayout });
  } catch (err) {
    console.error(`Error saving layout ${layoutId}:`, err);
    res.status(500).json({ error: 'Failed to save layout.' });
  }
});

// DELETE /api/layouts/:id - Delete a layout
app.delete('/api/layouts/:id', async (req, res) => {
  const layoutId = req.params.id;
  const filePath = path.join(LAYOUTS_DIR, `${layoutId}.json`);

  try {
    await fs.unlink(filePath);
    console.log(`✓ Deleted layout ${layoutId}`);
    res.json({ message: 'Layout deleted successfully.', id: layoutId });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`✓ Layout ${layoutId} was already deleted or did not exist.`);
      return res.json({ message: 'Layout deleted successfully.', id: layoutId });
    }
    console.error(`Error deleting layout ${layoutId}:`, err);
    res.status(500).json({ error: 'Failed to delete layout.' });
  }
});

// Start backend
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  2D ROOM PLANNER BACKEND IS RUNNING ON PORT ${PORT}`);
  console.log(`  API Health check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});
