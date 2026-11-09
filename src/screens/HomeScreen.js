import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ userProfile, scanHistory, onNavigateToScan }) {
  const userName = userProfile?.name || 'Teman Sehat';
  const healthFocus = userProfile?.healthFocus || 'umum';

  // Stats calculation
  const totalScans = scanHistory.length;
  const safeCount = scanHistory.filter(item => item.overallGrade === 'A' || item.overallGrade === 'B').length;
  const alertCount = scanHistory.filter(item => item.overallGrade === 'C' || item.overallGrade === 'D').length;

  const focusLabels = {
    umum: { text: 'Pola Sehat Seimbang', color: '#16a34a', icon: 'cup-water' },
    diabetes: { text: 'Waspada Gula Minuman (Diabetes)', color: '#e11d48', icon: 'water-alert' },
    hipertensi: { text: 'Waspada Natrium Minuman (Hipertensi)', color: '#ea580c', icon: 'shield-alert' },
    lemak: { text: 'Batasi Krimer & Lemak Minuman', color: '#d97706', icon: 'cup-outline' },
  };

  const currentFocus = focusLabels[healthFocus] || focusLabels.umum;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeTextGroup}>
          <Text style={styles.welcomeSub}>Halo, Selamat Datang</Text>
          <Text style={styles.welcomeName}>{userName} 👋</Text>
        </View>

        <View style={[styles.focusPill, { backgroundColor: currentFocus.color + '18' }]}>
          <MaterialCommunityIcons name={currentFocus.icon} size={15} color={currentFocus.color} />
          <Text style={[styles.focusPillText, { color: currentFocus.color }]}>
            {currentFocus.text}
          </Text>
        </View>
      </View>

      {/* Main CTA Banner */}
      <TouchableOpacity style={styles.ctaBanner} onPress={onNavigateToScan} activeOpacity={0.9}>
        <View style={styles.ctaTextSide}>
          <View style={styles.ctaBadge}>
            <Text style={styles.ctaBadgeText}>PEMINDAI MINUMAN CERDAS</Text>
          </View>
          <Text style={styles.ctaTitle}>Cek Kadar Gula & Gizi Minuman Anda</Text>
          <Text style={styles.ctaSub}>
            Arahkan kamera ke label botol, kaleng, atau kotak minuman untuk melihat Nutri-Grade instan.
          </Text>

          <View style={styles.ctaButtonFake}>
            <Ionicons name="camera" size={16} color="#ffffff" />
            <Text style={styles.ctaButtonFakeText}>Pindai Minuman Sekarang</Text>
          </View>
        </View>

        <View style={styles.ctaGraphicSide}>
          <View style={styles.gradeDisplayCircle}>
            <MaterialCommunityIcons name="cup-water" size={32} color="#ffffff" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Quick Statistics */}
      <Text style={styles.sectionTitle}>Ringkasan Pindaian Minuman</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalScans}</Text>
          <Text style={styles.statLabel}>Minuman Dicek</Text>
        </View>

        <View style={[styles.statBox, { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }]}>
          <Text style={[styles.statNumber, { color: '#16a34a' }]}>{safeCount}</Text>
          <Text style={styles.statLabel}>Grade A & B (Aman)</Text>
        </View>

        <View style={[styles.statBox, { borderColor: '#fed7aa', backgroundColor: '#fff7ed' }]}>
          <Text style={[styles.statNumber, { color: '#ea580c' }]}>{alertCount}</Text>
          <Text style={styles.statLabel}>Grade C & D (Batasi)</Text>
        </View>
      </View>

      {/* Edukasi Minuman Berpemanis Dalam Kemasan (MBDK) */}
      <Text style={styles.sectionTitle}>Waspada Minuman Manis (Kemenkes RI)</Text>
      <View style={styles.tipsList}>
        <View style={styles.tipCard}>
          <View style={[styles.tipIconBox, { backgroundColor: '#fef3c7' }]}>
            <MaterialCommunityIcons name="cup-water" size={20} color="#d97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Gula Cair Minuman (Maks. 50g / hari)</Text>
            <Text style={styles.tipDesc}>
              Satu botol teh manis atau boba sering mengandung 25–40 gram gula cair, menyerap langsung ke pembuluh darah.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={[styles.tipIconBox, { backgroundColor: '#ffedd5' }]}>
            <MaterialCommunityIcons name="lightning-bolt-outline" size={20} color="#ea580c" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Natrium Minuman Isotonik & Kaleng</Text>
            <Text style={styles.tipDesc}>
              Minuman penambah energi dan isotonik mengandung natrium untuk elektrolit. Konsumsi berlebih dapat memicu hipertensi.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={[styles.tipIconBox, { backgroundColor: '#fee2e2' }]}>
            <MaterialCommunityIcons name="coffee-outline" size={20} color="#dc2626" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Lemak Jenuh Minuman Kopi & Krimer</Text>
            <Text style={styles.tipDesc}>
              Kopi susu kemasan dan minuman bersantan kemasan sering kali mengandung lemak tersembunyi yang cukup tinggi.
            </Text>
          </View>
        </View>
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
  welcomeCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  welcomeTextGroup: {
    marginBottom: 8,
  },
  welcomeSub: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  focusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  focusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  ctaBanner: {
    flexDirection: 'row',
    backgroundColor: '#166534',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#166534',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaTextSide: {
    flex: 1,
  },
  ctaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  ctaBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 22,
    marginBottom: 4,
  },
  ctaSub: {
    fontSize: 11,
    color: '#bbf7d0',
    lineHeight: 16,
    marginBottom: 14,
  },
  ctaButtonFake: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  ctaButtonFakeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  ctaGraphicSide: {
    marginLeft: 12,
  },
  gradeDisplayCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  tipsList: {
    gap: 10,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tipIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  tipDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 15,
  },
});
