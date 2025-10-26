(function(){
  // Global app namespace
  window.App = window.App || {};
  window.App.util = window.App.util || {};

  const STORAGE_KEY = 'courseLaunchApp.v1';

  function loadState(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch(e){
      console.error('Storage load failed', e);
      return {};
    }
  }
  function saveState(state){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch(e){
      console.error('Storage save failed', e);
    }
  }
  function getState(){
    window.App.state = window.App.state || {};
    const persisted = loadState();
    return Object.assign({}, persisted, window.App.state);
  }
  function setState(patch){
    const merged = Object.assign({}, getState(), patch);
    window.App.state = merged;
    saveState(merged);
    return merged;
  }
  function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
  }
  function uid(prefix){
    const r = Math.random().toString(36).slice(2, 7);
    return (prefix || 'id_') + r + Date.now().toString(36);
  }
  function prefersReducedMotion(){
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; }
  }
  function formatMoney(amount){
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount); } catch(e){ return '$' + amount; }
  }
  function smoothScrollTo(selector){
    try {
      const $el = $(selector);
      if (!$el.length) return;
      if (prefersReducedMotion()) { window.location.hash = selector; return; }
      $('html, body').animate({ scrollTop: $el.offset().top - 64 }, 500);
    } catch(e){ console.error('smoothScrollTo failed', e); }
  }
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function toICSDate(dt){
    // Convert Date to UTC ICS format: YYYYMMDDTHHMMSSZ
    const y = dt.getUTCFullYear();
    const m = pad(dt.getUTCMonth() + 1);
    const d = pad(dt.getUTCDate());
    const h = pad(dt.getUTCHours());
    const mi = pad(dt.getUTCMinutes());
    const s = pad(dt.getUTCSeconds());
    return `${y}${m}${d}T${h}${mi}${s}Z`;
  }
  function buildICS({ title, description, location, start, end }){
    const uidStr = uid('ics_') + '@creativefrontend.app';
    const startStr = toICSDate(start);
    const endStr = toICSDate(end);
    const nowStr = toICSDate(new Date());
    const body = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'PRODID:-//Creative Frontend Foundations//EN',
      'BEGIN:VEVENT',
      `UID:${uidStr}`,
      `DTSTAMP:${nowStr}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${(title || '').replace(/\n/g, ' ')}`,
      `DESCRIPTION:${(description || '').replace(/\n/g, ' ')}`,
      `LOCATION:${(location || '').replace(/\n/g, ' ')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(body);
  }

  // Expose API
  window.App.util.getState = getState;
  window.App.util.setState = setState;
  window.App.util.validateEmail = validateEmail;
  window.App.util.uid = uid;
  window.App.util.prefersReducedMotion = prefersReducedMotion;
  window.App.util.formatMoney = formatMoney;
  window.App.util.smoothScrollTo = smoothScrollTo;
  window.App.util.buildICS = buildICS;
})();
