import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
  Pressable, ScrollView, StyleSheet, Text, View,
  Image, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RealixColors,
  realixDestinations,
  realixDiscoverProperty,
} from '@/src/constants/screens/realix';

// ─── Nepal Data ──────────────────────────────────────────────────────────────

const FILTER_CHIPS = [
  { id: 'all',      label: 'All',        icon: 'globe-outline' },
  { id: 'popular',  label: 'Popular',    icon: 'flame-outline' },
  { id: 'trekking', label: 'Trekking',   icon: 'trail-sign-outline' },
  { id: 'heritage', label: 'Heritage',   icon: 'business-outline' },
  { id: 'resort',   label: 'Resort',     icon: 'umbrella-outline' },
  { id: 'budget',   label: 'Budget',     icon: 'wallet-outline' },
] as const;

type FilterId = typeof FILTER_CHIPS[number]['id'];

const NEPAL_DESTINATIONS = [
  {
    id: '1',
    city: 'Kathmandu',
    tagline: 'Capital & Culture',
    emoji: '🏛️',
    color: '#FFF3E0',
    properties: 240,
    from: 25,
  },
  {
    id: '2',
    city: 'Pokhara',
    tagline: 'Lakes & Himalayas',
    emoji: '🏔️',
    color: '#E3F2FD',
    properties: 180,
    from: 18,
  },
  {
    id: '3',
    city: 'Chitwan',
    tagline: 'Jungle Safaris',
    emoji: '🦏',
    color: '#E8F5E9',
    properties: 95,
    from: 30,
  },
  {
    id: '4',
    city: 'Lumbini',
    tagline: 'Birthplace of Buddha',
    emoji: '🕌',
    color: '#FCE4EC',
    properties: 48,
    from: 15,
  },
  {
    id: '5',
    city: 'Nagarkot',
    tagline: 'Sunrise Views',
    emoji: '🌄',
    color: '#EDE7F6',
    properties: 36,
    from: 20,
  },
  {
    id: '6',
    city: 'Bandipur',
    tagline: 'Hilltop Heritage',
    emoji: '🏘️',
    color: '#FFF8E1',
    properties: 22,
    from: 12,
  },
];

const FEATURED_PROPERTIES = [
  {
    id: '1',
    name: 'Dwarika\'s Hotel',
    location: 'Battisputali, Kathmandu',
    price: 280,
    rating: 4.9,
    reviews: 412,
    type: 'Heritage Hotel',
    tag: 'UNESCO Heritage',
    tagColor: '#E8F5E9',
    tagTextColor: '#2E7D32',
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
    image: 'https://res.cloudinary.com/dhwql7hqx/image/upload/v1776680988/hotel_images/images-1776680986036-70054303.webp',
  },
];

const TREKKING_PACKAGES = [
  { id: '1', name: 'EBC Trek', days: 14, from: 850, region: 'Khumbu' },
  { id: '2', name: 'Annapurna Circuit', days: 12, from: 720, region: 'Annapurna' },
  { id: '3', name: 'Langtang Valley', days: 7, from: 420, region: 'Langtang' },
];

const UPCOMING_FESTIVALS = [
  { id: '1', name: 'Dashain', date: 'Oct 2026', desc: 'Nepal\'s biggest festival' },
  { id: '2', name: 'Tihar', date: 'Nov 2026', desc: 'Festival of lights' },
  { id: '3', name: 'Holi', date: 'Mar 2027', desc: 'Festival of colors' },
];

type TabType = 'explore' | 'trekking' | 'favorites' | 'bookings';

const TABS: Array<{ id: TabType; label: string; icon: string }> = [
  { id: 'explore',   label: 'Explore',   icon: 'compass-outline' },
  { id: 'trekking',  label: 'Trekking',  icon: 'trail-sign-outline' },
  { id: 'favorites', label: 'Saved',     icon: 'bookmark-outline' },
  { id: 'bookings',  label: 'Bookings',  icon: 'calendar-outline' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />

      {/* ── Fixed Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>नमस्ते 🙏</Text>
          <Text style={styles.title}>Discover Nepal</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => router.push('/(tabs)/explore/search')}
          >
            <Ionicons name="notifications-outline" size={18} color={RealixColors.textPrimary} />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={() => router.push('/(tabs)/explore/search')}
          >
            <Ionicons name="search-outline" size={18} color={RealixColors.textPrimary} />
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
                size={15}
                color={activeTab === tab.id ? '#fff' : RealixColors.textMuted}
              />
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ══════════════════════════════════════════════ EXPLORE TAB */}
        {activeTab === 'explore' && (
          <>
            {/* Search Bar */}
            <Pressable
              style={styles.searchBar}
              onPress={() => router.push('/(tabs)/explore/search')}
            >
              <View style={styles.searchInner}>
                <Ionicons name="search" size={16} color={RealixColors.textMuted} />
                <Text style={styles.searchText}>Hotels, cities, landmarks…</Text>
              </View>
              <View style={styles.filterBtn}>
                <Ionicons name="options-outline" size={16} color={RealixColors.accent} />
              </View>
            </Pressable>

            {/* Season Banner */}
            <View style={styles.seasonBanner}>
              <View>
                <Text style={styles.seasonTitle}>🍂 Peak Season</Text>
                <Text style={styles.seasonSub}>Oct – Dec · Best weather for trekking</Text>
              </View>
              <Pressable style={styles.seasonBtn}>
                <Text style={styles.seasonBtnText}>Plan Trip</Text>
              </Pressable>
            </View>

            {/* Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {FILTER_CHIPS.map((chip) => (
                <Pressable
                  key={chip.id}
                  style={[styles.chip, activeFilter === chip.id && styles.chipActive]}
                  onPress={() => setActiveFilter(chip.id)}
                >
                  <Ionicons
                    name={chip.icon as any}
                    size={13}
                    color={activeFilter === chip.id ? '#fff' : RealixColors.textMuted}
                  />
                  <Text style={[styles.chipText, activeFilter === chip.id && styles.chipTextActive]}>
                    {chip.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Featured Properties */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Properties</Text>
              <Pressable>
                <Text style={styles.seeAll}>See all →</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredScroll}
            >
              {FEATURED_PROPERTIES.map((prop) => (
                <Pressable
                  key={prop.id}
                  style={styles.featuredCard}
                  onPress={() => router.push('/(tabs)/explore/detail')}
                >
                  <Image
                    source={{ uri: prop.image }}
                    style={styles.featuredImg}
                    resizeMode="cover"
                  />
                  <View style={styles.featuredTag}>
                    <Text style={[styles.featuredTagText, { color: prop.tagTextColor }]}>
                      {prop.tag}
                    </Text>
                  </View>
                  <Pressable style={styles.featuredHeart}>
                    <Ionicons name="heart-outline" size={14} color="#fff" />
                  </Pressable>
                  <View style={styles.featuredBody}>
                    <View style={styles.featuredTypeRow}>
                      <Text style={styles.featuredType}>{prop.type}</Text>
                      <View style={styles.ratingPill}>
                        <Ionicons name="star" size={10} color="#FFB800" />
                        <Text style={styles.ratingText}>{prop.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.featuredName} numberOfLines={1}>{prop.name}</Text>
                    <View style={styles.featuredLocRow}>
                      <Ionicons name="location-outline" size={11} color={RealixColors.textMuted} />
                      <Text style={styles.featuredLoc} numberOfLines={1}>{prop.location}</Text>
                    </View>
                    <View style={styles.featuredPriceRow}>
                      <Text style={styles.featuredPrice}>${prop.price}</Text>
                      <Text style={styles.featuredPriceSub}>/night</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Destinations */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Destinations</Text>
              <Pressable>
                <Text style={styles.seeAll}>See all →</Text>
              </Pressable>
            </View>

            <View style={styles.destGrid}>
              {NEPAL_DESTINATIONS.map((dest) => (
                <Pressable
                  key={dest.id}
                  style={[styles.destCard, { backgroundColor: dest.color }]}
                  onPress={() => router.push('/(tabs)/explore/search')}
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

            {/* Festivals */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Festivals</Text>
              <Pressable>
                <Text style={styles.seeAll}>Plan →</Text>
              </Pressable>
            </View>

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

            {/* Quick Actions */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
            </View>
            <View style={styles.quickGrid}>
              <Pressable
                style={styles.quickCard}
                onPress={() => router.push('/(tabs)/explore/map')}
              >
                <View style={[styles.quickIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="map-outline" size={20} color="#1565C0" />
                </View>
                <Text style={styles.quickTitle}>Map View</Text>
                <Text style={styles.quickText}>Browse by location</Text>
              </Pressable>
              <Pressable
                style={styles.quickCard}
                onPress={() => router.push('/(tabs)/explore/filter-price')}
              >
                <View style={[styles.quickIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="options-outline" size={20} color="#2E7D32" />
                </View>
                <Text style={styles.quickTitle}>Filters</Text>
                <Text style={styles.quickText}>Price, type & more</Text>
              </Pressable>
              <Pressable style={styles.quickCard}>
                <View style={[styles.quickIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="car-outline" size={20} color="#E65100" />
                </View>
                <Text style={styles.quickTitle}>Transfers</Text>
                <Text style={styles.quickText}>Airport pickups</Text>
              </Pressable>
              <Pressable style={styles.quickCard}>
                <View style={[styles.quickIcon, { backgroundColor: '#FCE4EC' }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#880E4F" />
                </View>
                <Text style={styles.quickTitle}>Insurance</Text>
                <Text style={styles.quickText}>Travel protection</Text>
              </Pressable>
            </View>

            {/* Currency helper */}
            <View style={styles.currencyCard}>
              <View style={styles.currencyLeft}>
                <Ionicons name="swap-horizontal-outline" size={18} color={RealixColors.accent} />
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

        {/* ══════════════════════════════════════════════ TREKKING TAB */}
        {activeTab === 'trekking' && (
          <>
            <View style={styles.trekkingHero}>
              <Text style={styles.trekkingHeroTitle}>Nepal Trekking</Text>
              <Text style={styles.trekkingHeroSub}>
                From Everest Base Camp to the Annapurna Circuit — find lodges along every route.
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Routes</Text>
            </View>

            {TREKKING_PACKAGES.map((pkg) => (
              <Pressable key={pkg.id} style={styles.trekkingCard}>
                <View style={styles.trekkingCardLeft}>
                  <Ionicons name="trail-sign-outline" size={20} color={RealixColors.accent} />
                  <View style={{ gap: 2 }}>
                    <Text style={styles.trekkingName}>{pkg.name}</Text>
                    <Text style={styles.trekkingRegion}>{pkg.region} Region</Text>
                    <Text style={styles.trekkingDays}>{pkg.days} days avg.</Text>
                  </View>
                </View>
                <View style={styles.trekkingRight}>
                  <Text style={styles.trekkingFrom}>From</Text>
                  <Text style={styles.trekkingPrice}>${pkg.from}</Text>
                  <Ionicons name="chevron-forward" size={14} color={RealixColors.textMuted} />
                </View>
              </Pressable>
            ))}

            <View style={styles.trekkingInfoCard}>
              <Ionicons name="information-circle-outline" size={18} color="#1565C0" />
              <Text style={styles.trekkingInfoText}>
                TIMS card and ACAP/SAARC permits required for most trekking routes.
                Our lodges include permit guidance.
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trek Essentials</Text>
            </View>
            <View style={styles.essGrid}>
              {[
                { icon: 'bed-outline',       label: 'Tea Houses',   color: '#E8F5E9', tc: '#2E7D32' },
                { icon: 'medkit-outline',     label: 'First Aid',    color: '#FCE4EC', tc: '#880E4F' },
                { icon: 'cloud-outline',      label: 'Weather',      color: '#E3F2FD', tc: '#1565C0' },
                { icon: 'people-outline',     label: 'Guides',       color: '#FFF3E0', tc: '#E65100' },
              ].map((item) => (
                <Pressable key={item.label} style={styles.essCard}>
                  <View style={[styles.essIcon, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.tc} />
                  </View>
                  <Text style={styles.essLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* ══════════════════════════════════════════════ FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="bookmark-outline" size={36} color={RealixColors.accent} />
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

        {/* ══════════════════════════════════════════════ BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="calendar-outline" size={36} color={RealixColors.accent} />
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

// ─── Styles ─────────────────────────────────────────────────────────────────

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
    backgroundColor: RealixColors.pageBackground,
  },
  greeting: {
    fontSize: 12,
    color: RealixColors.textMuted,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 0.5,
    borderColor: RealixColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Tab Bar ──
  tabBarWrap: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: RealixColors.pageBackground,
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
    color: '#fff',
  },

  // ── Scroll Content ──
  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 16,
  },

  // ── Search Bar ──
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RealixColors.inputBackground,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: RealixColors.inputBorder,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    marginTop: 4,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingVertical: 8,
  },
  searchText: {
    fontSize: 14,
    color: RealixColors.textMuted,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: RealixColors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },

  // ── Season Banner ──
  seasonBanner: {
    backgroundColor: '#EAF5D6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#C5E49A',
  },
  seasonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E5A0E',
    marginBottom: 2,
  },
  seasonSub: {
    fontSize: 11,
    color: '#3B6D11',
  },
  seasonBtn: {
    backgroundColor: RealixColors.accent,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  seasonBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  // ── Filter Chips ──
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
    borderColor: RealixColors.border,
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
    color: '#fff',
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
    fontSize: 13,
    color: RealixColors.accent,
    fontWeight: '600',
  },

  // ── Featured Properties ──
  featuredScroll: {
    gap: 12,
    paddingRight: 4,
  },
  featuredCard: {
    width: 200,
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: RealixColors.border,
  },
  featuredImg: {
    width: '100%',
    height: 120,
    backgroundColor: RealixColors.border,
  },
  featuredTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  featuredTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  featuredHeart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBody: {
    padding: 10,
    gap: 3,
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
    letterSpacing: 0.5,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E65100',
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
    fontSize: 15,
    fontWeight: '700',
    color: RealixColors.accent,
  },
  featuredPriceSub: {
    fontSize: 10,
    color: RealixColors.textMuted,
  },

  // ── Destinations Grid ──
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
    fontSize: 28,
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
    fontSize: 14,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    marginBottom: 2,
  },
  festDesc: {
    fontSize: 11,
    color: RealixColors.textMuted,
  },
  festDateBox: {
    backgroundColor: '#EAF5D6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  festDate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E5A0E',
  },

  // ── Quick Grid ──
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
    color: '#fff',
  },

  // ── Trekking Tab ──
  trekkingHero: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    borderWidth: 0.5,
    borderColor: '#C5E49A',
  },
  trekkingHeroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 6,
  },
  trekkingHeroSub: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 20,
  },
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
  trekkingCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  trekkingDays: {
    fontSize: 11,
    color: RealixColors.accent,
    fontWeight: '600',
  },
  trekkingRight: {
    alignItems: 'center',
    gap: 4,
    flexDirection: 'row',
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
  trekkingInfoCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#BBDEFB',
    alignItems: 'flex-start',
  },
  trekkingInfoText: {
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 18,
    flex: 1,
  },
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

  // ── Empty States ──
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
    backgroundColor: '#EAF5D6',
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
    color: '#fff',
  },
});