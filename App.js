import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { storageService } from './src/services/storage';

// Screens & Components
import OnboardingScreen from './src/screens/OnboardingScreen';
import Header from './src/components/Header';
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('scan'); // Default tab 'scan' as shown in mockup
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load profile and history from AsyncStorage on startup
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    setLoading(true);
    const profile = await storageService.getUserProfile();
    const history = await storageService.getScanHistory();
    setUserProfile(profile);
    setScanHistory(history);
    setLoading(false);
  };

  const handleOnboardingComplete = (newProfile) => {
    setUserProfile(newProfile);
    setActiveTab('scan');
  };

  const handleHistoryUpdated = (newHistory) => {
    setScanHistory(newHistory);
  };

  const handleProfileReset = () => {
    setUserProfile(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Memuat Data NutriSip...</Text>
      </View>
    );
  }

  // Jika belum mengisi form diri (Onboarding), tampilkan OnboardingScreen
  if (!userProfile || !userProfile.isConfigured) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  // Render Layar Sesuai Tab Aktif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            userProfile={userProfile}
            scanHistory={scanHistory}
            onNavigateToScan={() => setActiveTab('scan')}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            history={scanHistory}
            onHistoryUpdated={handleHistoryUpdated}
          />
        );
      case 'scan':
        return (
          <ScannerScreen
            userProfile={userProfile}
            onScanSaved={loadAppData}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            userProfile={userProfile}
            onProfileUpdated={(updated) => setUserProfile(updated)}
            onResetProfile={handleProfileReset}
          />
        );
      default:
        return <ScannerScreen userProfile={userProfile} onScanSaved={loadAppData} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0f172a' : '#ffffff'}
      />

      {/* Top Header dengan User Badge (Budi Pratama) */}
      <Header
        userProfile={userProfile}
        onOpenProfile={() => setActiveTab('profile')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Tab Screen Body */}
      <View style={styles.body}>{renderTabContent()}</View>

      {/* Bottom Navigation Bar (Sesuai Mockup Screenshot HP) */}
      <View style={styles.bottomNav}>
        {/* Beranda */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? '#16a34a' : '#94a3b8'}
          />
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Beranda
          </Text>
        </TouchableOpacity>

        {/* Riwayat */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'history' ? 'time' : 'time-outline'}
            size={22}
            color={activeTab === 'history' ? '#16a34a' : '#94a3b8'}
          />
          <Text style={[styles.navLabel, activeTab === 'history' && styles.navLabelActive]}>
            Riwayat
          </Text>
        </TouchableOpacity>

        {/* Floating Scan Button (Center) */}
        <TouchableOpacity
          style={styles.scanFloatingBtn}
          onPress={() => setActiveTab('scan')}
          activeOpacity={0.85}
        >
          <View style={[styles.scanIconWrapper, activeTab === 'scan' && styles.scanIconWrapperActive]}>
            <Ionicons name="camera" size={26} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Profil */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={22}
            color={activeTab === 'profile' ? '#16a34a' : '#94a3b8'}
          />
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
            Profil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  safeAreaDark: {
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 3,
  },
  navLabelActive: {
    color: '#16a34a',
    fontWeight: '700',
  },
  scanFloatingBtn: {
    top: -14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  scanIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  scanIconWrapperActive: {
    backgroundColor: '#16a34a',
  },
});
