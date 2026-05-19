import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Home, ChevronRight, Undo2, Redo2, Camera, Share2, Settings, 
  LayoutGrid, MoreVertical, Search, ArrowLeft, Maximize2, X, 
  Eye, Heart, Trash2, RotateCw, PlusCircle, HelpCircle, 
  ExternalLink, Locate, Plus, Minus, MapPin, Sparkles, CheckCircle2,
  Copy, Download, Printer, ChevronDown, Palette, SlidersHorizontal,
  FileDown, Link2, RefreshCw, Shuffle, Box, Ruler, ShoppingCart
} from 'lucide-react';

const GRID_SIZE = 20;

// High quality Unsplash images for rooms and categories
const ROOM_TEMPLATES = [
  { name: 'Living Room', type: 'living', w: 900, h: 600, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&q=80' },
  { name: 'Kitchen', type: 'kitchen', w: 800, h: 540, img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=260&q=80' },
  { name: 'Bedroom', type: 'bedroom', w: 800, h: 600, img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=260&q=80' },
  { name: 'Kids Room', type: 'kids', w: 700, h: 500, img: 'https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/1-2025-1736068988-NDPD1/ond-1759736307-rv9SV/kbr-1759750566-lYFZd/kb-4-1761578991-mRe1e.jpg' },
  { name: 'Bathroom', type: 'bathroom', w: 600, h: 480, img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=260&q=80' },
  { name: 'Dining Room', type: 'dining', w: 800, h: 540, img: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=260&q=80' }
];

const FURNISH_CATEGORIES = [
  { id: 'armchairs', name: 'Armchairs', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" /><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" /><path d="M6 18v2M18 18v2" /></svg> },
  { id: 'sofas', name: 'Sofas', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" /><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5" /><path d="M2 11h20M6 18v2M18 18v2" /></svg> },
  { id: 'ottoman', name: 'Ottoman', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="10" rx="2" /><path d="M6 16v3M18 16v3" /></svg> },
  { id: 'beds', name: 'Beds', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16M22 4v16M2 8h20M2 14h20" /></svg> },
  { id: 'storage', name: 'Storage', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 12h18M12 3v18" /></svg> },
  { id: 'tables_chairs', name: 'Tables, chairs', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18M6 8l-3 4 3 4M18 8l3 4-3 4" /></svg> },
  { id: 'office', name: 'Office furniture', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="12" rx="2" /><path d="M4 10h16M9 16v4M15 16v4" /></svg> },
  { id: 'kids', name: 'Children\'s furniture', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v16M20 4v16M4 14h16M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg> },
  { id: 'kitchen', name: 'Kitchen', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M3 9h18M15 9v12" /></svg> },
  { id: 'bathroom', name: 'Bathroom', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12a10 10 0 0 0 20 0M12 2v10" /></svg> },
  { id: 'public', name: 'Furniture for public spaces', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2" /><path d="M12 7v11M9 18h6" /></svg> }
];

const ELECTRICAL_CATEGORIES = [
  { id: 'lighting', name: 'Lighting', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6M10 22h4" /></svg> },
  { id: 'appliances', name: 'Household appliances', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="14" r="4" /><path d="M12 12v4M12 6h.01" /></svg> },
  { id: 'kitchen_appliances', name: 'Kitchen appliances', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="7" cy="12" r="2" /><circle cx="17" cy="12" r="2" /></svg> },
  { id: 'audio_video', name: 'Audio, video and TV', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" /><path d="M17 2H7a2 2 0 0 0-2 2v3h14V4a2 2 0 0 0-2-2Z" /></svg> },
  { id: 'climate', name: 'Climate', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg> }
];

const MISC_CATEGORIES = [
  { id: 'decor', name: 'Decor', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg> },
  { id: 'curtains', name: 'Curtains, blinds', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12M15 9v12" /></svg> },
  { id: 'rugs', name: 'Rugs', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><path d="M7 6v12M17 6v12" /></svg> },
  { id: 'kitchenware', name: 'Kitchenware', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><path d="M6 2v2M10 2v2M14 2v2" /></svg> },
  { id: 'fireplaces', name: 'Fireplaces', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg> },
  { id: 'plants', name: 'Plants', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 22h10M12 22V12M12 8a4 4 0 0 1 4-4M12 8a4 4 0 0 0-4-4" /></svg> },
  { id: 'people', name: 'People', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M5 22v-3a7 7 0 0 1 14 0v3" /></svg> },
  { id: 'sport', name: 'Sport', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11M6.5 17.5l11-11M3 21h18" /></svg> },
  { id: 'holidays', name: 'Holidays', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.886h6.186L12 3Z" /><path d="M12 19v3" /></svg> },
  { id: 'pets', name: 'Pets', icon: (color) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" /></svg> }
];

const PREMIUM_ROOM_LAYOUTS = {
  living: [
    { type: 'sofa', name: 'Luxury Sofa', emoji: '🛋', width: 180, height: 90, depth: 90, elevation: 0, x: 360, y: 140, rotation: 0, color: '#2563EB' },
    { type: 'coffee_table', name: 'Round Coffee Table', emoji: '☕', width: 90, height: 90, depth: 90, elevation: 0, x: 405, y: 270, rotation: 0, color: '#FFFFFF' },
    { type: 'armchair', name: 'Lounge Armchair', emoji: '🪑', width: 90, height: 90, depth: 90, elevation: 0, x: 220, y: 270, rotation: 90, color: '#FED7AA' },
    { type: 'chair', name: 'Egg Accent Chair', emoji: '🪑', width: 85, height: 85, depth: 85, elevation: 0, x: 600, y: 270, rotation: 270, color: '#A7F3D0' },
    { type: 'tv_console', name: 'TV Cabinet Console', emoji: '📺', width: 180, height: 50, depth: 50, elevation: 0, x: 360, y: 480, rotation: 0, color: '#1E293B' },
    { type: 'floor_plant', name: 'Monstera Floor Plant', emoji: '🪴', width: 60, height: 60, depth: 60, elevation: 0, x: 80, y: 80, rotation: 0, color: '#16A34A' },
    { type: 'floor_lamp', name: 'Floor Lamp', emoji: '💡', width: 60, height: 60, depth: 60, elevation: 0, x: 760, y: 80, rotation: 0, color: '#FDE68A' },
    { type: 'circular_rug', name: 'Circular Velvet Rug', emoji: '⭕', width: 160, height: 160, depth: 160, elevation: 0, x: 370, y: 240, rotation: 0, color: '#DDD6FE' },
    { type: 'window_curtain', name: 'Elegant Window Drapes', emoji: '🪟', width: 120, height: 12, depth: 12, elevation: 0, x: 390, y: 0, rotation: 0, color: '#FFFFFF' }
  ],
  bedroom: [
    { type: 'bed', name: 'King-Size Bed', emoji: '🛏', width: 200, height: 180, depth: 180, elevation: 0, x: 300, y: 80, rotation: 0, color: '#BFDBFE' },
    { type: 'nightstand', name: 'Oak Nightstand', emoji: '🗄', width: 60, height: 50, depth: 50, elevation: 0, x: 220, y: 80, rotation: 0, color: '#D7B58B' },
    { type: 'nightstand', name: 'Oak Nightstand', emoji: '🗄', width: 60, height: 50, depth: 50, elevation: 0, x: 520, y: 80, rotation: 0, color: '#D7B58B' },
    { type: 'reading_lamp', name: 'Reading Lamp', emoji: '💡', width: 50, height: 50, depth: 50, elevation: 0, x: 225, y: 80, rotation: 0, color: '#FDE68A' },
    { type: 'reading_lamp', name: 'Reading Lamp', emoji: '💡', width: 50, height: 50, depth: 50, elevation: 0, x: 525, y: 80, rotation: 0, color: '#FDE68A' },
    { type: 'wardrobe', name: 'Sliding Wardrobe', emoji: '🚪', width: 160, height: 60, depth: 60, elevation: 0, x: 80, y: 200, rotation: 90, color: '#8B5A2B' },
    { type: 'dresser', name: 'Vanity Dresser', emoji: '🪞', width: 100, height: 50, depth: 50, elevation: 0, x: 620, y: 200, rotation: 270, color: '#D7B58B' },
    { type: 'circular_rug', name: 'Cozy Sheepskin Rug', emoji: '🐑', width: 110, height: 80, depth: 80, elevation: 0, x: 345, y: 280, rotation: 0, color: '#FFFFFF' },
    { type: 'floor_plant', name: 'Monstera Floor Plant', emoji: '🪴', width: 60, height: 60, depth: 60, elevation: 0, x: 640, y: 460, rotation: 0, color: '#16A34A' },
    { type: 'armchair', name: 'Velvet Recliner', emoji: '🪑', width: 95, height: 95, depth: 95, elevation: 0, x: 100, y: 420, rotation: 45, color: '#FED7AA' }
  ],
  kitchen: [
    { type: 'island', name: 'Kitchen Island', emoji: '🍳', width: 200, height: 100, depth: 100, elevation: 0, x: 300, y: 260, rotation: 0, color: '#FFFFFF' },
    { type: 'stool', name: 'Bar Stool', emoji: '🪑', width: 50, height: 50, depth: 50, elevation: 0, x: 340, y: 380, rotation: 0, color: '#1E293B' },
    { type: 'stool', name: 'Bar Stool', emoji: '🪑', width: 50, height: 50, depth: 50, elevation: 0, x: 410, y: 380, rotation: 0, color: '#1E293B' },
    { type: 'counter', name: 'Kitchen Counter', emoji: '🍳', width: 160, height: 60, depth: 60, elevation: 0, x: 120, y: 80, rotation: 0, color: '#D7B58B' },
    { type: 'sink', name: 'Sink Unit', emoji: '𚰰', width: 100, height: 60, depth: 60, elevation: 0, x: 280, y: 80, rotation: 0, color: '#BFDBFE' },
    { type: 'fridge', name: 'Oven & Hob', emoji: '🔥', width: 75, height: 75, depth: 75, elevation: 0, x: 380, y: 80, rotation: 0, color: '#DC2626' },
    { type: 'fridge', name: 'Refrigerator', emoji: '🧊', width: 85, height: 80, depth: 80, elevation: 0, x: 600, y: 80, rotation: 0, color: '#FFFFFF' },
    { type: 'wardrobe', name: 'Pantry Cabinet', emoji: '🥫', width: 90, height: 60, depth: 60, elevation: 0, x: 600, y: 200, rotation: 270, color: '#8B5A2B' },
    { type: 'floor_plant', name: 'Monstera Floor Plant', emoji: '🪴', width: 60, height: 60, depth: 60, elevation: 0, x: 80, y: 380, rotation: 0, color: '#16A34A' }
  ],
  kids: [
    { type: 'kids_bed', name: 'Kids Bunk Bed', emoji: '𛲏', width: 160, height: 95, depth: 95, elevation: 0, x: 80, y: 60, rotation: 0, color: '#A7F3D0' },
    { type: 'play_desk', name: 'Kids Play Desk', emoji: '💻', width: 100, height: 55, depth: 55, elevation: 0, x: 420, y: 60, rotation: 0, color: '#FDE68A' },
    { type: 'little_chair', name: 'Little Chair', emoji: '𛲑', width: 50, height: 50, depth: 50, elevation: 0, x: 445, y: 130, rotation: 180, color: '#FED7AA' },
    { type: 'toy_cabinet', name: 'Toy Cabinet', emoji: '𗚄', width: 90, height: 45, depth: 45, elevation: 0, x: 520, y: 220, rotation: 270, color: '#FBCFE8' },
    { type: 'circular_rug', name: 'Circular Velvet Rug', emoji: '⭕', width: 160, height: 160, depth: 160, elevation: 0, x: 240, y: 220, rotation: 0, color: '#DDD6FE' },
    { type: 'ottoman', name: 'Round Knit Pouf', emoji: '🧶', width: 55, height: 55, depth: 55, elevation: 0, x: 140, y: 320, rotation: 0, color: '#FED7AA' },
    { type: 'circular_rug', name: 'Cozy Sheepskin Rug', emoji: '🐑', width: 110, height: 80, depth: 80, elevation: 0, x: 105, y: 180, rotation: 0, color: '#FFFFFF' },
    { type: 'floor_plant', name: 'Monstera Floor Plant', emoji: '🪴', width: 60, height: 60, depth: 60, elevation: 0, x: 80, y: 380, rotation: 0, color: '#16A34A' }
  ],
  bathroom: [
    { type: 'tub', name: 'Freestanding Tub', emoji: '🛁', width: 170, height: 80, depth: 80, elevation: 0, x: 60, y: 60, rotation: 0, color: '#BFDBFE' },
    { type: 'shower', name: 'Shower Cabin', emoji: '🚿', width: 100, height: 100, depth: 100, elevation: 0, x: 440, y: 60, rotation: 0, color: '#FFFFFF' },
    { type: 'sink', name: 'Double Sink', emoji: '𚰰', width: 120, height: 50, depth: 50, elevation: 0, x: 60, y: 360, rotation: 180, color: '#FFFFFF' },
    { type: 'stool', name: 'Toilet Suite', emoji: '🚽', width: 50, height: 70, depth: 70, elevation: 0, x: 440, y: 340, rotation: 180, color: '#FFFFFF' },
    { type: 'mirror', name: 'Full Mirror Wall', emoji: '𛲞', width: 110, height: 10, depth: 10, elevation: 0, x: 65, y: 420, rotation: 180, color: '#FFFFFF' },
    { type: 'wardrobe', name: 'Linen Closet', emoji: '🧺', width: 80, height: 45, depth: 45, elevation: 0, x: 280, y: 360, rotation: 180, color: '#D7B58B' },
    { type: 'ottoman', name: 'Robovac Dock', emoji: '🧹', width: 45, height: 45, depth: 45, elevation: 0, x: 360, y: 360, rotation: 0, color: '#1E293B' }
  ],
  dining: [
    { type: 'dining_table', name: 'Dining Oak Table', emoji: '🍽', width: 180, height: 100, depth: 100, elevation: 0, x: 310, y: 220, rotation: 0, color: '#8B5A2B' },
    { type: 'chair', name: 'Designer Chair', emoji: '𛲑', width: 60, height: 60, depth: 60, elevation: 0, x: 340, y: 140, rotation: 0, color: '#FED7AA' },
    { type: 'chair', name: 'Designer Chair', emoji: '𛲑', width: 60, height: 60, depth: 60, elevation: 0, x: 400, y: 140, rotation: 0, color: '#FED7AA' },
    { type: 'chair', name: 'Designer Chair', emoji: '𛲑', width: 60, height: 60, depth: 60, elevation: 0, x: 340, y: 340, rotation: 180, color: '#FED7AA' },
    { type: 'chair', name: 'Designer Chair', emoji: '𛲑', width: 60, height: 60, depth: 60, elevation: 0, x: 400, y: 340, rotation: 180, color: '#FED7AA' },
    { type: 'chair', name: 'Designer Chair', emoji: '𛲑', width: 60, height: 60, depth: 60, elevation: 0, x: 230, y: 240, rotation: 90, color: '#FED7AA' },
    { type: 'chair', name: 'Designer Chair', emoji: '𛲑', width: 60, height: 60, depth: 60, elevation: 0, x: 510, y: 240, rotation: 270, color: '#FED7AA' },
    { type: 'cabinet', name: 'Credenza Sideboard', emoji: '𗚄', width: 150, height: 45, depth: 45, elevation: 0, x: 325, y: 40, rotation: 0, color: '#8B5A2B' },
    { type: 'circular_rug', name: 'Persian Area Rug', emoji: '𗎴', width: 220, height: 160, depth: 160, elevation: 0, x: 290, y: 190, rotation: 0, color: '#DC2626' },
    { type: 'lamp', name: 'Chandelier', emoji: '🔱', width: 80, height: 80, depth: 80, elevation: 0, x: 360, y: 230, rotation: 0, color: '#FDE68A' },
    { type: 'floor_plant', name: 'Fiddle Leaf Fig Tree', emoji: '🌳', width: 70, height: 70, depth: 70, elevation: 0, x: 640, y: 60, rotation: 0, color: '#16A34A' }
  ],
  office: [
    { type: 'writing_desk', name: 'Office Desk', emoji: '💻', width: 140, height: 75, depth: 75, elevation: 0, x: 330, y: 220, rotation: 0, color: '#8B5A2B' },
    { type: 'office_chair', name: 'Ergonomic Chair', emoji: '𛲑', width: 65, height: 65, depth: 65, elevation: 0, x: 367, y: 310, rotation: 0, color: '#1E293B' },
    { type: 'chair', name: 'Designer Chair', emoji: '𛲑', width: 60, height: 60, depth: 60, elevation: 0, x: 310, y: 140, rotation: 180, color: '#FED7AA' },
    { type: 'chair', name: 'Designer Chair', emoji: '𛲑', width: 60, height: 60, depth: 60, elevation: 0, x: 430, y: 140, rotation: 180, color: '#FED7AA' },
    { type: 'shelf', name: 'Bookcase Shelf', emoji: '📚', width: 120, height: 35, depth: 35, elevation: 0, x: 340, y: 40, rotation: 0, color: '#8B5A2B' },
    { type: 'storage', name: 'Filing Cabinet', emoji: '𗚄', width: 60, height: 50, depth: 50, elevation: 0, x: 100, y: 80, rotation: 90, color: '#475569' },
    { type: 'chair', name: 'Nordic Club Chair', emoji: '𛲑', width: 80, height: 80, depth: 80, elevation: 0, x: 100, y: 420, rotation: 45, color: '#FED7AA' },
    { type: 'floor_plant', name: 'Fiddle Leaf Fig Tree', emoji: '🌳', width: 70, height: 70, depth: 70, elevation: 0, x: 630, y: 80, rotation: 0, color: '#16A34A' },
    { type: 'cabinet', name: 'Hi-Fi Audio Tower', emoji: '🔊', width: 70, height: 60, depth: 60, elevation: 0, x: 630, y: 440, rotation: 0, color: '#1E293B' },
    { type: 'lamp', name: 'Standing Air Fan', emoji: '🌀', width: 50, height: 50, depth: 50, elevation: 0, x: 100, y: 240, rotation: 0, color: '#475569' }
  ],
  hallway: [
    { type: 'circular_rug', name: 'Geometric Corridor Runner', emoji: '🏁', width: 240, height: 80, depth: 80, elevation: 0, x: 130, y: 310, rotation: 0, color: '#1E293B' },
    { type: 'ottoman', name: 'Storage Bench', emoji: '𗚄', width: 120, height: 50, depth: 50, elevation: 0, x: 190, y: 220, rotation: 0, color: '#D7B58B' },
    { type: 'wardrobe', name: 'Sliding Wardrobe', emoji: '🚪', width: 160, height: 60, depth: 60, elevation: 0, x: 170, y: 40, rotation: 0, color: '#8B5A2B' },
    { type: 'floor_plant', name: 'Monstera Floor Plant', emoji: '🪴', width: 60, height: 60, depth: 60, elevation: 0, x: 40, y: 220, rotation: 0, color: '#16A34A' }
  ]
};

const ALL_CATALOG_FOLDERS = [
  ...FURNISH_CATEGORIES,
  ...ELECTRICAL_CATEGORIES,
  ...MISC_CATEGORIES
];

const FURNITURE_ITEMS = [
  // 1. Armchairs
  { type: 'armchair', name: 'Lounge Armchair', emoji: '🪑', width: 90, height: 90, img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'armchairs' },
  { type: 'armchair', name: 'Velvet Recliner', emoji: '🪑', width: 95, height: 95, img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=260&q=80', rooms: ['living', 'bedroom'], category: 'armchairs' },
  { type: 'chair', name: 'Egg Accent Chair', emoji: '🪑', width: 85, height: 85, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=260&q=80', rooms: ['living', 'office'], category: 'armchairs' },
  { type: 'armchair', name: 'Wingback Chair', emoji: '🪑', width: 100, height: 90, img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=260&q=80', rooms: ['living', 'bedroom'], category: 'armchairs' },
  { type: 'chair', name: 'Nordic Club Chair', emoji: '🪑', width: 80, height: 80, img: 'https://images.unsplash.com/photo-1506898667547-42e22a46e125?w=260&q=80', rooms: ['living', 'office'], category: 'armchairs' },

  // 2. Sofas
  { type: 'sofa', name: 'Luxury Sofa', emoji: '🛋', width: 180, height: 90, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&q=80', rooms: ['living'], category: 'sofas' },
  { type: 'l_sofa', name: 'Sectional L-Sofa', emoji: '🛋', width: 220, height: 180, img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=260&q=80', rooms: ['living'], category: 'sofas' },
  { type: 'sofa', name: 'Chesterfield Sofa', emoji: '🛋', width: 210, height: 95, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&q=80', rooms: ['living'], category: 'sofas' },
  { type: 'sofa', name: 'Mid-Century Daybed', emoji: '🛋', width: 190, height: 85, img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=260&q=80', rooms: ['living', 'office'], category: 'sofas' },
  { type: 'sofa', name: 'Futon Sleeper Sofa', emoji: '🛋', width: 170, height: 90, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&q=80', rooms: ['living', 'bedroom'], category: 'sofas' },

  // 3. Ottomans
  { type: 'ottoman', name: 'Velvet Ottoman', emoji: '🦶', width: 70, height: 70, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=260&q=80', rooms: ['living', 'bedroom'], category: 'ottoman' },
  { type: 'ottoman', name: 'Leather Pouf', emoji: '🟤', width: 60, height: 60, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=260&q=80', rooms: ['living', 'bedroom'], category: 'ottoman' },
  { type: 'ottoman', name: 'Storage Bench', emoji: '🗄', width: 120, height: 50, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=260&q=80', rooms: ['living', 'bedroom', 'hallway'], category: 'ottoman' },
  { type: 'ottoman', name: 'Tufted Footstool', emoji: '🦶', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=260&q=80', rooms: ['bedroom'], category: 'ottoman' },
  { type: 'ottoman', name: 'Round Knit Pouf', emoji: '🧶', width: 55, height: 55, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=260&q=80', rooms: ['living', 'kids'], category: 'ottoman' },

  // 4. Beds
  { type: 'bed', name: 'King-Size Bed', emoji: '🛏', width: 200, height: 180, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=260&q=80', rooms: ['bedroom'], category: 'beds' },
  { type: 'single_bed', name: 'Single Bed', emoji: '🛏', width: 190, height: 100, img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=260&q=80', rooms: ['bedroom'], category: 'beds' },
  { type: 'bed', name: 'Queen Canopy Bed', emoji: '🛏', width: 200, height: 160, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=260&q=80', rooms: ['bedroom'], category: 'beds' },
  { type: 'bed', name: 'Japanese Futon', emoji: '🛏', width: 180, height: 180, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=260&q=80', rooms: ['bedroom'], category: 'beds' },
  { type: 'bed', name: 'Storage Bed Frame', emoji: '🛏', width: 200, height: 165, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=260&q=80', rooms: ['bedroom'], category: 'beds' },

  // 5. Storage
  { type: 'wardrobe', name: 'Sliding Wardrobe', emoji: '🚪', width: 160, height: 60, img: 'https://images.unsplash.com/photo-1558882224-cca166733360?w=260&q=80', rooms: ['bedroom', 'hallway'], category: 'storage' },
  { type: 'dresser', name: 'Vanity Dresser', emoji: '🪞', width: 100, height: 50, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['bedroom', 'living', 'hallway'], category: 'storage' },
  { type: 'nightstand', name: 'Oak Nightstand', emoji: '🗄', width: 60, height: 50, img: 'https://images.unsplash.com/photo-1532372320978-9b4d7a92b24d?w=260&q=80', rooms: ['bedroom', 'bathroom', 'hallway'], category: 'storage' },
  { type: 'shelf', name: 'Bookcase Shelf', emoji: '📚', width: 120, height: 35, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'storage' },
  { type: 'cabinet', name: 'Credenza Sideboard', emoji: '🗄', width: 150, height: 45, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['living', 'dining', 'office'], category: 'storage' },

  // 6. Tables & Chairs
  { type: 'dining_table', name: 'Dining Oak Table', emoji: '🍽', width: 180, height: 100, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['living', 'kitchen', 'dining'], category: 'tables_chairs' },
  { type: 'chair', name: 'Designer Chair', emoji: '🪑', width: 60, height: 60, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=260&q=80', rooms: ['living', 'kitchen', 'dining', 'public'], category: 'tables_chairs' },
  { type: 'stool', name: 'Bar Stool', emoji: '🪑', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=260&q=80', rooms: ['kitchen'], category: 'tables_chairs' },
  { type: 'coffee_table', name: 'Round Coffee Table', emoji: '☕', width: 90, height: 90, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['living'], category: 'tables_chairs' },
  { type: 'dining_table', name: 'Banquet Table', emoji: '🍽', width: 220, height: 110, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['dining', 'public'], category: 'tables_chairs' },

  // 7. Office
  { type: 'writing_desk', name: 'Office Desk', emoji: '💻', width: 140, height: 75, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=260&q=80', rooms: ['bedroom', 'office'], category: 'office' },
  { type: 'office_chair', name: 'Ergonomic Chair', emoji: '🪑', width: 65, height: 65, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=260&q=80', rooms: ['bedroom', 'office'], category: 'office' },
  { type: 'storage', name: 'Filing Cabinet', emoji: '🗄', width: 60, height: 50, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['office'], category: 'office' },
  { type: 'dining_table', name: 'Conference Table', emoji: '👥', width: 260, height: 120, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['office', 'public'], category: 'office' },
  { type: 'writing_desk', name: 'Drafting Desk', emoji: '📐', width: 150, height: 85, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=260&q=80', rooms: ['office'], category: 'office' },

  // 8. Kids
  { type: 'kids_bed', name: 'Kids Bed', emoji: '🛏', width: 150, height: 90, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=260&q=80', rooms: ['kids'], category: 'kids' },
  { type: 'play_desk', name: 'Kids Play Desk', emoji: '💻', width: 100, height: 55, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=260&q=80', rooms: ['kids'], category: 'kids' },
  { type: 'toy_cabinet', name: 'Toy Cabinet', emoji: '🗄', width: 90, height: 45, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['kids'], category: 'kids' },
  { type: 'little_chair', name: 'Little Chair', emoji: '🪑', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=260&q=80', rooms: ['kids'], category: 'kids' },
  { type: 'kids_bed', name: 'Kids Bunk Bed', emoji: '🛏', width: 160, height: 95, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=260&q=80', rooms: ['kids'], category: 'kids' },

  // 9. Kitchen
  { type: 'island', name: 'Kitchen Island', emoji: '🍳', width: 200, height: 100, img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=260&q=80', rooms: ['kitchen'], category: 'kitchen' },
  { type: 'counter', name: 'Kitchen Counter', emoji: '🍳', width: 160, height: 60, img: 'https://images.unsplash.com/photo-1556912403-c596e57667e6?w=260&q=80', rooms: ['kitchen'], category: 'kitchen' },
  { type: 'sink', name: 'Sink Unit', emoji: '🚰', width: 100, height: 60, img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=260&q=80', rooms: ['kitchen'], category: 'kitchen' },
  { type: 'wardrobe', name: 'Pantry Cabinet', emoji: '🥫', width: 90, height: 60, img: 'https://images.unsplash.com/photo-1558882224-cca166733360?w=260&q=80', rooms: ['kitchen'], category: 'kitchen' },
  { type: 'counter', name: 'Prep Counter', emoji: '🔪', width: 120, height: 60, img: 'https://images.unsplash.com/photo-1556912403-c596e57667e6?w=260&q=80', rooms: ['kitchen'], category: 'kitchen' },

  // 10. Bathroom
  { type: 'tub', name: 'Freestanding Tub', emoji: '🛁', width: 170, height: 80, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['bathroom'], category: 'bathroom' },
  { type: 'shower', name: 'Shower Cabin', emoji: '🚿', width: 100, height: 100, img: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=260&q=80', rooms: ['bathroom'], category: 'bathroom' },
  { type: 'sink', name: 'Double Sink', emoji: '🚰', width: 120, height: 50, img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=260&q=80', rooms: ['bathroom'], category: 'bathroom' },
  { type: 'stool', name: 'Toilet Suite', emoji: '🚽', width: 50, height: 70, img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=260&q=80', rooms: ['bathroom'], category: 'bathroom' },
  { type: 'wardrobe', name: 'Linen Closet', emoji: '🧺', width: 80, height: 45, img: 'https://images.unsplash.com/photo-1558882224-cca166733360?w=260&q=80', rooms: ['bathroom'], category: 'bathroom' },

  // 11. Public Spaces
  { type: 'public_bench', name: 'Public Bench', emoji: '🪑', width: 150, height: 50, img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=260&q=80', rooms: ['living', 'public'], category: 'public' },
  { type: 'counter', name: 'Reception Desk', emoji: '🛎', width: 180, height: 70, img: 'https://images.unsplash.com/photo-1556912403-c596e57667e6?w=260&q=80', rooms: ['public'], category: 'public' },
  { type: 'sofa', name: 'Lecture Seats', emoji: '🎓', width: 240, height: 60, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&q=80', rooms: ['public'], category: 'public' },
  { type: 'coffee_table', name: 'Cafe Table', emoji: '☕', width: 70, height: 70, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['public'], category: 'public' },
  { type: 'sofa', name: 'Lounge Group', emoji: '🛋', width: 200, height: 200, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&q=80', rooms: ['public'], category: 'public' },

  // 12. Lighting
  { type: 'floor_lamp', name: 'Floor Lamp', emoji: '💡', width: 60, height: 60, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'kids', 'dining', 'hallway', 'office', 'public'], category: 'lighting' },
  { type: 'reading_lamp', name: 'Reading Lamp', emoji: '💡', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['bedroom'], category: 'lighting' },
  { type: 'lamp', name: 'Chandelier', emoji: '🔱', width: 80, height: 80, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'dining'], category: 'lighting' },
  { type: 'lamp', name: 'Track Lights', emoji: '💡', width: 120, height: 20, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'kitchen', 'office'], category: 'lighting' },
  { type: 'lamp', name: 'Wall Sconce', emoji: '💡', width: 30, height: 35, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['bedroom', 'hallway'], category: 'lighting' },

  // 13. Household Appliances
  { type: 'washing_machine', name: 'Washing Machine', emoji: '🧺', width: 70, height: 70, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['bathroom', 'kitchen'], category: 'appliances' },
  { type: 'washing_machine', name: 'Tumble Dryer', emoji: '🧺', width: 70, height: 70, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['bathroom'], category: 'appliances' },
  { type: 'ottoman', name: 'Robovac Dock', emoji: '🧹', width: 45, height: 45, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['living', 'hallway'], category: 'appliances' },
  { type: 'kitchenware', name: 'Stand Mixer', emoji: '🥣', width: 40, height: 40, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['kitchen'], category: 'appliances' },
  { type: 'counter', name: 'Ironing Setup', emoji: '👔', width: 110, height: 40, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['bedroom', 'hallway'], category: 'appliances' },

  // 14. Kitchen Appliances
  { type: 'fridge', name: 'Refrigerator', emoji: '🧊', width: 85, height: 80, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['kitchen'], category: 'kitchen_appliances' },
  { type: 'fridge', name: 'Oven & Hob', emoji: '🔥', width: 75, height: 75, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['kitchen'], category: 'kitchen_appliances' },
  { type: 'fridge', name: 'Dishwasher Unit', emoji: '🧼', width: 70, height: 70, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['kitchen'], category: 'kitchen_appliances' },
  { type: 'kitchenware', name: 'Microwave oven', emoji: '⚡', width: 60, height: 45, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['kitchen'], category: 'kitchen_appliances' },
  { type: 'coffee_maker', name: 'Espresso Center', emoji: '☕', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['kitchen'], category: 'kitchen_appliances' },

  // 15. Audio & Video
  { type: 'tv_console', name: 'TV Cabinet Console', emoji: '📺', width: 180, height: 50, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['living', 'bedroom'], category: 'audio_video' },
  { type: 'cabinet', name: 'Hi-Fi Audio Tower', emoji: '🔊', width: 70, height: 60, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['living', 'office'], category: 'audio_video' },
  { type: 'mirror', name: 'Projector Screen', emoji: '📽', width: 200, height: 10, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['living', 'office', 'public'], category: 'audio_video' },
  { type: 'writing_desk', name: 'Gaming Rig Setup', emoji: '🎮', width: 140, height: 80, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=260&q=80', rooms: ['bedroom', 'office'], category: 'audio_video' },
  { type: 'nightstand', name: 'Retro Turntable', emoji: '📻', width: 65, height: 50, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['living', 'bedroom'], category: 'audio_video' },

  // 16. Climate Controls
  { type: 'ac_unit', name: 'AC Split Unit', emoji: '❄️', width: 100, height: 30, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'climate' },
  { type: 'lamp', name: 'Air Purifier Tower', emoji: '🍃', width: 40, height: 40, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'climate' },
  { type: 'ac_unit', name: 'Radiator Heater', emoji: '🔥', width: 80, height: 20, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'bedroom', 'hallway'], category: 'climate' },
  { type: 'lamp', name: 'Vapor Humidifier', emoji: '💧', width: 35, height: 35, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['bedroom', 'kids'], category: 'climate' },
  { type: 'lamp', name: 'Standing Air Fan', emoji: '🌀', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'office'], category: 'climate' },

  // 17. Decor
  { type: 'mirror', name: 'Full Mirror Wall', emoji: '🪞', width: 110, height: 10, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['bathroom', 'bedroom', 'hallway', 'decor'], category: 'decor' },
  { type: 'mirror', name: 'Abstract Art Piece', emoji: '🖼', width: 100, height: 8, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['living', 'dining', 'decor'], category: 'decor' },
  { type: 'ottoman', name: 'Sculptural Vase', emoji: '🏺', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'hallway', 'decor'], category: 'decor' },
  { type: 'mirror', name: 'Framed Canvas Grid', emoji: '🖼', width: 150, height: 8, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['living', 'decor'], category: 'decor' },
  { type: 'nightstand', name: 'Designer Desk Clock', emoji: '⏰', width: 40, height: 40, img: 'https://images.unsplash.com/photo-1532372320978-9b4d7a92b24d?w=260&q=80', rooms: ['office', 'bedroom', 'decor'], category: 'decor' },

  // 18. Curtains & Blinds
  { type: 'window_curtain', name: 'Elegant Window Drapes', emoji: '🪟', width: 120, height: 12, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['living', 'bedroom', 'decor'], category: 'curtains' },
  { type: 'window_curtain', name: 'Roller Privacy Blinds', emoji: '🪟', width: 100, height: 8, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['kitchen', 'bathroom', 'office'], category: 'curtains' },
  { type: 'window_curtain', name: 'Patio Slatted Blinds', emoji: '🪟', width: 180, height: 15, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['living', 'public'], category: 'curtains' },
  { type: 'window_curtain', name: 'Venetian Wood Shades', emoji: '🪟', width: 110, height: 10, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['bedroom', 'office'], category: 'curtains' },
  { type: 'window_curtain', name: 'Roman Fabric Shades', emoji: '🪟', width: 90, height: 10, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['bedroom', 'kids'], category: 'curtains' },

  // 19. Rugs
  { type: 'circular_rug', name: 'Circular Velvet Rug', emoji: '⭕', width: 160, height: 160, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'kids', 'decor'], category: 'rugs' },
  { type: 'circular_rug', name: 'Persian Area Rug', emoji: '🎴', width: 220, height: 160, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'dining', 'decor'], category: 'rugs' },
  { type: 'circular_rug', name: 'Cozy Sheepskin Rug', emoji: '🐑', width: 110, height: 80, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['bedroom', 'kids', 'decor'], category: 'rugs' },
  { type: 'circular_rug', name: 'Geometric Corridor Runner', emoji: '🏁', width: 240, height: 80, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['hallway', 'decor'], category: 'rugs' },
  { type: 'circular_rug', name: 'Jute Natural Fiber Rug', emoji: '🟤', width: 140, height: 140, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'decor'], category: 'rugs' },

  // 20. Kitchenware
  { type: 'coffee_maker', name: 'Drip Coffee Station', emoji: '☕', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['kitchen'], category: 'kitchenware' },
  { type: 'shelf', name: 'Hanging Pot Rack', emoji: '🍳', width: 120, height: 30, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['kitchen'], category: 'kitchenware' },
  { type: 'kitchenware', name: 'Chef Knife Block', emoji: '🔪', width: 35, height: 35, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['kitchen'], category: 'kitchenware' },
  { type: 'kitchenware', name: 'Stacked Dinnerware', emoji: '🍽', width: 45, height: 45, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['kitchen', 'dining'], category: 'kitchenware' },
  { type: 'nightstand', name: 'Rotating Spice Stand', emoji: '🧂', width: 40, height: 40, img: 'https://images.unsplash.com/photo-1532372320978-9b4d7a92b24d?w=260&q=80', rooms: ['kitchen'], category: 'kitchenware' },

  // 21. Fireplaces
  { type: 'fireplaces', name: 'Bio-Ethanol Burner', emoji: '🔥', width: 90, height: 45, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'public'], category: 'fireplaces' },
  { type: 'fireplaces', name: 'Stone Mantel Hearth', emoji: '🪵', width: 160, height: 60, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living'], category: 'fireplaces' },
  { type: 'fireplaces', name: 'Wood-Burning Stove', emoji: '🪵', width: 70, height: 70, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom'], category: 'fireplaces' },
  { type: 'fireplaces', name: 'Wall LED Fireplace', emoji: '🖼', width: 130, height: 25, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'fireplaces' },
  { type: 'ottoman', name: 'Outdoor Fire Pit Bowl', emoji: '🔥', width: 85, height: 85, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=260&q=80', rooms: ['living', 'public'], category: 'fireplaces' },

  // 22. Plants
  { type: 'floor_plant', name: 'Monstera Floor Plant', emoji: '🪴', width: 60, height: 60, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'dining', 'hallway', 'office', 'public', 'decor'], category: 'plants' },
  { type: 'floor_plant', name: 'Fiddle Leaf Fig Tree', emoji: '🌳', width: 70, height: 70, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'dining', 'hallway', 'office', 'decor'], category: 'plants' },
  { type: 'floor_plant', name: 'Mini Succulent Trio', emoji: '🌵', width: 45, height: 30, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['bedroom', 'office', 'decor'], category: 'plants' },
  { type: 'floor_plant', name: 'Hanging Ivy Vine', emoji: '🌿', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'decor'], category: 'plants' },
  { type: 'floor_plant', name: 'Snake Plant Corner Stand', emoji: '🪴', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'office', 'decor'], category: 'plants' },

  // 23. People Silhouettes
  { type: 'person_standing', name: 'Standing Silhouette', emoji: '🚶', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=260&q=80', rooms: ['living', 'public'], category: 'people' },
  { type: 'person_standing', name: 'Sitting Silhouette', emoji: '🧘', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=260&q=80', rooms: ['living', 'bedroom', 'office', 'public'], category: 'people' },
  { type: 'person_standing', name: 'Two People Group', emoji: '👥', width: 90, height: 50, img: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=260&q=80', rooms: ['living', 'office', 'public'], category: 'people' },
  { type: 'person_standing', name: 'Child Silhouette', emoji: '🚶', width: 40, height: 40, img: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=260&q=80', rooms: ['living', 'kids', 'public'], category: 'people' },
  { type: 'person_standing', name: 'Presenter Silhouette', emoji: '🧑‍🏫', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=260&q=80', rooms: ['office', 'public'], category: 'people' },

  // 24. Sports & Fitness
  { type: 'yoga_mat', name: 'Premium Yoga Mat', emoji: '🧘', width: 180, height: 60, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom'], category: 'sport' },
  { type: 'sport', name: 'Treadmill Machine', emoji: '🏃', width: 160, height: 75, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'sport' },
  { type: 'sport', name: 'Adjustable Weight Bench', emoji: '🏋️', width: 130, height: 50, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'sport' },
  { type: 'sport', name: 'Stationary Spin Bike', emoji: '🚴', width: 110, height: 55, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'sport' },
  { type: 'floor_lamp', name: 'Heavy Punching Bag', emoji: '🥊', width: 60, height: 60, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'bedroom'], category: 'sport' },

  // 25. Holidays & Seasonal
  { type: 'floor_plant', name: 'Christmas Pine Tree', emoji: '🎄', width: 100, height: 100, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'kids'], category: 'holidays' },
  { type: 'floor_plant', name: 'Halloween Pumpkin Stack', emoji: '🎃', width: 60, height: 60, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'hallway'], category: 'holidays' },
  { type: 'curtains', name: 'Party Balloon Archway', emoji: '🎈', width: 220, height: 30, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['living', 'kids', 'public'], category: 'holidays' },
  { type: 'decor', name: 'Holiday Wreath Accent', emoji: '🎀', width: 50, height: 10, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['living', 'hallway'], category: 'holidays' },
  { type: 'lamp', name: 'Decorative Menorah', emoji: '🕎', width: 60, height: 30, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'bedroom'], category: 'holidays' },

  // 26. Pets & Animals
  { type: 'pet_dog', name: 'Golden Retriever Dog', emoji: '🐕', width: 70, height: 40, img: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=260&q=80', rooms: ['living', 'public'], category: 'pets' },
  { type: 'pet_dog', name: 'Fluffy Persian Cat', emoji: '🐈', width: 50, height: 30, img: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=260&q=80', rooms: ['living', 'bedroom'], category: 'pets' },
  { type: 'shelf', name: 'Cat Climbing Tower', emoji: '🐾', width: 75, height: 75, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['living', 'bedroom', 'kids'], category: 'pets' },
  { type: 'ottoman', name: 'Orthopedic Dog Cushion', emoji: '🐶', width: 80, height: 60, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=260&q=80', rooms: ['living', 'bedroom'], category: 'pets' },
  { type: 'cabinet', name: 'Aquarium Fish Tank', emoji: '🐠', width: 110, height: 50, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['living', 'office', 'kids'], category: 'pets' }
];

const renderFurnitureSvg = (type, color) => {
  const fillCol = color || '#BFDBFE';
  const strokeCol = '#1E40AF';
  const strokeW = '1.8';

  switch (type) {
    case 'sofa':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="8" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="2" y="2" width="96" height="15" rx="3" fill="#FFFFFF" fillOpacity="0.4" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="15" y="22" width="32" height="66" rx="4" fill="#FFFFFF" fillOpacity="0.6" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="53" y="22" width="32" height="66" rx="4" fill="#FFFFFF" fillOpacity="0.6" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="2" y="15" width="10" height="78" rx="3" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="88" y="15" width="10" height="78" rx="3" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
    case 'armchair':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="10" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="2" y="2" width="96" height="18" rx="3" fill="#FFFFFF" fillOpacity="0.4" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="15" y="25" width="70" height="63" rx="6" fill="#FFFFFF" fillOpacity="0.6" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="2" y="18" width="10" height="75" rx="3" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="88" y="18" width="10" height="75" rx="3" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
    case 'ottoman':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="20" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <circle cx="30" cy="30" r="3" fill={strokeCol} />
          <circle cx="70" cy="30" r="3" fill={strokeCol} />
          <circle cx="30" cy="70" r="3" fill={strokeCol} />
          <circle cx="70" cy="70" r="3" fill={strokeCol} />
          <circle cx="50" cy="50" r="3" fill={strokeCol} />
        </svg>
      );
    case 'storage':
    case 'cabinet':
    case 'shelf':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="4" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <line x1="2" y1="50" x2="98" y2="50" stroke={strokeCol} strokeWidth="1.2" />
          <line x1="33" y1="2" x2="33" y2="98" stroke={strokeCol} strokeWidth="1.2" />
          <line x1="66" y1="2" x2="66" y2="98" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="12" y="20" width="10" height="4" rx="1" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1" />
          <rect x="45" y="20" width="10" height="4" rx="1" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1" />
          <rect x="78" y="20" width="10" height="4" rx="1" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1" />
          <rect x="12" y="70" width="10" height="4" rx="1" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1" />
          <rect x="45" y="70" width="10" height="4" rx="1" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1" />
          <rect x="78" y="70" width="10" height="4" rx="1" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1" />
        </svg>
      );
    case 'lamp':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="50" cy="50" r="30" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <circle cx="50" cy="50" r="12" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <path d="M 50 50 L 50 90" stroke={strokeCol} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="50" cy="90" r="5" fill={strokeCol} />
        </svg>
      );
    case 'coffee_table':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="8" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="10" y="10" width="80" height="80" rx="4" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1" strokeDasharray="3,3" />
          <line x1="15" y1="15" x2="85" y2="85" stroke={strokeCol} strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      );
    case 'dining_table':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="15" y="15" width="70" height="70" rx="4" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="35" y="2" width="30" height="10" rx="2" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="35" y="88" width="30" height="10" rx="2" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="2" y="35" width="10" height="30" rx="2" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="88" y="35" width="10" height="30" rx="2" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
    case 'chair':
    case 'stool':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="6" y="6" width="88" height="88" rx="8" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <path d="M 12 12 Q 50 25 88 12" fill="none" stroke={strokeCol} strokeWidth="1.5" />
          <rect x="18" y="25" width="64" height="60" rx="4" fill="#FFFFFF" fillOpacity="0.6" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
    case 'bed':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="6" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="2" y="2" width="96" height="10" fill={strokeCol} />
          <rect x="10" y="16" width="35" height="22" rx="4" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="55" y="16" width="35" height="22" rx="4" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <path d="M 2 55 C 30 50, 70 50, 98 55 L 98 98 L 2 98 Z" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
    case 'wardrobe':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="4" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <line x1="2" y1="12" x2="98" y2="12" stroke={strokeCol} strokeWidth="1.2" />
          <line x1="2" y1="18" x2="98" y2="18" stroke={strokeCol} strokeWidth="1.2" />
          <line x1="50" y1="18" x2="50" y2="98" stroke={strokeCol} strokeWidth="1.2" />
          <path d="M 20 40 L 30 40 M 25 35 L 25 45" stroke={strokeCol} strokeWidth="1" strokeOpacity="0.6" />
          <path d="M 70 40 L 80 40 M 75 35 L 75 45" stroke={strokeCol} strokeWidth="1" strokeOpacity="0.6" />
        </svg>
      );
    case 'nightstand':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="4" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="15" y="15" width="70" height="30" rx="2" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="15" y="55" width="70" height="30" rx="2" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.2" />
          <circle cx="50" cy="30" r="3" fill={strokeCol} />
          <circle cx="50" cy="70" r="3" fill={strokeCol} />
        </svg>
      );
    case 'dresser':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="6" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="10" y="20" width="80" height="60" rx="2" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.2" />
          <path d="M 10 10 Q 50 15 90 10" stroke={strokeCol} strokeWidth="1.5" fill="none" />
          <circle cx="50" cy="50" r="10" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
    case 'island':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="4" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <circle cx="30" cy="50" r="12" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <circle cx="30" cy="50" r="6" fill={strokeCol} />
          <rect x="60" y="30" width="26" height="40" rx="4" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
    case 'counter':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="10" y="10" width="40" height="80" fill="#FFFFFF" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="60" y="25" width="25" height="50" rx="2" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
    case 'fridge':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="8" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <line x1="2" y1="35" x2="98" y2="35" stroke={strokeCol} strokeWidth="2" />
          <rect x="40" y="32" width="20" height="6" rx="1" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
    case 'tub':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="48" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="10" y="10" width="80" height="80" rx="40" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <circle cx="50" cy="18" r="3" fill={strokeCol} />
          <line x1="50" y1="2" x2="50" y2="18" stroke={strokeCol} strokeWidth="1.5" />
        </svg>
      );
    case 'shower':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="4" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="40" y="40" width="20" height="20" rx="2" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <line x1="40" y1="50" x2="60" y2="50" stroke={strokeCol} strokeWidth="1.0" />
          <circle cx="15" cy="15" r="6" fill={strokeCol} />
          <line x1="2" y1="2" x2="15" y2="15" stroke={strokeCol} strokeWidth="1.5" />
        </svg>
      );
    case 'sink':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="6" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="12" y="20" width="30" height="60" rx="15" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <rect x="58" y="20" width="30" height="60" rx="15" fill="#FFFFFF" stroke={strokeCol} strokeWidth="1.2" />
          <line x1="27" y1="2" x2="27" y2="20" stroke={strokeCol} strokeWidth="1.5" />
          <line x1="73" y1="2" x2="73" y2="20" stroke={strokeCol} strokeWidth="1.5" />
        </svg>
      );
    case 'mirror':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="40" width="96" height="20" rx="2" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="10" y="45" width="80" height="10" rx="1" fill="#FFFFFF" fillOpacity="0.6" stroke={strokeCol} strokeWidth="1" />
        </svg>
      );
    default:
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="4" fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} />
          <rect x="10" y="10" width="80" height="80" rx="2" fill="#FFFFFF" fillOpacity="0.4" stroke={strokeCol} strokeWidth="1.2" />
        </svg>
      );
  }
};

const ROOM_FOLDERS = [
  { id: 'living', name: 'Living room', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=260&q=80' },
  { id: 'kitchen', name: 'Kitchen', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=260&q=80' },
  { id: 'bedroom', name: 'Bedroom', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=260&q=80' },
  { id: 'kids', name: 'Kids room', img: 'https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/1-2025-1736068988-NDPD1/ond-1759736307-rv9SV/kbr-1759750566-lYFZd/kb-4-1761578991-mRe1e.jpg' },
  { id: 'bathroom', name: 'Bathroom', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80' },
  { id: 'dining', name: 'Dining room', img: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=260&q=80' },
  { id: 'hallway', name: 'Hallway', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=260&q=80' },
  { id: 'office', name: 'Office', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=260&q=80' },
  { id: 'public', name: 'Public space', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN2AM9QQ6gkxlWwf5TR5fbzU7LFbJitKExKQ&s' },
  { id: 'decor', name: 'Decor', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=260&q=80' }
];

const LOADING_STATUSES = [
  'Initializing Planora engine...',
  'Syncing local configurations...',
  'Calibrating blueprint coordinates...',
  'Drawing dynamic metric rulers...',
  'Loading furniture catalog assets...',
  'Ready!'
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Grid properties matching jigsaw specifications
  const [roomWidth, setRoomWidth] = useState(900);
  const [roomHeight, setRoomHeight] = useState(600);
  const [floorName, setFloorName] = useState('Ground Floor');
  const [isEditingFloorName, setIsEditingFloorName] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Categories'); // Rooms vs Categories
  const [selectedRoomFolder, setSelectedRoomFolder] = useState(null); // Active room folder selection
  const [selectedCategory, setSelectedCategory] = useState(null); // Selected category under Categories tab
  const [expandedAccordionSections, setExpandedAccordionSections] = useState({
    furnish: true,
    electrical: false,
    misc: false
  });
  const [isDirty, setIsDirty] = useState(false);

  // Layout instances
  const [currentLayoutId, setCurrentLayoutId] = useState(null);
  const [savedLayouts, setSavedLayouts] = useState([]);
  const [showFloorsDropdown, setShowFloorsDropdown] = useState(false);

  // Multi-floor active configurations
  const [floors, setFloors] = useState([
    { id: 'floor_ground', name: 'Ground Floor', items: [], rooms: [], activeRoomId: null, roomWidth: 900, roomHeight: 600 },
    { id: 'floor_first', name: 'First Floor', items: [], rooms: [], activeRoomId: null, roomWidth: 900, roomHeight: 600 },
    { id: 'floor_second', name: 'Second Floor', items: [], rooms: [], activeRoomId: null, roomWidth: 900, roomHeight: 600 }
  ]);
  const [activeFloorId, setActiveFloorId] = useState('floor_ground');

  // Multi-room active configurations
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);

  // Zoom factor & Minimap
  const [zoom, setZoom] = useState(1);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureStart, setMeasureStart] = useState(null);
  const [measureEnd, setMeasureEnd] = useState(null);
  const [showBOMDrawer, setShowBOMDrawer] = useState(false);
  const [bomItemCosts, setBomItemCosts] = useState({});
  const [bomActiveTab, setBomActiveTab] = useState('total');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });
  const [showMinimap, setShowMinimap] = useState(true);
  const [minimapPos, setMinimapPos] = useState({ x: null, y: null });

  const handleMinimapMouseDown = (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const parent = document.querySelector('.app-container') || card.offsetParent;
    const parentRect = parent.getBoundingClientRect();
    
    const initialX = rect.left - parentRect.left;
    const initialY = rect.top - parentRect.top;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      let newX = initialX + dx;
      let newY = initialY + dy;

      const maxW = parentRect.width - rect.width;
      const maxH = parentRect.height - rect.height;
      
      newX = Math.max(0, Math.min(maxW, newX));
      newY = Math.max(0, Math.min(maxH, newY));

      setMinimapPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const [roomSwitcherPos, setRoomSwitcherPos] = useState({ x: null, y: null });

  const handleRoomSwitcherMouseDown = (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const parent = document.querySelector('.app-container') || card.offsetParent;
    const parentRect = parent.getBoundingClientRect();
    
    const initialX = rect.left - parentRect.left;
    const initialY = rect.top - parentRect.top;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      let newX = initialX + dx;
      let newY = initialY + dy;

      const maxW = parentRect.width - rect.width;
      const maxH = parentRect.height - rect.height;
      
      newX = Math.max(0, Math.min(maxW, newX));
      newY = Math.max(0, Math.min(maxH, newY));

      setRoomSwitcherPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Alignment Guides
  const [guides, setGuides] = useState([]);

  // Alignment Guides is already defined above

  // Undo/Redo
  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  // UI Feature flags
  const [showGridDots, setShowGridDots] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState('blueprint');
  const [userName, setUserName] = useState('Saikiran');
  const [userEmail, setUserEmail] = useState('saikiran@planora.io');
  const [userRole, setUserRole] = useState('Professional Architect');
  const [gridSnapSize, setGridSnapSize] = useState(20);
  const [measurementUnit, setMeasurementUnit] = useState('cm');
  const [roomBoundaryColor, setRoomBoundaryColor] = useState('#2563EB');
  const [shareLink, setShareLink] = useState('');
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // Canvas ref for snapshot
  const canvasContainerRef = useRef(null);
  const roomWrapperRef = useRef(null);
  const [toasts, setToasts] = useState([]);

  // Favourites checklist
  const [favourites, setFavourites] = useState({});

  useEffect(() => {
    fetchLayouts();

    // Cycle statuses and percentages every 650ms for a slower, high-fidelity experience
    const statusInterval = setInterval(() => {
      setLoadingStatusIndex(prev => {
        if (prev < LOADING_STATUSES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(statusInterval);
          // Once 100% is reached, wait 350ms and fade out the preloader!
          setTimeout(() => {
            setIsLoading(false);
          }, 350);
          return prev;
        }
      });
    }, 650);

    // Parse encoded share link state on component mount
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedLayout = params.get('layout');
      if (encodedLayout) {
        const decoded = JSON.parse(decodeURIComponent(atob(encodedLayout)));
        if (decoded) {
          if (decoded.floorName) setFloorName(decoded.floorName);
          if (decoded.roomWidth) setRoomWidth(decoded.roomWidth);
          if (decoded.roomHeight) setRoomHeight(decoded.roomHeight);
          if (decoded.items) setItems(decoded.items);
          if (decoded.rooms) setRooms(decoded.rooms);
          
          addToast('Shared design loaded successfully!', 'success');
          // Clean the query string without reloading to keep URL tidy
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (err) {
      console.error("Failed to decode shared layout:", err);
    }

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  // Auto-close color picker on item selection change
  useEffect(() => {
    setShowColorPicker(false);
  }, [selectedId]);

  // Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === '?') {
        setShowShortcutsModal(true);
      } else if (e.key === 'Escape') {
        setShowShortcutsModal(false);
        setSelectedId(null);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) handleDeleteItem(selectedId);
      } else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (selectedId) handleDuplicateItem(selectedId);
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) handleRedo(); else handleUndo();
      } else if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, items, undoHistory, redoHistory]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const triggerConfirm = (title, message, onConfirmCallback) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: onConfirmCallback
    });
  };

  // ── SNAPSHOT: uses high-fidelity offscreen Canvas exporter ──
  const handleSnapshot = () => {
    handleExportSnapshot();
  };

  // ── SHARE: generate a sharable URL with layout state encoded ──
  const handleShare = () => {
    const state = { floorName, roomWidth, roomHeight, items, rooms };
    const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
    const url = `${window.location.origin}${window.location.pathname}?layout=${encoded}`;
    setShareLink(url);
    setShareLinkCopied(false);
    setShowShareModal(true);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setShareLinkCopied(true);
      addToast('Link copied to clipboard!', 'success');
      setTimeout(() => setShareLinkCopied(false), 2500);
    });
  };

  // ── EXPORT PDF: print the canvas area ──
  const handleExportPDF = () => {
    addToast('Opening print preview for PDF export...', 'info');
    const originalTitle = document.title;
    document.title = `Planora_${floorName.replace(/\s+/g, '_')}_Layout`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  // ── RECENTER: reset zoom and scroll canvas to center ──
  const handleRecenter = () => {
    setZoom(1);
    setSelectedId(null);
    const container = document.querySelector('.canvas-container');
    if (container) {
      container.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
    addToast('View recentered', 'info');
  };

  // ── CLEAR ROOM: remove all items from active room ──
  const handleClearRoom = () => {
    if (items.length === 0) { addToast('Room is already empty', 'info'); return; }
    saveHistoryState();
    setItems([]);
    setSelectedId(null);
    addToast('Room cleared', 'info');
  };

  const saveHistoryState = () => {
    setUndoHistory(prev => [...prev, JSON.stringify(items)]);
    setRedoHistory([]);
    setIsDirty(true);
  };

  const handleUndo = () => {
    if (undoHistory.length === 0) return;
    const prev = undoHistory[undoHistory.length - 1];
    setRedoHistory(r => [...r, JSON.stringify(items)]);
    setItems(JSON.parse(prev));
    setUndoHistory(u => u.slice(0, -1));
    addToast('Undo performed', 'info');
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;
    const next = redoHistory[redoHistory.length - 1];
    setUndoHistory(u => [...u, JSON.stringify(items)]);
    setItems(JSON.parse(next));
    setRedoHistory(r => r.slice(0, -1));
    addToast('Redo performed', 'info');
  };

  const snap = (val) => Math.round(val / gridSnapSize) * gridSnapSize;

  // Add new item to room grid canvas
  const handleAddItem = (catalogItem) => {
    saveHistoryState();
    const rawX = (roomWidth - catalogItem.width) / 2;
    const rawY = (roomHeight - catalogItem.height) / 2;
    const x = snap(rawX);
    const y = snap(rawY);

    const newItem = {
      id: `item_${Date.now()}`,
      type: catalogItem.type,
      name: catalogItem.name,
      emoji: catalogItem.emoji,
      width: catalogItem.width,
      height: catalogItem.height,
      depth: catalogItem.height, // Map depth to height for property inputs
      elevation: 0,
      x: Math.max(0, Math.min(roomWidth - catalogItem.width, x)),
      y: Math.max(0, Math.min(roomHeight - catalogItem.height, y)),
      rotation: 0,
      zIndex: items.length + 1,
      roomId: activeRoomId
    };

    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
    addToast(`Added ${catalogItem.name} to floor plan`, 'success');
  };

  const handleDeleteItem = (id) => {
    saveHistoryState();
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedId === id) setSelectedId(null);
    addToast('Furniture item removed', 'info');
  };

  const handleDuplicateItem = (id) => {
    const original = items.find(item => item.id === id);
    if (!original) return;
    saveHistoryState();

    const duplicated = {
      ...original,
      id: `item_${Date.now()}`,
      name: `${original.name} (Copy)`,
      x: snap(Math.min(roomWidth - original.width, original.x + 40)),
      y: snap(Math.min(roomHeight - original.height, original.y + 40)),
      zIndex: items.length + 1,
      roomId: activeRoomId
    };

    setItems(prev => [...prev, duplicated]);
    setSelectedId(duplicated.id);
    addToast('Item duplicated', 'success');
  };

  const handleToggleFavorite = (id) => {
    setFavourites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    addToast(favourites[id] ? 'Removed from favorites' : 'Added to favorites', 'success');
  };

  const handleFlipItem = (id) => {
    saveHistoryState();
    // Rotate 180 degrees to visually mimic a horizontal flip
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, rotation: (item.rotation + 180) % 360 };
      }
      return item;
    }));
    addToast('Flipped item orientation', 'info');
  };

  const handleUpdateItemProperty = (id, prop, val) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        let finalVal = val;
        // Snap positioning/sizing
        if (prop === 'x' || prop === 'y') finalVal = snap(val);
        if (prop === 'width' || prop === 'height' || prop === 'depth') finalVal = snap(val);
        
        // Keep 2D footprint height/depth in sync with properties bar changes
        if (prop === 'depth') {
          return { ...item, depth: finalVal, height: finalVal };
        }
        if (prop === 'height') {
          return { ...item, height: finalVal, depth: finalVal };
        }
        
        return { ...item, [prop]: finalVal };
      }
      return item;
    }));
    setIsDirty(true);
  };

  // Drag operations
  const handleMouseDown = (e, item) => {
    if (e.button !== 0) return; // Left click only
    setSelectedId(item.id);
    saveHistoryState();

    const startX = e.clientX;
    const startY = e.clientY;
    const itemStartX = item.x;
    const itemStartY = item.y;

    const handleMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / zoom;
      const dy = (moveEvent.clientY - startY) / zoom;
      let nx = snap(itemStartX + dx);
      let ny = snap(itemStartY + dy);

      nx = Math.max(0, Math.min(roomWidth - item.width, nx));
      ny = Math.max(0, Math.min(roomHeight - item.height, ny));

      // Calculate dynamic alignment guidelines (within 6px alignment threshold)
      const currentGuides = [];
      items.forEach(other => {
        if (other.id === item.id) return;
        
        // Horizontal alignment (x center or edges)
        if (Math.abs(other.x - nx) < 6) {
          nx = other.x;
          currentGuides.push({ type: 'vertical', x: nx, label: `${(nx / 100).toFixed(2)} m` });
        }
        if (Math.abs((other.x + other.width) - (nx + item.width)) < 6) {
          nx = other.x + other.width - item.width;
          currentGuides.push({ type: 'vertical', x: nx + item.width, label: `${((nx + item.width) / 100).toFixed(2)} m` });
        }

        // Vertical alignment
        if (Math.abs(other.y - ny) < 6) {
          ny = other.y;
          currentGuides.push({ type: 'horizontal', y: ny, label: `${(ny / 100).toFixed(2)} m` });
        }
        if (Math.abs((other.y + other.height) - (ny + item.height)) < 6) {
          ny = other.y + other.height - item.height;
          currentGuides.push({ type: 'horizontal', y: ny + item.height, label: `${((ny + item.height) / 100).toFixed(2)} m` });
        }
      });

      setGuides(currentGuides);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, x: nx, y: ny } : i));
    };

    const handleMouseUp = () => {
      setGuides([]);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Resize Corners and Midpoints (8-handle system)
  const handleResizeStart = (e, item, direction) => {
    e.preventDefault();
    e.stopPropagation();
    saveHistoryState();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = item.width;
    const startH = item.height;
    const startXPos = item.x;
    const startYPos = item.y;

    const handleMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / zoom;
      const dy = (moveEvent.clientY - startY) / zoom;

      let nw = startW;
      let nh = startH;
      let nx = startXPos;
      let ny = startYPos;

      const MIN = 60; // 60px minimum sizing

      if (direction.includes('e')) nw = Math.max(MIN, snap(startW + dx));
      if (direction.includes('s')) nh = Math.max(MIN, snap(startH + dy));
      if (direction.includes('w')) {
        const cx = snap(Math.min(dx, startW - MIN));
        nw = startW - cx;
        nx = startXPos + cx;
      }
      if (direction.includes('n')) {
        const cy = snap(Math.min(dy, startH - MIN));
        nh = startH - cy;
        ny = startYPos + cy;
      }

      if (nx + nw > roomWidth) nw = roomWidth - nx;
      if (ny + nh > roomHeight) nh = roomHeight - ny;

      setItems(prev => prev.map(i => i.id === item.id ? { 
        ...i, 
        width: nw, 
        height: nh,
        depth: nh,
        x: nx,
        y: ny
      } : i));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Rotation with 15deg snap
  const handleRotateStart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    saveHistoryState();

    const element = document.getElementById(`placed-item-${item.id}`);
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const startRotation = item.rotation || 0;

    const handleMouseMove = (moveEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - cy, moveEvent.clientX - cx);
      const diff = currentAngle - startAngle;
      let deg = Math.round(startRotation + (diff * 180) / Math.PI);
      deg = (deg % 360 + 360) % 360;
      deg = Math.round(deg / 15) * 15; // Clean 15 degree snapping

      setItems(prev => prev.map(i => i.id === item.id ? { ...i, rotation: deg } : i));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Switch Room configurations
  const handleSwitchRoomTab = (roomId) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;
    saveHistoryState();
    setActiveRoomId(roomId);
    setRoomWidth(targetRoom.width);
    setRoomHeight(targetRoom.height);
    setSelectedId(null);
    addToast(`Switched active floor section to ${targetRoom.name}`, 'info');
  };

  // Multi-floor configurations switching
  const handleSwitchFloor = (newFloorId) => {
    const updatedFloors = floors.map(f => {
      if (f.id === activeFloorId) {
        return {
          ...f,
          items: items,
          rooms: rooms,
          activeRoomId: activeRoomId,
          roomWidth: roomWidth,
          roomHeight: roomHeight
        };
      }
      return f;
    });

    setFloors(updatedFloors);

    const nextFloor = updatedFloors.find(f => f.id === newFloorId);
    if (nextFloor) {
      setItems(nextFloor.items || []);
      setRooms(nextFloor.rooms || []);
      setActiveRoomId(nextFloor.activeRoomId || null);
      setRoomWidth(nextFloor.roomWidth || 900);
      setRoomHeight(nextFloor.roomHeight || 600);
      setActiveFloorId(newFloorId);
      setFloorName(nextFloor.name);
      addToast(`Switched floor to ${nextFloor.name}`, 'info');
    }
  };

  const handleAddFloor = () => {
    const updatedFloors = floors.map(f => {
      if (f.id === activeFloorId) {
        return {
          ...f,
          items: items,
          rooms: rooms,
          activeRoomId: activeRoomId,
          roomWidth: roomWidth,
          roomHeight: roomHeight
        };
      }
      return f;
    });

    const floorNames = ["Ground Floor", "First Floor", "Second Floor", "Third Floor", "Fourth Floor", "Fifth Floor", "Sixth Floor", "Seventh Floor", "Eighth Floor", "Ninth Floor", "Tenth Floor"];
    const newFloorName = floorNames[updatedFloors.length] || `Floor ${updatedFloors.length}`;
    const newFloorId = `floor_${Date.now()}`;

    const newFloor = {
      id: newFloorId,
      name: newFloorName,
      items: [],
      rooms: [],
      activeRoomId: null,
      roomWidth: 900,
      roomHeight: 600
    };

    setFloors([...updatedFloors, newFloor]);
    setItems([]);
    setRooms([]);
    setActiveRoomId(null);
    setRoomWidth(900);
    setRoomHeight(600);
    setActiveFloorId(newFloorId);
    setFloorName(newFloorName);
    addToast(`Added and switched to ${newFloorName}!`, 'success');
  };

  // Load standard pre-built room templates
  const handleSelectTemplateRoom = (tpl) => {
    saveHistoryState();
    setRoomWidth(tpl.w);
    setRoomHeight(tpl.h);
    // Clear only the active room's items
    setItems(prev => prev.filter(item => item.roomId && item.roomId !== activeRoomId));
    setSelectedId(null);
    addToast(`Initialized ${tpl.name} layout blueprint`, 'success');
  };

  const handleCreateRoomLayout = (folderId, loadTemplate = false) => {
    saveHistoryState();
    const folder = ROOM_FOLDERS.find(f => f.id === folderId);
    if (!folder) return;
    
    const existingCount = rooms.filter(r => r.id.startsWith(folderId)).length;
    const newRoomId = `${folderId}_${Date.now()}`;
    const newRoomName = existingCount > 0 ? `${folder.name} ${existingCount + 1}` : folder.name;

    let w = 900;
    let h = 600;
    if (folderId === 'kitchen') { w = 800; h = 540; }
    else if (folderId === 'bedroom') { w = 800; h = 600; }
    else if (folderId === 'kids') { w = 700; h = 500; }
    else if (folderId === 'bathroom') { w = 600; h = 480; }
    else if (folderId === 'dining') { w = 800; h = 540; }
    else if (folderId === 'hallway') { w = 500; h = 700; }
    else if (folderId === 'office') { w = 800; h = 600; }

    const newRoom = { id: newRoomId, name: newRoomName, width: w, height: h };
    setRooms(prev => [...prev, newRoom]);
    setActiveRoomId(newRoomId);
    setRoomWidth(w);
    setRoomHeight(h);
    setSelectedId(null);

    if (loadTemplate && PREMIUM_ROOM_LAYOUTS[folderId]) {
      const templateItems = PREMIUM_ROOM_LAYOUTS[folderId].map((tplItem, idx) => ({
        ...tplItem,
        id: `item_${Date.now()}_${idx}`,
        roomId: newRoomId,
        zIndex: items.length + idx + 1
      }));
      setItems(prev => [...prev, ...templateItems]);
      addToast(`Initialized fully furnished ${newRoomName} design layout!`, 'success');
    } else {
      addToast(`Added blank ${newRoomName} section!`, 'success');
    }
  };

  const handleDeleteRoom = (roomId, e) => {
    if (e) e.stopPropagation();
    if (rooms.length <= 1) {
      addToast('Cannot delete the last remaining room section!', 'warning');
      return;
    }
    const targetRoom = rooms.find(r => r.id === roomId);
    triggerConfirm(
      'Remove Room Layout?',
      `Are you sure you want to delete "${targetRoom?.name || 'this room'}" permanently? All furniture items placed in this room will also be removed.`,
      () => {
        // Save history state first
        saveHistoryState();
        
        // Remove all items belonging to this room
        setItems(prev => prev.filter(item => item.roomId !== roomId && (item.roomId || roomId !== 'room_1')));
        
        // Remove the room itself
        const remainingRooms = rooms.filter(r => r.id !== roomId);
        setRooms(remainingRooms);
        
        // If the active room was deleted, switch active room to the first remaining one
        if (activeRoomId === roomId) {
          const nextActiveRoom = remainingRooms[0];
          setActiveRoomId(nextActiveRoom.id);
          setRoomWidth(nextActiveRoom.width);
          setRoomHeight(nextActiveRoom.height);
        }
        
        addToast(`Successfully removed "${targetRoom?.name}" and its furniture items.`, 'info');
      }
    );
  };

  const handleExportSnapshot = () => {
    const activeRoom = rooms.find(r => r.id === activeRoomId);
    if (!activeRoom) {
      addToast('No active room section to export!', 'warning');
      return;
    }

    addToast('Generating high-res floor plan snapshot...', 'info');

    // Create an off-screen canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Scale up the canvas size for sharp, high-res prints (2x multiplier)
    const scale = 2;
    canvas.width = roomWidth * scale;
    canvas.height = roomHeight * scale;
    
    ctx.scale(scale, scale);

    // 1. Draw solid background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, roomWidth, roomHeight);

    // 2. Draw dot grid background (similar to Planora premium canvas)
    if (showGridDots) {
      ctx.fillStyle = '#CBD5E1';
      const dotSpacing = 20;
      for (let x = dotSpacing; x < roomWidth; x += dotSpacing) {
        for (let y = dotSpacing; y < roomHeight; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

    // 3. Draw architectural double-border outer walls
    ctx.strokeStyle = '#0F172A'; // Dark navy walls
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, roomWidth, roomHeight);
    
    ctx.strokeStyle = '#E2E8F0'; // Inner wall lining
    ctx.lineWidth = 1.5;
    ctx.strokeRect(3, 3, roomWidth - 6, roomHeight - 6);

    // 4. Render layout items (sorted by z-index to maintain correct layer overlaps)
    const activeRoomItems = items
      .filter(item => item.roomId === activeRoomId || (!item.roomId && activeRoomId === 'room_1'))
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    activeRoomItems.forEach(item => {
      ctx.save();
      
      // Move coordinates to the center of the item
      const cx = item.x + item.width / 2;
      const cy = item.y + item.height / 2;
      ctx.translate(cx, cy);
      
      // Rotate context
      if (item.rotation) {
        ctx.rotate((item.rotation * Math.PI) / 180);
      }

      const itemColor = item.color || '#BFDBFE';
      
      // Draw dynamic item shadow
      ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;

      // Draw custom visual based on furniture type
      if (item.type === 'circular_rug' || item.name.toLowerCase().includes('rug')) {
        // Draw round rug overlays
        ctx.fillStyle = hexToRgba(itemColor, 0.35);
        ctx.strokeStyle = itemColor;
        ctx.lineWidth = 2.5;
        
        ctx.beginPath();
        if (item.type === 'circular_rug') {
          ctx.arc(0, 0, Math.min(item.width, item.height) / 2, 0, 2 * Math.PI);
        } else {
          // Rounded rect for rectangular carpets
          ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 12);
        }
        ctx.fill();
        ctx.stroke();
      } else {
        // Standard furniture item: filled rounded card box
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = itemColor;
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 8);
        ctx.fill();
        ctx.stroke();

        // Draw color accent stripe along the left edge
        ctx.fillStyle = itemColor;
        ctx.beginPath();
        ctx.roundRect(-item.width / 2, -item.height / 2, 8, item.height, { tl: 8, bl: 8, tr: 0, br: 0 });
        ctx.fill();
      }

      // 5. Draw element details (emoji and labeling text)
      ctx.shadowColor = 'transparent'; // Reset shadows for text
      
      // Print item emoji icon
      ctx.font = '22px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.emoji || '🪑', 0, -6);

      // Print item name / label
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(item.name, 0, 18);

      // Print metric sizing label (e.g. 180 x 90 cm)
      ctx.fillStyle = '#64748B';
      ctx.font = '7px monospace';
      ctx.fillText(`${item.width}x${item.height} cm`, 0, 28);

      ctx.restore();
    });

    // 5. Render room identification label
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    
    const labelX = 20;
    const labelY = roomHeight - 25;
    ctx.fillText(`${activeRoom.name} Blueprint`, labelX, labelY);
    
    ctx.fillStyle = '#64748B';
    ctx.font = '9px monospace';
    ctx.fillText(`Scale Ratio 1:50 | ${roomWidth} x ${roomHeight} cm`, labelX, labelY + 12);

    // 6. Trigger PNG file download
    setTimeout(() => {
      try {
        const link = document.createElement('a');
        link.download = `Planora_${floorName.replace(/\s+/g, '_')}_${activeRoom.name.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        addToast('Snapshot downloaded successfully!', 'success');
      } catch (err) {
        console.error('Snapshot generation error:', err);
        addToast('Failed to download image snapshot.', 'danger');
      }
    }, 100);
  };

  // Helper utility to convert hex colors to transparent RGBA format
  const hexToRgba = (hex, alpha) => {
    let c = hex.substring(1);
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Persistent save
  const handleSaveLayout = async () => {
    // Sync current floor states to floors list first
    const updatedFloors = floors.map(f => {
      if (f.id === activeFloorId) {
        return {
          ...f,
          items: items,
          rooms: rooms,
          activeRoomId: activeRoomId,
          roomWidth: roomWidth,
          roomHeight: roomHeight
        };
      }
      return f;
    });

    setFloors(updatedFloors);

    const nameToSave = floorName || 'Modern Apartment Blueprint';
    const payload = {
      id: currentLayoutId,
      name: nameToSave,
      items,
      rooms,
      activeRoomId,
      roomWidth,
      roomHeight,
      floors: updatedFloors,
      activeFloorId,
      roomFloor: 'blueprint',
      gridEnabled: true,
      snapToGrid: true
    };

    try {
      const response = await fetch('/api/layouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (response.ok) {
        addToast(`Layout "${nameToSave}" successfully saved!`, 'success');
        setCurrentLayoutId(result.layout.id);
        setIsDirty(false);
        fetchLayouts();
      } else {
        addToast('Error persisting state', 'error');
      }
    } catch (err) {
      addToast('Network error: server unreachable', 'error');
    }
  };

  const fetchLayouts = async () => {
    try {
      const response = await fetch('/api/layouts');
      if (response.ok) {
        const data = await response.json();
        setSavedLayouts(data);
      }
    } catch (err) {}
  };

  const handleCreateNewFloor = () => {
    saveHistoryState();
    setItems([]);
    setRooms([]);
    setActiveRoomId(null);
    setRoomWidth(900);
    setRoomHeight(600);
    setFloorName('New Floor');
    setCurrentLayoutId(null);
    setSelectedId(null);
    setUndoHistory([]);
    setRedoHistory([]);
    setIsDirty(false);
    setShowFloorsDropdown(false);
    addToast('Created new floor', 'success');
  };

  const handleLoadSavedLayout = (layout) => {
    setItems(layout.items || []);
    
    // Load floors structure
    if (layout.floors && layout.floors.length > 0) {
      setFloors(layout.floors);
      if (layout.activeFloorId) {
        setActiveFloorId(layout.activeFloorId);
      } else {
        setActiveFloorId(layout.floors[0].id);
      }
    } else {
      // Legacy layout format compatibility: setup default Ground, First, and Second floors
      const defaultFloors = [
        { 
          id: 'floor_ground', 
          name: 'Ground Floor', 
          items: layout.items || [], 
          rooms: layout.rooms || [], 
          activeRoomId: layout.activeRoomId || null, 
          roomWidth: layout.roomWidth || 900, 
          roomHeight: layout.roomHeight || 600 
        },
        { id: 'floor_first', name: 'First Floor', items: [], rooms: [], activeRoomId: null, roomWidth: 900, roomHeight: 600 },
        { id: 'floor_second', name: 'Second Floor', items: [], rooms: [], activeRoomId: null, roomWidth: 900, roomHeight: 600 }
      ];
      setFloors(defaultFloors);
      setActiveFloorId('floor_ground');
    }

    if (layout.rooms && layout.rooms.length > 0) {
      setRooms(layout.rooms);
      if (layout.activeRoomId) {
        setActiveRoomId(layout.activeRoomId);
        const activeRoom = layout.rooms.find(r => r.id === layout.activeRoomId);
        if (activeRoom) {
          setRoomWidth(activeRoom.width || 900);
          setRoomHeight(activeRoom.height || 600);
        } else {
          setRoomWidth(layout.roomWidth || 900);
          setRoomHeight(layout.roomHeight || 600);
        }
      } else {
        setActiveRoomId(layout.rooms[0].id);
        setRoomWidth(layout.rooms[0].width || layout.roomWidth || 900);
        setRoomHeight(layout.rooms[0].height || layout.roomHeight || 600);
      }
    } else {
      // Legacy compatibility: create a default room and switch to it
      const defaultRoom = { id: 'room_1', name: 'Main Lounge', width: layout.roomWidth || 900, height: layout.roomHeight || 600 };
      setRooms([defaultRoom]);
      setActiveRoomId('room_1');
      setRoomWidth(layout.roomWidth || 900);
      setRoomHeight(layout.roomHeight || 600);
    }
    setFloorName(layout.name);
    setCurrentLayoutId(layout.id);
    setSelectedId(null);
    setUndoHistory([]);
    setRedoHistory([]);
    setIsDirty(false);
    addToast(`Loaded saved state: "${layout.name}"`, 'success');
  };

  const handleDeleteSavedLayout = async (e, id) => {
    e.stopPropagation();
    triggerConfirm(
      'Delete Saved Design?',
      'Are you sure you want to delete this custom room design permanently? This cannot be undone.',
      async () => {
        try {
          const response = await fetch(`/api/layouts/${id}`, { method: 'DELETE' });
          if (response.ok) {
            addToast('State removed successfully', 'info');
            if (currentLayoutId === id) {
              setCurrentLayoutId(null);
              setIsDirty(false);
            }
            fetchLayouts();
          }
        } catch (err) {}
      }
    );
  };

  // Scale calculations for dynamic metric rules
  const renderRulerTicks = (orientation, length) => {
    const ticks = [];
    const maxVal = length;
    for (let i = 0; i <= maxVal; i += 20) {
      const isMajor = i % 100 === 0;
      if (orientation === 'top') {
        ticks.push(
          <div key={i} className="ruler-ticks">
            <div className={`tick-mark ${isMajor ? 'major' : ''}`} style={{ left: `${i}px`, width: '1px', height: isMajor ? '12px' : '6px', top: '0' }} />
          </div>
        );
      } else {
        ticks.push(
          <div key={i} className="ruler-ticks">
            <div className={`tick-mark ${isMajor ? 'major' : ''}`} style={{ top: `${i}px`, height: '1px', width: isMajor ? '12px' : '6px', left: '0' }} />
          </div>
        );
      }
    }
    return ticks;
  };

  const activeItem = items.find(item => item.id === selectedId);

  // Search Filter across room groups
  const allItems = FURNITURE_ITEMS;

  const filteredCatalogItems = searchQuery
    ? allItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : (selectedRoomFolder ? FURNITURE_ITEMS.filter(item => item.rooms.includes(selectedRoomFolder)) : (selectedCategory ? FURNITURE_ITEMS.filter(item => item.category === selectedCategory) : []));

  if (isLoading) {
    const pcts = [8, 28, 52, 72, 90, 100];
    const currentPct = pcts[loadingStatusIndex] !== undefined ? pcts[loadingStatusIndex] : 100;

    return (
      <div className="plr">
        <div className="plr-grid"></div>
        <div className="plr-vig"></div>

        <div className="plr-corner tl"></div>
        <div className="plr-corner tr"></div>
        <div className="plr-corner bl"></div>
        <div className="plr-corner br"></div>

        {/* floating particles */}
        <div className="plr-particle" style={{ width: '3px', height: '3px', left: '13%', top: '24%', opacity: 0.18, animationDuration: '4.2s', animationDelay: '0s' }}></div>
        <div className="plr-particle" style={{ width: '4px', height: '4px', left: '81%', top: '16%', opacity: 0.14, animationDuration: '5.1s', animationDelay: '0.6s' }}></div>
        <div className="plr-particle" style={{ width: '3px', height: '3px', left: '56%', top: '76%', opacity: 0.2, animationDuration: '3.8s', animationDelay: '1.1s' }}></div>
        <div className="plr-particle" style={{ width: '2px', height: '2px', left: '26%', top: '64%', opacity: 0.12, animationDuration: '4.7s', animationDelay: '1.6s' }}></div>
        <div className="plr-particle" style={{ width: '4px', height: '4px', left: '71%', top: '54%', opacity: 0.16, animationDuration: '3.5s', animationDelay: '0.9s' }}></div>
        <div className="plr-particle" style={{ width: '2px', height: '2px', left: '42%', top: '9%', opacity: 0.1, animationDuration: '5.3s', animationDelay: '0.3s' }}></div>
        <div className="plr-particle" style={{ width: '3px', height: '3px', left: '88%', top: '72%', opacity: 0.15, animationDuration: '4s', animationDelay: '2s' }}></div>
        <div className="plr-particle" style={{ width: '2px', height: '2px', left: '7%', top: '83%', opacity: 0.13, animationDuration: '4.9s', animationDelay: '1.3s' }}></div>

        <div className="plr-card">
          {/* orbit system */}
          <div className="plr-orbit">
            <div className="plr-ring1"></div>
            <div className="plr-ring2"></div>
            <div className="plr-ring3"></div>
            <div className="plr-orb1"></div>
            <div className="plr-orb2"></div>
            <div className="plr-orb3"></div>
            <div className="plr-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5L12 3l9 7.5V21H15v-5H9v5H3V10.5z"/>
                <path d="M9 16h6" strokeOpacity=".45"/>
              </svg>
            </div>
          </div>

          <div className="plr-brand">Planora</div>
          <div className="plr-tag">Spatial Layout Planner</div>

          <div className="plr-track">
            <div className="plr-fill" style={{ width: `${currentPct}%` }}></div>
          </div>

          <div className="plr-pct">
            <span>Loading assets</span>
            <span>{currentPct}%</span>
          </div>

          <div className="plr-status">
            <span key={loadingStatusIndex} style={{ display: 'block', animation: 'pl-status-swap .45s ease both' }}>
              {LOADING_STATUSES[loadingStatusIndex]}
            </span>
          </div>

          <div className="plr-dots">
            <div className="plr-dot"></div>
            <div className="plr-dot"></div>
            <div className="plr-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* TOAST NOTIFICATION HOST */}
      <div className="toasts-stack-container">
        {toasts.map(t => (
          <div key={t.id} className={`premium-toast-card ${t.type}`}>
            <CheckCircle2 size={16} />
            <div className="toast-content-wrapper">
              <span className="toast-message-text">{t.message}</span>
            </div>
            <div className="toast-progress-bar-line" />
          </div>
        ))}
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="top-nav">
        <div className="left-cluster">
          <a href="#" className="logo-section">
            <Home size={20} className="logo-icon-blue" />
            <span>Planora</span>
          </a>
          
          <div className="vertical-divider"></div>
          
          <div style={{ position: 'relative' }}>
            <button 
              className="breadcrumb-all" 
              onClick={(e) => { e.stopPropagation(); setShowFloorsDropdown(prev => !prev); }}
            >
              &lt; All Floors
            </button>
            {showFloorsDropdown && (
              <div className="profile-dropdown-menu" style={{ left: '0', right: 'auto', top: '35px', width: '240px', padding: '12px' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>All Floors</h4>
                  <button 
                    onClick={() => { handleAddFloor(); setShowFloorsDropdown(false); }}
                    style={{ fontSize: '11px', background: '#DBEAFE', color: '#1E40AF', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    + Add Floor
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                  {floors.map(floor => (
                    <div 
                      key={floor.id}
                      onClick={() => { handleSwitchFloor(floor.id); setShowFloorsDropdown(false); }}
                      style={{ 
                        padding: '8px', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        background: activeFloorId === floor.id ? '#EFF6FF' : 'transparent',
                        border: activeFloorId === floor.id ? '1px solid #BFDBFE' : '1px solid transparent',
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '2px'
                      }}
                      onMouseEnter={(e) => { if(activeFloorId !== floor.id) e.currentTarget.style.background = '#F8FAFC'; }}
                      onMouseLeave={(e) => { if(activeFloorId !== floor.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{floor.name}</span>
                        {activeFloorId === floor.id && <span style={{ fontSize: '10px', background: '#3B82F6', color: '#FFF', padding: '1px 4px', borderRadius: '3px', fontWeight: 700 }}>Active</span>}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {floor.id === activeFloorId ? items.length : (floor.items || []).length} items &bull; {floor.id === activeFloorId ? rooms.length : (floor.rooms || []).length} rooms
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <span className="breadcrumb-sep">›</span>
          
          {isEditingFloorName ? (
            <input 
              type="text" 
              className="floor-name-input" 
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
              onBlur={() => setIsEditingFloorName(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingFloorName(false); }}
              autoFocus
            />
          ) : (
            <span 
              className="floor-name-input" 
              style={{ cursor: 'pointer' }}
              onDoubleClick={() => setIsEditingFloorName(true)}
              title="Double click to edit floor name"
            >
              {floorName}
            </span>
          )}

          <div className="vertical-divider"></div>

          <button className="nav-history-btn" onClick={handleUndo} disabled={undoHistory.length === 0}>
            <Undo2 size={15} />
          </button>
          <button className="nav-history-btn" onClick={handleRedo} disabled={redoHistory.length === 0}>
            <Redo2 size={15} />
          </button>
        </div>

        <div className="right-cluster">
          <button className="nav-tool-btn" onClick={handleSnapshot} title="Capture snapshot (PNG)"><Camera size={15} /></button>
          <button className="nav-tool-btn" onClick={handleShare} title="Share layout"><Share2 size={15} /></button>
          <button className="nav-tool-btn" onClick={() => setShowSettingsModal(true)} title="Settings"><Settings size={15} /></button>
          
          <button 
            className={`nav-tool-btn ${is3DMode ? 'nav-tool-active' : ''}`} 
            onClick={() => { setIs3DMode(!is3DMode); addToast(is3DMode ? '2D Flat mode active' : 'Isometric 3D mode active!', 'info'); }} 
            title="Toggle Isometric 3D Mode"
          ><Box size={15} /></button>
          
          <button 
            className={`nav-tool-btn ${isMeasuring ? 'nav-tool-active' : ''}`} 
            onClick={() => { 
              setIsMeasuring(!isMeasuring); 
              if (!isMeasuring) {
                setMeasureStart(null);
                setMeasureEnd(null);
              }
              addToast(isMeasuring ? 'Tape Measure deactivated' : 'Tape Measure activated! Click & drag to measure gaps.', 'info'); 
            }} 
            title="Tape Measure Tool"
          ><Ruler size={15} /></button>

          <button 
            className={`nav-tool-btn ${showBOMDrawer ? 'nav-tool-active' : ''}`} 
            onClick={() => setShowBOMDrawer(!showBOMDrawer)} 
            title="Bill of Materials & Costs"
          ><ShoppingCart size={15} /></button>

          <button 
            className={`nav-tool-btn ${showGridDots ? 'nav-tool-active' : ''}`} 
            onClick={() => { setShowGridDots(g => !g); addToast(showGridDots ? 'Grid hidden' : 'Grid visible', 'info'); }} 
            title="Toggle layout grid"
          ><LayoutGrid size={15} /></button>
          <div style={{ position: 'relative' }}>
            <button 
              className="nav-tool-btn" 
              title="More options"
              onClick={e => { e.stopPropagation(); setShowMoreOptionsMenu(m => !m); }}
            ><MoreVertical size={15} /></button>
            {showMoreOptionsMenu && (
              <div className="more-options-dropdown" onClick={e => e.stopPropagation()}>
                <button className="more-option-item" onClick={() => { handleExportPDF(); setShowMoreOptionsMenu(false); }}>
                  <Printer size={14} /> Export as PDF
                </button>
                <button className="more-option-item" onClick={() => { handleSnapshot(); setShowMoreOptionsMenu(false); }}>
                  <Download size={14} /> Download PNG
                </button>
                <button className="more-option-item" onClick={() => { handleShare(); setShowMoreOptionsMenu(false); }}>
                  <Link2 size={14} /> Copy Share Link
                </button>
                <div className="more-option-divider" />
                <button className="more-option-item" onClick={() => { setIsEditingFloorName(true); setShowMoreOptionsMenu(false); }}>
                  <Palette size={14} /> Rename Floor
                </button>
                <button className="more-option-item danger" onClick={() => { handleClearRoom(); setShowMoreOptionsMenu(false); }}>
                  <Trash2 size={14} /> Clear Room
                </button>
              </div>
            )}
          </div>
          
          <div className="vertical-divider"></div>

          <button className={`btn-upgrade btn-save-pulsing ${isDirty ? 'dirty' : ''}`} onClick={handleSaveLayout}>
            Save Layout
          </button>

          <div style={{ position: 'relative' }}>
            <div className="user-avatar" onClick={e => { e.stopPropagation(); setShowProfileMenu(p => !p); }} title="Saikiran Profile" style={{ cursor: 'pointer' }}>
              SK
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown-menu" onClick={e => e.stopPropagation()}>
                <div className="profile-user-header">
                  <div className="profile-large-avatar">SK</div>
                  <div className="profile-user-details">
                    <h4>Saikiran</h4>
                    <p>{userEmail}</p>
                  </div>
                </div>
                
                <div className="profile-badge-tier">
                  <Sparkles size={12} className="sparkle-gold-icon" style={{ color: '#D97706', marginRight: '4px' }} />
                  <span>Professional Plan</span>
                </div>
                
                <div className="profile-stats-row">
                  <div className="profile-stat-box">
                    <span className="stat-num">{rooms.length}</span>
                    <span className="stat-label">Rooms</span>
                  </div>
                  <div className="profile-stat-box">
                    <span className="stat-num">{items.length}</span>
                    <span className="stat-label">Items</span>
                  </div>
                  <div className="profile-stat-box">
                    <span className="stat-num">{savedLayouts.length}</span>
                    <span className="stat-label">Saved</span>
                  </div>
                </div>
                
                <div className="profile-menu-divider" />
                
                <button className="profile-menu-item" onClick={() => { setShowSettingsModal(true); setShowProfileMenu(false); }}>
                  <Settings size={14} /> Account Settings
                </button>
                <button className="profile-menu-item" onClick={() => { setShowShortcutsModal(true); setShowProfileMenu(false); }}>
                  <HelpCircle size={14} /> Keyboard Shortcuts
                </button>
                
                <div className="profile-menu-divider" />
                
                <button className="profile-menu-item logout" onClick={() => { addToast('Logging out...', 'info'); setShowProfileMenu(false); }}>
                  <ExternalLink size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* WORKSPACE GRID */}
      <div className="workspace-grid with-rooms">
        
        {/* LEFT SIDEBAR */}
        <aside className="sidebar-left">
          <div className="sidebar-header-row">
            <div className="sidebar-title-group">
              <ArrowLeft size={16} style={{ cursor: 'pointer' }} onClick={() => addToast('Navigating back...', 'info')} />
              <span>Furnish</span>
            </div>
            <div className="sidebar-header-actions">
              <Maximize2 size={15} style={{ marginRight: '6px' }} />
              <X size={15} onClick={() => addToast('Sidebar close triggered', 'info')} />
            </div>
          </div>

          <div className="search-container">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              className="sidebar-search-input" 
              placeholder="Search furniture..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sidebar-tabs">
            <button 
              className={`sidebar-tab-btn ${activeTab === 'Rooms' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Rooms'); setSelectedCategory(null); }}
            >
              Rooms
            </button>
            <button 
              className={`sidebar-tab-btn ${activeTab === 'Categories' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Categories'); setSelectedRoomFolder(null); }}
            >
              Categories
            </button>
            <button 
              className={`sidebar-tab-btn ${activeTab === 'Saved' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Saved'); setSelectedRoomFolder(null); setSelectedCategory(null); }}
            >
              Saved
            </button>
          </div>



          {/* Grid Area */}
          <div className="sidebar-scroll-content">
            {activeTab === 'Rooms' ? (
              <div>
                {!searchQuery && !selectedRoomFolder ? (
                  <div>
                    <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                      Select a Room Type
                    </h3>
                    <div className="cards-grid">
                      {ROOM_FOLDERS.map((folder, idx) => (
                        <div
                          key={folder.id}
                          className="card-item"
                          onClick={() => {
                            setSelectedRoomFolder(folder.id);
                          }}
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <div className="card-img-container">
                            <img src={folder.img} alt={folder.name} className="card-img" />
                          </div>
                          <div className="card-meta-row">
                            <span className="card-label">{folder.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {!searchQuery && (
                      <button
                        onClick={() => setSelectedRoomFolder(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: 'none',
                          background: 'none',
                          color: 'var(--primary)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginBottom: '12px',
                          padding: 0
                        }}
                      >
                        ← Back to Room Types
                      </button>
                    )}
                    
                    <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                      {searchQuery ? 'Search Results' : `${ROOM_FOLDERS.find(f => f.id === selectedRoomFolder)?.name} Furniture`}
                    </h3>

                    {!searchQuery && selectedRoomFolder && (
                      <div className="template-option-card">
                        <div className="template-card-title">Create Room Space</div>
                        <p className="template-card-subtitle">Choose a starting layout to place this room division</p>
                        
                        <div className="template-button-row">
                          <button
                            className="btn-template-choice blank"
                            onClick={() => handleCreateRoomLayout(selectedRoomFolder, false)}
                            title="Start with an empty floor plan grid"
                          >
                            <span className="btn-choice-icon">⬜</span>
                            <div className="btn-choice-details">
                              <span className="btn-choice-title">Blank Blueprint</span>
                              <span className="btn-choice-desc">Empty workspace</span>
                            </div>
                          </button>
                          
                          <button
                            className="btn-template-choice premium"
                            onClick={() => handleCreateRoomLayout(selectedRoomFolder, true)}
                            title="Pre-populate with a gorgeous furnished reference template"
                          >
                            <span className="btn-choice-icon">✨</span>
                            <div className="btn-choice-details">
                              <span className="btn-choice-title">Furnished Design</span>
                              <span className="btn-choice-desc">Premium 2D template</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}


                    <div className="cards-grid" style={{ marginBottom: '20px' }}>
                      {filteredCatalogItems.map((catalogItem, idx) => (
                        <div 
                          key={idx} 
                          className="card-item" 
                          onClick={() => handleAddItem(catalogItem)}
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <div className="card-img-container">
                            <img src={catalogItem.img} alt={catalogItem.name} className="card-img" />
                          </div>
                          <div className="card-meta-row">
                            <span className="card-label">{catalogItem.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'Categories' ? (
              <div>
                {!searchQuery && !selectedCategory ? (
                  <div>
                    {/* Collapsible Accordion section Furnish */}
                    <div className="accordion-section">
                      <button 
                        className="accordion-header" 
                        onClick={() => setExpandedAccordionSections(prev => ({ ...prev, furnish: !prev.furnish }))}
                      >
                        <span className="accordion-header-title">Furnish</span>
                        <ChevronRight size={16} className={`accordion-chevron ${expandedAccordionSections.furnish ? 'expanded' : ''}`} />
                      </button>
                      {expandedAccordionSections.furnish && (
                        <div className="accordion-content">
                          {FURNISH_CATEGORIES.map(cat => (
                            <button 
                              key={cat.id} 
                              className={`category-row-item ${selectedCategory === cat.id ? 'active' : ''}`}
                              onClick={() => { setSelectedCategory(cat.id); addToast(`Opened ${cat.name} catalog`, 'info'); }}
                            >
                              <div className="category-row-left">
                                <span className="category-row-icon">{cat.icon('#2563EB')}</span>
                                <span>{cat.name}</span>
                              </div>
                              <ChevronRight size={14} style={{ opacity: 0.5 }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Collapsible Accordion section Electrical appliances */}
                    <div className="accordion-section">
                      <button 
                        className="accordion-header" 
                        onClick={() => setExpandedAccordionSections(prev => ({ ...prev, electrical: !prev.electrical }))}
                      >
                        <span className="accordion-header-title">Electrical appliances</span>
                        <ChevronRight size={16} className={`accordion-chevron ${expandedAccordionSections.electrical ? 'expanded' : ''}`} />
                      </button>
                      {expandedAccordionSections.electrical && (
                        <div className="accordion-content">
                          {ELECTRICAL_CATEGORIES.map(cat => (
                            <button 
                              key={cat.id} 
                              className={`category-row-item ${selectedCategory === cat.id ? 'active' : ''}`}
                              onClick={() => { setSelectedCategory(cat.id); addToast(`Opened ${cat.name} catalog`, 'info'); }}
                            >
                              <div className="category-row-left">
                                <span className="category-row-icon">{cat.icon('#2563EB')}</span>
                                <span>{cat.name}</span>
                              </div>
                              <ChevronRight size={14} style={{ opacity: 0.5 }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Collapsible Accordion section Misc */}
                    <div className="accordion-section">
                      <button 
                        className="accordion-header" 
                        onClick={() => setExpandedAccordionSections(prev => ({ ...prev, misc: !prev.misc }))}
                      >
                        <span className="accordion-header-title">Misc</span>
                        <ChevronRight size={16} className={`accordion-chevron ${expandedAccordionSections.misc ? 'expanded' : ''}`} />
                      </button>
                      {expandedAccordionSections.misc && (
                        <div className="accordion-content">
                          {MISC_CATEGORIES.map(cat => (
                            <button 
                              key={cat.id} 
                              className={`category-row-item ${selectedCategory === cat.id ? 'active' : ''}`}
                              onClick={() => { setSelectedCategory(cat.id); addToast(`Opened ${cat.name} catalog`, 'info'); }}
                            >
                              <div className="category-row-left">
                                <span className="category-row-icon">{cat.icon('#2563EB')}</span>
                                <span>{cat.name}</span>
                              </div>
                              <ChevronRight size={14} style={{ opacity: 0.5 }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {!searchQuery && (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: 'none',
                          background: 'none',
                          color: 'var(--primary)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginBottom: '12px',
                          padding: 0
                        }}
                      >
                        ← Back to Categories
                      </button>
                    )}
                    
                    <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                      {searchQuery ? 'Search Results' : `${ALL_CATALOG_FOLDERS.find(f => f.id === selectedCategory)?.name} Furniture`}
                    </h3>

                    <div className="cards-grid" style={{ marginBottom: '20px' }}>
                      {filteredCatalogItems.map((catalogItem, idx) => (
                        <div 
                          key={idx} 
                          className="card-item" 
                          onClick={() => handleAddItem(catalogItem)}
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <div className="card-img-container">
                            <img src={catalogItem.img} alt={catalogItem.name} className="card-img" />
                          </div>
                          <div className="card-meta-row">
                            <span className="card-label">{catalogItem.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'Saved' ? (
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  Saved Floor Designs
                </h3>
                <div className="saved-layouts-section">
                  {savedLayouts.map(layout => (
                    <div 
                      key={layout.id} 
                      className={`saved-layout-card-blue ${currentLayoutId === layout.id ? 'active' : ''}`}
                      onClick={() => handleLoadSavedLayout(layout)}
                      style={{ marginBottom: '8px' }}
                    >
                      <div className="layout-details">
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{layout.name}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {layout.items.length} items &bull; {new Date(layout.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="layout-card-actions">
                        <button className="btn-layout-action" onClick={(e) => { e.stopPropagation(); handleLoadSavedLayout(layout); }}>
                          <Eye size={12} />
                        </button>
                        <button className="btn-layout-action delete-hover" onClick={(e) => handleDeleteSavedLayout(e, layout.id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {savedLayouts.length === 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px', border: '1px dashed #E2E8F0', borderRadius: '8px' }}>
                      No saved layout files found on disk.
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <footer className="sidebar-footer">
            <span>{items.length} items placed</span>
          </footer>
        </aside>

        {/* CANVAS WORKSPACE AREA */}
        <section className="canvas-container" onClick={() => setSelectedId(null)}>

          {rooms.length === 0 ? (
            <div className="empty-canvas-state" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-secondary)',
              padding: '40px',
              textAlign: 'center',
              animation: 'pl-fade-up 0.4s ease both'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
              }}>
                <Home size={32} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Your Floor Plan is Empty</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: '1.6', marginBottom: '20px' }}>
                Open the <strong>Rooms</strong> tab in the sidebar and select a room category to add your first room and start designing!
              </p>
              <button 
                onClick={() => { setActiveTab('Rooms'); setSelectedRoomFolder(null); }}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                }}
              >
                Browse Room Types
              </button>
            </div>
          ) : (
            <div className="room-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}>
            

            {/* Outer Wall Dimensions (matching inspiration image) */}
            <div className="room-outer-dimensions">
              {/* Top arrow dimension */}
              <div className="outer-dim-line top-dim" style={{ width: `${roomWidth}px`, top: '-40px', left: '0' }}>
                <div className="outer-dim-tick"></div>
                <div className="outer-dim-arrow-left">&larr;</div>
                <div className="outer-dim-line-seg"></div>
                <span className="outer-dim-text">{(roomWidth / 100).toFixed(2)} m</span>
                <div className="outer-dim-line-seg"></div>
                <div className="outer-dim-arrow-right">&rarr;</div>
                <div className="outer-dim-tick"></div>
              </div>

              {/* Bottom arrow dimension */}
              <div className="outer-dim-line bottom-dim" style={{ width: `${roomWidth}px`, bottom: '-40px', left: '0' }}>
                <div className="outer-dim-tick"></div>
                <div className="outer-dim-arrow-left">&larr;</div>
                <div className="outer-dim-line-seg"></div>
                <span className="outer-dim-text">{(roomWidth / 100).toFixed(2)} m</span>
                <div className="outer-dim-line-seg"></div>
                <div className="outer-dim-arrow-right">&rarr;</div>
                <div className="outer-dim-tick"></div>
              </div>

              {/* Left arrow dimension */}
              <div className="outer-dim-line left-dim" style={{ height: `${roomHeight}px`, left: '-50px', top: '0' }}>
                <div className="outer-dim-tick-v"></div>
                <div className="outer-dim-arrow-up">&uarr;</div>
                <div className="outer-dim-line-seg-v"></div>
                <span className="outer-dim-text-v">{(roomHeight / 100).toFixed(2)} m</span>
                <div className="outer-dim-line-seg-v"></div>
                <div className="outer-dim-arrow-down">&darr;</div>
                <div className="outer-dim-tick-v"></div>
              </div>

              {/* Right arrow dimension */}
              <div className="outer-dim-line right-dim" style={{ height: `${roomHeight}px`, right: '-50px', top: '0' }}>
                <div className="outer-dim-tick-v"></div>
                <div className="outer-dim-arrow-up">&uarr;</div>
                <div className="outer-dim-line-seg-v"></div>
                <span className="outer-dim-text-v">{(roomHeight / 100).toFixed(2)} m</span>
                <div className="outer-dim-line-seg-v"></div>
                <div className="outer-dim-arrow-down">&darr;</div>
                <div className="outer-dim-tick-v"></div>
              </div>
            </div>

            {/* Room Blueprint Canvas */}
            <div
              id="room-blueprint-canvas"
              className={`room-box-premium ${selectedId ? 'unselected' : 'selected'} ${showGridDots ? 'grid-dots-active' : 'grid-dots-hidden'} ${is3DMode ? 'is-3d-view' : ''}`}
              style={{
                width: `${roomWidth}px`,
                height: `${roomHeight}px`,
                borderColor: selectedId ? '#64748B' : roomBoundaryColor,
                transform: is3DMode ? 'perspective(1000px) rotateX(60deg) rotateZ(-45deg)' : 'none',
                transformStyle: is3DMode ? 'preserve-3d' : 'flat',
                boxShadow: is3DMode ? '15px 15px 30px rgba(15, 23, 42, 0.25)' : 'none',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease',
                cursor: isMeasuring ? 'crosshair' : 'default'
              }}
              onMouseDown={(e) => {
                if (!isMeasuring) return;
                e.preventDefault();
                e.stopPropagation();
                
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = (e.clientX - rect.left) / zoom;
                const clickY = (e.clientY - rect.top) / zoom;
                const sx = snap(clickX);
                const sy = snap(clickY);
                
                setMeasureStart({ x: sx, y: sy });
                setMeasureEnd({ x: sx, y: sy });
                
                const handleMouseMove = (moveEvent) => {
                  const mx = (moveEvent.clientX - rect.left) / zoom;
                  const my = (moveEvent.clientY - rect.top) / zoom;
                  setMeasureEnd({ x: snap(mx), y: snap(my) });
                };
                
                const handleMouseUp = () => {
                  window.removeEventListener('mousemove', handleMouseMove);
                  window.removeEventListener('mouseup', handleMouseUp);
                };
                
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
              }}
              onClick={(e) => {
                if (isMeasuring) return;
                if (e.target.id === 'room-blueprint-canvas') setSelectedId(null);
              }}
            >
              {/* Placed Furniture Elements */}
              {items.filter(item => !item.roomId || item.roomId === activeRoomId).map(item => {
                const isSelected = item.id === selectedId;
                const isFavourite = !!favourites[item.id];
                return (
                  <div
                    key={item.id}
                    id={`placed-item-${item.id}`}
                    className={`placed-item placed-item-enter ${isSelected ? 'selected' : ''}`}
                    style={{
                      left: `${item.x}px`,
                      top: `${item.y}px`,
                      width: `${item.width}px`,
                      height: `${item.height}px`,
                      transform: is3DMode
                        ? `rotate(${item.rotation || 0}deg) translate3d(0, 0, ${item.elevation || 0}px)`
                        : `rotate(${item.rotation || 0}deg)`,
                      transformStyle: is3DMode ? 'preserve-3d' : 'flat',
                      boxShadow: is3DMode
                        ? `0 1px 0 #CBD5E1, 0 2px 0 #94A3B8, 0 3px 0 #64748B, 0 4px 0 #475569, 0 ${4 + (item.elevation || 0)/10}px 10px rgba(15,23,42,0.25)`
                        : 'none',
                      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease',
                      zIndex: item.zIndex || 1
                    }}
                    onMouseDown={(e) => handleMouseDown(e, item)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="placed-svg-wrapper">
                      {renderFurnitureSvg(item.type, item.color)}
                    </div>

                    {/* LIVE DIMENSION PILL LABELS (WHILE SELECTED) */}
                    {isSelected && (
                      <>
                        <div className="dim-label-blue dim-label-width">
                          {(item.width / 100).toFixed(2)} m
                        </div>
                        <div className="dim-label-blue dim-label-height">
                          {(item.height / 100).toFixed(2)} m
                        </div>
                      </>
                    )}

                    {/* TRANSFORM RESIZE HANDLES */}
                    {isSelected && (
                      <div className="premium-handle-layer">
                        {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(dir => (
                          <div 
                            key={dir} 
                            className={`premium-resize-sq rsq-${dir}`} 
                            onMouseDown={(e) => handleResizeStart(e, item, dir)}
                          />
                        ))}

                        {/* ROTATION MECHANISM */}
                        <div className="premium-rotate-connector"></div>
                        <div className="premium-rotate-circle" onMouseDown={(e) => handleRotateStart(e, item)}>
                          <RotateCw size={8} style={{ color: '#2563EB' }} />
                        </div>
                        <div className="premium-rotate-badge">
                          {item.rotation || 0}°
                        </div>
                      </div>
                    )}

                    {/* CURVED CIRCULAR ACTION MENU (CROWN ARC ABOVE THE SELECTED ITEM) */}
                    {isSelected && (
                      <div className="curved-action-arc-layer" onMouseDown={e => e.stopPropagation()}>
                        {[
                          { 
                            icon: <Palette size={13} />, 
                            title: "Style Color", 
                            onClick: () => {
                              setShowColorPicker(prev => !prev);
                              addToast('Custom Color Customizer active!', 'info');
                            }
                          },
                          { 
                            icon: <Shuffle size={13} />, 
                            title: "Flip", 
                            onClick: () => handleFlipItem(item.id) 
                          },
                          { 
                            icon: <Copy size={13} />, 
                            title: "Duplicate", 
                            onClick: () => handleDuplicateItem(item.id) 
                          },
                          { 
                            icon: <Heart size={13} fill={isFavourite ? '#EF4444' : 'none'} style={{ color: isFavourite ? '#EF4444' : 'inherit' }} />, 
                            title: "Favorite", 
                            onClick: () => handleToggleFavorite(item.id) 
                          },
                          { 
                            icon: <RotateCw size={13} />, 
                            title: "Rotate 90°", 
                            onClick: () => handleUpdateItemProperty(item.id, 'rotation', ((item.rotation || 0) + 90) % 360) 
                          },
                          { 
                            icon: <Trash2 size={13} style={{ color: '#EF4444' }} />, 
                            title: "Delete", 
                            onClick: () => handleDeleteItem(item.id),
                            isDelete: true 
                          }
                        ].map((btn, btnIdx, arr) => {
                          const R = Math.max(item.width, item.height) / 2 + 40;
                          const startAngle = -150 * Math.PI / 180;
                          const endAngle = -30 * Math.PI / 180;
                          const angle = startAngle + (btnIdx * (endAngle - startAngle) / (arr.length - 1));
                          const cx = item.width / 2;
                          const cy = item.height / 2;
                          const x = cx + R * Math.cos(angle) - 16;
                          const y = cy + R * Math.sin(angle) - 16;

                          return (
                            <button
                              key={btnIdx}
                              className={`arc-action-btn ${btn.isDelete ? 'delete-btn' : ''}`}
                              style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                position: 'absolute'
                              }}
                              onClick={btn.onClick}
                              title={btn.title}
                            >
                              {btn.icon}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* WALL DISTANCE ALIGNMENT LINES AND PILLS (FOR SELECTED ITEM - MATCHING INSPIRATION IMAGE) */}
              {activeItem && (
                <>
                  {/* Top wall line & badge */}
                  {activeItem.y > 5 && (
                    <>
                      <div 
                        className="wall-distance-line vertical-dist-line" 
                        style={{
                          left: `${activeItem.x + activeItem.width / 2}px`,
                          top: 0,
                          height: `${activeItem.y}px`
                        }}
                      />
                      <div 
                        className="wall-distance-badge"
                        style={{
                          left: `${activeItem.x + activeItem.width / 2}px`,
                          top: `${activeItem.y / 2}px`
                        }}
                      >
                        {(activeItem.y / 100).toFixed(2)} m
                      </div>
                    </>
                  )}

                  {/* Left wall line & badge */}
                  {activeItem.x > 5 && (
                    <>
                      <div 
                        className="wall-distance-line horizontal-dist-line" 
                        style={{
                          left: 0,
                          top: `${activeItem.y + activeItem.height / 2}px`,
                          width: `${activeItem.x}px`
                        }}
                      />
                      <div 
                        className="wall-distance-badge"
                        style={{
                          left: `${activeItem.x / 2}px`,
                          top: `${activeItem.y + activeItem.height / 2}px`
                        }}
                      >
                        {(activeItem.x / 100).toFixed(2)} m
                      </div>
                    </>
                  )}

                  {/* Right wall line & badge */}
                  {(roomWidth - (activeItem.x + activeItem.width)) > 5 && (
                    <>
                      <div 
                        className="wall-distance-line horizontal-dist-line" 
                        style={{
                          left: `${activeItem.x + activeItem.width}px`,
                          top: `${activeItem.y + activeItem.height / 2}px`,
                          width: `${roomWidth - (activeItem.x + activeItem.width)}px`
                        }}
                      />
                      <div 
                        className="wall-distance-badge"
                        style={{
                          left: `${activeItem.x + activeItem.width + (roomWidth - (activeItem.x + activeItem.width)) / 2}px`,
                          top: `${activeItem.y + activeItem.height / 2}px`
                        }}
                      >
                        {((roomWidth - (activeItem.x + activeItem.width)) / 100).toFixed(2)} m
                      </div>
                    </>
                  )}

                  {/* Bottom wall line & badge */}
                  {(roomHeight - (activeItem.y + activeItem.height)) > 5 && (
                    <>
                      <div 
                        className="wall-distance-line vertical-dist-line" 
                        style={{
                          left: `${activeItem.x + activeItem.width / 2}px`,
                          top: `${activeItem.y + activeItem.height}px`,
                          height: `${roomHeight - (activeItem.y + activeItem.height)}px`
                        }}
                      />
                      <div 
                        className="wall-distance-badge"
                        style={{
                          left: `${activeItem.x + activeItem.width / 2}px`,
                          top: `${activeItem.y + activeItem.height + (roomHeight - (activeItem.y + activeItem.height)) / 2}px`
                        }}
                      >
                        {((roomHeight - (activeItem.y + activeItem.height)) / 100).toFixed(2)} m
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ALIGNMENT DYNAMIC HELPERS */}
              {guides.map((guide, idx) => (
                <div
                  key={idx}
                  className={`alignment-guide-line ${guide.type}`}
                  style={
                    guide.type === 'horizontal'
                      ? { top: `${guide.y}px`, left: '0', right: '0' }
                      : { left: `${guide.x}px`, top: '0', bottom: '0' }
                  }
                >
                  <span 
                    className="alignment-guide-badge"
                    style={
                      guide.type === 'horizontal'
                        ? { left: '12px', top: '-10px' }
                        : { top: '12px', left: '-20px' }
                    }
                  >
                    {guide.label}
                  </span>
                </div>
              ))}

              {/* Bottom Scale arrow helper */}
              <div className="scale-bar-under">
                <div className="scale-line"></div>
                <span className="scale-text">&larr; 5 m &rarr;</span>
              </div>

              {/* INTERACTIVE TAPE MEASURE OVERLAY */}
              {isMeasuring && measureStart && measureEnd && (
                <svg 
                  className="measure-vector-overlay" 
                  style={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: 0, 
                    width: '100%', 
                    height: '100%', 
                    pointerEvents: 'none', 
                    zIndex: 99999 
                  }}
                >
                  <line 
                    x1={measureStart.x} 
                    y1={measureStart.y} 
                    x2={measureEnd.x} 
                    y2={measureEnd.y} 
                    stroke="#EF4444" 
                    strokeWidth="2.5" 
                    strokeDasharray="6,4" 
                  />
                  <circle cx={measureStart.x} cy={measureStart.y} r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx={measureEnd.x} cy={measureEnd.y} r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                  
                  <foreignObject
                    x={(measureStart.x + measureEnd.x) / 2 - 40}
                    y={(measureStart.y + measureEnd.y) / 2 - 14}
                    width="80"
                    height="28"
                  >
                    <div style={{
                      background: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 6px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                      border: '1px solid #FFFFFF',
                      whiteSpace: 'nowrap',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}>
                      {(Math.sqrt(Math.pow(measureEnd.x - measureStart.x, 2) + Math.pow(measureEnd.y - measureStart.y, 2)) / 100).toFixed(2)} m
                    </div>
                  </foreignObject>
                </svg>
              )}

            </div>
          </div>
        )}

          {/* ZOOM CONTROL BAR (RIGHT STRIP) */}
          <div className="zoom-strip-right">
            <button className="zoom-strip-btn" onClick={() => setShowShortcutsModal(true)} title="Shortcuts"><HelpCircle size={16} /></button>
            <button className="zoom-strip-btn" onClick={handleExportPDF} title="Export PDF"><ExternalLink size={16} /></button>
            <button className="zoom-strip-btn" onClick={handleRecenter} title="Recenter blueprint focus"><Locate size={16} /></button>
            <div className="zoom-strip-separator"></div>
            <button className="zoom-strip-btn" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} title="Zoom In"><Plus size={16} /></button>
            <button className="zoom-strip-btn" onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} title="Zoom Out"><Minus size={16} /></button>
          </div>
        </section>

        {/* BOTTOM SLIDE-UP PROPERTY CONTROL PANEL */}
        {activeItem && (
          <div className="bottom-property-bar" onMouseDown={e => e.stopPropagation()}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginRight: '8px' }}>
              {activeItem.name} Properties:
            </span>
            <div className="prop-input-group">
              <span className="prop-input-label">Width:</span>
              <input 
                type="number" className="prop-input-field" 
                value={activeItem.width.toFixed(2)}
                onChange={e => handleUpdateItemProperty(activeItem.id, 'width', parseFloat(e.target.value) || 60)}
              />
              <span className="prop-input-label" style={{ fontSize: '11px' }}>cm</span>
            </div>

            <div className="prop-input-group">
              <span className="prop-input-label">Depth:</span>
              <input 
                type="number" className="prop-input-field" 
                value={(activeItem.depth || activeItem.height).toFixed(2)}
                onChange={e => handleUpdateItemProperty(activeItem.id, 'depth', parseFloat(e.target.value) || 60)}
              />
              <span className="prop-input-label" style={{ fontSize: '11px' }}>cm</span>
            </div>

            <div className="prop-input-group">
              <span className="prop-input-label">Height:</span>
              <input 
                type="number" className="prop-input-field" 
                value={(activeItem.height).toFixed(2)}
                onChange={e => handleUpdateItemProperty(activeItem.id, 'height', parseFloat(e.target.value) || 60)}
              />
              <span className="prop-input-label" style={{ fontSize: '11px' }}>cm</span>
            </div>

            <div className="prop-input-group">
              <span className="prop-input-label">Angle:</span>
              <input 
                type="number" className="prop-input-field" 
                value={(activeItem.rotation || 0).toFixed(2)}
                onChange={e => handleUpdateItemProperty(activeItem.id, 'rotation', parseFloat(e.target.value) || 0)}
              />
              <span className="prop-input-label" style={{ fontSize: '11px' }}>°</span>
            </div>

            <div className="prop-input-group">
              <span className="prop-input-label">Elevation:</span>
              <input 
                type="number" className="prop-input-field" 
                value={(activeItem.elevation || 0).toFixed(2)}
                onChange={e => handleUpdateItemProperty(activeItem.id, 'elevation', parseFloat(e.target.value) || 0)}
              />
              <span className="prop-input-label" style={{ fontSize: '11px' }}>cm</span>
            </div>

            <div className="prop-input-group" style={{ position: 'relative' }}>
              <span className="prop-input-label">Color:</span>
              <button 
                className="prop-color-swatch-circle" 
                style={{ backgroundColor: activeItem.color || '#BFDBFE' }}
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Customize furniture color"
              />
              {showColorPicker && (
                <div className="premium-color-popup" onMouseDown={e => e.stopPropagation()}>
                  <div className="color-popup-header">
                    <span>Customize Color</span>
                    <button className="color-popup-close" onClick={() => setShowColorPicker(false)}>&times;</button>
                  </div>
                  
                  {/* Preset Swatches Grid ("Direct circles of colors") */}
                  <div className="color-preset-grid">
                    {[
                      '#BFDBFE', '#FED7AA', '#FDE68A', '#A7F3D0', '#DDD6FE', '#FBCFE8', 
                      '#2563EB', '#16A34A', '#DC2626', '#D97706', '#7C3AED', '#475569', 
                      '#FFFFFF', '#1E293B', '#8B5A2B', '#D7B58B'
                    ].map(col => (
                      <button 
                        key={col}
                        className={`color-preset-circle ${activeItem.color === col ? 'active' : ''}`}
                        style={{ backgroundColor: col }}
                        onClick={() => {
                          handleUpdateItemProperty(activeItem.id, 'color', col);
                          addToast('Color updated', 'success');
                        }}
                        title={col}
                      />
                    ))}
                  </div>

                  <div className="color-popup-divider" />

                  {/* Spectrum Circle & Color Code input */}
                  <div className="color-custom-row">
                    <div className="custom-picker-wrapper" title="Open Custom Color Wheel">
                      <input 
                        type="color" 
                        className="native-color-wheel"
                        value={activeItem.color || '#BFDBFE'} 
                        onChange={(e) => handleUpdateItemProperty(activeItem.id, 'color', e.target.value)} 
                      />
                      <span className="picker-wheel-label">Color Wheel</span>
                    </div>

                    <div className="custom-input-wrapper">
                      <span className="custom-input-label">Hex Code:</span>
                      <input 
                        type="text" 
                        className="custom-hex-field" 
                        value={activeItem.color || '#BFDBFE'} 
                        onChange={(e) => handleUpdateItemProperty(activeItem.id, 'color', e.target.value)}
                        placeholder="#HEX"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ marginLeft: 'auto' }}>
              <button 
                className="btn-layout-action delete-hover" 
                style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                onClick={() => handleDeleteItem(activeItem.id)}
                title="Remove selected block"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* FLOATING ACTIVE ROOM SWITCHER (DRAGGABLE ANYWHERE IN THE WHOLE PAGE) */}
      {rooms.length > 0 && (
        <div 
          className="floating-room-switcher" 
          style={roomSwitcherPos.x !== null ? { left: `${roomSwitcherPos.x}px`, top: `${roomSwitcherPos.y}px`, transform: 'none', right: 'auto', margin: '0' } : {}}
          onMouseDown={handleRoomSwitcherMouseDown}
          onClick={e => e.stopPropagation()}
        >
          {rooms.map(r => (
            <div 
              key={r.id} 
              className={`floating-room-tab ${activeRoomId === r.id ? 'active' : ''}`}
              onClick={() => handleSwitchRoomTab(r.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', position: 'relative' }}
            >
              <span>{r.name}</span>
              <span className="room-tab-badge">&bull; {items.filter(item => item.roomId === r.id || (!item.roomId && r.id === 'room_1')).length}</span>
              
              {rooms.length > 1 && (
                <button
                  className="room-tab-delete-btn"
                  onClick={(e) => handleDeleteRoom(r.id, e)}
                  title={`Delete ${r.name}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '2px',
                    color: 'rgba(239, 68, 68, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.15s ease',
                    marginLeft: '2px'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(239, 68, 68, 0.65)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <X size={11} />
                </button>
              )}
            </div>
          ))}
          <button 
            className="floating-room-add-btn" 
            onClick={() => {
              const nextId = `room_${Date.now()}`;
              const nextName = `Room Section ${rooms.length + 1}`;
              setRooms([...rooms, { id: nextId, name: nextName, width: 800, height: 600 }]);
              addToast(`Added ${nextName}`, 'success');
            }}
            title="Add floor division"
          >
            <Plus size={14} />
          </button>
        </div>
      )}

      {/* DRAGGABLE MINIMAP / ROOM FILLED TRACKER (DRAGGABLE ANYWHERE IN THE WHOLE PAGE) */}
      {showMinimap && rooms.length > 0 && (
        <div 
          className="minimap-card"
          style={minimapPos.x !== null ? { left: `${minimapPos.x}px`, top: `${minimapPos.y}px`, bottom: 'auto', right: 'auto' } : {}}
          onMouseDown={handleMinimapMouseDown}
        >
          <button className="btn-minimap-toggle" onClick={() => setShowMinimap(false)} title="Close minimap">
            <MapPin size={10} />
          </button>
          <div className="minimap-replica-room">
            {items.filter(item => !item.roomId || item.roomId === activeRoomId).map(item => (
              <div
                key={item.id}
                className="minimap-replica-item"
                style={{
                  left: `${(item.x / roomWidth) * 100}%`,
                  top: `${(item.y / roomHeight) * 100}%`,
                  width: `${(item.width / roomWidth) * 100}%`,
                  height: `${(item.height / roomHeight) * 100}%`
                }}
              />
            ))}
          </div>
        </div>
      )}
      {!showMinimap && (
        <button 
          className="btn-minimap-closed-toggle"
          style={minimapPos.x !== null ? { left: `${minimapPos.x}px`, top: `${minimapPos.y}px`, bottom: 'auto', right: 'auto' } : {}}
          onMouseDown={handleMinimapMouseDown}
          onClick={() => setShowMinimap(true)}
          title="Show minimap"
        >
          <MapPin size={14} style={{ margin: 'auto' }} />
        </button>
      )}



      {/* KEYBOARD SHORTCUTS MODAL */}
      {showShortcutsModal && (
        <div className="modal-backdrop-blur" onClick={() => setShowShortcutsModal(false)}>
          <div className="shortcuts-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title-row">
              <h3>Keyboard Shortcuts</h3>
              <button className="btn-modal-close" onClick={() => setShowShortcutsModal(false)}><X size={18} /></button>
            </div>
            
            <div className="shortcuts-two-col">
              <div className="shortcut-item-row">
                <span className="shortcut-desc">Delete selected item</span>
                <kbd className="kbd-style">Delete / Backspace</kbd>
              </div>
              <div className="shortcut-item-row">
                <span className="shortcut-desc">Duplicate selected item</span>
                <kbd className="kbd-style">Ctrl + D</kbd>
              </div>
              <div className="shortcut-item-row">
                <span className="shortcut-desc">Undo latest change</span>
                <kbd className="kbd-style">Ctrl + Z</kbd>
              </div>
              <div className="shortcut-item-row">
                <span className="shortcut-desc">Redo latest change</span>
                <kbd className="kbd-style">Ctrl + Shift + Z</kbd>
              </div>
              <div className="shortcut-item-row">
                <span className="shortcut-desc">Recenter blueprint focus</span>
                <kbd className="kbd-style">Esc</kbd>
              </div>
              <div className="shortcut-item-row">
                <span className="shortcut-desc">Open shortcuts manual</span>
                <kbd className="kbd-style">?</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS CONFIGURATION MODAL */}
      {showSettingsModal && (
        <div className="modal-backdrop-blur" onClick={() => setShowSettingsModal(false)}>
          <div className="shortcuts-modal-box settings-modal-box" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-title-row">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={18} className="logo-icon-blue" />
                <span>Settings Control Panel</span>
              </h3>
              <button className="btn-modal-close" onClick={() => setShowSettingsModal(false)}><X size={18} /></button>
            </div>

            {/* TAB SELECTOR HEADER */}
            <div className="modal-tabs-header" style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '16px', gap: '12px' }}>
              {['blueprint', 'account', 'preferences'].map(tab => (
                <button
                  key={tab}
                  className={`modal-tab-btn ${settingsActiveTab === tab ? 'active' : ''}`}
                  onClick={() => setSettingsActiveTab(tab)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: settingsActiveTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                    padding: '8px 4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: settingsActiveTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {tab === 'blueprint' ? 'Blueprint' : tab === 'account' ? 'Account' : 'Preferences'}
                </button>
              ))}
            </div>
            
            <div className="settings-grid-flow">
              {/* TAB 1: BLUEPRINT SETTINGS */}
              {settingsActiveTab === 'blueprint' && (
                <>
                  <div className="setting-control-group">
                    <label className="setting-label">Floor Division Name</label>
                    <input 
                      type="text" 
                      className="setting-input-text" 
                      value={floorName} 
                      onChange={e => setFloorName(e.target.value)} 
                      placeholder="e.g. Ground Floor"
                    />
                  </div>

                  <div className="settings-row-pair">
                    <div className="setting-control-group">
                      <label className="setting-label">Canvas Width (cm)</label>
                      <input 
                        type="number" 
                        className="setting-input-text" 
                        value={roomWidth} 
                        onChange={e => setRoomWidth(Math.max(300, Math.min(2000, parseInt(e.target.value) || 900)))} 
                        step="50"
                      />
                      <span className="setting-helper-text">Min: 300cm, Max: 2000cm</span>
                    </div>
                    <div className="setting-control-group">
                      <label className="setting-label">Canvas Height (cm)</label>
                      <input 
                        type="number" 
                        className="setting-input-text" 
                        value={roomHeight} 
                        onChange={e => setRoomHeight(Math.max(300, Math.min(2000, parseInt(e.target.value) || 600)))} 
                        step="50"
                      />
                      <span className="setting-helper-text">Min: 300cm, Max: 2000cm</span>
                    </div>
                  </div>

                  <div className="setting-control-group" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                    <label className="setting-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span>Enable Minimap Tracker</span>
                      <input 
                        type="checkbox" 
                        checked={showMinimap} 
                        onChange={e => setShowMinimap(e.target.checked)} 
                        style={{ width: '16px', height: '16px', accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                    </label>
                  </div>

                  <div className="setting-control-group" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginTop: '6px' }}>
                    <label className="setting-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span>Visible Dot Layout Grid</span>
                      <input 
                        type="checkbox" 
                        checked={showGridDots} 
                        onChange={e => setShowGridDots(e.target.checked)} 
                        style={{ width: '16px', height: '16px', accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                    </label>
                  </div>
                </>
              )}

              {/* TAB 2: ACCOUNT PROFILE SETTINGS */}
              {settingsActiveTab === 'account' && (
                <>
                  <div className="setting-control-group">
                    <label className="setting-label">Full Name</label>
                    <input 
                      type="text" 
                      className="setting-input-text" 
                      value={userName} 
                      onChange={e => setUserName(e.target.value)} 
                    />
                  </div>

                  <div className="setting-control-group">
                    <label className="setting-label">Email Address</label>
                    <input 
                      type="email" 
                      className="setting-input-text" 
                      value={userEmail} 
                      onChange={e => setUserEmail(e.target.value)} 
                    />
                  </div>

                  <div className="setting-control-group">
                    <label className="setting-label">Professional Role</label>
                    <input 
                      type="text" 
                      className="setting-input-text" 
                      value={userRole} 
                      onChange={e => setUserRole(e.target.value)} 
                    />
                  </div>

                  <div className="setting-control-group" style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', border: '1px solid #E2E8F0', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>Account Membership</div>
                        <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Professional Plan Subscription</div>
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 800, background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D', padding: '3px 8px', borderRadius: '12px' }}>
                        ACTIVE
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: DESIGNER PREFERENCES */}
              {settingsActiveTab === 'preferences' && (
                <>
                  <div className="setting-control-group">
                    <label className="setting-label">Grid Snap Increment</label>
                    <select
                      className="setting-input-text"
                      value={gridSnapSize}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setGridSnapSize(val);
                        addToast(`Grid snap increment set to ${val}cm`, 'info');
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="1">No Snap (Free movement)</option>
                      <option value="5">Fine Snap (5 cm)</option>
                      <option value="10">Standard Snap (10 cm)</option>
                      <option value="20">Coarse Snap (20 cm)</option>
                      <option value="50">Broad Snap (50 cm)</option>
                    </select>
                  </div>

                  <div className="setting-control-group">
                    <label className="setting-label">Measurement Metric System</label>
                    <select
                      className="setting-input-text"
                      value={measurementUnit}
                      onChange={e => {
                        setMeasurementUnit(e.target.value);
                        addToast(`Measurement system updated to ${e.target.value === 'cm' ? 'Centimeters' : 'Inches'}`, 'info');
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="cm">Metric (Centimeters / Meters)</option>
                      <option value="in">Imperial (Inches / Feet)</option>
                    </select>
                  </div>

                  <div className="setting-control-group">
                    <label className="setting-label">Selected Room Border Accent</label>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      {['#2563EB', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#0F172A'].map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setRoomBoundaryColor(color);
                            addToast('Room boundary theme updated!', 'success');
                          }}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: color,
                            border: roomBoundaryColor === color ? '3px solid #FFFFFF' : '1px solid rgba(0, 0, 0, 0.1)',
                            boxShadow: roomBoundaryColor === color ? '0 0 0 2px var(--primary)' : 'none',
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="btn-layout-action" style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '0 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }} onClick={() => setShowSettingsModal(false)}>
                  Cancel
                </button>
                <button className="btn-upgrade" onClick={() => { setShowSettingsModal(false); addToast('Configuration updated successfully!', 'success'); }}>
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BILL OF MATERIALS & COST ESTIMATOR DRAWER */}
      {showBOMDrawer && (
        <div className="bom-drawer-backdrop" onClick={() => setShowBOMDrawer(false)}>
          <div className="bom-drawer-card" onClick={e => e.stopPropagation()}>
            <div className="bom-drawer-header">
              <div className="bom-header-title-cluster">
                <ShoppingCart className="bom-header-icon" size={18} />
                <h3>Bill of Materials & Cost Estimator</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setShowBOMDrawer(false)}><X size={18} /></button>
            </div>
            
            <div className="bom-drawer-content">
              {items.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ShoppingCart size={40} style={{ opacity: 0.15, marginBottom: '12px' }} />
                  <p style={{ fontSize: '13px' }}>Your active room floor plan is empty!</p>
                  <p style={{ fontSize: '11px', marginTop: '4px' }}>Add catalog elements to populate the Bill of Materials.</p>
                </div>
              ) : (
                <>
                  {/* BOM Tab Bar */}
                  <div className="bom-tabs" style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 20px', background: '#F8FAFC', overflowX: 'auto', gap: '8px' }}>
                    <button 
                      className={`bom-tab-btn ${bomActiveTab === 'total' ? 'active' : ''}`}
                      onClick={() => setBomActiveTab('total')}
                      style={{
                        padding: '10px 14px',
                        border: 'none',
                        background: 'none',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: bomActiveTab === 'total' ? 'var(--primary)' : 'var(--text-secondary)',
                        borderBottom: bomActiveTab === 'total' ? '2px solid var(--primary)' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      📁 Total Summary
                    </button>
                    {rooms.map(room => (
                      <button 
                        key={room.id}
                        className={`bom-tab-btn ${bomActiveTab === room.id ? 'active' : ''}`}
                        onClick={() => setBomActiveTab(room.id)}
                        style={{
                          padding: '10px 14px',
                          border: 'none',
                          background: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: bomActiveTab === room.id ? 'var(--primary)' : 'var(--text-secondary)',
                          borderBottom: bomActiveTab === room.id ? '2px solid var(--primary)' : '2px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        🚪 {room.name}
                      </button>
                    ))}
                  </div>

                  {bomActiveTab === 'total' ? (
                    /* group summary view */
                    <div className="bom-total-summary-view" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
                      <div style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', padding: '16px', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Project Budget</h4>
                        <span style={{ fontSize: '26px', fontWeight: 800, color: '#1E3A8A' }}>
                          ${items.reduce((sum, item) => sum + (bomItemCosts[item.id] !== undefined ? bomItemCosts[item.id] : 120), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#1E40AF' }}>
                          Across {rooms.length} rooms and {items.length} total elements.
                        </p>
                      </div>

                      <h4 style={{ margin: '10px 0 0 0', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Cost Segregation by Room Division</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {rooms.map(room => {
                          const roomItems = items.filter(item => item.roomId === room.id || (!item.roomId && room.id === 'room_1'));
                          const roomCost = roomItems.reduce((sum, item) => sum + (bomItemCosts[item.id] !== undefined ? bomItemCosts[item.id] : 120), 0);
                          return (
                            <div 
                              key={room.id}
                              onClick={() => setBomActiveTab(room.id)}
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '12px 16px', 
                                background: '#FFFFFF', 
                                border: '1px solid #E2E8F0', 
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.08)'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                              <div>
                                <h5 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{room.name}</h5>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{roomItems.length} elements placed</span>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                  ${roomCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <div style={{ fontSize: '9px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>View details →</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* itemized list view for selected room tab */
                    <>
                      <div className="bom-table-wrapper" style={{ flex: 1, overflowY: 'auto' }}>
                        <div style={{ padding: '12px 20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            Itemized List: {rooms.find(r => r.id === bomActiveTab)?.name || 'Elements'}
                          </span>
                          <button 
                            onClick={() => setBomActiveTab('total')}
                            style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            ← Back to Total
                          </button>
                        </div>
                        
                        <table className="bom-table">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Category</th>
                              <th>Dimensions (WxD)</th>
                              <th style={{ textAlign: 'right' }}>Est. Cost ($)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items
                              .filter(item => item.roomId === bomActiveTab || (!item.roomId && bomActiveTab === 'room_1'))
                              .map(item => {
                                const cost = bomItemCosts[item.id] !== undefined ? bomItemCosts[item.id] : 120;
                                return (
                                  <tr key={item.id}>
                                    <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '16px' }}>{item.emoji || '🪑'}</span>
                                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                                      </div>
                                    </td>
                                    <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.type || 'Furniture'}</td>
                                    <td style={{ fontSize: '11px', fontFamily: 'monospace' }}>{item.width} x {item.height} cm</td>
                                    <td style={{ textAlign: 'right' }}>
                                      <input 
                                        type="number"
                                        className="bom-cost-input"
                                        value={cost}
                                        onChange={(e) => {
                                          const nextCosts = { ...bomItemCosts, [item.id]: parseFloat(e.target.value) || 0 };
                                          setBomItemCosts(nextCosts);
                                        }}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            {items.filter(item => item.roomId === bomActiveTab || (!item.roomId && bomActiveTab === 'room_1')).length === 0 && (
                              <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                  No items placed in this room division yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="bom-footer-summary">
                        <div className="bom-summary-row">
                          <span>Room elements count:</span>
                          <span style={{ fontWeight: 700 }}>
                            {items.filter(item => item.roomId === bomActiveTab || (!item.roomId && bomActiveTab === 'room_1')).length} items
                          </span>
                        </div>
                        <div className="bom-summary-row highlight">
                          <span>Room Budget Subtotal:</span>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                            ${items
                              .filter(item => item.roomId === bomActiveTab || (!item.roomId && bomActiveTab === 'room_1'))
                              .reduce((sum, item) => sum + (bomItemCosts[item.id] !== undefined ? bomItemCosts[item.id] : 120), 0)
                              .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHARE PROJECT LINK MODAL */}
      {showShareModal && (
        <div className="modal-backdrop-blur" onClick={() => setShowShareModal(false)}>
          <div className="shortcuts-modal-box share-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title-row">
              <h3>Share Your Floor Design</h3>
              <button className="btn-modal-close" onClick={() => setShowShareModal(false)}><X size={18} /></button>
            </div>
            
            <div className="share-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Anyone with this custom URL will be able to load, view, and live edit your exact floor layout with all furniture states intact!
              </p>
              
              <div className="share-link-input-wrapper" style={{ display: 'flex', gap: '8px', background: '#F8FAFC', padding: '6px', borderRadius: '8px', border: '1px solid #E2E8F0', alignItems: 'center' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={shareLink} 
                  style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '11px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', padding: '4px' }}
                  onClick={e => e.target.select()}
                />
                <button 
                  className="btn-layout-action" 
                  onClick={handleCopyShareLink}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', height: '30px' }}
                >
                  {shareLinkCopied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* PREMIUM CUSTOM CONFIRMATION OVERLAY MODAL */}
      {confirmModal.isOpen && (
        <div className="modal-backdrop-blur" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}>
          <div className="shortcuts-modal-box confirm-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-title-row" style={{ borderBottom: 'none', paddingBottom: '0' }}>
              <h3 style={{ color: '#EF4444' }}>{confirmModal.title || 'Are you sure?'}</h3>
              <button className="btn-modal-close" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}><X size={18} /></button>
            </div>
            
            <div style={{ padding: '12px 24px 20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {confirmModal.message}
              </p>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  className="btn-layout-action"
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  style={{
                    background: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #E2E8F0',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
