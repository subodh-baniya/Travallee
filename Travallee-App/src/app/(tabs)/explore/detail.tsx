import React, { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Pressable, ScrollView, StyleSheet, Text, View, Image,
  ActivityIndicator, PanResponder, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';
import axios from 'axios';
import { API_ENDPOINTS_HOTEL } from '@/src/constants/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HotelDetail {
  _id: string;
  hotelName: string;
  hotelDescription: string;
  hotelLocation: string;
  hotelImages: string[];
  propertyType: string;
  facilities: string[];
  checkinTime: string;
  checkoutTime: string;
  contactNumber: string;
  pricePerNight: number;
  rating: number;
  numberOfReviews: number;
  ownerName: string;
  isFeatured: boolean;
  verified: boolean;
  rooms: any[];
  createdAt: string;
  updatedAt: string;
}

const AMENITY_ICON_MAP: Record<string, string> = {
  swimming: 'water-outline',
  pool: 'water-outline',
  wifi: 'wifi-outline',
  'free wifi': 'wifi-outline',
  restaurant: 'restaurant-outline',
  bar: 'wine-outline',
  business: 'briefcase-outline',
  parking: 'car-outline',
  gym: 'fitness-outline',
  ac: 'snow-outline',
  'air conditioning': 'snow-outline',
  tv: 'tv-outline',
  kitchen: 'fast-food-outline',
  spa: 'sparkles-outline',
  laundry: 'shirt-outline',
};

const getAmenityIconName = (facility: string): string => {
  return AMENITY_ICON_MAP[facility.toLowerCase()] || 'checkmark-circle-outline';
};

const RATING_COLORS = ['#FFB800', '#FFC940', '#E8E0C8', '#D8D0B8', '#C8C0A8'];
const RATING_PERCENTAGES = [60, 20, 10, 1, 5];

export default function HotelDetailScreen() {
  const router = useRouter();
  const { hotelId } = useLocalSearchParams();
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 30 && Math.abs(gestureState.dy) < 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) router.back();
      },
    })
  ).current;

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        if (!hotelId) {
          setError('Hotel ID not found');
          setLoading(false);
          return;
        }
        const url = API_ENDPOINTS_HOTEL.GET_HOTEL_BY_ID.replace(':id', hotelId as string);
        const response = await axios.get(url, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          timeout: 15000,
        });
        // Handle both { success, data } and direct object response shapes
        const data = response.data?.success ? response.data.data : response.data;
        if (data?._id) {
          setHotel(data);
        } else {
          setError('Failed to load hotel data');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, [hotelId]);

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="auto" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={RealixColors.accent} />
          <Text style={styles.loadingText}>Loading hotel details…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (error || !hotel) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="auto" />
        <View style={styles.headerBar}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={18} color={RealixColors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={RealixColors.textMuted} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error || 'Hotel not found'}</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const displayAmenities = hotel.facilities?.slice(0, 5) || [];
  const extraImages = (hotel.hotelImages?.length ?? 0) - 3;

  // ─── Main Screen ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.headerBar}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color={RealixColors.textPrimary} />
        </Pressable>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerBtn} onPress={() => setIsFavorited(v => !v)}>
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorited ? '#e74c3c' : RealixColors.textSecondary}
            />
          </Pressable>
          <Pressable style={styles.headerBtn}>
            <Ionicons name="ellipsis-horizontal" size={16} color={RealixColors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        {...panResponder.panHandlers}
      >
        {/* ── Hero ── */}
        <View style={styles.heroSection}>
          {hotel.hotelImages?.length > 0 ? (
            <Image
              source={{ uri: hotel.hotelImages[currentImageIndex] }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="image-outline" size={48} color={RealixColors.textMuted} />
              <Text style={styles.noImageText}>No photos available</Text>
            </View>
          )}

          {/* Image counter badge */}
          {hotel.hotelImages?.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {hotel.hotelImages.length}
              </Text>
            </View>
          )}

          {/* Dots */}
          {hotel.hotelImages?.length > 1 && (
            <View style={styles.dots}>
              {hotel.hotelImages.map((_, idx) => (
                <Pressable key={idx} onPress={() => setCurrentImageIndex(idx)}>
                  <View style={[styles.dot, idx === currentImageIndex && styles.dotActive]} />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ── Body ── */}
        <View style={styles.bodyContent}>

          {/* Badges */}
          <View style={styles.badgeRow}>
            {hotel.propertyType ? (
              <View style={styles.badgeType}>
                <Text style={styles.badgeTypeText}>{hotel.propertyType}</Text>
              </View>
            ) : null}
            {hotel.verified && (
              <View style={styles.badgeVerified}>
                <Ionicons name="checkmark-circle" size={10} color="#1a7a3f" />
                <Text style={styles.badgeVerifiedText}>Verified</Text>
              </View>
            )}
            {hotel.isFeatured && (
              <View style={styles.badgeFeatured}>
                <Ionicons name="star" size={10} color="#b55a00" />
                <Text style={styles.badgeFeaturedText}>Featured</Text>
              </View>
            )}
          </View>

          {/* Name */}
          <Text style={styles.propName}>{hotel.hotelName}</Text>

          {/* Location */}
          <View style={styles.locRow}>
            <View style={styles.locDot} />
            <Text style={styles.locText}>{hotel.hotelLocation}</Text>
          </View>

          {/* Rating + Price card */}
          <View style={styles.ratingCard}>
            <View style={styles.ratingLeft}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.ratingNum}>{hotel.rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>
                {hotel.numberOfReviews > 0
                  ? `${hotel.numberOfReviews} review${hotel.numberOfReviews !== 1 ? 's' : ''}`
                  : 'No reviews yet'}
              </Text>
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.priceMain}>${hotel.pricePerNight}</Text>
              <Text style={styles.priceSub}>/night</Text>
            </View>
          </View>

          {/* About */}
          <Text style={styles.secTitle}>About</Text>
          <Text style={styles.aboutText}>{hotel.hotelDescription}</Text>

          {/* Amenities */}
          {displayAmenities.length > 0 && (
            <>
              <Text style={styles.secTitle}>Popular Amenities</Text>
              <View style={styles.amenRow}>
                {displayAmenities.map((facility, idx) => (
                  <View key={idx} style={styles.amenity}>
                    <View style={styles.amenIcon}>
                      <Ionicons
                        name={getAmenityIconName(facility) as any}
                        size={20}
                        color={RealixColors.accent}
                      />
                    </View>
                    <Text style={styles.amenLabel} numberOfLines={2}>
                      {facility}
                    </Text>
                  </View>
                ))}
              </View>
              {hotel.facilities?.length > 5 && (
                <Pressable>
                  <Text style={styles.allLink}>All Amenities ({hotel.facilities.length}) →</Text>
                </Pressable>
              )}
            </>
          )}

          {/* Check-in / Check-out */}
          {(hotel.checkinTime || hotel.checkoutTime) && (
            <>
              <Text style={styles.secTitle}>Check-in & Check-out</Text>
              <View style={styles.timeRow}>
                <View style={styles.timeBox}>
                  <Ionicons name="log-in-outline" size={16} color={RealixColors.accent} />
                  <Text style={styles.timeLabel}>Check-in</Text>
                  <Text style={styles.timeValue}>{hotel.checkinTime || '—'}</Text>
                </View>
                <View style={[styles.timeBox, styles.timeBoxRight]}>
                  <Ionicons name="log-out-outline" size={16} color={RealixColors.textMuted} />
                  <Text style={styles.timeLabel}>Check-out</Text>
                  <Text style={styles.timeValue}>{hotel.checkoutTime || '—'}</Text>
                </View>
              </View>
            </>
          )}

          {/* Gallery */}
          {hotel.hotelImages?.length > 0 && (
            <>
              <Text style={styles.secTitle}>Gallery</Text>
              <View style={styles.galleryRow}>
                {hotel.hotelImages.slice(0, 3).map((img, idx) => (
                  <View key={idx} style={styles.thumb}>
                    <Image source={{ uri: img }} style={styles.thumbImg} resizeMode="cover" />
                    {idx === 2 && extraImages > 0 && (
                      <View style={styles.thumbOverlay}>
                        <Text style={styles.overlayText}>+{extraImages}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Map placeholder */}
          <Text style={styles.secTitle}>Location</Text>
          <View style={styles.mapBox}>
            <View style={styles.mapRing}>
              <View style={styles.mapPin} />
            </View>
            <Text style={styles.mapLabel}>{hotel.hotelLocation}</Text>
          </View>

          {/* Rooms */}
          {hotel.rooms?.length > 0 && (
            <>
              <View style={styles.revHead}>
                <Text style={styles.secTitle}>Available Rooms</Text>
                <Text style={styles.revAll}>{hotel.rooms.length} rooms</Text>
              </View>
              <View style={styles.roomsRow}>
                {hotel.rooms.slice(0, 3).map((room, idx) => (
                  <View key={idx} style={styles.roomCard}>
                    <View style={styles.roomCardInner}>
                      <Ionicons name="bed-outline" size={18} color={RealixColors.accent} />
                      <Text style={styles.roomCardText}>
                        {room.roomType || `Room ${idx + 1}`}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Contact */}
          <Text style={styles.secTitle}>Contact</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={styles.contactIconBox}>
                <Ionicons name="call-outline" size={14} color={RealixColors.accent} />
              </View>
              <Text style={styles.contactText}>{hotel.contactNumber}</Text>
            </View>
            <View style={styles.contactDivider} />
            <View style={styles.contactRow}>
              <View style={styles.contactIconBox}>
                <Ionicons name="person-outline" size={14} color={RealixColors.accent} />
              </View>
              <Text style={styles.contactText}>{hotel.ownerName}</Text>
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.revHead}>
            <Text style={styles.secTitle}>Reviews</Text>
            <Pressable>
              <Text style={styles.revAll}>View all →</Text>
            </Pressable>
          </View>
          <View style={styles.revScore}>
            <Text style={styles.bigNum}>{hotel.rating.toFixed(1)}</Text>
            <View>
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.revCount}>
                {hotel.numberOfReviews > 0
                  ? `${hotel.numberOfReviews} ratings`
                  : 'No ratings yet'}
              </Text>
            </View>
          </View>

          {[5, 4, 3, 2, 1].map((star, idx) => (
            <View key={star} style={styles.barRow}>
              <Text style={styles.barLbl}>{star}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${RATING_PERCENTAGES[idx]}%`, backgroundColor: RATING_COLORS[idx] },
                  ]}
                />
              </View>
              <Text style={styles.barPct}>{RATING_PERCENTAGES[idx]}%</Text>
            </View>
          ))}

          {/* Price summary */}
          <View style={styles.dividerLine} />
          <View style={styles.priceSummaryRow}>
            <View>
              <Text style={styles.priceSummaryLabel}>Price per night</Text>
              <Text style={styles.priceSummaryValue}>${hotel.pricePerNight}</Text>
            </View>
            <View style={styles.priceSummaryBadge}>
              <Text style={styles.priceSummaryBadgeText}>Best price</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.heartOutline, isFavorited && styles.heartOutlineActive]}
          onPress={() => setIsFavorited(v => !v)}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorited ? '#e74c3c' : RealixColors.textSecondary}
          />
        </Pressable>
        <Pressable style={styles.bookBtn}>
          <Text style={styles.bookTxt}>Book Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RealixColors.pageBackground,
  },

  // ── Header ──
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: RealixColors.cardBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: RealixColors.border,
  },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: RealixColors.rowBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },

  // ── Scroll ──
  scrollContent: {
    paddingBottom: 24,
  },

  // ── Hero ──
  heroSection: {
    width: '100%',
    height: Math.round(SCREEN_HEIGHT * 0.28),
    backgroundColor: RealixColors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RealixColors.rowBackground,
    gap: 8,
  },
  noImageText: {
    fontSize: 13,
    color: RealixColors.textMuted,
  },
  imageCounter: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageCounterText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 16,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },

  // ── Body ──
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },

  // ── Badges ──
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  badgeType: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: RealixColors.rowBackground,
  },
  badgeTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: RealixColors.textSecondary,
  },
  badgeVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: '#E8F8EE',
  },
  badgeVerifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1a7a3f',
  },
  badgeFeatured: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
  },
  badgeFeaturedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#b55a00',
  },

  // ── Name & Location ──
  propName: {
    fontSize: 20,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    marginBottom: 6,
    lineHeight: 26,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 14,
  },
  locDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: RealixColors.accent,
    marginTop: 4,
    flexShrink: 0,
  },
  locText: {
    fontSize: 13,
    color: RealixColors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },

  // ── Rating Card ──
  ratingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingNum: {
    fontSize: 18,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  ratingCount: {
    fontSize: 11,
    color: RealixColors.textMuted,
  },
  pricePill: {
    backgroundColor: RealixColors.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  priceMain: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  priceSub: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.85)',
  },

  // ── Section title ──
  secTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },

  // ── About ──
  aboutText: {
    fontSize: 13,
    color: RealixColors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },

  // ── Amenities ──
  amenRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  amenity: {
    alignItems: 'center',
    width: '18%',
    marginBottom: 4,
  },
  amenIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: RealixColors.rowBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  amenLabel: {
    fontSize: 10,
    color: RealixColors.textMuted,
    textAlign: 'center',
    lineHeight: 13,
  },
  allLink: {
    fontSize: 12,
    color: RealixColors.accent,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 2,
  },

  // ── Check-in / Check-out ──
  timeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  timeBox: {
    flex: 1,
    backgroundColor: RealixColors.rowBackground,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 4,
  },
  timeBoxRight: {
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  timeLabel: {
    fontSize: 10,
    color: RealixColors.textMuted,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },

  // ── Gallery ──
  galleryRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  thumb: {
    flex: 1,
    height: 90,
    borderRadius: 10,
    backgroundColor: RealixColors.border,
    overflow: 'hidden',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.58)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // ── Map ──
  mapBox: {
    width: '100%',
    height: 120,
    backgroundColor: RealixColors.rowBackground,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  mapRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(123,200,32,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: RealixColors.accent,
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  mapLabel: {
    fontSize: 11,
    color: RealixColors.textMuted,
  },

  // ── Rooms ──
  roomsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  roomCard: {
    flex: 1,
    height: 80,
    borderRadius: 10,
    backgroundColor: RealixColors.rowBackground,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  roomCardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  roomCardText: {
    fontSize: 11,
    color: RealixColors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ── Contact ──
  contactCard: {
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  contactIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EAF5D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDivider: {
    height: 0.5,
    backgroundColor: RealixColors.border,
    marginLeft: 52,
  },
  contactText: {
    fontSize: 13,
    color: RealixColors.textPrimary,
    fontWeight: '500',
  },

  // ── Reviews ──
  revHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  revAll: {
    fontSize: 12,
    color: RealixColors.accent,
    fontWeight: '600',
  },
  revScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  bigNum: {
    fontSize: 36,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    lineHeight: 40,
  },
  stars: {
    fontSize: 14,
    color: '#FFB800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  revCount: {
    fontSize: 11,
    color: RealixColors.textMuted,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  barLbl: {
    fontSize: 12,
    color: RealixColors.textSecondary,
    width: 12,
    textAlign: 'right',
    fontWeight: '500',
  },
  barTrack: {
    flex: 1,
    height: 7,
    backgroundColor: RealixColors.rowBackground,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barPct: {
    fontSize: 11,
    color: RealixColors.textSecondary,
    width: 30,
    textAlign: 'right',
  },

  // ── Price Summary ──
  dividerLine: {
    height: 1,
    backgroundColor: RealixColors.border,
    marginVertical: 14,
  },
  priceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceSummaryLabel: {
    fontSize: 11,
    color: RealixColors.textMuted,
    marginBottom: 2,
  },
  priceSummaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  priceSummaryBadge: {
    backgroundColor: '#EAF5D6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  priceSummaryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B6D11',
  },

  // ── Bottom Bar ──
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: RealixColors.border,
    backgroundColor: RealixColors.cardBackground,
  },
  heartOutline: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: RealixColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RealixColors.cardBackground,
  },
  heartOutlineActive: {
    borderColor: '#e74c3c',
    backgroundColor: '#FFF0F0',
  },
  bookBtn: {
    flex: 1,
    backgroundColor: RealixColors.accent,
    borderRadius: 22,
    paddingVertical: 13,
    alignItems: 'center',
  },
  bookTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },

  // ── Loading / Error ──
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: RealixColors.textMuted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: RealixColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: RealixColors.accent,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});