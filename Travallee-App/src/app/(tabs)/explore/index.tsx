import React, { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '@/src/services/apiClient';
import { API_ENDPOINTS_HOTEL } from '@/src/constants/api';
import { API_URL } from '@/src/constants/env';

// ─── Colors ──────────────────────────────────────────────────────────────────

export const RealixColors = {
  pageBackground: '#111111',
  screenBackground: '#111111',
  sectionBackground: '#1a1a1a',
  cardBackground: '#1e1e1e',
  rowBackground: '#1c1c1c',
  inputBackground: '#2a2a2a',
  textPrimary: '#f0f0f0',
  textSecondary: '#aaaaaa',
  textMuted: '#666666',
  textCaption: '#555555',
  border: '#2a2a2a',
  inputBorder: '#333333',
  accent: '#7ED321',
  accentBright: '#8EE52A',
  accentDark: '#6abc18',
  accentToggle: '#4CAF50',
  orange: '#f39c12',
  blue: '#3a7bd5',
  shadow: 'rgba(0, 0, 0, 0.6)',
  danger: '#ef4444',
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

const FILTER_CHIPS = [
  { id: 'all',     label: 'All Hotels', icon: 'globe-outline' },
  { id: 'hotels',  label: 'Hotels',     icon: 'business-outline' },
  { id: 'resorts', label: 'Resorts',    icon: 'umbrella-outline' },
] as const;

type FilterId = typeof FILTER_CHIPS[number]['id'];

const NEPAL_DESTINATIONS = [
  { id: '1', city: 'Kathmandu', tagline: 'Capital & Culture',     emoji: '🏛️', color: '#FFF3E0', properties: 240, from: 25 },
  { id: '2', city: 'Pokhara',   tagline: 'Lakes & Himalayas',     emoji: '🏔️', color: '#E3F2FD', properties: 180, from: 18 },
  { id: '3', city: 'Chitwan',   tagline: 'Jungle Safaris',        emoji: '🦏', color: '#E8F5E9', properties: 95,  from: 30 },
  { id: '4', city: 'Lumbini',   tagline: 'Birthplace of Buddha',  emoji: '🕌', color: '#FCE4EC', properties: 48,  from: 15 },
  { id: '5', city: 'Nagarkot',  tagline: 'Sunrise Views',         emoji: '🌄', color: '#EDE7F6', properties: 36,  from: 20 },
  { id: '6', city: 'Bandipur',  tagline: 'Hilltop Heritage',      emoji: '🏘️', color: '#FFF8E1', properties: 22,  from: 12 },
];

const FEATURED_PROPERTIES = [
  {
    id: '1',
    name: "Dwarika's Hotel",
    location: 'Battisputali, Kathmandu',
    price: 280,
    rating: 4.9,
    reviews: 412,
    type: 'Heritage Hotel',
    tag: 'UNESCO Heritage',
    tagColor: '#E8F5E9',
    tagTextColor: '#2E7D32',
    gradientColors: ['#1a2e0a', '#2d5010'] as [string, string],
    emoji: '🏛️',
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776680988/hotel_images/images-1776680986036-70054303.webp',
  },
  {
    id: '2',
    name: 'Temple Tree Resort',
    location: 'Lakeside, Pokhara',
    price: 95,
    rating: 4.7,
    reviews: 318,
    type: 'Resort',
    tag: 'Lakefront',
    tagColor: '#E3F2FD',
    tagTextColor: '#1565C0',
    gradientColors: ['#0a1e2e', '#103050'] as [string, string],
    emoji: '🏔️',
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776681018/hotel_images/images-1776680986036-162807224.jpg',
  },
  {
    id: '3',
    name: 'Barahi Jungle Lodge',
    location: 'Sauraha, Chitwan',
    price: 120,
    rating: 4.8,
    reviews: 204,
    type: 'Jungle Lodge',
    tag: 'Safari Included',
    tagColor: '#FFF3E0',
    tagTextColor: '#E65100',
    gradientColors: ['#1e2a0a', '#2a4010'] as [string, string],
    emoji: '🦏',
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776680988/hotel_images/images-1776680986036-70054303.webp',
  },
];

const MIGHT_LIKE_PROPERTIES = [
  {
    id: '1',
    name: 'Hotel Shanker',
    location: 'Lazimpat, Kathmandu',
    price: 118,
    originalPrice: 158,
    rating: 4.8,
    reviews: 289,
    type: 'Boutique Hotel',
    offer: '25% OFF',
    perk: 'Free breakfast + free cancellation',
    gradientColors: ['#2e1a0a', '#503010'] as [string, string],
    emoji: '🏰',
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776681018/hotel_images/images-1776680986036-162807224.jpg',
  },
  {
    id: '2',
    name: 'Barahi Pokhara',
    location: 'Lakeside, Pokhara',
    price: 92,
    originalPrice: 125,
    rating: 4.7,
    reviews: 214,
    type: 'Lake Resort',
    offer: 'Save $33',
    perk: 'Breakfast included',
    gradientColors: ['#0a1e2e', '#103050'] as [string, string],
    emoji: '🌊',
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776680988/hotel_images/images-1776680986036-70054303.webp',
  },
  {
    id: '3',
    name: 'Kasara Chitwan',
    location: 'Sauraha, Chitwan',
    price: 145,
    originalPrice: 190,
    rating: 4.9,
    reviews: 167,
    type: 'Jungle Lodge',
    offer: 'Deal of the day',
    perk: 'Safari add-on available',
    gradientColors: ['#1e2a0a', '#2a4010'] as [string, string],
    emoji: '🌿',
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776681018/hotel_images/images-1776680986036-162807224.jpg',
  },
];

const TOP_RATED_STAYS = [
  {
    id: '1',
    name: "Dwarika's Hotel",
    location: 'Kathmandu',
    rating: 4.9,
    reviews: 412,
    offer: 'Guest favorite',
    gradientColors: ['#1a2e0a', '#2d5010'] as [string, string],
    emoji: '🏛️',
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776680988/hotel_images/images-1776680986036-70054303.webp',
  },
  {
    id: '2',
    name: 'Temple Tree Resort',
    location: 'Pokhara',
    rating: 4.8,
    reviews: 318,
    offer: 'Top rated for couples',
    gradientColors: ['#0a1e2e', '#103050'] as [string, string],
    emoji: '🏔️',
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776681018/hotel_images/images-1776680986036-162807224.jpg',
  },
  {
    id: '3',
    name: 'Barahi Jungle Lodge',
    location: 'Chitwan',
    rating: 4.8,
    reviews: 204,
    offer: 'Best safari stay',
    gradientColors: ['#1e2a0a', '#2a4010'] as [string, string],
    emoji: '🦏',
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776680988/hotel_images/images-1776680986036-70054303.webp',
  },
];

const NEARBY_GETAWAYS = [
  { id: '1', city: 'Kathmandu Valley', note: '1-2 nights',       price: 24, icon: 'business-outline',  color: '#FFF3E0' },
  { id: '2', city: 'Pokhara Lakeside', note: 'Weekend escape',    price: 18, icon: 'water-outline',     color: '#E3F2FD' },
  { id: '3', city: 'Chitwan Safari',   note: 'Nature break',      price: 30, icon: 'leaf-outline',      color: '#E8F5E9' },
  { id: '4', city: 'Nagarkot Sunrise', note: 'Quick getaway',     price: 20, icon: 'sunny-outline',     color: '#FCE4EC' },
];

const TREKKING_PACKAGES = [
  { id: '1', name: 'EBC Trek',           days: 14, from: 850, region: 'Khumbu Region' },
  { id: '2', name: 'Annapurna Circuit',  days: 12, from: 720, region: 'Annapurna Region' },
  { id: '3', name: 'Langtang Valley',    days: 7,  from: 420, region: 'Langtang Region' },
];

const UPCOMING_FESTIVALS = [
  { id: '1', name: 'Dashain', date: 'Oct 2026', desc: "Nepal's biggest festival" },
  { id: '2', name: 'Tihar',   date: 'Nov 2026', desc: 'Festival of lights' },
  { id: '3', name: 'Holi',    date: 'Mar 2027', desc: 'Festival of colors' },
];

const TRAVEL_ESSENTIALS = [
  { id: '1', label: 'Transfers', icon: 'car-outline',              color: '#FFF3E0', iconColor: '#E65100' },
  { id: '2', label: 'Visa Help', icon: 'document-text-outline',    color: '#E3F2FD', iconColor: '#1565C0' },
  { id: '3', label: 'Guides',    icon: 'people-outline',           color: '#E8F5E9', iconColor: '#2E7D32' },
  { id: '4', label: 'Insurance', icon: 'shield-checkmark-outline', color: '#FCE4EC', iconColor: '#880E4F' },
];

const QUICK_ACTIONS = [
  { id: '1', title: 'Map View',   text: 'Browse by location', icon: 'map-outline',              bg: '#1a2040', iconColor: '#4a8adf', route: '/(tabs)/explore/map' },
  { id: '2', title: 'Filters',    text: 'Price, type & more', icon: 'options-outline',           bg: '#1a2e0a', iconColor: '#7ED321', route: '/(tabs)/explore/filter-price' },
  { id: '3', title: 'Transfers',  text: 'Airport pickups',    icon: 'car-outline',              bg: '#2e1a0a', iconColor: '#E65100', route: null },
  { id: '4', title: 'Insurance',  text: 'Travel protection',  icon: 'shield-checkmark-outline', bg: '#2e0a1a', iconColor: '#880E4F', route: null },
];

type TabType = 'explore' | 'favorites' | 'bookings';

const TABS: Array<{ id: TabType; label: string; icon: string }> = [
  { id: 'explore',   label: 'Explore',  icon: 'compass-outline' },
  { id: 'favorites', label: 'Saved',    icon: 'bookmark-outline' },
  { id: 'bookings',  label: 'Bookings', icon: 'calendar-outline' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getHotelImageUri = (prop: any): string | null => {
  if (!prop) return null;
  if (typeof prop === 'string' && prop) return prop;
  if (typeof prop.image === 'string' && prop.image) return prop.image;
  if (typeof prop.imageUrl === 'string' && prop.imageUrl) return prop.imageUrl;
  if (typeof prop.photo === 'string' && prop.photo) return prop.photo;
  if (Array.isArray(prop.hotelImages) && prop.hotelImages.length > 0) return prop.hotelImages[0];
  if (Array.isArray(prop.images) && prop.images.length > 0) return prop.images[0];
  if (Array.isArray(prop.photos) && prop.photos.length > 0) return prop.photos[0];
  if (prop.image && typeof prop.image === 'object' && typeof prop.image.url === 'string') return prop.image.url;
  return null;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Rating pill — amber on dark bg */
const RatingPill = ({ rating }: { rating: number }) => (
  <View style={styles.ratingPill}>
    <Ionicons name="star" size={10} color="#FFB800" />
    <Text style={styles.ratingText}>{rating}</Text>
  </View>
);

/** Card image — shows real img with gradient overlay, falls back to emoji on gradient */
const CardImage = ({
  uri,
  height,
  gradientColors,
  emoji,
}: {
  uri: string | null;
  height: number;
  gradientColors: [string, string];
  emoji: string;
}) => (
  <View style={{ height, width: '100%' }}>
    {uri ? (
      <Image source={{ uri }} style={{ width: '100%', height }} resizeMode="cover" />
    ) : (
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 32 }}>{emoji}</Text>
      </LinearGradient>
    )}
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab]       = useState<TabType>('explore');
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading]           = useState(false);

  // Accent strip animation
  const stripOpacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(stripOpacity, { toValue: 0.7, duration: 1800, useNativeDriver: true }),
        Animated.timing(stripOpacity, { toValue: 0.3, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Handle destination press
  const handleDestinationPress = async (location: string) => {
    try {
      setLoading(true);
      const url = `${API_URL}:3001/api/v1/hotels/location/${location}`;
      const response = await apiClient.get(url);
      if (response.data.success && Array.isArray(response.data.data)) {
        router.push({
          pathname: '/(tabs)/explore/destination-results',
          params: { location, hotels: JSON.stringify(response.data.data) },
        });
      }
    } catch (error) {
      console.error('Error fetching hotels by location:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotels / resorts based on filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let endpoint = API_ENDPOINTS_HOTEL.FEATURED_HOTELS;
        if (activeFilter === 'hotels')  endpoint = API_ENDPOINTS_HOTEL.GET_ALL_HOTELS;
        if (activeFilter === 'resorts') endpoint = API_ENDPOINTS_HOTEL.GET_ALL_RESORTS;
        const response = await apiClient.get(endpoint);
        if (response.data.success && Array.isArray(response.data.data)) {
          setFilteredData(response.data.data);
        } else {
          setFilteredData([]);
        }
      } catch {
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeFilter]);

  const featTitle =
    activeFilter === 'hotels'  ? 'Hotels' :
    activeFilter === 'resorts' ? 'Resorts' :
    'Featured Properties';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>NEPAL · KTM</Text>
          <Text style={styles.title}>
            Discover <Text style={styles.titleAccent}>Nepal</Text>
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(tabs)/explore/search')}>
            <Ionicons name="notifications-outline" size={17} color={RealixColors.textMuted} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(tabs)/explore/search')}>
            <Ionicons name="search-outline" size={17} color={RealixColors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* ── Tab Bar ── */}
      <View style={styles.tabBarWrap}>
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.id}
              style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon as any}
                size={14}
                color={activeTab === tab.id ? '#111' : RealixColors.textMuted}
              />
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Accent strip */}
      <Animated.View style={[styles.accentStrip, { opacity: stripOpacity }]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════ EXPLORE TAB */}
        {activeTab === 'explore' && (
          <>

            {/* Season Banner */}
            <LinearGradient
              colors={['#1e3d0a', '#2a5210', '#1b3c08']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.seasonBanner}
            >
              <View>
                <Text style={styles.seasonTitle}>🍂 Peak Season</Text>
                <Text style={styles.seasonSub}>Oct – Dec · Best weather for trekking</Text>
              </View>
              <Pressable style={styles.seasonBtn}>
                <Text style={styles.seasonBtnText}>Plan Trip</Text>
              </Pressable>
            </LinearGradient>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {FILTER_CHIPS.map((chip) => (
                <Pressable
                  key={chip.id}
                  style={[styles.chip, activeFilter === chip.id && styles.chipActive]}
                  onPress={() => setActiveFilter(chip.id)}
                >
                  <Ionicons
                    name={chip.icon as any}
                    size={13}
                    color={activeFilter === chip.id ? '#111' : RealixColors.textMuted}
                  />
                  <Text style={[styles.chipText, activeFilter === chip.id && styles.chipTextActive]}>
                    {chip.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* ── Featured Properties ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{featTitle}</Text>
              <Pressable><Text style={styles.seeAll}>See all →</Text></Pressable>
            </View>

            {loading ? (
              <View style={styles.loaderWrap}>
                <ActivityIndicator size="large" color={RealixColors.accent} />
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
                {(filteredData.length > 0 ? filteredData : FEATURED_PROPERTIES).map((prop: any, idx: number) => {
                  const fallback = FEATURED_PROPERTIES[idx % FEATURED_PROPERTIES.length];
                  const imgUri = getHotelImageUri(prop);
                  return (
                    <Pressable
                      key={prop._id || prop.id}
                      style={styles.featuredCard}
                      onPress={() =>
                        router.replace({
                          pathname: '/(tabs)/explore/detail',
                          params: { hotelId: prop._id || prop.id },
                        })
                      }
                    >
                      <CardImage
                        uri={imgUri}
                        height={120}
                        gradientColors={prop.gradientColors || fallback.gradientColors}
                        emoji={prop.emoji || fallback.emoji}
                      />
                      {/* Gradient overlay */}
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.55)']}
                        style={styles.imgOverlay}
                      />
                      <View style={styles.featuredTag}>
                        <Text style={styles.featuredTagText}>
                          {prop.tag || (prop.isFeatured ? 'Featured' : prop.propertyType || 'Hotel')}
                        </Text>
                      </View>
                      <Pressable style={styles.featuredHeart}>
                        <Ionicons name="heart-outline" size={13} color="#fff" />
                      </Pressable>
                      <View style={styles.featuredBody}>
                        <View style={styles.featuredTypeRow}>
                          <Text style={styles.featuredType}>{prop.type || prop.propertyType || 'Hotel'}</Text>
                          <RatingPill rating={prop.rating} />
                        </View>
                        <Text style={styles.featuredName} numberOfLines={1}>{prop.name || prop.hotelName}</Text>
                        <View style={styles.featuredLocRow}>
                          <Ionicons name="location-outline" size={11} color={RealixColors.textMuted} />
                          <Text style={styles.featuredLoc} numberOfLines={1}>{prop.location || prop.hotelLocation}</Text>
                        </View>
                        <View style={styles.featuredPriceRow}>
                          <Text style={styles.featuredPrice}>${prop.price || prop.pricePerNight || 'N/A'}</Text>
                          <Text style={styles.featuredPriceSub}>/night</Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            {/* ── You Might Like ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>You Might Like</Text>
              <Pressable><Text style={styles.seeAll}>More deals →</Text></Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealScroll}>
              {MIGHT_LIKE_PROPERTIES.map((prop) => (
                <View key={prop.id} style={styles.dealCard}>
                  <View>
                    <CardImage
                      uri={getHotelImageUri(prop)}
                      height={128}
                      gradientColors={prop.gradientColors}
                      emoji={prop.emoji}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.5)']}
                      style={styles.imgOverlay}
                    />
                    <View style={styles.dealBadge}>
                      <Text style={styles.dealBadgeText}>{prop.offer}</Text>
                    </View>
                  </View>
                  <View style={styles.dealBody}>
                    <View style={styles.dealTopRow}>
                      <Text style={styles.dealType}>{prop.type}</Text>
                      <RatingPill rating={prop.rating} />
                    </View>
                    <Text style={styles.dealName} numberOfLines={1}>{prop.name}</Text>
                    <View style={styles.dealLocRow}>
                      <Ionicons name="location-outline" size={11} color={RealixColors.textMuted} />
                      <Text style={styles.dealLoc} numberOfLines={1}>{prop.location}</Text>
                    </View>
                    <View style={styles.dealOfferRow}>
                      <Text style={styles.dealPrice}>${prop.price}</Text>
                      <Text style={styles.dealOldPrice}>${prop.originalPrice}</Text>
                    </View>
                    <Text style={styles.dealPerk} numberOfLines={2}>{prop.perk}</Text>
                    <Text style={styles.dealReviews}>{prop.reviews} reviews</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* ── Top Rated Stays ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Rated Stays</Text>
              <Pressable><Text style={styles.seeAll}>View more →</Text></Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topRatedScroll}>
              {TOP_RATED_STAYS.map((stay) => (
                <Pressable key={stay.id} style={styles.topRatedCard}>
                  <CardImage
                    uri={getHotelImageUri(stay)}
                    height={108}
                    gradientColors={stay.gradientColors}
                    emoji={stay.emoji}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.5)']}
                    style={styles.imgOverlay}
                  />
                  <View style={styles.topRatedBody}>
                    <View style={styles.topRatedRow}>
                      <Text style={styles.topRatedName} numberOfLines={1}>{stay.name}</Text>
                      <View style={styles.topRatedBadge}>
                        <Ionicons name="star" size={10} color="#FFB800" />
                        <Text style={styles.topRatedBadgeText}>{stay.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.topRatedLoc}>{stay.location}</Text>
                    <Text style={styles.topRatedOffer}>{stay.offer}</Text>
                    <Text style={styles.topRatedReviews}>{stay.reviews} reviews</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* ── Nearby Getaways ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Getaways</Text>
            </View>

            <View style={styles.getawayGrid}>
              {NEARBY_GETAWAYS.map((item) => (
                <Pressable key={item.id} style={[styles.getawayCard, { backgroundColor: item.color }]}>
                  <View style={styles.getawayIconWrap}>
                    <Ionicons name={item.icon as any} size={18} color={RealixColors.accent} />
                  </View>
                  <Text style={styles.getawayCity}>{item.city}</Text>
                  <Text style={styles.getawayNote}>{item.note}</Text>
                  <Text style={styles.getawayPrice}>From ${item.price}</Text>
                </Pressable>
              ))}
            </View>

            {/* ── Popular Destinations ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Destinations</Text>
              <Pressable><Text style={styles.seeAll}>See all →</Text></Pressable>
            </View>

            <View style={styles.destGrid}>
              {NEPAL_DESTINATIONS.map((dest) => (
                <Pressable
                  key={dest.id}
                  style={[styles.destCard, { backgroundColor: dest.color }]}
                  onPress={() => handleDestinationPress(dest.city)}
                >
                  <Text style={styles.destEmoji}>{dest.emoji}</Text>
                  <Text style={styles.destCity}>{dest.city}</Text>
                  <Text style={styles.destTagline}>{dest.tagline}</Text>
                  <View style={styles.destMeta}>
                    <Text style={styles.destFrom}>From ${dest.from}</Text>
                    <Text style={styles.destCount}>{dest.properties}+</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* ── Trekking Packages ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trekking Packages</Text>
              <Pressable><Text style={styles.seeAll}>See all →</Text></Pressable>
            </View>

            <View style={{ gap: 10 }}>
              {TREKKING_PACKAGES.map((pkg) => (
                <Pressable key={pkg.id} style={styles.trekkingCard}>
                  <View style={styles.trekkingLeft}>
                    <View style={styles.trekkingIcon}>
                      <Ionicons name="footsteps-outline" size={18} color={RealixColors.accent} />
                    </View>
                    <View>
                      <Text style={styles.trekkingName}>{pkg.name}</Text>
                      <Text style={styles.trekkingRegion}>{pkg.region}</Text>
                    </View>
                  </View>
                  <View style={styles.trekkingRight}>
                    <View>
                      <Text style={styles.trekkingDays}>{pkg.days} days</Text>
                      <Text style={styles.trekkingFrom}>From</Text>
                    </View>
                    <Text style={styles.trekkingPrice}>${pkg.from}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* ── Travel Essentials ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Travel Essentials</Text>
            </View>

            <View style={styles.essGrid}>
              {TRAVEL_ESSENTIALS.map((item) => (
                <Pressable key={item.id} style={styles.essCard}>
                  <View style={[styles.essIcon, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.iconColor} />
                  </View>
                  <Text style={styles.essLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* ── Upcoming Festivals ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Festivals</Text>
              <Pressable><Text style={styles.seeAll}>Plan →</Text></Pressable>
            </View>

            <View style={{ gap: 8 }}>
              {UPCOMING_FESTIVALS.map((fest) => (
                <Pressable key={fest.id} style={styles.festCard}>
                  <View style={styles.festLeft}>
                    <View style={styles.festDot} />
                    <View>
                      <Text style={styles.festName}>{fest.name}</Text>
                      <Text style={styles.festDesc}>{fest.desc}</Text>
                    </View>
                  </View>
                  <View style={styles.festDateBox}>
                    <Text style={styles.festDate}>{fest.date}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* ── Quick Access ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
            </View>

            <View style={styles.quickGrid}>
              {QUICK_ACTIONS.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.quickCard}
                  onPress={() => item.route && router.push(item.route as any)}
                >
                  <View style={[styles.quickIcon, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
                  </View>
                  <Text style={styles.quickTitle}>{item.title}</Text>
                  <Text style={styles.quickText}>{item.text}</Text>
                </Pressable>
              ))}
            </View>

            {/* ── Currency Helper ── */}
            <View style={styles.currencyCard}>
              <View style={styles.currencyLeft}>
                <View style={styles.currencyIconWrap}>
                  <Ionicons name="swap-horizontal-outline" size={17} color={RealixColors.accent} />
                </View>
                <View>
                  <Text style={styles.currencyTitle}>1 USD = 133.5 NPR</Text>
                  <Text style={styles.currencySub}>Live rate · Updated just now</Text>
                </View>
              </View>
              <Pressable style={styles.currencyBtn}>
                <Text style={styles.currencyBtnText}>Convert</Text>
              </Pressable>
            </View>

          </>
        )}

        {/* ═══════════════════════════ FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="bookmark-outline" size={34} color={RealixColors.accent} />
            </View>
            <Text style={styles.emptyTitle}>No saved properties</Text>
            <Text style={styles.emptyText}>
              Tap the heart on any property to save it here for later.
            </Text>
            <Pressable style={styles.emptyBtn} onPress={() => setActiveTab('explore')}>
              <Text style={styles.emptyBtnText}>Explore Properties</Text>
            </Pressable>
          </View>
        )}

        {/* ═══════════════════════════ BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="calendar-outline" size={34} color={RealixColors.accent} />
            </View>
            <Text style={styles.emptyTitle}>No upcoming bookings</Text>
            <Text style={styles.emptyText}>
              When you book a property, your reservation will appear here.
            </Text>
            <Pressable style={styles.emptyBtn} onPress={() => setActiveTab('explore')}>
              <Text style={styles.emptyBtnText}>Find a Stay</Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RealixColors.pageBackground,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '600',
    color: RealixColors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    letterSpacing: -0.5,
  },
  titleAccent: {
    color: RealixColors.accent,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 0.5,
    borderColor: RealixColors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Accent Strip ──
  accentStrip: {
    height: 1.5,
    marginHorizontal: 20,
    borderRadius: 1,
    backgroundColor: RealixColors.accent,
    marginBottom: 2,
  },

  // ── Tab Bar ──
  tabBarWrap: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 14,
    padding: 4,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: RealixColors.accent,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: RealixColors.textMuted,
  },
  tabLabelActive: {
    color: '#111',
  },

  // ── Scroll Content ──
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 18,
  },
  loaderWrap: {
    paddingVertical: 24,
    alignItems: 'center',
  },

  // ── Season Banner ──
  seasonBanner: {
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a6e15',
    gap: 12,
  },
  seasonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c5f07a',
    marginBottom: 4,
  },
  seasonSub: {
    fontSize: 12,
    color: '#8ab55a',
    fontWeight: '500',
  },
  seasonBtn: {
    backgroundColor: RealixColors.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  seasonBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },

  // ── Chips ──
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 0.5,
    borderColor: RealixColors.inputBorder,
  },
  chipActive: {
    backgroundColor: RealixColors.accent,
    borderColor: RealixColors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: RealixColors.textMuted,
  },
  chipTextActive: {
    color: '#111',
  },

  // ── Section Header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  seeAll: {
    fontSize: 12,
    color: RealixColors.accent,
    fontWeight: '600',
  },

  // ── Rating Pill ──
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#2a2000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFB800',
  },

  // ── Image Overlay ──
  imgOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },

  // ── Featured Cards ──
  featuredScroll: {
    gap: 12,
    paddingRight: 4,
  },
  featuredCard: {
    width: 196,
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  featuredTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featuredTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.4,
  },
  featuredHeart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBody: {
    padding: 10,
    gap: 4,
  },
  featuredTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredType: {
    fontSize: 9,
    color: RealixColors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  featuredName: {
    fontSize: 13,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  featuredLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  featuredLoc: {
    fontSize: 10,
    color: RealixColors.textMuted,
    flex: 1,
  },
  featuredPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginTop: 2,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: RealixColors.accent,
  },
  featuredPriceSub: {
    fontSize: 10,
    color: RealixColors.textMuted,
  },

  // ── Deal Cards ──
  dealScroll: {
    gap: 12,
    paddingRight: 4,
  },
  dealCard: {
    width: 224,
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  dealBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(17,17,17,0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  dealBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  dealBody: {
    padding: 12,
    gap: 4,
  },
  dealTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealType: {
    fontSize: 9,
    color: RealixColors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dealName: {
    fontSize: 14,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  dealLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dealLoc: {
    fontSize: 10,
    color: RealixColors.textMuted,
    flex: 1,
  },
  dealOfferRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  dealPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: RealixColors.accent,
  },
  dealOldPrice: {
    fontSize: 11,
    color: RealixColors.textMuted,
    textDecorationLine: 'line-through',
  },
  dealPerk: {
    fontSize: 11,
    color: RealixColors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  dealReviews: {
    fontSize: 10,
    color: RealixColors.textMuted,
    marginTop: 1,
  },

  // ── Top Rated ──
  topRatedScroll: {
    gap: 12,
    paddingRight: 4,
  },
  topRatedCard: {
    width: 208,
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  topRatedBody: {
    padding: 12,
    gap: 4,
  },
  topRatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  topRatedName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  topRatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#2a2000',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  topRatedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFB800',
  },
  topRatedLoc: {
    fontSize: 11,
    color: RealixColors.textMuted,
  },
  topRatedOffer: {
    fontSize: 12,
    color: RealixColors.textSecondary,
    lineHeight: 17,
  },
  topRatedReviews: {
    fontSize: 10,
    color: RealixColors.textMuted,
  },

  // ── Nearby Getaways ──
  getawayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  getawayCard: {
    width: '47.5%',
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  getawayIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  getawayCity: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },
  getawayNote: {
    fontSize: 11,
    color: '#555',
  },
  getawayPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },

  // ── Destinations ──
  destGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  destCard: {
    width: '47.5%',
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  destEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  destCity: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  destTagline: {
    fontSize: 11,
    color: '#555',
    marginBottom: 6,
  },
  destMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destFrom: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  destCount: {
    fontSize: 10,
    color: '#777',
  },

  // ── Trekking ──
  trekkingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  trekkingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trekkingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1a2e0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trekkingName: {
    fontSize: 14,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  trekkingRegion: {
    fontSize: 11,
    color: RealixColors.textMuted,
  },
  trekkingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trekkingDays: {
    fontSize: 11,
    color: RealixColors.accent,
    fontWeight: '600',
  },
  trekkingFrom: {
    fontSize: 10,
    color: RealixColors.textMuted,
  },
  trekkingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },

  // ── Travel Essentials ──
  essGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  essCard: {
    flex: 1,
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  essIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  essLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: RealixColors.textPrimary,
    textAlign: 'center',
  },

  // ── Festivals ──
  festCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  festLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  festDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: RealixColors.accent,
  },
  festName: {
    fontSize: 13,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    marginBottom: 2,
  },
  festDesc: {
    fontSize: 11,
    color: RealixColors.textMuted,
  },
  festDateBox: {
    backgroundColor: '#1a2e0a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#3a6e15',
  },
  festDate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8ab55a',
  },

  // ── Quick Access ──
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: '47.5%',
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
    padding: 14,
    gap: 8,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  quickText: {
    fontSize: 11,
    color: RealixColors.textSecondary,
    lineHeight: 16,
  },

  // ── Currency ──
  currencyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currencyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1a2e0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  currencySub: {
    fontSize: 10,
    color: RealixColors.textMuted,
    marginTop: 1,
  },
  currencyBtn: {
    backgroundColor: RealixColors.accent,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  currencyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },

  // ── Empty State ──
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 14,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1a2e0a',
    borderWidth: 1,
    borderColor: '#3a6e15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: RealixColors.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 4,
    backgroundColor: RealixColors.accent,
    borderRadius: 22,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
});