import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import VerificationModal from '../components/VerificationModal';
import ResultModal from '../components/ResultModal';
import { calculateNutriGrade } from '../services/nutritionCalculator';
import { storageService } from '../services/storage';

// Contoh sampel uji coba cepat kategori produk minuman (berdasarkan database Excel per 100 ml)
const PRESET_BEVERAGE_SAMPLES = [
  {
    name: 'Teh Hijau Rendah Gula (Botol)',
    sugar: 0.3,
    sodium: 17.0,
    fat: 0.2,
    servingSize: 100,
    type: 'Teh Kemasan',
  },
  {
    name: 'Susu Kedelai Murni (Kotak)',
    sugar: 3.0,
    sodium: 3.0,
    fat: 0.7,
    servingSize: 100,
    type: 'Susu UHT',
  },
  {
    name: 'Kopi Susu Gula Aren (Kaleng)',
    sugar: 8.0,
    sodium: 100.0,
    fat: 2.0,
    servingSize: 100,
    type: 'Kopi Kemasan',
  },
  {
    name: 'Minuman Isotonik (Botol 500ml)',
    sugar: 6.5,
    sodium: 160.0,
    fat: 0.0,
    servingSize: 100,
    type: 'Isotonik',
  },
];

export default function ScannerScreen({ userProfile, onScanSaved }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Modals state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);

  // Ambil gambar kemasan minuman dari kamera
  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin kamera untuk memotret botol/kaleng minuman.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Gagal membuka kamera perangkat.');
    }
  };

  // Pilih gambar kemasan minuman dari galeri
  const handlePickFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin galeri untuk memilih foto kemasan minuman.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Gagal membuka galeri perangkat.');
    }
  };

  // Gunakan Preset Sampel Minuman untuk pengujian langsung
  const handleSelectPreset = preset => {
    setOcrData({
      productName: preset.name,
      servingSize: preset.servingSize,
      sugar: preset.sugar,
      sodium: preset.sodium,
      fat: preset.fat,
    });
    setSelectedImage('https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80');
    setShowVerificationModal(true);
  };

  // Eksekusi Langkah 2: Simulasi OCR Minuman -> Membuka Titik Kendali (Langkah 3)
  const handleStartAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      // Data terstruktur hasil bacaan OCR kemasan minuman
      setOcrData({
        productName: 'Minuman Teh Manis Kemasan 250ml',
        servingSize: 100,
        sugar: 4.5,
        sodium: 20.0,
        fat: 0.0,
      });
      setShowVerificationModal(true);
    }, 1200);
  };

  // Eksekusi Langkah 4 & 5 (Kalkulasi Skor Minuman) -> Membuka Langkah 6 (Hasil)
  const handleConfirmCalculation = verifiedData => {
    setShowVerificationModal(false);

    const calculated = calculateNutriGrade({
      sugar: verifiedData.sugar,
      sodium: verifiedData.sodium,
      fat: verifiedData.fat,
      servingSize: verifiedData.servingSize,
      userProfile,
    });

    setCalculationResult({
      ...calculated,
      productName: verifiedData.productName,
      servingSize: verifiedData.servingSize,
    });
    setShowResultModal(true);
  };

  // Simpan ke AsyncStorage
  const handleSaveToHistory = async () => {
    if (!calculationResult) return;

    const historyItem = {
      id: 'drink-scan-' + Date.now(),
      productName: calculationResult.productName,
      timestamp: new Date().toISOString(),
      imageUri: selectedImage,
      servingSize: calculationResult.servingSize,
      sugar: calculationResult.sugar,
      sodium: calculationResult.sodium,
      fat: calculationResult.fat,
      sugarLevel: calculationResult.sugarLevel,
      sodiumLevel: calculationResult.sodiumLevel,
      fatLevel: calculationResult.fatLevel,
      overallGrade: calculationResult.overallGrade,
      overallColor: calculationResult.colorInfo.hex,
      score: calculationResult.score,
      statusText: calculationResult.summary,
    };

    await storageService.addScanItem(historyItem);
    setShowResultModal(false);
    if (onScanSaved) onScanSaved();
    Alert.alert('Tersimpan', 'Hasil analisis minuman berhasil disimpan ke Riwayat.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Title Header */}
      <View style={styles.titleSection}>
        <Text style={styles.heading}>Pindai Label Minuman</Text>
        <Text style={styles.subheading}>
          Arahkan kamera ke bagian tabel Informasi Nilai Gizi pada botol, kaleng, atau kotak minuman Anda
        </Text>
      </View>

      {/* Viewfinder / Camera Frame Minuman */}
      <View style={styles.viewfinderContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderBox}>
            <MaterialCommunityIcons name="cup-water" size={48} color="#22c55e" />
            <Text style={styles.placeholderText}>Kotak Bidik Nutrisi Minuman</Text>
            <Text style={styles.placeholderSub}>Posisikan tabel nutrisi kemasan minuman di sini</Text>
          </View>
        )}

        {/* Laser Corner Overlays */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {/* Scan line effect */}
        <View style={styles.scanLine} />
      </View>

      {/* Status Bar */}
      <View style={styles.statusCard}>
        <View style={styles.statusLeft}>
          <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
          <Text style={styles.statusText}>
            {selectedImage ? 'Foto Kemasan Minuman Siap' : 'Siap Memotret Label Minuman'}
          </Text>
        </View>

        {selectedImage && (
          <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Ganti Foto</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons: Kamera & Galeri */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleTakePhoto} activeOpacity={0.8}>
          <Ionicons name="camera" size={20} color="#166534" />
          <Text style={styles.actionBtnText}>Buka Kamera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handlePickFromGallery} activeOpacity={0.8}>
          <Ionicons name="images-outline" size={20} color="#166534" />
          <Text style={styles.actionBtnText}>Unggah Galeri</Text>
        </TouchableOpacity>
      </View>

      {/* Shortcut Sample Bar Khusus Minuman */}
      <View style={styles.presetSection}>
        <Text style={styles.presetHeading}>Coba Cepat Sampel Minuman Populer:</Text>
        <View style={styles.presetChips}>
          {PRESET_BEVERAGE_SAMPLES.map((sample, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.chip}
              onPress={() => handleSelectPreset(sample)}
            >
              <Text style={styles.chipText}>{sample.name.split(' (')[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main Analyze CTA Button */}
      <TouchableOpacity
        style={[styles.analyzeBtn, analyzing && styles.analyzeBtnDisabled]}
        onPress={handleStartAnalysis}
        disabled={analyzing}
        activeOpacity={0.85}
      >
        {analyzing ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            <MaterialCommunityIcons name="lightning-bolt" size={22} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.analyzeBtnText}>Analisis Nutrisi Minuman Sekarang</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Modals */}
      <VerificationModal
        visible={showVerificationModal}
        initialData={ocrData}
        onClose={() => setShowVerificationModal(false)}
        onConfirmCalculation={handleConfirmCalculation}
      />

      <ResultModal
        visible={showResultModal}
        result={calculationResult}
        productName={calculationResult?.productName}
        onSaveAndClose={handleSaveToHistory}
        onCloseOnly={() => setShowResultModal(false)}
      />
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
  titleSection: {
    marginBottom: 16,
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
    lineHeight: 17,
  },
  viewfinderContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  placeholderSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#22c55e',
    borderWidth: 3.5,
  },
  cornerTL: {
    top: 14,
    left: 14,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    top: 14,
    right: 14,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 10,
  },
  cornerBL: {
    bottom: 14,
    left: 14,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    bottom: 14,
    right: 14,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
  },
  scanLine: {
    position: 'absolute',
    width: '85%',
    height: 2,
    backgroundColor: '#22c55e',
    opacity: 0.6,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  changePhotoBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    borderRadius: 14,
    height: 48,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  presetSection: {
    marginBottom: 16,
  },
  presetHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 16,
    height: 52,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeBtnDisabled: {
    backgroundColor: '#86efac',
    shadowOpacity: 0,
  },
  analyzeBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
