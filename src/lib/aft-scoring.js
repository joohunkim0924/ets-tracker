/**
 * AFT Scoring Tables
 * Source: HQDA EXORD 218-25, Annex B — Approved 1 May 2025, Effective 1 June 2025
 *
 * Tables are [{pts, raw}] with key breakpoints extracted from the official document.
 * For time-based events (sprint_drag_carry, two_mile_run) raw is in SECONDS, LOWER = better.
 * For plank raw is in SECONDS, HIGHER = better.
 * For deadlift raw is in LBS, HIGHER = better.
 * For pushups raw is in REPS, HIGHER = better.
 *
 * "M|C" column used for male values (male and combat arms share the same column in this table).
 */

function ageGroup(age) {
  const a = Number(age);
  if (a < 22) return '17-21';
  if (a < 27) return '22-26';
  if (a < 32) return '27-31';
  if (a < 37) return '32-36';
  if (a < 42) return '37-41';
  if (a < 47) return '42-46';
  if (a < 52) return '47-51';
  if (a < 57) return '52-56';
  if (a < 62) return '57-61';
  return '62+';
}

// Helper: convert "M:SS" string to seconds
function t(str) {
  const [m, s] = str.split(':').map(Number);
  return m * 60 + s;
}

/**
 * DEADLIFT (lbs) — higher is better
 * Key breakpoints per age group & gender from official table (points: 60, 70, 75, 80, 85, 90, 95, 100)
 */
const DEADLIFT = {
  male: {
    '17-21': [{pts:0,raw:80},{pts:60,raw:150},{pts:70,raw:200},{pts:75,raw:220},{pts:80,raw:240},{pts:85,raw:270},{pts:90,raw:300},{pts:95,raw:320},{pts:100,raw:340}],
    '22-26': [{pts:0,raw:80},{pts:60,raw:150},{pts:70,raw:200},{pts:75,raw:220},{pts:80,raw:240},{pts:85,raw:270},{pts:90,raw:300},{pts:95,raw:330},{pts:100,raw:350}],
    '27-31': [{pts:0,raw:80},{pts:60,raw:150},{pts:70,raw:200},{pts:75,raw:220},{pts:80,raw:240},{pts:85,raw:270},{pts:90,raw:300},{pts:95,raw:330},{pts:100,raw:350}],
    '32-36': [{pts:0,raw:80},{pts:60,raw:140},{pts:70,raw:190},{pts:75,raw:210},{pts:80,raw:250},{pts:85,raw:260},{pts:90,raw:300},{pts:95,raw:330},{pts:100,raw:350}],
    '37-41': [{pts:0,raw:80},{pts:60,raw:140},{pts:70,raw:190},{pts:75,raw:220},{pts:80,raw:250},{pts:85,raw:270},{pts:90,raw:300},{pts:95,raw:320},{pts:100,raw:350}],
    '42-46': [{pts:0,raw:80},{pts:60,raw:140},{pts:70,raw:190},{pts:75,raw:220},{pts:80,raw:240},{pts:85,raw:270},{pts:90,raw:290},{pts:95,raw:320},{pts:100,raw:350}],
    '47-51': [{pts:0,raw:80},{pts:60,raw:140},{pts:70,raw:180},{pts:75,raw:200},{pts:80,raw:240},{pts:85,raw:260},{pts:90,raw:290},{pts:95,raw:320},{pts:100,raw:340}],
    '52-56': [{pts:0,raw:80},{pts:60,raw:140},{pts:70,raw:180},{pts:75,raw:200},{pts:80,raw:230},{pts:85,raw:250},{pts:90,raw:280},{pts:95,raw:310},{pts:100,raw:330}],
    '57-61': [{pts:0,raw:80},{pts:60,raw:140},{pts:70,raw:160},{pts:75,raw:180},{pts:80,raw:200},{pts:85,raw:220},{pts:90,raw:250},{pts:95,raw:300},{pts:100,raw:330}],  // note: 57-61 tops at 250/M per table, allowing up to 330 for female column mapping
    '62+':   [{pts:0,raw:80},{pts:60,raw:140},{pts:70,raw:160},{pts:75,raw:170},{pts:80,raw:190},{pts:85,raw:210},{pts:90,raw:230},{pts:95,raw:240},{pts:100,raw:250}],
  },
  female: {
    '17-21': [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:130},{pts:75,raw:140},{pts:80,raw:150},{pts:85,raw:170},{pts:90,raw:180},{pts:95,raw:200},{pts:100,raw:220}],
    '22-26': [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:130},{pts:75,raw:140},{pts:80,raw:150},{pts:85,raw:170},{pts:90,raw:180},{pts:95,raw:210},{pts:100,raw:230}],
    '27-31': [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:130},{pts:75,raw:140},{pts:80,raw:150},{pts:85,raw:170},{pts:90,raw:180},{pts:95,raw:210},{pts:100,raw:240}],
    '32-36': [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:130},{pts:75,raw:140},{pts:80,raw:150},{pts:85,raw:160},{pts:90,raw:180},{pts:95,raw:200},{pts:100,raw:230}],
    '37-41': [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:130},{pts:75,raw:140},{pts:80,raw:150},{pts:85,raw:160},{pts:90,raw:170},{pts:95,raw:190},{pts:100,raw:220}],
    '42-46': [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:130},{pts:75,raw:140},{pts:80,raw:150},{pts:85,raw:160},{pts:90,raw:170},{pts:95,raw:190},{pts:100,raw:210}],
    '47-51': [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:120},{pts:75,raw:130},{pts:80,raw:140},{pts:85,raw:150},{pts:90,raw:170},{pts:95,raw:180},{pts:100,raw:200}],
    '52-56': [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:120},{pts:75,raw:130},{pts:80,raw:140},{pts:85,raw:150},{pts:90,raw:160},{pts:95,raw:170},{pts:100,raw:190}],
    '57-61': [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:120},{pts:75,raw:130},{pts:80,raw:140},{pts:85,raw:150},{pts:90,raw:160},{pts:95,raw:170},{pts:100,raw:170}],
    '62+':   [{pts:0,raw:60},{pts:60,raw:120},{pts:70,raw:120},{pts:75,raw:130},{pts:80,raw:140},{pts:85,raw:150},{pts:90,raw:160},{pts:95,raw:170},{pts:100,raw:170}],
  },
};

/**
 * HAND-RELEASE PUSH-UPS (reps in 2 min) — higher is better
 * Key breakpoints from official table
 */
const PUSHUPS = {
  male: {
    '17-21': [{pts:0,raw:4},{pts:60,raw:15},{pts:65,raw:22},{pts:70,raw:28},{pts:75,raw:32},{pts:80,raw:37},{pts:85,raw:41},{pts:90,raw:46},{pts:95,raw:52},{pts:100,raw:58}],
    '22-26': [{pts:0,raw:4},{pts:60,raw:14},{pts:65,raw:21},{pts:70,raw:26},{pts:75,raw:31},{pts:80,raw:37},{pts:85,raw:42},{pts:90,raw:48},{pts:95,raw:54},{pts:100,raw:61}],
    '27-31': [{pts:0,raw:4},{pts:60,raw:14},{pts:65,raw:21},{pts:70,raw:26},{pts:75,raw:32},{pts:80,raw:37},{pts:85,raw:43},{pts:90,raw:48},{pts:95,raw:54},{pts:100,raw:62}],
    '32-36': [{pts:0,raw:4},{pts:60,raw:13},{pts:65,raw:19},{pts:70,raw:25},{pts:75,raw:31},{pts:80,raw:36},{pts:85,raw:42},{pts:90,raw:47},{pts:95,raw:53},{pts:100,raw:60}],
    '37-41': [{pts:0,raw:4},{pts:60,raw:12},{pts:65,raw:18},{pts:70,raw:24},{pts:75,raw:30},{pts:80,raw:35},{pts:85,raw:40},{pts:90,raw:46},{pts:95,raw:51},{pts:100,raw:59}],
    '42-46': [{pts:0,raw:4},{pts:60,raw:11},{pts:65,raw:16},{pts:70,raw:23},{pts:75,raw:29},{pts:80,raw:34},{pts:85,raw:39},{pts:90,raw:44},{pts:95,raw:49},{pts:100,raw:57}],
    '47-51': [{pts:0,raw:4},{pts:60,raw:11},{pts:65,raw:15},{pts:70,raw:22},{pts:75,raw:27},{pts:80,raw:32},{pts:85,raw:37},{pts:90,raw:42},{pts:95,raw:48},{pts:100,raw:55}],
    '52-56': [{pts:0,raw:4},{pts:60,raw:10},{pts:65,raw:14},{pts:70,raw:21},{pts:75,raw:26},{pts:80,raw:30},{pts:85,raw:35},{pts:90,raw:40},{pts:95,raw:45},{pts:100,raw:51}],
    '57-61': [{pts:0,raw:4},{pts:60,raw:10},{pts:65,raw:13},{pts:70,raw:18},{pts:75,raw:23},{pts:80,raw:27},{pts:85,raw:32},{pts:90,raw:37},{pts:95,raw:43},{pts:100,raw:46}],
    '62+':   [{pts:0,raw:4},{pts:60,raw:10},{pts:65,raw:13},{pts:70,raw:17},{pts:75,raw:21},{pts:80,raw:24},{pts:85,raw:28},{pts:90,raw:33},{pts:95,raw:38},{pts:100,raw:43}],
  },
  female: {
    '17-21': [{pts:0,raw:4},{pts:60,raw:11},{pts:65,raw:14},{pts:70,raw:18},{pts:75,raw:20},{pts:80,raw:23},{pts:85,raw:27},{pts:90,raw:32},{pts:95,raw:38},{pts:100,raw:53}],
    '22-26': [{pts:0,raw:4},{pts:60,raw:11},{pts:65,raw:14},{pts:70,raw:17},{pts:75,raw:20},{pts:80,raw:23},{pts:85,raw:27},{pts:90,raw:32},{pts:95,raw:37},{pts:100,raw:50}],
    '27-31': [{pts:0,raw:4},{pts:60,raw:11},{pts:65,raw:14},{pts:70,raw:17},{pts:75,raw:20},{pts:80,raw:23},{pts:85,raw:27},{pts:90,raw:32},{pts:95,raw:36},{pts:100,raw:48}],
    '32-36': [{pts:0,raw:4},{pts:60,raw:11},{pts:65,raw:14},{pts:70,raw:17},{pts:75,raw:19},{pts:80,raw:23},{pts:85,raw:27},{pts:90,raw:32},{pts:95,raw:36},{pts:100,raw:47}],
    '37-41': [{pts:0,raw:4},{pts:60,raw:10},{pts:65,raw:13},{pts:70,raw:16},{pts:75,raw:19},{pts:80,raw:22},{pts:85,raw:26},{pts:90,raw:30},{pts:95,raw:35},{pts:100,raw:43}],
    '42-46': [{pts:0,raw:4},{pts:60,raw:10},{pts:65,raw:13},{pts:70,raw:15},{pts:75,raw:18},{pts:80,raw:21},{pts:85,raw:25},{pts:90,raw:29},{pts:95,raw:33},{pts:100,raw:40}],
    '47-51': [{pts:0,raw:4},{pts:60,raw:10},{pts:65,raw:12},{pts:70,raw:15},{pts:75,raw:17},{pts:80,raw:20},{pts:85,raw:23},{pts:90,raw:27},{pts:95,raw:31},{pts:100,raw:38}],
    '52-56': [{pts:0,raw:4},{pts:60,raw:10},{pts:65,raw:11},{pts:70,raw:13},{pts:75,raw:16},{pts:80,raw:19},{pts:85,raw:22},{pts:90,raw:26},{pts:95,raw:30},{pts:100,raw:36}],
    '57-61': [{pts:0,raw:4},{pts:60,raw:10},{pts:65,raw:11},{pts:70,raw:13},{pts:75,raw:15},{pts:80,raw:17},{pts:85,raw:20},{pts:90,raw:22},{pts:95,raw:24},{pts:100,raw:24}],
    '62+':   [{pts:0,raw:4},{pts:60,raw:10},{pts:65,raw:11},{pts:70,raw:12},{pts:75,raw:13},{pts:80,raw:15},{pts:85,raw:17},{pts:90,raw:20},{pts:95,raw:23},{pts:100,raw:24}],
  },
};

/**
 * SPRINT-DRAG-CARRY (seconds) — lower is better
 * Key breakpoints (60, 70, 75, 80, 85, 90, 95, 100) from official table
 */
const SDC = {
  male: {
    '17-21': [{pts:100,raw:t('1:29')},{pts:95,raw:t('1:37')},{pts:90,raw:t('1:43')},{pts:85,raw:t('1:48')},{pts:80,raw:t('1:53')},{pts:75,raw:t('1:58')},{pts:70,raw:t('2:03')},{pts:65,raw:t('2:11')},{pts:60,raw:t('2:28')}],
    '22-26': [{pts:100,raw:t('1:30')},{pts:95,raw:t('1:37')},{pts:90,raw:t('1:43')},{pts:85,raw:t('1:48')},{pts:80,raw:t('1:53')},{pts:75,raw:t('1:59')},{pts:70,raw:t('2:05')},{pts:65,raw:t('2:14')},{pts:60,raw:t('2:31')}],
    '27-31': [{pts:100,raw:t('1:30')},{pts:95,raw:t('1:38')},{pts:90,raw:t('1:45')},{pts:85,raw:t('1:50')},{pts:80,raw:t('1:55')},{pts:75,raw:t('2:00')},{pts:70,raw:t('2:06')},{pts:65,raw:t('2:15')},{pts:60,raw:t('2:32')}],
    '32-36': [{pts:100,raw:t('1:33')},{pts:95,raw:t('1:41')},{pts:90,raw:t('1:48')},{pts:85,raw:t('1:53')},{pts:80,raw:t('1:58')},{pts:75,raw:t('2:03')},{pts:70,raw:t('2:10')},{pts:65,raw:t('2:19')},{pts:60,raw:t('2:36')}],
    '37-41': [{pts:100,raw:t('1:36')},{pts:95,raw:t('1:45')},{pts:90,raw:t('1:52')},{pts:85,raw:t('1:57')},{pts:80,raw:t('2:02')},{pts:75,raw:t('2:08')},{pts:70,raw:t('2:14')},{pts:65,raw:t('2:24')},{pts:60,raw:t('2:41')}],
    '42-46': [{pts:100,raw:t('1:40')},{pts:95,raw:t('1:49')},{pts:90,raw:t('1:56')},{pts:85,raw:t('2:01')},{pts:80,raw:t('2:07')},{pts:75,raw:t('2:13')},{pts:70,raw:t('2:20')},{pts:65,raw:t('2:29')},{pts:60,raw:t('2:45')}],
    '47-51': [{pts:100,raw:t('1:45')},{pts:95,raw:t('1:55')},{pts:90,raw:t('2:02')},{pts:85,raw:t('2:08')},{pts:80,raw:t('2:14')},{pts:75,raw:t('2:20')},{pts:70,raw:t('2:27')},{pts:65,raw:t('2:37')},{pts:60,raw:t('2:53')}],
    '52-56': [{pts:100,raw:t('1:52')},{pts:95,raw:t('2:03')},{pts:90,raw:t('2:10')},{pts:85,raw:t('2:16')},{pts:80,raw:t('2:23')},{pts:75,raw:t('2:29')},{pts:70,raw:t('2:35')},{pts:65,raw:t('2:44')},{pts:60,raw:t('3:00')}],
    '57-61': [{pts:100,raw:t('1:58')},{pts:95,raw:t('2:09')},{pts:90,raw:t('2:17')},{pts:85,raw:t('2:23')},{pts:80,raw:t('2:29')},{pts:75,raw:t('2:36')},{pts:70,raw:t('2:43')},{pts:65,raw:t('2:53')},{pts:60,raw:t('3:12')}],
    '62+':   [{pts:100,raw:t('2:09')},{pts:95,raw:t('2:14')},{pts:90,raw:t('2:17')},{pts:85,raw:t('2:21')},{pts:80,raw:t('2:32')},{pts:75,raw:t('2:41')},{pts:70,raw:t('2:49')},{pts:65,raw:t('2:59')},{pts:60,raw:t('3:16')}],
  },
  female: {
    '17-21': [{pts:100,raw:t('1:55')},{pts:95,raw:t('2:08')},{pts:90,raw:t('2:16')},{pts:85,raw:t('2:22')},{pts:80,raw:t('2:28')},{pts:75,raw:t('2:34')},{pts:70,raw:t('2:41')},{pts:65,raw:t('2:51')},{pts:60,raw:t('3:15')}],
    '22-26': [{pts:100,raw:t('1:55')},{pts:95,raw:t('2:06')},{pts:90,raw:t('2:15')},{pts:85,raw:t('2:22')},{pts:80,raw:t('2:29')},{pts:75,raw:t('2:35')},{pts:70,raw:t('2:43')},{pts:65,raw:t('2:54')},{pts:60,raw:t('3:15')}],
    '27-31': [{pts:100,raw:t('1:55')},{pts:95,raw:t('2:08')},{pts:90,raw:t('2:16')},{pts:85,raw:t('2:23')},{pts:80,raw:t('2:29')},{pts:75,raw:t('2:36')},{pts:70,raw:t('2:43')},{pts:65,raw:t('2:53')},{pts:60,raw:t('3:15')}],
    '32-36': [{pts:100,raw:t('1:59')},{pts:95,raw:t('2:11')},{pts:90,raw:t('2:20')},{pts:85,raw:t('2:27')},{pts:80,raw:t('2:34')},{pts:75,raw:t('2:40')},{pts:70,raw:t('2:47')},{pts:65,raw:t('2:57')},{pts:60,raw:t('3:22')}],
    '37-41': [{pts:100,raw:t('2:02')},{pts:95,raw:t('2:15')},{pts:90,raw:t('2:25')},{pts:85,raw:t('2:31')},{pts:80,raw:t('2:38')},{pts:75,raw:t('2:45')},{pts:70,raw:t('2:52')},{pts:65,raw:t('3:02')},{pts:60,raw:t('3:27')}],
    '42-46': [{pts:100,raw:t('2:09')},{pts:95,raw:t('2:20')},{pts:90,raw:t('2:30')},{pts:85,raw:t('2:37')},{pts:80,raw:t('2:44')},{pts:75,raw:t('2:50')},{pts:70,raw:t('2:58')},{pts:65,raw:t('3:08')},{pts:60,raw:t('3:42')}],
    '47-51': [{pts:100,raw:t('2:11')},{pts:95,raw:t('2:28')},{pts:90,raw:t('2:37')},{pts:85,raw:t('2:44')},{pts:80,raw:t('2:50')},{pts:75,raw:t('2:57')},{pts:70,raw:t('3:05')},{pts:65,raw:t('3:16')},{pts:60,raw:t('3:51')}],
    '52-56': [{pts:100,raw:t('2:18')},{pts:95,raw:t('2:35')},{pts:90,raw:t('2:44')},{pts:85,raw:t('2:51')},{pts:80,raw:t('2:58')},{pts:75,raw:t('3:07')},{pts:70,raw:t('3:19')},{pts:65,raw:t('3:30')},{pts:60,raw:t('4:03')}],
    '57-61': [{pts:100,raw:t('2:26')},{pts:95,raw:t('2:44')},{pts:90,raw:t('2:54')},{pts:85,raw:t('3:00')},{pts:80,raw:t('3:07')},{pts:75,raw:t('3:17')},{pts:70,raw:t('3:29')},{pts:65,raw:t('3:43')},{pts:60,raw:t('4:48')}],
    '62+':   [{pts:100,raw:t('2:26')},{pts:95,raw:t('2:44')},{pts:90,raw:t('2:54')},{pts:85,raw:t('3:00')},{pts:80,raw:t('3:07')},{pts:75,raw:t('3:21')},{pts:70,raw:t('3:36')},{pts:65,raw:t('3:50')},{pts:60,raw:t('4:48')}],
  },
};

/**
 * PLANK (seconds) — higher is better
 * From official table: M|C and F same across all age groups 42+ (table shows same values)
 * Breakpoints: 60, 70, 75, 80, 85, 90, 95, 100
 */
const PLANK = {
  male: {
    '17-21': [{pts:0,raw:t('1:00')},{pts:60,raw:t('1:30')},{pts:70,raw:t('2:02')},{pts:75,raw:t('2:19')},{pts:80,raw:t('2:35')},{pts:85,raw:t('2:51')},{pts:90,raw:t('3:08')},{pts:95,raw:t('3:24')},{pts:100,raw:t('3:40')}],
    '22-26': [{pts:0,raw:t('0:55')},{pts:60,raw:t('1:25')},{pts:70,raw:t('1:58')},{pts:75,raw:t('2:14')},{pts:80,raw:t('2:30')},{pts:85,raw:t('2:46')},{pts:90,raw:t('3:03')},{pts:95,raw:t('3:19')},{pts:100,raw:t('3:35')}],
    '27-31': [{pts:0,raw:t('0:50')},{pts:60,raw:t('1:20')},{pts:70,raw:t('1:52')},{pts:75,raw:t('2:09')},{pts:80,raw:t('2:25')},{pts:85,raw:t('2:41')},{pts:90,raw:t('2:58')},{pts:95,raw:t('3:14')},{pts:100,raw:t('3:30')}],
    '32-36': [{pts:0,raw:t('0:45')},{pts:60,raw:t('1:15')},{pts:70,raw:t('1:47')},{pts:75,raw:t('2:04')},{pts:80,raw:t('2:20')},{pts:85,raw:t('2:36')},{pts:90,raw:t('2:53')},{pts:95,raw:t('3:09')},{pts:100,raw:t('3:25')}],
    '37-41': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '42-46': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '47-51': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '52-56': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '57-61': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '62+':   [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
  },
  female: {
    // Plank table shows M|C = F for all age groups — same values
    '17-21': [{pts:0,raw:t('1:00')},{pts:60,raw:t('1:30')},{pts:70,raw:t('2:02')},{pts:75,raw:t('2:19')},{pts:80,raw:t('2:35')},{pts:85,raw:t('2:51')},{pts:90,raw:t('3:08')},{pts:95,raw:t('3:24')},{pts:100,raw:t('3:40')}],
    '22-26': [{pts:0,raw:t('0:55')},{pts:60,raw:t('1:25')},{pts:70,raw:t('1:58')},{pts:75,raw:t('2:14')},{pts:80,raw:t('2:30')},{pts:85,raw:t('2:46')},{pts:90,raw:t('3:03')},{pts:95,raw:t('3:19')},{pts:100,raw:t('3:35')}],
    '27-31': [{pts:0,raw:t('0:50')},{pts:60,raw:t('1:20')},{pts:70,raw:t('1:52')},{pts:75,raw:t('2:09')},{pts:80,raw:t('2:25')},{pts:85,raw:t('2:41')},{pts:90,raw:t('2:58')},{pts:95,raw:t('3:14')},{pts:100,raw:t('3:30')}],
    '32-36': [{pts:0,raw:t('0:45')},{pts:60,raw:t('1:15')},{pts:70,raw:t('1:47')},{pts:75,raw:t('2:04')},{pts:80,raw:t('2:20')},{pts:85,raw:t('2:36')},{pts:90,raw:t('2:53')},{pts:95,raw:t('3:09')},{pts:100,raw:t('3:25')}],
    '37-41': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '42-46': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '47-51': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '52-56': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '57-61': [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
    '62+':   [{pts:0,raw:t('0:40')},{pts:60,raw:t('1:10')},{pts:70,raw:t('1:42')},{pts:75,raw:t('1:59')},{pts:80,raw:t('2:15')},{pts:85,raw:t('2:31')},{pts:90,raw:t('2:47')},{pts:95,raw:t('3:04')},{pts:100,raw:t('3:20')}],
  },
};

/**
 * 2-MILE RUN (seconds) — lower is better
 * Key breakpoints from official table (points 60, 70, 75, 80, 85, 90, 95, 100)
 */
const TMR = {
  male: {
    '17-21': [{pts:100,raw:t('13:22')},{pts:95,raw:t('14:45')},{pts:90,raw:t('15:39')},{pts:85,raw:t('16:28')},{pts:80,raw:t('17:13')},{pts:75,raw:t('17:52')},{pts:70,raw:t('18:35')},{pts:65,raw:t('19:23')},{pts:60,raw:t('19:57')}],
    '22-26': [{pts:100,raw:t('13:25')},{pts:95,raw:t('14:41')},{pts:90,raw:t('15:38')},{pts:85,raw:t('16:29')},{pts:80,raw:t('17:17')},{pts:75,raw:t('17:55')},{pts:70,raw:t('18:23')},{pts:65,raw:t('19:07')},{pts:60,raw:t('19:45')}],
    '27-31': [{pts:100,raw:t('13:25')},{pts:95,raw:t('14:41')},{pts:90,raw:t('15:38')},{pts:85,raw:t('16:33')},{pts:80,raw:t('17:21')},{pts:75,raw:t('18:04')},{pts:70,raw:t('18:23')},{pts:65,raw:t('19:15')},{pts:60,raw:t('19:45')}],
    '32-36': [{pts:100,raw:t('13:42')},{pts:95,raw:t('15:01')},{pts:90,raw:t('15:50')},{pts:85,raw:t('16:30')},{pts:80,raw:t('17:16')},{pts:75,raw:t('17:58')},{pts:70,raw:t('18:30')},{pts:65,raw:t('19:34')},{pts:60,raw:t('20:44')}],
    '37-41': [{pts:100,raw:t('13:42')},{pts:95,raw:t('15:10')},{pts:90,raw:t('16:01')},{pts:85,raw:t('16:48')},{pts:80,raw:t('17:33')},{pts:75,raw:t('18:14')},{pts:70,raw:t('18:35')},{pts:65,raw:t('19:31')},{pts:60,raw:t('20:44')}],
    '42-46': [{pts:100,raw:t('14:05')},{pts:95,raw:t('15:24')},{pts:90,raw:t('16:15')},{pts:85,raw:t('17:01')},{pts:80,raw:t('17:47')},{pts:75,raw:t('18:35')},{pts:70,raw:t('18:55')},{pts:65,raw:t('20:10')},{pts:60,raw:t('22:04')}],
    '47-51': [{pts:100,raw:t('14:30')},{pts:95,raw:t('15:47')},{pts:90,raw:t('16:39')},{pts:85,raw:t('17:25')},{pts:80,raw:t('18:12')},{pts:75,raw:t('19:00')},{pts:70,raw:t('19:30')},{pts:65,raw:t('20:50')},{pts:60,raw:t('22:04')}],
    '52-56': [{pts:100,raw:t('15:09')},{pts:95,raw:t('16:33')},{pts:90,raw:t('17:26')},{pts:85,raw:t('18:13')},{pts:80,raw:t('19:00')},{pts:75,raw:t('19:49')},{pts:70,raw:t('20:20')},{pts:65,raw:t('21:40')},{pts:60,raw:t('22:50')}],
    '57-61': [{pts:100,raw:t('15:28')},{pts:95,raw:t('17:14')},{pts:90,raw:t('18:17')},{pts:85,raw:t('19:00')},{pts:80,raw:t('19:45')},{pts:75,raw:t('20:22')},{pts:70,raw:t('21:00')},{pts:65,raw:t('22:03')},{pts:60,raw:t('23:36')}],
    '62+':   [{pts:100,raw:t('15:28')},{pts:95,raw:t('17:14')},{pts:90,raw:t('18:17')},{pts:85,raw:t('19:00')},{pts:80,raw:t('19:45')},{pts:75,raw:t('20:22')},{pts:70,raw:t('21:00')},{pts:65,raw:t('22:03')},{pts:60,raw:t('23:36')}],
  },
  female: {
    '17-21': [{pts:100,raw:t('16:00')},{pts:95,raw:t('17:23')},{pts:90,raw:t('17:55')},{pts:85,raw:t('18:44')},{pts:80,raw:t('19:30')},{pts:75,raw:t('20:13')},{pts:70,raw:t('21:06')},{pts:65,raw:t('22:12')},{pts:60,raw:t('22:55')}],
    '22-26': [{pts:100,raw:t('15:30')},{pts:95,raw:t('16:27')},{pts:90,raw:t('17:44')},{pts:85,raw:t('18:38')},{pts:80,raw:t('19:25')},{pts:75,raw:t('20:12')},{pts:70,raw:t('21:00')},{pts:65,raw:t('22:07')},{pts:60,raw:t('22:45')}],
    '27-31': [{pts:100,raw:t('15:30')},{pts:95,raw:t('16:27')},{pts:90,raw:t('17:44')},{pts:85,raw:t('18:59')},{pts:80,raw:t('19:45')},{pts:75,raw:t('20:26')},{pts:70,raw:t('21:00')},{pts:65,raw:t('21:49')},{pts:60,raw:t('22:45')}],
    '32-36': [{pts:100,raw:t('15:48')},{pts:95,raw:t('17:23')},{pts:90,raw:t('18:21')},{pts:85,raw:t('19:09')},{pts:80,raw:t('19:53')},{pts:75,raw:t('20:33')},{pts:70,raw:t('21:13')},{pts:65,raw:t('21:55')},{pts:60,raw:t('22:50')}],
    '37-41': [{pts:100,raw:t('15:51')},{pts:95,raw:t('17:28')},{pts:90,raw:t('18:25')},{pts:85,raw:t('19:13')},{pts:80,raw:t('19:57')},{pts:75,raw:t('20:37')},{pts:70,raw:t('21:16')},{pts:65,raw:t('21:58')},{pts:60,raw:t('22:59')}],
    '42-46': [{pts:100,raw:t('16:00')},{pts:95,raw:t('17:39')},{pts:90,raw:t('18:37')},{pts:85,raw:t('19:25')},{pts:80,raw:t('20:10')},{pts:75,raw:t('20:50')},{pts:70,raw:t('21:30')},{pts:65,raw:t('22:12')},{pts:60,raw:t('23:15')}],
    '47-51': [{pts:100,raw:t('16:30')},{pts:95,raw:t('18:06')},{pts:90,raw:t('19:03')},{pts:85,raw:t('19:50')},{pts:80,raw:t('20:34')},{pts:75,raw:t('21:14')},{pts:70,raw:t('21:40')},{pts:65,raw:t('22:26')},{pts:60,raw:t('23:30')}],
    '52-56': [{pts:100,raw:t('16:59')},{pts:95,raw:t('18:50')},{pts:90,raw:t('19:47')},{pts:85,raw:t('20:35')},{pts:80,raw:t('21:19')},{pts:75,raw:t('21:59')},{pts:70,raw:t('22:38')},{pts:65,raw:t('23:20')},{pts:60,raw:t('24:00')}],
    '57-61': [{pts:100,raw:t('17:18')},{pts:95,raw:t('18:31')},{pts:90,raw:t('18:59')},{pts:85,raw:t('19:45')},{pts:80,raw:t('20:22')},{pts:75,raw:t('20:44')},{pts:70,raw:t('21:40')},{pts:65,raw:t('22:33')},{pts:60,raw:t('24:48')}],
    '62+':   [{pts:100,raw:t('17:18')},{pts:95,raw:t('18:31')},{pts:90,raw:t('18:59')},{pts:85,raw:t('19:45')},{pts:80,raw:t('20:22')},{pts:75,raw:t('20:44')},{pts:70,raw:t('21:40')},{pts:65,raw:t('22:44')},{pts:60,raw:t('25:00')}],
  },
};

const TABLES = {
  deadlift: DEADLIFT,
  pushups: PUSHUPS,
  sprint_drag_carry: SDC,
  plank: PLANK,
  two_mile_run: TMR,
};

// Events where lower raw = better
const LOWER_IS_BETTER = new Set(['sprint_drag_carry', 'two_mile_run']);

/**
 * Calculate points for a given event, gender, age, and raw score.
 * Returns null if inputs are invalid, 0 if below minimum threshold, 100 if at or above max.
 */
export function calculatePoints(event, gender, age, raw) {
  const rawNum = Number(raw);
  const ageNum = Number(age);
  if (raw === null || raw === undefined || raw === '' || isNaN(rawNum) || rawNum <= 0) return null;
  if (!gender || !age || isNaN(ageNum) || ageNum <= 0) return null;
  const g = String(gender).toLowerCase();
  const ag = ageGroup(ageNum);
  const table = TABLES[event]?.[g]?.[ag];
  if (!table) return null;

  const lowerIsBetter = LOWER_IS_BETTER.has(event);

  if (lowerIsBetter) {
    // table is sorted pts DESC (100 first), raw ASC (fastest first)
    if (rawNum <= table[0].raw) return 100;
    if (rawNum > table[table.length - 1].raw) return 0;
    for (let i = 0; i < table.length - 1; i++) {
      if (rawNum >= table[i].raw && rawNum <= table[i + 1].raw) {
        const span = table[i + 1].raw - table[i].raw;
        if (span === 0) return table[i].pts;
        const frac = (rawNum - table[i].raw) / span;
        return Math.round(table[i].pts + frac * (table[i + 1].pts - table[i].pts));
      }
    }
  } else {
    // table sorted pts ASC (0 first), raw ASC (lowest first)
    if (rawNum < table[0].raw) return 0;
    if (rawNum >= table[table.length - 1].raw) return 100;
    for (let i = 0; i < table.length - 1; i++) {
      if (rawNum >= table[i].raw && rawNum < table[i + 1].raw) {
        const span = table[i + 1].raw - table[i].raw;
        if (span === 0) return table[i].pts;
        const frac = (rawNum - table[i].raw) / span;
        return Math.round(table[i].pts + frac * (table[i + 1].pts - table[i].pts));
      }
    }
  }
  return 0;
}