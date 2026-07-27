/**
 * BlackOut Pub — Configurazione ordine sottocategorie (Menu Engineering)
 * e normalizzazione alias DB → categorie display.
 */
(function (global) {
  'use strict';

  const BADGE_TYPES = {
    'BEST SELLER': { className: 'badge-best-seller', rowClass: 'item-row--badge-best-seller' },
    'NOVITÀ': { className: 'badge-novita', rowClass: 'item-row--badge-novita' },
    'NOVITA': { className: 'badge-novita', rowClass: 'item-row--badge-novita' },
    'CONSIGLIATO': { className: 'badge-consigliato', rowClass: 'item-row--badge-consigliato' },
  };

  const BADGE_OPTIONS = ['', 'BEST SELLER', 'NOVITÀ', 'CONSIGLIATO'];

  /** @type {Record<string, { key: string, label: string, sources: string[] }[]>} */
  const SUB_CATEGORY_CONFIG = {
    Cucina: [
      { key: 'fuori-menu', label: 'Fuori Menù', sources: ['Fuori menù', 'Fuori Menù', 'Fuori Menu', 'Fuori menu'] },
      { key: 'hamburger', label: 'Hamburger', sources: ['Hamburger'] },
      { key: 'piade-panini', label: 'Piade e Panini', sources: ['Piade e panini', 'Piade e Panini', 'Piadine e Panini'] },
      { key: 'fritti', label: 'Fritti', sources: ['Fritti'] },
      { key: 'salse', label: 'Salse', sources: ['Salse', 'salse'] },
      { key: 'vegan', label: 'Vegan', sources: ['Vegan'] },
      { key: 'insalate', label: 'Insalate', sources: ['Insalate'] },
      { key: 'dolci-homemade', label: 'Dolci Homemade', sources: ['Dolci homemade', 'Dolci Homemade'] },
      { key: 'dolci-classici', label: 'Dolci Classici', sources: ['Dolci classici', 'Dolci Classici', 'Dolci'] },
    ],
    Drink: [
      { key: 'cocktail', label: 'Cocktail List', sources: ['Cocktail list', 'Cocktail List', 'Cocktail'] },
      { key: 'gin', label: 'Gin List', sources: ['Gin', 'Gin List', 'Gin list'] },
      { key: 'rum', label: 'Rum', sources: ['Rum', 'Rum / Whisky / Tekila'] },
      { key: 'whisky', label: 'Whisky', sources: ['Whisky'] },
      { key: 'tequila', label: 'Tequila', sources: ['Tekila', 'Tequila'] },
      { key: 'vini', label: 'Vini', sources: ['Vini', 'Vino'] },
      { key: 'analcolici', label: 'Analcolici', sources: ['Analcolici', 'Analcolici / Bibite'] },
      { key: 'bibite', label: 'Bibite', sources: ['Bibite'] },
      { key: 'amari', label: 'Amari', sources: ['Amari', 'Amari / Grappe'] },
      { key: 'grappe', label: 'Grappe', sources: ['Grappe'] },
      { key: 'kaffetteria', label: 'Kaffetteria', sources: ['Kaffetteria', 'Caffetteria'] },
    ],
  };

  const _lookupCache = {};

  function _buildLookup(macro) {
    if (_lookupCache[macro]) return _lookupCache[macro];
    const map = new Map();
    (SUB_CATEGORY_CONFIG[macro] || []).forEach(entry => {
      entry.sources.forEach(src => {
        map.set(src.toLowerCase().trim(), entry);
      });
    });
    _lookupCache[macro] = map;
    return map;
  }

  function resolveSubCategory(macro, dbSubCategory) {
    const raw = (dbSubCategory || '').trim();
    if (macro === 'Drink' && raw.toLowerCase().startsWith('gin')) {
      return { key: 'gin', label: 'Gin List' };
    }
    const lookup = _buildLookup(macro);
    const match = lookup.get(raw.toLowerCase());
    if (match) return { key: match.key, label: match.label };
    const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'altro';
    return { key: 'other-' + slug, label: raw };
  }

  function getOrderedSubCategories(macro, groupedMap) {
    const config = SUB_CATEGORY_CONFIG[macro] || [];
    const ordered = [];
    const seen = new Set();

    config.forEach(entry => {
      if (groupedMap.has(entry.key)) {
        ordered.push({ key: entry.key, label: entry.label });
        seen.add(entry.key);
      }
    });

    [...groupedMap.keys()]
      .filter(k => !seen.has(k))
      .sort((a, b) => (groupedMap.get(a).label || '').localeCompare(groupedMap.get(b).label || ''))
      .forEach(k => ordered.push({ key: k, label: groupedMap.get(k).label }));

    return ordered;
  }

  function groupItemsByDisplayCategory(items, macro) {
    const grouped = new Map();
    items.forEach(item => {
      const { key, label } = resolveSubCategory(macro, item.sub_category);
      if (!grouped.has(key)) grouped.set(key, { label, items: [] });
      grouped.get(key).items.push(item);
    });
    return grouped;
  }

  function getSubCategoryOptions(macro) {
    return (SUB_CATEGORY_CONFIG[macro] || []).map(e => e.label);
  }

  function normalizeBadge(badge) {
    if (!badge || typeof badge !== 'string') return null;
    const trimmed = badge.trim();
    if (!trimmed) return null;
    if (trimmed.toUpperCase() === 'NOVITA') return 'NOVITÀ';
    return trimmed;
  }

  function getBadgeMeta(badge) {
    const norm = normalizeBadge(badge);
    if (!norm) return null;
    return BADGE_TYPES[norm] || BADGE_TYPES[norm.toUpperCase()] || null;
  }

  function formatDescription(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/(?<!\d),(?!\d)\s*|,\s+/g, ' - ')
      .replace(/\s*-\s*(?:-\s*)+/g, ' - ')
      .trim();
  }

  global.MenuConfig = {
    SUB_CATEGORY_CONFIG,
    BADGE_TYPES,
    BADGE_OPTIONS,
    resolveSubCategory,
    getOrderedSubCategories,
    groupItemsByDisplayCategory,
    getSubCategoryOptions,
    normalizeBadge,
    getBadgeMeta,
    formatDescription,
  };
})(typeof window !== 'undefined' ? window : global);

