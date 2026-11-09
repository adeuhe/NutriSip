import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function VerificationModal({
  visible,
  initialData,
  onClose,
  onConfirmCalculation,
}) {
  const [productName, setProductName] = useState('');
  const [servingSize, setServingSize] = useState('100');
  const [sugar, setSugar] = useState('');
  const [sodium, setSodium] = useState('');
  const [fat, setFat] = useState('');

  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || 'Minuman Kemasan');
      setServingSize(String(initialData.servingSize || 100));
      setSugar(String(initialData.sugar ?? 0.3));
      setSodium(String(initialData.sodium ?? 17.0));
      setFat(String(initialData.fat ?? 0.2));
    }
  }, [initialData, visible]);

  const handleCalculate = () => {
    onConfirmCalculation({
      productName: productName.trim() || 'Produk Minuman Kemasan',
      servingSize: parseFloat(servingSize) || 100,
      sugar: parseFloat(sugar) || 0,
      sodium: parseFloat(sodium) || 0,
      fat: parseFloat(fat) || 0,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeStep}>
              <Text style={styles.badgeStepText}>LANGKAH 3 DARI 6 (KENDALI PENGGUNA)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Titik Kendali: Verifikasi Nutrisi Minuman</Text>
          <Text style={styles.subtitle}>
            Sistem OCR membaca tabel Informasi Nilai Gizi dari botol/kaleng. Anda adalah penentu angka
            sebelum skor dan grade akhir dinilai.
          </Text>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Nama Produk Minuman */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Minuman</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="pricetag-outline" size={18} color="#64748b" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={productName}
                  onChangeText={setProductName}
                  placeholder="Contoh: Teh Melati Kemasan Botol"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Takaran Saji (ml) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Takaran Saji Minuman (ml)</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="cup-water" size={18} color="#64748b" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={servingSize}
                  onChangeText={setServingSize}
                  keyboardType="numeric"
                  placeholder="100"
                  placeholderTextColor="#94a3b8"
                />
                <Text style={styles.unitText}>ml / saji</Text>
              </View>
            </View>

            {/* 3 Parameter Gizi Utama */}
            <View style={styles.nutrientCard}>
              <Text style={styles.nutrientTitle}>Kandungan Zat Gizi per Takaran Saji</Text>

              {/* Gula */}
              <View style={styles.nutrientRow}>
                <View style={[styles.bullet, { backgroundColor: '#eab308' }]} />
                <Text style={styles.nutrientName}>Gula Cair Total</Text>
                <View style={styles.smallInputWrapper}>
                  <TextInput
                    style={styles.smallInput}
                    value={sugar}
                    onChangeText={setSugar}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <Text style={styles.smallUnit}>g</Text>
                </View>
              </View>

              {/* Natrium */}
              <View style={styles.nutrientRow}>
                <View style={[styles.bullet, { backgroundColor: '#ea580c' }]} />
                <Text style={styles.nutrientName}>Natrium (Sodium)</Text>
                <View style={styles.smallInputWrapper}>
                  <TextInput
                    style={styles.smallInput}
                    value={sodium}
                    onChangeText={setSodium}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <Text style={styles.smallUnit}>mg</Text>
                </View>
              </View>

              {/* Lemak Total */}
              <View style={styles.nutrientRow}>
                <View style={[styles.bullet, { backgroundColor: '#16a34a' }]} />
                <Text style={styles.nutrientName}>Lemak Total</Text>
                <View style={styles.smallInputWrapper}>
                  <TextInput
                    style={styles.smallInput}
                    value={fat}
                    onChangeText={setFat}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <Text style={styles.smallUnit}>g</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color="#0284c7" />
              <Text style={styles.infoText}>
                Jika kemasan bukan 100 ml (misal 250ml atau 500ml), sistem akan menormalkannya secara
                otomatis ke basis standar 100 ml produk siap konsumsi.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleCalculate} activeOpacity={0.85}>
              <Ionicons name="flash-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.confirmBtnText}>Analisis Minuman</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeStep: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeStepText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
    marginBottom: 16,
  },
  formScroll: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  nutrientCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  nutrientTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  nutrientName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  smallInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 8,
    width: 84,
    height: 36,
  },
  smallInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    paddingRight: 4,
  },
  smallUnit: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: '#0369a1',
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  confirmBtn: {
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
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
