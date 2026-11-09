/**
 * Kalkulator Nutri-Grade & Ambang Batas Gizi Minuman NutriSip
 * Berdasarkan acuan sheet "Batas Level" dan "Foodscan - grade"
 * Disesuaikan khusus untuk produk minuman siap konsumsi (per 100 ml)
 */

export const NUTRI_COLORS = {
  A: {
    name: 'DARKGREEN',
    hex: '#166534', // Hijau Tua
    bg: '#dcfce7',
    label: 'Level A - Sangat Sehat (Bebas/Rendah Gula)',
  },
  B: {
    name: 'LIGHTGREEN',
    hex: '#22c55e', // Hijau Muda
    bg: '#f0fdf4',
    label: 'Level B - Baik & Aman Dikonsumsi Harian',
  },
  C: {
    name: 'YELLOW',
    hex: '#eab308', // Kuning/Oranye
    bg: '#fefce8',
    label: 'Level C - Waspada (Kadar Gula/Natrium Sedang)',
  },
  D: {
    name: 'RED',
    hex: '#ef4444', // Merah
    bg: '#fef2f2',
    label: 'Level D - Sangat Tinggi (Batasi Tegukan)',
  },
};

/**
 * 1. Evaluasi Level Gula Minuman (per 100 ml)
 * <= 0.5         => Level A
 * > 0.5 - <= 6.0 => Level B
 * > 6.0 - <= 12.5=> Level C
 * > 12.5         => Level D
 */
export function getSugarLevel(g) {
  const val = parseFloat(g) || 0;
  if (val <= 0.5) return 'A';
  if (val <= 6.0) return 'B';
  if (val <= 12.5) return 'C';
  return 'D';
}

/**
 * 2. Evaluasi Level Natrium Minuman (mg per 100 ml)
 * <= 5.0           => Level A
 * > 5.0 - <= 120.0 => Level B
 * > 120.0 - <= 500 => Level C
 * > 500.0          => Level D
 */
export function getSodiumLevel(mg) {
  const val = parseFloat(mg) || 0;
  if (val <= 5.0) return 'A';
  if (val <= 120.0) return 'B';
  if (val <= 500.0) return 'C';
  return 'D';
}

/**
 * 3. Evaluasi Level Lemak Total Minuman (per 100 ml)
 * <= 0.5         => Level A
 * > 0.5 - <= 3.0 => Level B
 * > 3.0 - <= 17.0=> Level C
 * > 17.0         => Level D
 */
export function getFatLevel(g) {
  const val = parseFloat(g) || 0;
  if (val <= 0.5) return 'A';
  if (val <= 3.0) return 'B';
  if (val <= 17.0) return 'C';
  return 'D';
}

/**
 * 4. Hitung Nutri-Level Akhir Minuman & Skor (0 - 100)
 */
export function calculateNutriGrade({ sugar, sodium, fat, servingSize = 100, userProfile = null }) {
  // Normalisasi ke per 100 ml jika takaran botol/kaleng berbeda
  const ratio = servingSize > 0 ? 100 / servingSize : 1;
  const sugarPer100 = (parseFloat(sugar) || 0) * (servingSize === 100 ? 1 : ratio);
  const sodiumPer100 = (parseFloat(sodium) || 0) * (servingSize === 100 ? 1 : ratio);
  const fatPer100 = (parseFloat(fat) || 0) * (servingSize === 100 ? 1 : ratio);

  const sugarLvl = getSugarLevel(sugarPer100);
  const sodiumLvl = getSodiumLevel(sodiumPer100);
  const fatLvl = getFatLevel(fatPer100);

  const levels = [sugarLvl, sodiumLvl, fatLvl];
  const countA = levels.filter(l => l === 'A').length;
  const countB = levels.filter(l => l === 'B').length;
  const countC = levels.filter(l => l === 'C').length;
  const countD = levels.filter(l => l === 'D').length;

  let finalGrade = 'B';
  // Aturan agregasi sesuai database Excel:
  // Contoh 1: Gula A, Natrium B, Lemak A -> Overall A
  // Contoh 2: Gula B, Natrium A, Lemak B -> Overall A
  // Contoh campuran: Gula C, Natrium B, Lemak B -> Overall B
  if (countD >= 1) {
    finalGrade = countD >= 2 ? 'D' : 'C';
  } else if (countC >= 1) {
    finalGrade = countC >= 2 ? 'C' : 'B';
  } else if (countA >= 2) {
    finalGrade = 'A';
  } else if (countA === 1 && countB === 2) {
    finalGrade = 'A';
  } else {
    finalGrade = 'B';
  }

  // Hitung Skor Numerik 0 - 100
  let score = 100;
  // Penalti gula cair (komponen paling krusial pada minuman kemasan)
  if (sugarLvl === 'B') score -= 10;
  else if (sugarLvl === 'C') score -= 28;
  else if (sugarLvl === 'D') score -= 45;

  // Penalti natrium (pada minuman isotonik/elektrolit)
  if (sodiumLvl === 'B') score -= 8;
  else if (sodiumLvl === 'C') score -= 22;
  else if (sodiumLvl === 'D') score -= 40;

  // Penalti lemak (pada susu kemasan / kopi krimer)
  if (fatLvl === 'B') score -= 7;
  else if (fatLvl === 'C') score -= 20;
  else if (fatLvl === 'D') score -= 35;

  score = Math.max(15, Math.min(100, Math.round(score)));

  // Peringatan Personalisasi Khusus Minuman
  const personalizedAlerts = [];
  if (userProfile && userProfile.healthFocus) {
    const focus = userProfile.healthFocus.toLowerCase();
    if (focus.includes('diabet') && (sugarLvl === 'C' || sugarLvl === 'D')) {
      personalizedAlerts.push({
        type: 'danger',
        title: 'Peringatan Bahaya Diabetes',
        message: `Minuman ini mengandung gula Level ${sugarLvl} (${sugarPer100.toFixed(1)}g per 100ml). Gula cair dalam minuman sangat cepat diserap tubuh dan memicu lonjakan glukosa darah!`
      });
    }
    if (focus.includes('hipertensi') && (sodiumLvl === 'C' || sodiumLvl === 'D')) {
      personalizedAlerts.push({
        type: 'danger',
        title: 'Peringatan Hipertensi',
        message: `Minuman ini memiliki kadar natrium Level ${sodiumLvl} (${sodiumPer100.toFixed(0)}mg per 100ml). Batasi porsi agar tekanan darah tetap terkontrol.`
      });
    }
    if (focus.includes('lemak') && (fatLvl === 'C' || fatLvl === 'D')) {
      personalizedAlerts.push({
        type: 'warning',
        title: 'Peringatan Lemak / Kolesterol',
        message: `Kandungan lemak pada minuman ini berada di Level ${fatLvl} (${fatPer100.toFixed(1)}g per 100ml), perhatikan konsumsi krimer dan susu tinggi lemak.`
      });
    }
  }

  return {
    sugar: sugarPer100,
    sodium: sodiumPer100,
    fat: fatPer100,
    sugarLevel: sugarLvl,
    sodiumLevel: sodiumLvl,
    fatLevel: fatLvl,
    overallGrade: finalGrade,
    score,
    colorInfo: NUTRI_COLORS[finalGrade],
    personalizedAlerts,
    summary:
      finalGrade === 'A'
        ? 'Pilihan Sangat Baik: Minuman sangat rendah gula, garam, dan lemak. Aman untuk hidrasi rutin.'
        : finalGrade === 'B'
        ? 'Pilihan Baik: Komposisi gizi minuman masih dalam batas moderat yang dianjurkan.'
        : finalGrade === 'C'
        ? 'Perhatikan Porsi: Minuman ini memiliki kadar gula atau natrium cukup tinggi.'
        : 'Waspada Tinggi: Sangat tinggi gula cair! Hindari konsumsi berlebihan atau terlalu sering.'
  };
}
