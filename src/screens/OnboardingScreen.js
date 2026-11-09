import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { storageService } from '../services/storage';

const HEALTH_OPTIONS = [
  {
    id: 'umum',
    title: 'Pola Sehat Seimbang',
    desc: 'Pedoman umum untuk menjaga asupan minuman kemasan harian',
    icon: 'cup-water',
    color: '#16a34a',
  },
  {
    id: 'diabetes',
    title: 'Diabetes / Batasi Gula Minuman',
    desc: 'Waspada ketat terhadap lonjakan gula cair (kopi susu, teh manis, boba, soda)',
    icon: 'water-alert',
    color: '#e11d48',
  },
  {
    id: 'hipertensi',
    title: 'Hipertensi / Batasi Natrium',
    desc: 'Pantau natrium & elektrolit pada minuman isotonik dan kalengan',
    icon: 'shield-alert',
    color: '#ea580c',
  },
  {
    id: 'lemak',
    title: 'Rendah Lemak & Kolesterol',
    desc: 'Batasi lemak jenuh dari susu kental manis, krimer, dan minuman creamy',
    icon: 'cup-outline',
    color: '#d97706',
  },
];

export default function OnboardingScreen({ onComplete }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Laki-laki');
  const [selectedFocus, setSelectedFocus] = useState('umum');
  const [dailySugarLimit, setDailySugarLimit] = useState('30'); // gram
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Perhatian', 'Silakan masukkan nama Anda terlebih dahulu.');
      return;
    }

    setLoading(true);
    const profile = {
      name: name.trim(),
      age: age ? parseInt(age, 10) : 21,
      gender,
      healthFocus: selectedFocus,
      dailySugarLimit: parseInt(dailySugarLimit, 10) || 50,
      createdAt: new Date().toISOString(),
      isConfigured: true,
    };

    const success = await storageService.saveUserProfile(profile);
    setLoading(false);

    if (success) {
      onComplete(profile);
    } else {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan profil ke AsyncStorage.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <MaterialCommunityIcons name="cup-water" size={38} color="#16a34a" />
            </View>
            <Text style={styles.bannerTitle}>Selamat Datang di NutriSip</Text>
            <Text style={styles.bannerSubtitle}>
              Pemindai nutrisi minuman cerdas. Kenalkan diri Anda agar NutriSip dapat menganalisis
              kandungan gula, natrium, dan lemak pada setiap botol atau kaleng minuman yang Anda konsumsi.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.sectionHeader}>Informasi Pengguna</Text>

            {/* Nama */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Panggilan / Lengkap <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Budi Pratama"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Usia & Gender row */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Usia (Tahun)</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="calendar-outline" size={20} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="21"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={age}
                    onChangeText={setAge}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1.2, marginLeft: 8 }]}>
                <Text style={styles.label}>Jenis Kelamin</Text>
                <View style={styles.genderRow}>
                  {['Laki-laki', 'Perempuan'].map(g => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.genderBtnText, gender === g && styles.genderBtnTextActive]}>
                        {g === 'Laki-laki' ? 'L' : 'P'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Fokus Kesehatan Minuman */}
            <Text style={[styles.sectionHeader, { marginTop: 18 }]}>Fokus Pantauan Nutrisi Minuman</Text>
            <Text style={styles.helpText}>
              Aplikasi akan memberi peringatan bila minuman yang dipindai berisiko tinggi bagi kondisi Anda.
            </Text>

            <View style={styles.optionsList}>
              {HEALTH_OPTIONS.map(opt => {
                const isSelected = selectedFocus === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionCard, isSelected && styles.optionCardActive]}
                    onPress={() => setSelectedFocus(opt.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.optionIconBox, { backgroundColor: opt.color + '15' }]}>
                      <MaterialCommunityIcons name={opt.icon} size={24} color={opt.color} />
                    </View>
                    <View style={styles.optionTextBox}>
                      <Text style={[styles.optionTitle, isSelected && { color: '#0f172a', fontWeight: '700' }]}>
                        {opt.title}
                      </Text>
                      <Text style={styles.optionDesc}>{opt.desc}</Text>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Target Batas Gula Harian */}
            <View style={[styles.inputGroup, { marginTop: 14 }]}>
              <Text style={styles.label}>Target Batas Gula Minuman (Gram/hari)</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="cube-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="30"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={dailySugarLimit}
                  onChangeText={setDailySugarLimit}
                />
                <Text style={styles.unitSuffix}>g/hari</Text>
              </View>
              <Text style={styles.noteSmall}>*Kemenkes RI menganjurkan batas maksimal 50 gram gula (4 sdm) per hari.</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={22} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>
                {loading ? 'Menyimpan...' : 'Mulai Gunakan NutriSip'}
              </Text>
            </TouchableOpacity>

            <View style={styles.storageNote}>
              <MaterialCommunityIcons name="database-check" size={16} color="#059669" />
              <Text style={styles.storageNoteText}>Data profil tersimpan aman di memori lokal (AsyncStorage)</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  banner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
    marginTop: -4,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#ef4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  unitSuffix: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 3,
    height: 46,
  },
  genderBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  genderBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  genderBtnText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  genderBtnTextActive: {
    color: '#16a34a',
    fontWeight: '700',
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  optionCardActive: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  optionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionTextBox: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  optionDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 15,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioCircleActive: {
    borderColor: '#16a34a',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16a34a',
  },
  noteSmall: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#16a34a',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  storageNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 6,
  },
  storageNoteText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
  },
});
