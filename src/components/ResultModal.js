import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NUTRI_COLORS } from '../services/nutritionCalculator';

export default function ResultModal({
  visible,
  result,
  productName,
  onSaveAndClose,
  onCloseOnly,
}) {
  if (!result) return null;

  const {
    sugar,
    sodium,
    fat,
    sugarLevel,
    sodiumLevel,
    fatLevel,
    overallGrade,
    score,
    summary,
    personalizedAlerts = [],
  } = result;

  const gradeInfo = NUTRI_COLORS[overallGrade] || NUTRI_COLORS.B;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCloseOnly}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.badgeSuccess}>
              <MaterialCommunityIcons name="cup-water" size={14} color="#15803d" />
              <Text style={styles.badgeSuccessText}>Hasil Nutri-Grade Minuman</Text>
            </View>
            <TouchableOpacity onPress={onCloseOnly} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.productTitle}>{productName || 'Minuman Kemasan'}</Text>
            <Text style={styles.perUnitText}>Berdasarkan takaran standar 100 ml produk minuman siap konsumsi</Text>

            {/* Score & Grade Hero Card */}
            <View style={[styles.heroCard, { backgroundColor: gradeInfo.bg, borderColor: gradeInfo.hex }]}>
              <View style={styles.heroLeft}>
                <Text style={styles.scoreNumber}>{score}</Text>
                <Text style={styles.scoreMax}>/ 100</Text>
                <Text style={styles.scoreLabel}>Skor Nutrisi</Text>
              </View>

              <View style={styles.heroDivider} />

              <View style={styles.heroRight}>
                <View style={[styles.gradeCircle, { backgroundColor: gradeInfo.hex }]}>
                  <Text style={styles.gradeLetter}>{overallGrade}</Text>
                </View>
                <Text style={[styles.gradeStatusText, { color: gradeInfo.hex }]}>
                  {gradeInfo.label}
                </Text>
              </View>
            </View>

            {/* Ringkasan Edukasi Minuman */}
            <View style={styles.summaryBox}>
              <Ionicons name="bulb-outline" size={18} color="#059669" />
              <Text style={styles.summaryText}>{summary}</Text>
            </View>

            {/* Personalized Alerts */}
            {personalizedAlerts.map((alert, idx) => (
              <View
                key={idx}
                style={[
                  styles.alertCard,
                  alert.type === 'danger' ? styles.alertDanger : styles.alertWarning,
                ]}
              >
                <Ionicons
                  name={alert.type === 'danger' ? 'warning' : 'alert-circle'}
                  size={20}
                  color={alert.type === 'danger' ? '#dc2626' : '#d97706'}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.alertTitle,
                      { color: alert.type === 'danger' ? '#991b1b' : '#92400e' },
                    ]}
                  >
                    {alert.title}
                  </Text>
                  <Text
                    style={[
                      styles.alertMessage,
                      { color: alert.type === 'danger' ? '#b91c1c' : '#b45309' },
                    ]}
                  >
                    {alert.message}
                  </Text>
                </View>
              </View>
            ))}

            {/* 3 Detail Zat Gizi Minuman Sesuai Database Excel */}
            <Text style={styles.sectionTitle}>Rincian Ambang Batas Gizi Minuman</Text>

            <View style={styles.nutrientsContainer}>
              {/* Gula */}
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientLeft}>
                  <View style={[styles.indicatorDot, { backgroundColor: NUTRI_COLORS[sugarLevel].hex }]} />
                  <View>
                    <Text style={styles.nutrientTitle}>Gula Cair Total</Text>
                    <Text style={styles.nutrientValue}>{sugar.toFixed(1)} g / 100ml</Text>
                  </View>
                </View>
                <View style={[styles.nutrientLevelBadge, { backgroundColor: NUTRI_COLORS[sugarLevel].bg }]}>
                  <Text style={[styles.nutrientLevelText, { color: NUTRI_COLORS[sugarLevel].hex }]}>
                    Level {sugarLevel} ({NUTRI_COLORS[sugarLevel].name})
                  </Text>
                </View>
              </View>

              {/* Natrium */}
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientLeft}>
                  <View style={[styles.indicatorDot, { backgroundColor: NUTRI_COLORS[sodiumLevel].hex }]} />
                  <View>
                    <Text style={styles.nutrientTitle}>Natrium (Sodium)</Text>
                    <Text style={styles.nutrientValue}>{sodium.toFixed(0)} mg / 100ml</Text>
                  </View>
                </View>
                <View style={[styles.nutrientLevelBadge, { backgroundColor: NUTRI_COLORS[sodiumLevel].bg }]}>
                  <Text style={[styles.nutrientLevelText, { color: NUTRI_COLORS[sodiumLevel].hex }]}>
                    Level {sodiumLevel} ({NUTRI_COLORS[sodiumLevel].name})
                  </Text>
                </View>
              </View>

              {/* Lemak Total */}
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientLeft}>
                  <View style={[styles.indicatorDot, { backgroundColor: NUTRI_COLORS[fatLevel].hex }]} />
                  <View>
                    <Text style={styles.nutrientTitle}>Lemak Total</Text>
                    <Text style={styles.nutrientValue}>{fat.toFixed(1)} g / 100ml</Text>
                  </View>
                </View>
                <View style={[styles.nutrientLevelBadge, { backgroundColor: NUTRI_COLORS[fatLevel].bg }]}>
                  <Text style={[styles.nutrientLevelText, { color: NUTRI_COLORS[fatLevel].hex }]}>
                    Level {fatLevel} ({NUTRI_COLORS[fatLevel].name})
                  </Text>
                </View>
              </View>
            </View>

            {/* Storage Info */}
            <View style={styles.storageHint}>
              <MaterialCommunityIcons name="content-save-check-outline" size={16} color="#64748b" />
              <Text style={styles.storageHintText}>
                Menekan tombol simpan akan merekam minuman ini ke riwayat lokal Anda.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.saveBtn} onPress={onSaveAndClose} activeOpacity={0.85}>
              <Ionicons name="bookmark-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Simpan Minuman ke Riwayat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtnFooter} onPress={onCloseOnly}>
              <Text style={styles.closeBtnFooterText}>Pindai Minuman Lain</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  perUnitText: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 14,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
  },
  heroLeft: {
    alignItems: 'center',
    flex: 1,
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 38,
  },
  scoreMax: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: -4,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 14,
  },
  heroRight: {
    alignItems: 'center',
    flex: 1.2,
  },
  gradeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 6,
  },
  gradeLetter: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },
  gradeStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  summaryText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
    fontWeight: '500',
  },
  alertCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertDanger: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alertWarning: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 11,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 6,
    marginBottom: 10,
  },
  nutrientsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 14,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  nutrientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nutrientTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  nutrientValue: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  nutrientLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nutrientLevelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  storageHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  storageHintText: {
    fontSize: 11,
    color: '#64748b',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 8,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#16a34a',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeBtnFooter: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnFooterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});
