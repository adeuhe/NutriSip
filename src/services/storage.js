import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@nutrisip_user_profile';
const SCAN_HISTORY_KEY = '@nutrisip_scan_history';

// Contoh data awal sampel minuman (dari database Excel per 100 ml)
const INITIAL_BEVERAGE_HISTORY = [
  {
    id: 'sample-1',
    productName: 'Teh Melati Kemasan Botol (Rendah Gula)',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    imageUri: null,
    servingSize: 100,
    sugar: 0.3,
    sodium: 17.0,
    fat: 0.2,
    sugarLevel: 'A',
    sodiumLevel: 'B',
    fatLevel: 'A',
    overallGrade: 'A',
    overallColor: '#166534',
    score: 92,
    statusText: 'Sangat Sehat & Aman untuk Minuman Harian'
  },
  {
    id: 'sample-2',
    productName: 'Susu Kedelai UHT Murni',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    imageUri: null,
    servingSize: 100,
    sugar: 3.0,
    sodium: 3.0,
    fat: 0.7,
    sugarLevel: 'B',
    sodiumLevel: 'A',
    fatLevel: 'B',
    overallGrade: 'A',
    overallColor: '#166534',
    score: 88,
    statusText: 'Nutrisi Baik, Seimbang untuk Dikonsumsi'
  },
  {
    id: 'sample-3',
    productName: 'Kopi Susu Gula Aren Kaleng',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    imageUri: null,
    servingSize: 100,
    sugar: 8.0,
    sodium: 100.0,
    fat: 2.0,
    sugarLevel: 'C',
    sodiumLevel: 'B',
    fatLevel: 'B',
    overallGrade: 'B',
    overallColor: '#22c55e',
    score: 72,
    statusText: 'Perhatikan Porsi: Kadar Gula Cair Cukup Tinggi'
  }
];

export const storageService = {
  // --- Profile Methods ---
  async getUserProfile() {
    try {
      const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error fetching user profile:', e);
      return null;
    }
  },

  async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error('Error saving user profile:', e);
      return false;
    }
  },

  async clearUserProfile() {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
      return true;
    } catch (e) {
      console.error('Error clearing profile:', e);
      return false;
    }
  },

  // --- Scan History Methods ---
  async getScanHistory() {
    try {
      const data = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      if (!data) {
        // Inisialisasi awal dengan sampel minuman dari database Excel
        await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(INITIAL_BEVERAGE_HISTORY));
        return INITIAL_BEVERAGE_HISTORY;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error fetching scan history:', e);
      return [];
    }
  },

  async addScanItem(item) {
    try {
      const current = await this.getScanHistory();
      const updated = [item, ...current];
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error adding scan item:', e);
      return [];
    }
  },

  async deleteScanItem(id) {
    try {
      const current = await this.getScanHistory();
      const updated = current.filter(item => item.id !== id);
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error deleting scan item:', e);
      return [];
    }
  },

  async clearScanHistory() {
    try {
      await AsyncStorage.removeItem(SCAN_HISTORY_KEY);
      return [];
    } catch (e) {
      console.error('Error clearing scan history:', e);
      return [];
    }
  }
};
