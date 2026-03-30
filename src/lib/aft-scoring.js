/**
 * AFT Scoring Tables - Approximate based on Army ATP 7-22.01
 * Tables are [{pts, raw}] sorted by pts ASC (60 → 100).
 * For time-based events (sprint_drag_carry, two_mile_run), raw DECREASES as pts increases.
 */

const AGE_GROUPS = ['17-21','22-26','27-31','32-36','37-41','42-46','47-51','52-56','57-61','62+'];

function ageGroup(age) {
  if (age < 22) return '17-21';
  if (age < 27) return '22-26';
  if (age < 32) return '27-31';
  if (age < 37) return '32-36';
  if (age < 42) return '37-41';
  if (age < 47) return '42-46';
  if (age < 52) return '47-51';
  if (age < 57) return '52-56';
  if (age < 62) return '57-61';
  return '62+';
}

// Format: { gender: { ageGroup: [{pts, raw}] } }
// Higher raw = better for: deadlift, pushups, plank
// Lower raw = better for: sprint_drag_carry, two_mile_run

const TABLES = {
  deadlift: {
    male: {
      '17-21': [{pts:60,raw:142},{pts:65,raw:152},{pts:70,raw:162},{pts:75,raw:177},{pts:80,raw:192},{pts:85,raw:212},{pts:90,raw:232},{pts:95,raw:247},{pts:100,raw:260}],
      '22-26': [{pts:60,raw:152},{pts:65,raw:162},{pts:70,raw:172},{pts:75,raw:187},{pts:80,raw:202},{pts:85,raw:222},{pts:90,raw:242},{pts:95,raw:257},{pts:100,raw:270}],
      '27-31': [{pts:60,raw:150},{pts:65,raw:160},{pts:70,raw:170},{pts:75,raw:185},{pts:80,raw:200},{pts:85,raw:220},{pts:90,raw:240},{pts:95,raw:255},{pts:100,raw:265}],
      '32-36': [{pts:60,raw:140},{pts:65,raw:150},{pts:70,raw:160},{pts:75,raw:175},{pts:80,raw:190},{pts:85,raw:210},{pts:90,raw:230},{pts:95,raw:245},{pts:100,raw:255}],
      '37-41': [{pts:60,raw:130},{pts:65,raw:140},{pts:70,raw:150},{pts:75,raw:165},{pts:80,raw:180},{pts:85,raw:200},{pts:90,raw:220},{pts:95,raw:235},{pts:100,raw:245}],
      '42-46': [{pts:60,raw:120},{pts:65,raw:130},{pts:70,raw:140},{pts:75,raw:155},{pts:80,raw:170},{pts:85,raw:190},{pts:90,raw:210},{pts:95,raw:225},{pts:100,raw:235}],
      '47-51': [{pts:60,raw:110},{pts:65,raw:120},{pts:70,raw:130},{pts:75,raw:145},{pts:80,raw:160},{pts:85,raw:180},{pts:90,raw:200},{pts:95,raw:215},{pts:100,raw:225}],
      '52-56': [{pts:60,raw:100},{pts:65,raw:110},{pts:70,raw:120},{pts:75,raw:135},{pts:80,raw:150},{pts:85,raw:170},{pts:90,raw:190},{pts:95,raw:205},{pts:100,raw:215}],
      '57-61': [{pts:60,raw:90},{pts:65,raw:100},{pts:70,raw:110},{pts:75,raw:125},{pts:80,raw:140},{pts:85,raw:160},{pts:90,raw:180},{pts:95,raw:195},{pts:100,raw:205}],
      '62+':   [{pts:60,raw:80},{pts:65,raw:90},{pts:70,raw:100},{pts:75,raw:115},{pts:80,raw:130},{pts:85,raw:150},{pts:90,raw:170},{pts:95,raw:185},{pts:100,raw:195}],
    },
    female: {
      '17-21': [{pts:60,raw:100},{pts:65,raw:110},{pts:70,raw:120},{pts:75,raw:133},{pts:80,raw:147},{pts:85,raw:163},{pts:90,raw:180},{pts:95,raw:193},{pts:100,raw:205}],
      '22-26': [{pts:60,raw:110},{pts:65,raw:120},{pts:70,raw:130},{pts:75,raw:143},{pts:80,raw:157},{pts:85,raw:173},{pts:90,raw:190},{pts:95,raw:203},{pts:100,raw:215}],
      '27-31': [{pts:60,raw:108},{pts:65,raw:118},{pts:70,raw:128},{pts:75,raw:141},{pts:80,raw:155},{pts:85,raw:171},{pts:90,raw:188},{pts:95,raw:201},{pts:100,raw:213}],
      '32-36': [{pts:60,raw:100},{pts:65,raw:110},{pts:70,raw:120},{pts:75,raw:133},{pts:80,raw:147},{pts:85,raw:163},{pts:90,raw:180},{pts:95,raw:193},{pts:100,raw:205}],
      '37-41': [{pts:60,raw:90},{pts:65,raw:100},{pts:70,raw:110},{pts:75,raw:123},{pts:80,raw:137},{pts:85,raw:153},{pts:90,raw:168},{pts:95,raw:181},{pts:100,raw:193}],
      '42-46': [{pts:60,raw:80},{pts:65,raw:90},{pts:70,raw:100},{pts:75,raw:113},{pts:80,raw:127},{pts:85,raw:143},{pts:90,raw:158},{pts:95,raw:171},{pts:100,raw:183}],
      '47-51': [{pts:60,raw:70},{pts:65,raw:80},{pts:70,raw:90},{pts:75,raw:103},{pts:80,raw:117},{pts:85,raw:133},{pts:90,raw:148},{pts:95,raw:161},{pts:100,raw:173}],
      '52-56': [{pts:60,raw:60},{pts:65,raw:70},{pts:70,raw:80},{pts:75,raw:93},{pts:80,raw:107},{pts:85,raw:123},{pts:90,raw:138},{pts:95,raw:151},{pts:100,raw:163}],
      '57-61': [{pts:60,raw:50},{pts:65,raw:60},{pts:70,raw:70},{pts:75,raw:83},{pts:80,raw:97},{pts:85,raw:113},{pts:90,raw:128},{pts:95,raw:141},{pts:100,raw:153}],
      '62+':   [{pts:60,raw:40},{pts:65,raw:50},{pts:70,raw:60},{pts:75,raw:73},{pts:80,raw:87},{pts:85,raw:103},{pts:90,raw:118},{pts:95,raw:131},{pts:100,raw:143}],
    },
  },
  pushups: {
    male: {
      '17-21': [{pts:60,raw:10},{pts:65,raw:17},{pts:70,raw:23},{pts:75,raw:30},{pts:80,raw:37},{pts:85,raw:44},{pts:90,raw:51},{pts:95,raw:56},{pts:100,raw:60}],
      '22-26': [{pts:60,raw:10},{pts:65,raw:16},{pts:70,raw:22},{pts:75,raw:29},{pts:80,raw:36},{pts:85,raw:43},{pts:90,raw:50},{pts:95,raw:55},{pts:100,raw:60}],
      '27-31': [{pts:60,raw:9},{pts:65,raw:15},{pts:70,raw:21},{pts:75,raw:28},{pts:80,raw:35},{pts:85,raw:42},{pts:90,raw:49},{pts:95,raw:54},{pts:100,raw:58}],
      '32-36': [{pts:60,raw:8},{pts:65,raw:14},{pts:70,raw:20},{pts:75,raw:27},{pts:80,raw:34},{pts:85,raw:41},{pts:90,raw:48},{pts:95,raw:53},{pts:100,raw:57}],
      '37-41': [{pts:60,raw:7},{pts:65,raw:13},{pts:70,raw:19},{pts:75,raw:26},{pts:80,raw:33},{pts:85,raw:40},{pts:90,raw:47},{pts:95,raw:52},{pts:100,raw:56}],
      '42-46': [{pts:60,raw:6},{pts:65,raw:12},{pts:70,raw:18},{pts:75,raw:25},{pts:80,raw:32},{pts:85,raw:39},{pts:90,raw:46},{pts:95,raw:51},{pts:100,raw:55}],
      '47-51': [{pts:60,raw:5},{pts:65,raw:11},{pts:70,raw:17},{pts:75,raw:24},{pts:80,raw:31},{pts:85,raw:38},{pts:90,raw:45},{pts:95,raw:50},{pts:100,raw:54}],
      '52-56': [{pts:60,raw:4},{pts:65,raw:10},{pts:70,raw:16},{pts:75,raw:23},{pts:80,raw:30},{pts:85,raw:37},{pts:90,raw:44},{pts:95,raw:49},{pts:100,raw:53}],
      '57-61': [{pts:60,raw:3},{pts:65,raw:9},{pts:70,raw:15},{pts:75,raw:22},{pts:80,raw:29},{pts:85,raw:36},{pts:90,raw:43},{pts:95,raw:48},{pts:100,raw:52}],
      '62+':   [{pts:60,raw:2},{pts:65,raw:8},{pts:70,raw:14},{pts:75,raw:21},{pts:80,raw:28},{pts:85,raw:35},{pts:90,raw:42},{pts:95,raw:47},{pts:100,raw:51}],
    },
    female: {
      '17-21': [{pts:60,raw:5},{pts:65,raw:9},{pts:70,raw:13},{pts:75,raw:17},{pts:80,raw:22},{pts:85,raw:27},{pts:90,raw:33},{pts:95,raw:38},{pts:100,raw:42}],
      '22-26': [{pts:60,raw:5},{pts:65,raw:9},{pts:70,raw:13},{pts:75,raw:17},{pts:80,raw:22},{pts:85,raw:27},{pts:90,raw:33},{pts:95,raw:38},{pts:100,raw:42}],
      '27-31': [{pts:60,raw:4},{pts:65,raw:8},{pts:70,raw:12},{pts:75,raw:16},{pts:80,raw:21},{pts:85,raw:26},{pts:90,raw:32},{pts:95,raw:37},{pts:100,raw:41}],
      '32-36': [{pts:60,raw:3},{pts:65,raw:7},{pts:70,raw:11},{pts:75,raw:15},{pts:80,raw:20},{pts:85,raw:25},{pts:90,raw:31},{pts:95,raw:36},{pts:100,raw:40}],
      '37-41': [{pts:60,raw:2},{pts:65,raw:6},{pts:70,raw:10},{pts:75,raw:14},{pts:80,raw:19},{pts:85,raw:24},{pts:90,raw:30},{pts:95,raw:35},{pts:100,raw:39}],
      '42-46': [{pts:60,raw:1},{pts:65,raw:5},{pts:70,raw:9},{pts:75,raw:13},{pts:80,raw:18},{pts:85,raw:23},{pts:90,raw:29},{pts:95,raw:34},{pts:100,raw:38}],
      '47-51': [{pts:60,raw:1},{pts:65,raw:4},{pts:70,raw:8},{pts:75,raw:12},{pts:80,raw:17},{pts:85,raw:22},{pts:90,raw:28},{pts:95,raw:33},{pts:100,raw:37}],
      '52-56': [{pts:60,raw:0},{pts:65,raw:3},{pts:70,raw:7},{pts:75,raw:11},{pts:80,raw:16},{pts:85,raw:21},{pts:90,raw:27},{pts:95,raw:32},{pts:100,raw:36}],
      '57-61': [{pts:60,raw:0},{pts:65,raw:2},{pts:70,raw:6},{pts:75,raw:10},{pts:80,raw:15},{pts:85,raw:20},{pts:90,raw:26},{pts:95,raw:31},{pts:100,raw:35}],
      '62+':   [{pts:60,raw:0},{pts:65,raw:1},{pts:70,raw:5},{pts:75,raw:9},{pts:80,raw:14},{pts:85,raw:19},{pts:90,raw:25},{pts:95,raw:30},{pts:100,raw:34}],
    },
  },
  // Sprint-Drag-Carry: raw in seconds, LOWER is better
  sprint_drag_carry: {
    male: {
      '17-21': [{pts:60,raw:155},{pts:65,raw:145},{pts:70,raw:135},{pts:75,raw:125},{pts:80,raw:115},{pts:85,raw:107},{pts:90,raw:100},{pts:95,raw:97},{pts:100,raw:93}],
      '22-26': [{pts:60,raw:158},{pts:65,raw:148},{pts:70,raw:138},{pts:75,raw:128},{pts:80,raw:118},{pts:85,raw:110},{pts:90,raw:103},{pts:95,raw:100},{pts:100,raw:96}],
      '27-31': [{pts:60,raw:161},{pts:65,raw:151},{pts:70,raw:141},{pts:75,raw:131},{pts:80,raw:121},{pts:85,raw:113},{pts:90,raw:106},{pts:95,raw:103},{pts:100,raw:99}],
      '32-36': [{pts:60,raw:164},{pts:65,raw:154},{pts:70,raw:144},{pts:75,raw:134},{pts:80,raw:124},{pts:85,raw:116},{pts:90,raw:109},{pts:95,raw:106},{pts:100,raw:102}],
      '37-41': [{pts:60,raw:170},{pts:65,raw:160},{pts:70,raw:150},{pts:75,raw:140},{pts:80,raw:130},{pts:85,raw:122},{pts:90,raw:115},{pts:95,raw:112},{pts:100,raw:108}],
      '42-46': [{pts:60,raw:176},{pts:65,raw:166},{pts:70,raw:156},{pts:75,raw:146},{pts:80,raw:136},{pts:85,raw:128},{pts:90,raw:121},{pts:95,raw:118},{pts:100,raw:114}],
      '47-51': [{pts:60,raw:185},{pts:65,raw:175},{pts:70,raw:165},{pts:75,raw:155},{pts:80,raw:145},{pts:85,raw:137},{pts:90,raw:130},{pts:95,raw:127},{pts:100,raw:123}],
      '52-56': [{pts:60,raw:194},{pts:65,raw:184},{pts:70,raw:174},{pts:75,raw:164},{pts:80,raw:154},{pts:85,raw:146},{pts:90,raw:139},{pts:95,raw:136},{pts:100,raw:132}],
      '57-61': [{pts:60,raw:205},{pts:65,raw:195},{pts:70,raw:185},{pts:75,raw:175},{pts:80,raw:165},{pts:85,raw:157},{pts:90,raw:150},{pts:95,raw:147},{pts:100,raw:143}],
      '62+':   [{pts:60,raw:216},{pts:65,raw:206},{pts:70,raw:196},{pts:75,raw:186},{pts:80,raw:176},{pts:85,raw:168},{pts:90,raw:161},{pts:95,raw:158},{pts:100,raw:154}],
    },
    female: {
      '17-21': [{pts:60,raw:180},{pts:65,raw:170},{pts:70,raw:160},{pts:75,raw:150},{pts:80,raw:140},{pts:85,raw:132},{pts:90,raw:125},{pts:95,raw:122},{pts:100,raw:118}],
      '22-26': [{pts:60,raw:183},{pts:65,raw:173},{pts:70,raw:163},{pts:75,raw:153},{pts:80,raw:143},{pts:85,raw:135},{pts:90,raw:128},{pts:95,raw:125},{pts:100,raw:121}],
      '27-31': [{pts:60,raw:186},{pts:65,raw:176},{pts:70,raw:166},{pts:75,raw:156},{pts:80,raw:146},{pts:85,raw:138},{pts:90,raw:131},{pts:95,raw:128},{pts:100,raw:124}],
      '32-36': [{pts:60,raw:190},{pts:65,raw:180},{pts:70,raw:170},{pts:75,raw:160},{pts:80,raw:150},{pts:85,raw:142},{pts:90,raw:135},{pts:95,raw:132},{pts:100,raw:128}],
      '37-41': [{pts:60,raw:196},{pts:65,raw:186},{pts:70,raw:176},{pts:75,raw:166},{pts:80,raw:156},{pts:85,raw:148},{pts:90,raw:141},{pts:95,raw:138},{pts:100,raw:134}],
      '42-46': [{pts:60,raw:204},{pts:65,raw:194},{pts:70,raw:184},{pts:75,raw:174},{pts:80,raw:164},{pts:85,raw:156},{pts:90,raw:149},{pts:95,raw:146},{pts:100,raw:142}],
      '47-51': [{pts:60,raw:214},{pts:65,raw:204},{pts:70,raw:194},{pts:75,raw:184},{pts:80,raw:174},{pts:85,raw:166},{pts:90,raw:159},{pts:95,raw:156},{pts:100,raw:152}],
      '52-56': [{pts:60,raw:226},{pts:65,raw:216},{pts:70,raw:206},{pts:75,raw:196},{pts:80,raw:186},{pts:85,raw:178},{pts:90,raw:171},{pts:95,raw:168},{pts:100,raw:164}],
      '57-61': [{pts:60,raw:240},{pts:65,raw:230},{pts:70,raw:220},{pts:75,raw:210},{pts:80,raw:200},{pts:85,raw:192},{pts:90,raw:185},{pts:95,raw:182},{pts:100,raw:178}],
      '62+':   [{pts:60,raw:254},{pts:65,raw:244},{pts:70,raw:234},{pts:75,raw:224},{pts:80,raw:214},{pts:85,raw:206},{pts:90,raw:199},{pts:95,raw:196},{pts:100,raw:192}],
    },
  },
  // Plank: raw in seconds, HIGHER is better
  plank: {
    male: {
      '17-21': [{pts:60,raw:129},{pts:65,raw:150},{pts:70,raw:175},{pts:75,raw:200},{pts:80,raw:230},{pts:85,raw:260},{pts:90,raw:290},{pts:95,raw:320},{pts:100,raw:347}],
      '22-26': [{pts:60,raw:129},{pts:65,raw:150},{pts:70,raw:175},{pts:75,raw:200},{pts:80,raw:230},{pts:85,raw:260},{pts:90,raw:290},{pts:95,raw:320},{pts:100,raw:347}],
      '27-31': [{pts:60,raw:122},{pts:65,raw:143},{pts:70,raw:168},{pts:75,raw:193},{pts:80,raw:223},{pts:85,raw:253},{pts:90,raw:283},{pts:95,raw:313},{pts:100,raw:340}],
      '32-36': [{pts:60,raw:116},{pts:65,raw:137},{pts:70,raw:162},{pts:75,raw:187},{pts:80,raw:217},{pts:85,raw:247},{pts:90,raw:277},{pts:95,raw:307},{pts:100,raw:333}],
      '37-41': [{pts:60,raw:109},{pts:65,raw:130},{pts:70,raw:155},{pts:75,raw:180},{pts:80,raw:210},{pts:85,raw:240},{pts:90,raw:270},{pts:95,raw:300},{pts:100,raw:326}],
      '42-46': [{pts:60,raw:103},{pts:65,raw:124},{pts:70,raw:149},{pts:75,raw:174},{pts:80,raw:204},{pts:85,raw:234},{pts:90,raw:264},{pts:95,raw:294},{pts:100,raw:320}],
      '47-51': [{pts:60,raw:96},{pts:65,raw:117},{pts:70,raw:142},{pts:75,raw:167},{pts:80,raw:197},{pts:85,raw:227},{pts:90,raw:257},{pts:95,raw:287},{pts:100,raw:313}],
      '52-56': [{pts:60,raw:90},{pts:65,raw:111},{pts:70,raw:136},{pts:75,raw:161},{pts:80,raw:191},{pts:85,raw:221},{pts:90,raw:251},{pts:95,raw:281},{pts:100,raw:307}],
      '57-61': [{pts:60,raw:84},{pts:65,raw:105},{pts:70,raw:130},{pts:75,raw:155},{pts:80,raw:185},{pts:85,raw:215},{pts:90,raw:245},{pts:95,raw:275},{pts:100,raw:301}],
      '62+':   [{pts:60,raw:77},{pts:65,raw:98},{pts:70,raw:123},{pts:75,raw:148},{pts:80,raw:178},{pts:85,raw:208},{pts:90,raw:238},{pts:95,raw:268},{pts:100,raw:294}],
    },
    female: {
      '17-21': [{pts:60,raw:129},{pts:65,raw:150},{pts:70,raw:175},{pts:75,raw:200},{pts:80,raw:230},{pts:85,raw:260},{pts:90,raw:290},{pts:95,raw:320},{pts:100,raw:347}],
      '22-26': [{pts:60,raw:129},{pts:65,raw:150},{pts:70,raw:175},{pts:75,raw:200},{pts:80,raw:230},{pts:85,raw:260},{pts:90,raw:290},{pts:95,raw:320},{pts:100,raw:347}],
      '27-31': [{pts:60,raw:122},{pts:65,raw:143},{pts:70,raw:168},{pts:75,raw:193},{pts:80,raw:223},{pts:85,raw:253},{pts:90,raw:283},{pts:95,raw:313},{pts:100,raw:340}],
      '32-36': [{pts:60,raw:116},{pts:65,raw:137},{pts:70,raw:162},{pts:75,raw:187},{pts:80,raw:217},{pts:85,raw:247},{pts:90,raw:277},{pts:95,raw:307},{pts:100,raw:333}],
      '37-41': [{pts:60,raw:109},{pts:65,raw:130},{pts:70,raw:155},{pts:75,raw:180},{pts:80,raw:210},{pts:85,raw:240},{pts:90,raw:270},{pts:95,raw:300},{pts:100,raw:326}],
      '42-46': [{pts:60,raw:103},{pts:65,raw:124},{pts:70,raw:149},{pts:75,raw:174},{pts:80,raw:204},{pts:85,raw:234},{pts:90,raw:264},{pts:95,raw:294},{pts:100,raw:320}],
      '47-51': [{pts:60,raw:96},{pts:65,raw:117},{pts:70,raw:142},{pts:75,raw:167},{pts:80,raw:197},{pts:85,raw:227},{pts:90,raw:257},{pts:95,raw:287},{pts:100,raw:313}],
      '52-56': [{pts:60,raw:90},{pts:65,raw:111},{pts:70,raw:136},{pts:75,raw:161},{pts:80,raw:191},{pts:85,raw:221},{pts:90,raw:251},{pts:95,raw:281},{pts:100,raw:307}],
      '57-61': [{pts:60,raw:84},{pts:65,raw:105},{pts:70,raw:130},{pts:75,raw:155},{pts:80,raw:185},{pts:85,raw:215},{pts:90,raw:245},{pts:95,raw:275},{pts:100,raw:301}],
      '62+':   [{pts:60,raw:77},{pts:65,raw:98},{pts:70,raw:123},{pts:75,raw:148},{pts:80,raw:178},{pts:85,raw:208},{pts:90,raw:238},{pts:95,raw:268},{pts:100,raw:294}],
    },
  },
  // 2-Mile Run: raw in seconds, LOWER is better
  two_mile_run: {
    male: {
      '17-21': [{pts:60,raw:1134},{pts:65,raw:1062},{pts:70,raw:996},{pts:75,raw:954},{pts:80,raw:900},{pts:85,raw:846},{pts:90,raw:810},{pts:95,raw:780},{pts:100,raw:765}],
      '22-26': [{pts:60,raw:1152},{pts:65,raw:1080},{pts:70,raw:1014},{pts:75,raw:972},{pts:80,raw:918},{pts:85,raw:864},{pts:90,raw:828},{pts:95,raw:798},{pts:100,raw:783}],
      '27-31': [{pts:60,raw:1176},{pts:65,raw:1104},{pts:70,raw:1038},{pts:75,raw:996},{pts:80,raw:942},{pts:85,raw:888},{pts:90,raw:852},{pts:95,raw:822},{pts:100,raw:807}],
      '32-36': [{pts:60,raw:1200},{pts:65,raw:1128},{pts:70,raw:1062},{pts:75,raw:1020},{pts:80,raw:966},{pts:85,raw:912},{pts:90,raw:876},{pts:95,raw:846},{pts:100,raw:831}],
      '37-41': [{pts:60,raw:1224},{pts:65,raw:1152},{pts:70,raw:1086},{pts:75,raw:1044},{pts:80,raw:990},{pts:85,raw:936},{pts:90,raw:900},{pts:95,raw:870},{pts:100,raw:855}],
      '42-46': [{pts:60,raw:1260},{pts:65,raw:1188},{pts:70,raw:1122},{pts:75,raw:1080},{pts:80,raw:1026},{pts:85,raw:972},{pts:90,raw:936},{pts:95,raw:906},{pts:100,raw:891}],
      '47-51': [{pts:60,raw:1296},{pts:65,raw:1224},{pts:70,raw:1158},{pts:75,raw:1116},{pts:80,raw:1062},{pts:85,raw:1008},{pts:90,raw:972},{pts:95,raw:942},{pts:100,raw:927}],
      '52-56': [{pts:60,raw:1332},{pts:65,raw:1260},{pts:70,raw:1194},{pts:75,raw:1152},{pts:80,raw:1098},{pts:85,raw:1044},{pts:90,raw:1008},{pts:95,raw:978},{pts:100,raw:963}],
      '57-61': [{pts:60,raw:1380},{pts:65,raw:1308},{pts:70,raw:1242},{pts:75,raw:1200},{pts:80,raw:1146},{pts:85,raw:1092},{pts:90,raw:1056},{pts:95,raw:1026},{pts:100,raw:1011}],
      '62+':   [{pts:60,raw:1440},{pts:65,raw:1368},{pts:70,raw:1302},{pts:75,raw:1260},{pts:80,raw:1206},{pts:85,raw:1152},{pts:90,raw:1116},{pts:95,raw:1086},{pts:100,raw:1071}],
    },
    female: {
      '17-21': [{pts:60,raw:1344},{pts:65,raw:1272},{pts:70,raw:1206},{pts:75,raw:1164},{pts:80,raw:1110},{pts:85,raw:1056},{pts:90,raw:1020},{pts:95,raw:990},{pts:100,raw:975}],
      '22-26': [{pts:60,raw:1362},{pts:65,raw:1290},{pts:70,raw:1224},{pts:75,raw:1182},{pts:80,raw:1128},{pts:85,raw:1074},{pts:90,raw:1038},{pts:95,raw:1008},{pts:100,raw:993}],
      '27-31': [{pts:60,raw:1386},{pts:65,raw:1314},{pts:70,raw:1248},{pts:75,raw:1206},{pts:80,raw:1152},{pts:85,raw:1098},{pts:90,raw:1062},{pts:95,raw:1032},{pts:100,raw:1017}],
      '32-36': [{pts:60,raw:1410},{pts:65,raw:1338},{pts:70,raw:1272},{pts:75,raw:1230},{pts:80,raw:1176},{pts:85,raw:1122},{pts:90,raw:1086},{pts:95,raw:1056},{pts:100,raw:1041}],
      '37-41': [{pts:60,raw:1434},{pts:65,raw:1362},{pts:70,raw:1296},{pts:75,raw:1254},{pts:80,raw:1200},{pts:85,raw:1146},{pts:90,raw:1110},{pts:95,raw:1080},{pts:100,raw:1065}],
      '42-46': [{pts:60,raw:1470},{pts:65,raw:1398},{pts:70,raw:1332},{pts:75,raw:1290},{pts:80,raw:1236},{pts:85,raw:1182},{pts:90,raw:1146},{pts:95,raw:1116},{pts:100,raw:1101}],
      '47-51': [{pts:60,raw:1506},{pts:65,raw:1434},{pts:70,raw:1368},{pts:75,raw:1326},{pts:80,raw:1272},{pts:85,raw:1218},{pts:90,raw:1182},{pts:95,raw:1152},{pts:100,raw:1137}],
      '52-56': [{pts:60,raw:1542},{pts:65,raw:1470},{pts:70,raw:1404},{pts:75,raw:1362},{pts:80,raw:1308},{pts:85,raw:1254},{pts:90,raw:1218},{pts:95,raw:1188},{pts:100,raw:1173}],
      '57-61': [{pts:60,raw:1590},{pts:65,raw:1518},{pts:70,raw:1452},{pts:75,raw:1410},{pts:80,raw:1356},{pts:85,raw:1302},{pts:90,raw:1266},{pts:95,raw:1236},{pts:100,raw:1221}],
      '62+':   [{pts:60,raw:1650},{pts:65,raw:1578},{pts:70,raw:1512},{pts:75,raw:1470},{pts:80,raw:1416},{pts:85,raw:1362},{pts:90,raw:1326},{pts:95,raw:1296},{pts:100,raw:1281}],
    },
  },
};

// Events where lower raw = better (time-based)
const LOWER_IS_BETTER = new Set(['sprint_drag_carry', 'two_mile_run']);

/**
 * Calculate points for a given event, gender, age, and raw score.
 * Returns 0 if below minimum, 100 if above maximum.
 */
export function calculatePoints(event, gender, age, raw) {
  if (raw === null || raw === undefined || raw === '' || !gender || !age) return null;
  const g = gender.toLowerCase();
  const ag = ageGroup(Number(age));
  const table = TABLES[event]?.[g]?.[ag];
  if (!table) return null;

  const lowerIsBetter = LOWER_IS_BETTER.has(event);

  if (lowerIsBetter) {
    // table: pts ascending, raw descending
    if (raw > table[0].raw) return 0;
    if (raw <= table[table.length - 1].raw) return 100;
    for (let i = 0; i < table.length - 1; i++) {
      if (raw <= table[i].raw && raw > table[i + 1].raw) {
        const t = (table[i].raw - raw) / (table[i].raw - table[i + 1].raw);
        return Math.round(table[i].pts + t * (table[i + 1].pts - table[i].pts));
      }
    }
  } else {
    // higher is better
    if (raw < table[0].raw) return 0;
    if (raw >= table[table.length - 1].raw) return 100;
    for (let i = 0; i < table.length - 1; i++) {
      if (raw >= table[i].raw && raw < table[i + 1].raw) {
        const t = (raw - table[i].raw) / (table[i + 1].raw - table[i].raw);
        return Math.round(table[i].pts + t * (table[i + 1].pts - table[i].pts));
      }
    }
  }
  return 0;
}