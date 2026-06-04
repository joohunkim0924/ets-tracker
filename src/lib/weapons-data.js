export const RIFLE_WEAPONS = ['M4'];
export const HANDGUN_WEAPONS = ['M17/M18 MHS'];
export const OTHER_WEAPONS = ['M240B', 'M249', 'M2', 'M320', 'AT4', 'Mk19'];

export const ALL_WEAPONS = [...RIFLE_WEAPONS, ...HANDGUN_WEAPONS, ...OTHER_WEAPONS];

export const OPTIC_TYPES = [
  'Iron Sights',
  'CCO (M68)',
  'ACOG (M150)',
  'LPVO',
];

export function isRifleWeapon(weapon) {
  return RIFLE_WEAPONS.includes(weapon);
}

export function isHandgunWeapon(weapon) {
  return HANDGUN_WEAPONS.includes(weapon);
}
