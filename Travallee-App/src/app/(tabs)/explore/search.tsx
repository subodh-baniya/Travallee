import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors, realixSearchResults } from '@/src/constants/screens/realix';
import apiClient from '@/src/services/apiClient';
import { API_URL } from '@/src/constants/env';

export default function ExploreSearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Search hotels by location
  const handleSearch = useCallback(async (location: string) => {
    if (!location.trim()) {
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    try {
      setLoading(true);
      setNoResults(false);
      
      const url = `${API_URL}:3001/api/v1/hotels/location/${location}`;
      const response = await apiClient.get(url);
      
      if (response.data.success && response.data.data) {
        setSearchResults(response.data.data);
        if (response.data.data.length === 0) {
          setNoResults(true);
        }
      }
    } catch (error: any) {
      console.error('Search error:', error);
      setNoResults(true);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.headerRow}>
        <Text style={styles.title}>Discover</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={RealixColors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by location (e.g., Chitwan, Bharatpur)"
          placeholderTextColor={RealixColors.textMuted}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(text);
          }}
        />
        {searchQuery && (
          <Pressable onPress={() => {
            setSearchQuery('');
            setSearchResults([]);
            setNoResults(false);
          }}>
            <Ionicons name="close-circle" size={16} color={RealixColors.textMuted} />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={RealixColors.accent} />
            <Text style={styles.loadingText}>Searching hotels...</Text>
          </View>
        )}

        {noResults && !loading && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color={RealixColors.textMuted} />
            <Text style={styles.noResultsText}>No hotels found in "{searchQuery}"</Text>
            <Text style={styles.noResultsSubtext}>Try searching for another location</Text>
          </View>
        )}

        {!loading && searchResults.length > 0 && searchResults.map((hotel) => (
          <Pressable key={hotel._id} style={styles.row} onPress={() => router.push('/(tabs)/explore/detail')}>
            <View style={styles.thumb}>
              <Text style={styles.thumbEmoji}>🏨</Text>
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.name}>{hotel.hotelName}</Text>
              <Text style={styles.address}>{hotel.hotelLocation}</Text>
              {hotel.rating && (
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={RealixColors.accent} />
                  <Text style={styles.rating}>{hotel.rating} ({hotel.numberOfReviews})</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}

        {!loading && searchQuery === '' && searchResults.length === 0 && !noResults && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={RealixColors.textMuted} />
            <Text style={styles.emptyText}>Search by location</Text>
            <Text style={styles.emptySubtext}>Find hotels in Chitwan, Bharatpur, Nepal or any other location</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  headerRow: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 6 },
  title: { fontSize: 24, fontWeight: '700', color: RealixColors.textPrimary },
  searchBar: {
    marginHorizontal: 20,
    backgroundColor: RealixColors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: RealixColors.textPrimary,
  },
  content: { paddingVertical: 8 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: RealixColors.textMuted,
    marginTop: 12,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: RealixColors.textPrimary,
    marginTop: 12,
  },
  noResultsSubtext: {
    fontSize: 13,
    color: RealixColors.textMuted,
    marginTop: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: RealixColors.textPrimary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: RealixColors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 10 },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 20 },
  textWrap: { flex: 1 },
  name: { fontSize: 13, fontWeight: '600', color: RealixColors.textPrimary },
  address: { fontSize: 11, color: RealixColors.textMuted, marginTop: 2 },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rating: {
    fontSize: 10,
    color: RealixColors.accent,
    fontWeight: '500',
  },
});