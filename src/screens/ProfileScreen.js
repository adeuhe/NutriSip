import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { storageService } from '../services/storage';

export default function ProfileScreen({ userProfile, onProfileUpdated, onResetProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [dailySugarLimit, setDailySugarLimit] = useState(String(userProfile?.dailySugarLimit || 30));

  const handleSaveEdit = async () => {
    if (!name.trim()) {
      Alert.alert('Perhatian', 'Nama tidak boleh kosong.');
      return;
    }

    const updated = {
      ...userProfile,
      name: name.trim(),
      dailySugarLimit: parseInt(dailySugarLimit, 10) || 50,
    };

    const ok = await storageService.saveUserProfile(updated);
    if (ok) {
      onProfileUpdated(updated);
      setIsEditing(false);
      Alert.alert('Sukses', 'Profil berhasil diperbarui di AsyncStorage.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Profil',
      'Apakah Anda ingin mereset profil dan mengisi ulang formulir diri NutriSip? Riwayat pindaian minuman Anda tetap aman.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await storageService.clearUserProfile();
            onResetProfile();
          },
        },
      ]
    );
  };

  const focusMap = {
    umum: 'Pola Sehat Seimbang',
    diabetes: 'Diabetes (Waspada Gula Minuman)',
    hipertensi: 'Hipertensi (Waspada Natrium Minuman)',
    lemak: 'Rendah Lemak & Krimer Minuman',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Profil & Preferensi Minuman</Text>
      <Text style={styles.subheading}>Informasi personalisasi asupan minuman kemasan dan aplikasi</Text>

      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>
            {(userProfile?.name || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userProfile?.name || 'Tamu'}</Text>
          <Text style={styles.userDetail}>
            {userProfile?.gender || 'Laki-laki'} • {userProfile?.age || 21} Tahun
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editToggleBtn}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons name={isEditing ? 'close' : 'pencil'} size={18} color="#16a34a" />
        </TouchableOpacity>
      </View>

      {/* Edit Form (if editing) */}
      {isEditing ? (
        <View style={styles.editCard}>
          <Text style={styles.editCardTitle}>Edit Informasi Pengguna</Text>

          <Text style={styles.fieldLabel}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nama Anda"
          />

          <Text style={styles.fieldLabel}>Batas Gula Minuman Harian (g/hari)</Text>
          <TextInput
            style={styles.input}
            value={dailySugarLimit}
            onChangeText={setDailySugarLimit}
            keyboardType="numeric"
            placeholder="30"
          />

          <TouchableOpacity style={styles.saveEditBtn} onPress={handleSaveEdit}>
            <Text style={styles.saveEditBtnText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Health Profile Card */}
      <View style={styles.infoCard}>
        <Text style={styles.cardHeader}>Target & Kondisi Pantauan</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoRowLeft}>
            <MaterialCommunityIcons name="cup-water" size={20} color="#16a34a" />
            <Text style={styles.infoRowLabel}>Fokus Pantauan</Text>
          </View>
          <Text style={styles.infoRowVal}>
            {focusMap[userProfile?.healthFocus] || 'Pola Sehat Seimbang'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoRowLeft}>
            <MaterialCommunityIcons name="cube-outline" size={20} color="#d97706" />
            <Text style={styles.infoRowLabel}>Batas Gula Minuman</Text>
          </View>
          <Text style={styles.infoRowVal}>{userProfile?.dailySugarLimit || 30} g / hari</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoRowLeft}>
            <MaterialCommunityIcons name="shaker-outline" size={20} color="#ea580c" />
            <Text style={styles.infoRowLabel}>Batas Natrium</Text>
          </View>
          <Text style={styles.infoRowVal}>2000 mg / hari</Text>
        </View>
      </View>

      {/* Database Technical Info */}
      <View style={styles.infoCard}>
        <Text style={styles.cardHeader}>Informasi Basis Data (Database)</Text>

        <View style={styles.dbStatusBox}>
          <MaterialCommunityIcons name="database-check" size={24} color="#16a34a" />
          <View style={{ flex: 1 }}>
            <Text style={styles.dbStatusTitle}>AsyncStorage (NutriSip Offline Engine)</Text>
            <Text style={styles.dbStatusSub}>
              Data profil dan riwayat minuman tersimpan di memori perangkat secara mandiri.
            </Text>
          </View>
        </View>
      </View>

      {/* Reset Profile Action */}
      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Ionicons name="refresh-outline" size={18} color="#ef4444" style={{ marginRight: 6 }} />
        <Text style={styles.resetBtnText}>Ulangi Pengisian Form Diri (Reset Profil)</Text>
      </TouchableOpacity>

      {/* Academic Project Credits */}
      <View style={styles.creditsBox}>
        <Text style={styles.creditsTitle}>NutriSip Mobile v1.0.0</Text>
        <Text style={styles.creditsDesc}>
          Proyek Aplikasi Mobile Mata Kuliah Teknopreneur
        </Text>
        <Text style={styles.creditsDesc}>
          Pemindai Nutri-Grade Minuman Kemasan Berbasis React Native
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  userDetail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  editToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  editCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  editCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 10,
  },
  saveEditBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveEditBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoRowLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  infoRowVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  dbStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  dbStatusTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  dbStatusSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 15,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 14,
    height: 48,
    marginBottom: 20,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
  },
  creditsBox: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 2,
  },
  creditsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  creditsDesc: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
