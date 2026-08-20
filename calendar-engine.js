// === تبدیل تقویم شمسی (جلالی) <-> میلادی — الگوریتم استاندارد، بدون کتابخانه‌ی خارجی ===
function jdiv(a, b) { return ~~(a / b); }
function jmod(a, b) { return a - ~~(a / b) * b; }
function jalCal(jy) {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  const bl = breaks.length; const gy = jy + 621;
  let leapJ = -14, jp = breaks[0], jm, jump = 0, n, i;
  for (i = 1; i < bl; i += 1) {
    jm = breaks[i]; jump = jm - jp;
    if (jy < jm) break;
    leapJ += jdiv(jump, 33) * 8 + jdiv(jmod(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;
  leapJ += jdiv(n, 33) * 8 + jdiv(jmod(n, 33) + 3, 4);
  if (jmod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = jdiv(gy, 4) - jdiv((jdiv(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + jdiv(jump + 4, 33) * 33;
  let leap = jmod(jmod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}
function g2d(gy, gm, gd) {
  let d = jdiv((gy + jdiv(gm - 8, 6) + 100100) * 1461, 4) + jdiv(153 * jmod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - jdiv(jdiv(gy + 100100 + jdiv(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}
function d2g(jdn) {
  let j = 4 * jdn + 139361631;
  j = j + jdiv(jdiv(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = jdiv(jmod(j, 1461), 4) * 5 + 308;
  const gd = jdiv(jmod(i, 153), 5) + 1;
  const gm = jmod(jdiv(i, 153), 12) + 1;
  const gy = jdiv(j, 1461) - 100100 + jdiv(8 - gm, 6);
  return { gy, gm, gd };
}
function jalaaliToGregorian(jy, jm, jd) { const r = jalCal(jy); return d2g(g2d(r.gy, 3, r.march) + (jm - 1) * 31 - jdiv(jm, 7) * (jm - 7) + jd - 1); }
function gregorianToJalaali(gy, gm, gd) {
  const jdn = g2d(gy, gm, gd);
  let gy2 = d2g(jdn).gy; let jy = gy2 - 621; const r = jalCal(jy);
  const jdn1f = g2d(gy2, 3, r.march); let k = jdn - jdn1f; let jm, jd;
  if (k >= 0) {
    if (k <= 185) { jm = 1 + jdiv(k, 31); jd = jmod(k, 31) + 1; return { jy, jm, jd }; }
    k -= 186;
  } else { jy -= 1; k += 179; if (r.leap === 1) k += 1; }
  jm = 7 + jdiv(k, 30); jd = jmod(k, 30) + 1;
  return { jy, jm, jd };
}

// تبدیل «رو به جلو»: از یک تاریخ میلادی معلوم، روز/ماه معادلش در تقویم قمری (islamic-umalqura)
// را می‌گیرد. این جهت با Intl مرورگر قابل‌اعتماد است؛ جهت برعکس (قمری معلوم → میلادی مجهول)
// اعتماد کمتری دارد چون مبنای رؤیت هلال محلی است، برای همین در daysUntilNextHijri با یک
// اسکن رو-به-جلوی سبک (نه فرمول ثابت) حل می‌شود.
function gregorianToHijriDM(gy, gm, gd) {
  try {
    const dt = new Date(gy, gm - 1, gd);
    const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric' }).formatToParts(dt);
    const day = parseInt(parts.find(p => p.type === 'day').value, 10);
    const month = parseInt(parts.find(p => p.type === 'month').value, 10);
    if (!day || !month) return null;
    return { hd: day, hm: month };
  } catch (e) { return null; }
}

// اسکن رو-به-جلو (حداکثر ۳۹۵ روز) برای پیدا کردن نزدیک‌ترین تاریخ میلادیِ معادلِ یک
// روز/ماه قمری. ساده‌تر و قابل‌اعتمادتر از فرمول‌های تبدیل ثابت قمری→میلادی است.
// یک کش سبک به‌ازای هر (روز، ماه، سالِ امروز) نگه می‌داریم تا رندرهای پیاپی سنگین نشوند.
const _hijriNextCache = {};
function nextHijriOccurrence(hDay, hMonth) {
  const now = new Date();
  const cacheKey = `${hMonth}-${hDay}-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  if (_hijriNextCache[cacheKey]) return _hijriNextCache[cacheKey];
  const todayStripped = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 0; i < 395; i++) {
    const cand = new Date(todayStripped.getFullYear(), todayStripped.getMonth(), todayStripped.getDate() + i);
    const hm = gregorianToHijriDM(cand.getFullYear(), cand.getMonth() + 1, cand.getDate());
    if (hm && hm.hd === hDay && hm.hm === hMonth) {
      _hijriNextCache[cacheKey] = cand;
      return cand;
    }
  }
  return null; // نباید پیش بیاید، ولی برای ایمنی
}

function daysUntilNext(day, month, cal) {
  const now = new Date();
  const todayStripped = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // cal: 'j' = Jalali annual, 'h' = Hijri (lunar) annual, 'g' = Gregorian annual (default for legacy entries)
  const useJalali = cal === 'j' || cal === 'jalali';
  const useHijri = cal === 'h' || cal === 'hijri';
  if (useHijri) {
    const target = nextHijriOccurrence(day, month);
    if (!target) return 9999;
    return Math.round((target - todayStripped) / 86400000);
  }
  if (useJalali) {
    const jToday = gregorianToJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    let g = jalaaliToGregorian(jToday.jy, month, day);
    let target = new Date(g.gy, g.gm - 1, g.gd);
    if (target < todayStripped) {
      g = jalaaliToGregorian(jToday.jy + 1, month, day);
      target = new Date(g.gy, g.gm - 1, g.gd);
    }
    return Math.round((target - todayStripped) / 86400000);
  }
  let target = new Date(now.getFullYear(), month - 1, day);
  if (target < todayStripped) target = new Date(now.getFullYear() + 1, month - 1, day);
  return Math.round((target - todayStripped) / 86400000);
}

// Occurrence date for the current year (does NOT roll to next year).
// Used to expire one-shot marks the day after they pass.
function markedOccurrenceThisYear(day, month, cal) {
  const now = new Date();
  const useJalali = cal === 'j' || cal === 'jalali';
  const useHijri = cal === 'h' || cal === 'hijri';
  try {
    if (useHijri) {
      // برای پرونینگ صرفاً کافیست وقوعِ همین دور از تاریخ (نزدیک‌ترین رخداد) را بدانیم
      return nextHijriOccurrence(day, month);
    }
    if (useJalali) {
      const jToday = gregorianToJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const g = jalaaliToGregorian(jToday.jy, month, day);
      return new Date(g.gy, g.gm - 1, g.gd);
    }
    return new Date(now.getFullYear(), month - 1, day);
  } catch (e) {
    return null;
  }
}

function isMarkedDayPast(day, month, cal) {
  const occ = markedOccurrenceThisYear(day, month, cal);
  if (!occ || isNaN(occ.getTime())) return false;
  const now = new Date();
  const todayStripped = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Keep through the event day; remove starting the next calendar day
  return occ < todayStripped;
}
