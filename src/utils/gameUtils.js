export function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function percent(current, max) {
  if (max <= 0) {
    return 0;
  }
  return clamp((current / max) * 100, 0, 100);
}

export function resolveValue(value, state) {
  if (typeof value === "function") {
    return value(state);
  }
  return value ?? "";
}

export function createFlags() {
  return {
    paperSuccess: false,
    coffeeSuccess: false,
    spared: {
      printer: false,
      dean: false,
      librarian: false,
      security: false,
      methodist: false,
      chat: false,
      mold: false,
      final: false,
    },
  };
}

export function normalizeFlags(flags) {
  const defaults = createFlags();

  return {
    ...defaults,
    ...(flags || {}),
    spared: {
      ...defaults.spared,
      ...(flags?.spared || {}),
    },
  };
}

export function saveGameProgress(userId, progress) {
  try {
    const key = `game_progress_${userId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save game progress:', e);
  }
}

export function loadGameProgress(userId) {
  try {
    const key = `game_progress_${userId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load game progress:', e);
  }
  return null;
}

export function clearGameProgress(userId) {
  try {
    const key = `game_progress_${userId}`;
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to clear game progress:', e);
  }
}
