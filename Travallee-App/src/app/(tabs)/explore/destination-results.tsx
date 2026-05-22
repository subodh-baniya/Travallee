import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Pressable, ScrollView, StyleSheet, Text, View, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';

export default function DestinationResultsScreen() {
  const router = useRouter();
  const { goBack } = useSafeNavigation();
  const { location, hotels: hotelsJson } = useLocalSearchParams();
  const [hotels, setHotels] = useState<any[]>([]);

  useEffect(() => {
    if (hotelsJson && typeof hotelsJson === 'string') {
      try {
        const parsedHotels = JSON.parse(hotelsJson);
        setHotels(Array.isArray(parsedHotels) ? parsedHotels : []);
      } catch (error) {
        console.error('Error parsing hotels:', error);
        setHotels([]);
      }
    }
  }, [hotelsJson]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={RealixColors.textPrimary} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{location}</Text>
          <Text style={styles.subtitle}>{hotels.length} properties available</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {hotels.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={RealixColors.textMuted} />
            <Text style={styles.emptyTitle}>No hotels found</Text>
            <Text style={styles.emptyText}>Try searching for another location</Text>
          </View>
        ) : (
          hotels.map((hotel) => (
            <Pressable
              key={hotel._id || hotel.id}
              style={styles.hotelCard}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/explore/detail',
                  params: { hotelId: hotel._id || hotel.id },
                })
              }
            >
              {/* Hotel Image */}
              <Image
                source={{
                  uri: hotel.hotelImages?.[0] || 'https://via.placeholder.com/300',
                }}
                style={styles.hotelImage}
                resizeMode="cover"
              />

              {/* Tag */}
              {hotel.isFeatured && (
                <View style={styles.featuredTag}>
                  <Text style={styles.featuredTagText}>Featured</Text>
                </View>
              )}

              {/* Heart Button */}
              <Pressable style={styles.heartBtn}>
                <Ionicons name="heart-outline" size={20} color="#fff" />
              </Pressable>

              {/* Hotel Info */}
              <View style={styles.hotelInfo}>
                <View style={styles.hotelHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.hotelName} numberOfLines={1}>
                      {hotel.hotelName}
                    </Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={12} color={RealixColors.textMuted} />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {hotel.hotelLocation}
                      </Text>
                    </View>
                  </View>
                  {hotel.rating !== undefined && hotel.rating !== null && (
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#FFB800" />
                      <Text style={styles.ratingText}>{hotel.rating}</Text>
                    </View>
                  )}
                </View>

                {/* Property Type & Reviews */}
                <View style={styles.metaRow}>
                  <Text style={styles.propertyType}>
                    {hotel.propertyType || 'Hotel'}
                  </Text>
                  {hotel.numberOfReviews !== undefined && hotel.numberOfReviews !== null && (
                    <Text style={styles.reviewsText}>
                      {hotel.numberOfReviews} reviews
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RealixColors.screenBackground,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: RealixColors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: RealixColors.textMuted,
    marginTop: 2,
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: RealixColors.textMuted,
  },

  hotelCard: {
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },

  hotelImage: {
    width: '100%',
    height: 160,
    backgroundColor: RealixColors.border,
  },

  featuredTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: RealixColors.accent,
  },

  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  hotelInfo: {
    padding: 14,
    gap: 8,
  },

  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },

  hotelName: {
    fontSize: 15,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: RealixColors.textMuted,
    flex: 1,
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFB800',
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyType: {
    fontSize: 11,
    color: RealixColors.textMuted,
    fontWeight: '500',
  },
  reviewsText: {
    fontSize: 11,
    color: RealixColors.accent,
    fontWeight: '600',
  },
});
