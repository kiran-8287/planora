import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Home, ChevronRight, Undo2, Redo2, Camera, Share2, Settings, 
  LayoutGrid, MoreVertical, Search, ArrowLeft, Maximize2, X, 
  Eye, Heart, Trash2, RotateCw, PlusCircle, HelpCircle, 
  ExternalLink, Locate, Plus, Minus, MapPin, Sparkles, CheckCircle2,
  Copy, Download, Printer, ChevronDown, Palette, SlidersHorizontal,
  FileDown, Link2, RefreshCw, Shuffle
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

const ALL_CATALOG_FOLDERS = [
  ...FURNISH_CATEGORIES,
  ...ELECTRICAL_CATEGORIES,
  ...MISC_CATEGORIES
];

const FURNITURE_ITEMS = [
  { type: 'armchair', name: 'Lounge Armchair', emoji: '🪑', width: 90, height: 90, img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'armchairs' },
  { type: 'sofa', name: 'Luxury Sofa', emoji: '🛋', width: 180, height: 90, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&q=80', rooms: ['living'], category: 'sofas' },
  { type: 'l_sofa', name: 'Sectional L-Sofa', emoji: '🛋', width: 220, height: 180, img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=260&q=80', rooms: ['living'], category: 'sofas' },
  { type: 'ottoman', name: 'Velvet Ottoman', emoji: '🦶', width: 70, height: 70, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=260&q=80', rooms: ['living', 'bedroom'], category: 'ottoman' },
  { type: 'bed', name: 'King-Size Bed', emoji: '🛏', width: 200, height: 180, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=260&q=80', rooms: ['bedroom'], category: 'beds' },
  { type: 'single_bed', name: 'Single Bed', emoji: '🛏', width: 190, height: 100, img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=260&q=80', rooms: ['bedroom'], category: 'beds' },
  { type: 'wardrobe', name: 'Sliding Wardrobe', emoji: '🚪', width: 160, height: 60, img: 'https://images.unsplash.com/photo-1558882224-cca166733360?w=260&q=80', rooms: ['bedroom', 'hallway'], category: 'storage' },
  { type: 'dresser', name: 'Vanity Dresser', emoji: '🪞', width: 100, height: 50, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['bedroom', 'living', 'hallway'], category: 'storage' },
  { type: 'nightstand', name: 'Oak Nightstand', emoji: '🗄', width: 60, height: 50, img: 'https://images.unsplash.com/photo-1532372320978-9b4d7a92b24d?w=260&q=80', rooms: ['bedroom', 'bathroom', 'hallway'], category: 'storage' },
  { type: 'dining_table', name: 'Dining Oak Table', emoji: '🍽', width: 180, height: 100, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['living', 'kitchen', 'dining'], category: 'tables_chairs' },
  { type: 'chair', name: 'Designer Chair', emoji: '🪑', width: 60, height: 60, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=260&q=80', rooms: ['living', 'kitchen', 'dining', 'public'], category: 'tables_chairs' },
  { type: 'stool', name: 'Bar Stool', emoji: '🪑', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=260&q=80', rooms: ['kitchen'], category: 'tables_chairs' },
  { type: 'writing_desk', name: 'Office Desk', emoji: '💻', width: 140, height: 75, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=260&q=80', rooms: ['bedroom', 'office'], category: 'office' },
  { type: 'office_chair', name: 'Ergonomic Chair', emoji: '🪑', width: 65, height: 65, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=260&q=80', rooms: ['bedroom', 'office'], category: 'office' },
  { type: 'kids_bed', name: 'Kids Bed', emoji: '🛏', width: 150, height: 90, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=260&q=80', rooms: ['kids'], category: 'kids' },
  { type: 'play_desk', name: 'Kids Play Desk', emoji: '💻', width: 100, height: 55, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=260&q=80', rooms: ['kids'], category: 'kids' },
  { type: 'toy_cabinet', name: 'Toy Cabinet', emoji: '🗄', width: 90, height: 45, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['kids'], category: 'kids' },
  { type: 'little_chair', name: 'Little Chair', emoji: '🪑', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=260&q=80', rooms: ['kids'], category: 'kids' },
  { type: 'island', name: 'Kitchen Island', emoji: '🍳', width: 200, height: 100, img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=260&q=80', rooms: ['kitchen'], category: 'kitchen' },
  { type: 'counter', name: 'Kitchen Counter', emoji: '🍳', width: 160, height: 60, img: 'https://images.unsplash.com/photo-1556912403-c596e57667e6?w=260&q=80', rooms: ['kitchen'], category: 'kitchen' },
  { type: 'tub', name: 'Freestanding Tub', emoji: '🛁', width: 170, height: 80, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['bathroom'], category: 'bathroom' },
  { type: 'shower', name: 'Shower Cabin', emoji: '🚿', width: 100, height: 100, img: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=260&q=80', rooms: ['bathroom'], category: 'bathroom' },
  { type: 'sink', name: 'Double Sink', emoji: '🚰', width: 120, height: 50, img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=260&q=80', rooms: ['bathroom'], category: 'bathroom' },
  { type: 'public_bench', name: 'Public Bench', emoji: '🪑', width: 150, height: 50, img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=260&q=80', rooms: ['living', 'public'], category: 'public' },
  { type: 'floor_lamp', name: 'Floor Lamp', emoji: '💡', width: 60, height: 60, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'kids', 'dining', 'hallway', 'office', 'public'], category: 'lighting' },
  { type: 'reading_lamp', name: 'Reading Lamp', emoji: '💡', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['bedroom'], category: 'lighting' },
  { type: 'washing_machine', name: 'Washing Machine', emoji: '🧺', width: 70, height: 70, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['bathroom', 'kitchen'], category: 'appliances' },
  { type: 'fridge', name: 'Refrigerator', emoji: '🧊', width: 80, height: 80, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=260&q=80', rooms: ['kitchen'], category: 'kitchen_appliances' },
  { type: 'tv_console', name: 'TV Cabinet', emoji: '📺', width: 180, height: 50, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=260&q=80', rooms: ['living', 'bedroom'], category: 'audio_video' },
  { type: 'ac_unit', name: 'AC Unit', emoji: '❄️', width: 100, height: 30, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=260&q=80', rooms: ['living', 'bedroom', 'office'], category: 'climate' },
  { type: 'mirror', name: 'Mirror', emoji: '🪞', width: 80, height: 10, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['bathroom', 'bedroom', 'hallway', 'decor'], category: 'decor' },
  { type: 'floor_plant', name: 'Monstera Plant', emoji: '🪴', width: 60, height: 60, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'dining', 'hallway', 'office', 'public', 'decor'], category: 'plants' },
  { type: 'person_standing', name: 'Person Silhouette', emoji: '🚶', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=260&q=80', rooms: ['living', 'public'], category: 'people' },
  { type: 'pet_dog', name: 'Dog Silhouette', emoji: '🐕', width: 60, height: 40, img: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=260&q=80', rooms: ['living', 'public'], category: 'pets' },
  { type: 'yoga_mat', name: 'Yoga Mat', emoji: '🧘', width: 180, height: 60, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom'], category: 'sport' },
  { type: 'window_curtain', name: 'Window Curtain', emoji: '🪟', width: 120, height: 12, img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=260&q=80', rooms: ['living', 'bedroom', 'hallway', 'decor'], category: 'curtains' },
  { type: 'circular_rug', name: 'Circular Rug', emoji: '⭕', width: 160, height: 160, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=260&q=80', rooms: ['living', 'bedroom', 'kids', 'dining', 'hallway', 'office', 'decor'], category: 'rugs' },
  { type: 'coffee_maker', name: 'Coffee Station', emoji: '☕', width: 50, height: 50, img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=260&q=80', rooms: ['kitchen'], category: 'kitchenware' }
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
  { id: 'public', name: 'Public space', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=260&q=80' },
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

  // Multi-room active configurations
  const [rooms, setRooms] = useState([
    { id: 'room_1', name: 'Main Lounge', width: 900, height: 600 },
    { id: 'room_2', name: 'Kitchen space', width: 800, height: 540 },
    { id: 'room_3', name: 'Master Bed', width: 800, height: 600 }
  ]);
  const [activeRoomId, setActiveRoomId] = useState('room_1');

  // Zoom factor & Minimap
  const [zoom, setZoom] = useState(1);
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

    // Cycle statuses
    const statusInterval = setInterval(() => {
      setLoadingStatusIndex(prev => (prev < LOADING_STATUSES.length - 1 ? prev + 1 : prev));
    }, 400);

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(statusInterval);
    }, 2400);

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
      clearTimeout(loadTimer);
      clearInterval(statusInterval);
    };
  }, []);

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

  // ── SNAPSHOT: uses html2canvas-like approach via canvas API ──
  const handleSnapshot = () => {
    const el = document.getElementById('room-blueprint-canvas');
    if (!el) { addToast('Canvas not found', 'error'); return; }
    import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js').then(() => {
      window.html2canvas(el, { backgroundColor: '#ffffff', scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${floorName.replace(/\s+/g, '_')}_snapshot.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        addToast('Snapshot saved as PNG!', 'success');
      });
    }).catch(() => {
      // Fallback: open print dialog for the canvas
      addToast('Opening print dialog for snapshot...', 'info');
      window.print();
    });
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
    addToast('Preparing PDF export...', 'info');
    setTimeout(() => window.print(), 400);
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
      zIndex: items.length + 1
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
      zIndex: items.length + 1
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

  // Load standard pre-built room templates
  const handleSelectTemplateRoom = (tpl) => {
    saveHistoryState();
    setRoomWidth(tpl.w);
    setRoomHeight(tpl.h);
    setItems([]);
    setSelectedId(null);
    addToast(`Initialized ${tpl.name} layout blueprint`, 'success');
  };

  // Persistent save
  const handleSaveLayout = async () => {
    const nameToSave = floorName || 'Modern Apartment Blueprint';
    const payload = {
      id: currentLayoutId,
      name: nameToSave,
      items,
      roomWidth,
      roomHeight,
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

  const handleLoadSavedLayout = (layout) => {
    setItems(layout.items || []);
    setRoomWidth(layout.roomWidth || 900);
    setRoomHeight(layout.roomHeight || 600);
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
    if (!window.confirm('Delete this layout record permanently?')) return;

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
    return (
      <div className="planora-preloader-container">
        <div className="preloader-glass-card">
          <div className="preloader-logo-ring">
            <div className="preloader-glowing-circle" />
            <Home size={38} className="preloader-house-icon" style={{ zIndex: '2' }} />
          </div>
          <h2 className="preloader-brand-title">Planora</h2>
          <p className="preloader-subtitle">Spatial Layout Planner</p>
          
          <div className="preloader-progress-track">
            <div className="preloader-progress-fill" style={{ width: `${((loadingStatusIndex + 1) / LOADING_STATUSES.length) * 100}%` }} />
          </div>
          
          <div className="preloader-status-text">
            {LOADING_STATUSES[loadingStatusIndex]}
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
          
          <button className="breadcrumb-all">&lt; All Floors</button>
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
                          onClick={() => { setSelectedRoomFolder(folder.id); addToast(`Opened ${folder.name} catalog`, 'info'); }}
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
            ) : (
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

                <div className="vertical-divider" style={{ width: '100%', height: '1px', background: '#F1F5F9', margin: '16px 0' }} />
                
                {/* Persistence List inside Furnish drawer */}
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Saved Layouts
                </h3>

                <div className="saved-layouts-section">
                  {savedLayouts.map(layout => (
                    <div 
                      key={layout.id} 
                      className={`saved-layout-card-blue ${currentLayoutId === layout.id ? 'active' : ''}`}
                      onClick={() => handleLoadSavedLayout(layout)}
                    >
                      <div className="layout-details">
                        <h4>{layout.name}</h4>
                        <span>{layout.items.length} items &bull; {new Date(layout.lastUpdated).toLocaleDateString()}</span>
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
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px', border: '1px dashed #E2E8F0', borderRadius: '8px' }}>
                      No saved layout files found on disk.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <footer className="sidebar-footer">
            <span>{items.length} items placed</span>
          </footer>
        </aside>

        {/* CANVAS WORKSPACE AREA */}
        <section className="canvas-container" onClick={() => setSelectedId(null)}>

          <div className="room-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}>
            
            {/* Metric Rulers */}
            <div className="ruler-top">
              {renderRulerTicks('top', roomWidth)}
            </div>
            <div className="ruler-left">
              {renderRulerTicks('left', roomHeight)}
            </div>
            <div className="ruler-corner"></div>

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
              className={`room-box-premium ${selectedId ? 'unselected' : 'selected'} ${showGridDots ? 'grid-dots-active' : 'grid-dots-hidden'}`}
              style={{
                width: `${roomWidth}px`,
                height: `${roomHeight}px`,
                borderColor: selectedId ? '#64748B' : roomBoundaryColor
              }}
              onClick={(e) => {
                if (e.target.id === 'room-blueprint-canvas') setSelectedId(null);
              }}
            >
              {/* Dynamic room square meter label */}
              <div className="room-label-centered">
                Room ({((roomWidth * roomHeight) / 10000).toFixed(2)} m²)
              </div>

              {/* Placed Furniture Elements */}
              {items.map(item => {
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
                      transform: `rotate(${item.rotation || 0}deg)`,
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
                              const colors = ['#BFDBFE', '#FED7AA', '#FDE68A', '#A7F3D0', '#DDD6FE', '#FBCFE8', '#FFFFFF'];
                              const nextColor = colors[(colors.indexOf(item.color) + 1) % colors.length];
                              handleUpdateItemProperty(item.id, 'color', nextColor);
                              addToast('Style refreshed', 'success');
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

            </div>
          </div>

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
      <div 
        className="floating-room-switcher" 
        style={roomSwitcherPos.x !== null ? { left: `${roomSwitcherPos.x}px`, top: `${roomSwitcherPos.y}px`, transform: 'none', right: 'auto', margin: '0' } : {}}
        onMouseDown={handleRoomSwitcherMouseDown}
        onClick={e => e.stopPropagation()}
      >
        {rooms.map(r => (
          <button
            key={r.id}
            className={`floating-room-tab ${activeRoomId === r.id ? 'active' : ''}`}
            onClick={() => handleSwitchRoomTab(r.id)}
          >
            {r.name}
            <span className="room-tab-badge">&bull; {activeRoomId === r.id ? items.length : 0}</span>
          </button>
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

      {/* DRAGGABLE MINIMAP / ROOM FILLED TRACKER (DRAGGABLE ANYWHERE IN THE WHOLE PAGE) */}
      {showMinimap && (
        <div 
          className="minimap-card"
          style={minimapPos.x !== null ? { left: `${minimapPos.x}px`, top: `${minimapPos.y}px`, bottom: 'auto', right: 'auto' } : {}}
          onMouseDown={handleMinimapMouseDown}
        >
          <button className="btn-minimap-toggle" onClick={() => setShowMinimap(false)} title="Close minimap">
            <MapPin size={10} />
          </button>
          <div className="minimap-replica-room">
            {items.map(item => (
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
    </div>
  );
}
