export const ALTERNATE_RUN_EVENTS = [
  { key: '15k_bike', label: '15K Bike' },
  { key: '5k_row', label: '5K Row' },
  { key: '1k_swim', label: '1K Swim' },
  { key: '2.5_mile_walk', label: '2.5-Mile Walk' },
];

export const DEFAULT_ALTERNATE_RUN_EVENT = '15k_bike';

export function getAlternateRunLabel(key) {
  return ALTERNATE_RUN_EVENTS.find(e => e.key === key)?.label ?? key;
}
