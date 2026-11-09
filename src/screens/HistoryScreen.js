import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { storageService } from '../services/storage';
import { NUTRI_COLORS } from '../services/nutritionCalculator';

export default function HistoryScreen({ history, onHistoryUpdated }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filteredHistory = history.filter(item => {
    if (selectedFilter === 'ALL') return true;
    return item.overallGrade === selectedFilter;
  });

  const handleDeleteItem = (id, name) => {
    Alert.alert('Hapus Riwayat', `Apakah Anda yakin ingin menghapus "${name}" dari riwayat pindaian minuman?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const updated = await storageService.deleteScanItem(id);
          onHistoryUpdated(updated);
        },
      },
    ]);
  };

  const handleClearAll = () => {
    if (history.length === 0) return;
    Alert.alert('Kosongkan Riwayat', 'Hapus semua riwayat pindaian minuman dari AsyncStorage?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Kosongkan',
        style: 'destructive',
        onPress: async () => {
          const updated = await storageService.clearScanHistory();
          onHistoryUpdated(updated);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const gradeColor = NUTRI_COLORS[item.overallGrade]?.hex || '#22c55e';
    const dateFormatted = new Date(item.timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.gradeBadge, { backgroundColor: gradeColor }]}>
            <Text style={styles.gradeText}>{item.overallGrade}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.productName}
            </Text>
            <Text style={styles.dateText}>{dateFormatted} • {item.servingSize || 100}ml</Text>
          </View>

          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>{item.score}</Text>
            <Text style={styles.scoreSub}>pts</Text>
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDeleteItem(item.id, item.productName)}
          >
            <Ionicons name="trash-outline" size={16} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* 3 Nutrient values chips */}
        <View style={styles.nutrientChips}>
          <View style={styles.chipItem}>
            <Text style={styles.chipLabel}>Gula:</Text>
            <Text style={[styles.chipVal, { color: NUTRI_COLORS[item.sugarLevel]?.hex || '#334155' }]}>
              {item.sugar}g ({item.sugarLevel})
            </Text>
          </View>

          <View style={styles.chipItem}>
            <Text style={styles.chipLabel}>Natrium:</Text>
            <Text style={[styles.chipVal, { color: NUTRI_COLORS[item.sodiumLevel]?.hex || '#334155' }]}>
              {item.sodium}mg ({item.sodiumLevel})
            </Text>
          </View>

          <View style={styles.chipItem}>
            <Text style={styles.chipLabel}>Lemak:</Text>
            <Text style={[styles.chipVal, { color: NUTRI_COLORS[item.fatLevel]?.hex || '#334155' }]}>
              {item.fat}g ({item.fatLevel})
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Riwayat Pindaian Minuman</Text>
          <Text style={styles.subTitle}>{filteredHistory.length} produk minuman tersimpan di memori</Text>
        </View>

        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Hapus Semua</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['ALL', 'A', 'B', 'C', 'D'].map(grade => (
          <TouchableOpacity
            key={grade}
            style={[styles.filterTab, selectedFilter === grade && styles.filterTabActive]}
            onPress={() => setSelectedFilter(grade)}
          >
            <Text style={[styles.filterTabText, selectedFilter === grade && styles.filterTabTextActive]}>
              {grade === 'ALL' ? 'Semua' : `Grade ${grade}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* History List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cup-water" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Belum Ada Riwayat Pindaian Minuman</Text>
            <Text style={styles.emptySub}>
              Mulai memotret botol atau kaleng minuman kemasan untuk melihat hasil analisis gizinya.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  subTitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
  },
  filterTabActive: {
    backgroundColor: '#16a34a',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 30,
    gap: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gradeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  gradeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  headerInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  dateText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    gap: 2,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
  },
  scoreSub: {
    fontSize: 9,
    color: '#64748b',
  },
  deleteBtn: {
    padding: 6,
  },
  nutrientChips: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'space-around',
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  chipVal: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  emptySub: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 17,
  },
});
