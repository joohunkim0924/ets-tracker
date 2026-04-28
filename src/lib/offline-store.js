const STORAGE_KEYS = {
  user: 'ets-tracker:user',
  friends: 'ets-tracker:friends',
  aftScores: 'ets-tracker:aft-scores',
  weaponsRecords: 'ets-tracker:weapons-records',
};

const DEFAULT_USER = {
  role: 'user',
  last_name: '',
  first_name: '',
  preferred_name: '',
  rank: '',
  mos: '',
  unit: '',
  enlistment_date: '',
  ets_date: '',
  pcs_date: '',
  age: '',
  gender: '',
  promotion_date: '',
  onboarded: false,
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJson(key, fallback) {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Failed to read local data for ${key}:`, error);
    return fallback;
  }
}

function writeJson(key, value) {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write local data for ${key}:`, error);
  }
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function compareValues(a, b) {
  if (a === b) return 0;
  if (a === undefined || a === null || a === '') return 1;
  if (b === undefined || b === null || b === '') return -1;
  return a > b ? 1 : -1;
}

function sortRecords(records, sortBy) {
  if (!sortBy) return [...records];

  const descending = sortBy.startsWith('-');
  const field = descending ? sortBy.slice(1) : sortBy;
  const sorted = [...records].sort((left, right) => compareValues(left[field], right[field]));

  return descending ? sorted.reverse() : sorted;
}

function getCollection(key) {
  return readJson(key, []);
}

function saveCollection(key, value) {
  writeJson(key, value);
}

export function getUser() {
  return { ...DEFAULT_USER, ...readJson(STORAGE_KEYS.user, {}) };
}

export function saveUser(user) {
  const nextUser = { ...DEFAULT_USER, ...user };
  writeJson(STORAGE_KEYS.user, nextUser);
  return nextUser;
}

export function updateUser(patch) {
  return saveUser({ ...getUser(), ...patch });
}

export function clearAllOfflineData() {
  if (!isBrowser()) return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

function createEntityStore(storageKey, prefix) {
  return {
    async list(sortBy) {
      return sortRecords(getCollection(storageKey), sortBy);
    },

    async create(payload) {
      const items = getCollection(storageKey);
      const nextItem = { id: createId(prefix), ...payload };
      items.push(nextItem);
      saveCollection(storageKey, items);
      return nextItem;
    },

    async update(id, patch) {
      const items = getCollection(storageKey);
      const index = items.findIndex((item) => item.id === id);

      if (index === -1) {
        throw new Error(`Record not found: ${id}`);
      }

      const nextItem = { ...items[index], ...patch, id };
      items[index] = nextItem;
      saveCollection(storageKey, items);
      return nextItem;
    },

    async delete(id) {
      const items = getCollection(storageKey);
      saveCollection(storageKey, items.filter((item) => item.id !== id));
      return { success: true };
    },
  };
}

export const offlineEntities = {
  Friend: createEntityStore(STORAGE_KEYS.friends, 'friend'),
  AFTScore: createEntityStore(STORAGE_KEYS.aftScores, 'aft'),
  WeaponsRecord: createEntityStore(STORAGE_KEYS.weaponsRecords, 'weapon'),
};
