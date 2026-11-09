import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header({ userProfile, onOpenProfile, isDarkMode, onToggleDarkMode }) {
  const userName = userProfile?.name || 'Tamu';

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <View style={styles.logoIcon}>
          <MaterialCommunityIcons name="cup-water" size={24} color="#16a34a" />
        </View>
        <View>
          <Text style={styles.brandTitle}>NutriSip</Text>
          <Text style={styles.brandSubtitle}>Pindai Nutrisi Minuman</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {/* User Pill Badge */}
        <TouchableOpacity style={styles.userBadge} onPress={onOpenProfile} activeOpacity={0.7}>
          <View style={styles.onlineDot} />
          <Text style={styles.userName} numberOfLines={1}>
            {userName}
          </Text>
        </TouchableOpacity>

        {/* Settings button */}
        <TouchableOpacity style={styles.iconButton} onPress={onOpenProfile}>
          <Ionicons name="settings-outline" size={20} color="#4b5563" />
        </TouchableOpacity>

        {/* Dark Mode button */}
        <TouchableOpacity style={styles.iconButton} onPress={onToggleDarkMode}>
          <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon-outline'} size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#166534',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: 110,
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
