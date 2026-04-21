import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/src/context/AuthContext";
import { useLocation } from "@/src/hooks/useLocation";
import { RealixColors } from "@/src/constants/screens/realix";
import axios from "axios";
import { API_ENDPOINTS_HOTEL } from "@/src/constants/api";
import { API_ENDPOINTS_AUTH } from "@/src/constants/api";

// ─── Nepal-inspired design tokens ────────────────────────────────────────────
const N = {
  // Warm earthy palette inspired by Himalayan landscapes & Nepali architecture
  crimson:    "#B5282A",   // Pashupatinath temple red
  crimsonSoft:"#C94B2B",   // Patan brick
  saffron:    "#E8832A",   // Marigold garland
  saffronPale:"#F5B86B",   // Sunrise over Everest
  mustard:    "#D4941A",   // Mustard fields of Mustang
  earthDark:  "#1C1008",   // Rich dark earth
  earthMid:   "#2E1A0E",   // Dark timber
  earthWarm:  "#3D2410",   // Carved wood
  stoneDeep:  "#1A1410",   // Mountain stone
  stoneMid:   "#2A211A",   // Temple stone
  stoneSoft:  "#3C3028",   // Weathered stone
  snowWhite:  "#FAF6F0",   // Himalayan snow (warm white)
  snowMuted:  "#EDE5D8",   // Aged parchment
  textPrimary:"#F5EFE6",   // Warm off-white
  textSecond: "#C4B09A",   // Muted sand
  textMuted:  "#8A7566",   // Faded earth
  textDark:   "#1C1008",   // On-light text
  divider:    "rgba(180,140,100,0.18)",
  cardBg:     "#251A10",   // Dark warm card
  cardBorder: "rgba(200,155,90,0.22)",
  accentGlow: "rgba(232,131,42,0.15)",
};

interface Hotel {
  _id: string;
  hotelName: string;
  hotelDescription: string;
  hotelImages: string[];
  propertyType: string;
  hotelLocation: string;
  pricePerNight: number;
  rating: number;
  numberOfReviews: number;
}

// ─── Decorative separator ────────────────────────────────────────────────────
function DhokaSeparator() {
  return (
    <View style={sep.row}>
      <View style={sep.line} />
      <View style={sep.diamond} />
      <View style={sep.line} />
    </View>
  );
}

const sep = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 2 },
  line: { flex: 1, height: 0.5, backgroundColor: N.divider },
  diamond: {
    width: 6, height: 6, borderWidth: 1,
    borderColor: N.saffronPale, transform: [{ rotate: "45deg" }],
  },
});

// ─── Rating stars ─────────────────────────────────────────────────────────────
function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= full ? "star" : i === full + 1 && half ? "star-half" : "star-outline"}
          size={11}
          color={i <= full || (i === full + 1 && half) ? N.saffron : N.textMuted}
        />
      ))}
    </View>
  );
}

// ─── Hotel card ───────────────────────────────────────────────────────────────
function HotelCard({ hotel, onPress }: { hotel: Hotel; onPress: () => void }) {
  const [saved, setSaved] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [card.wrap, pressed && { opacity: 0.88 }]}
      onPress={onPress}
    >
      {/* Image */}
      <View style={card.imgWrap}>
        {hotel.hotelImages?.length > 0 ? (
          <Image source={{ uri: hotel.hotelImages[0] }} style={card.img} />
        ) : (
          <View style={[card.img, card.imgPlaceholder]}>
            <Ionicons name="image-outline" size={32} color={N.textMuted} />
          </View>
        )}
        {/* Type badge */}
        <View style={card.typeBadge}>
          <Text style={card.typeText}>{hotel.propertyType}</Text>
        </View>
        {/* Save button */}
        <Pressable style={card.saveBtn} onPress={() => setSaved(!saved)}>
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={15}
            color={saved ? N.crimson : N.snowWhite}
          />
        </Pressable>
      </View>

      {/* Info */}
      <View style={card.info}>
        <View style={card.locRow}>
          <Ionicons name="location-sharp" size={11} color={N.crimson} />
          <Text style={card.locText}>{hotel.hotelLocation}</Text>
        </View>
        <Text style={card.name} numberOfLines={1}>{hotel.hotelName}</Text>
        <Text style={card.desc} numberOfLines={1}>{hotel.hotelDescription}</Text>

        <View style={card.footer}>
          <View style={card.ratingBlock}>
            <StarRating value={hotel.rating} />
            <Text style={card.reviewCount}>{hotel.numberOfReviews} reviews</Text>
          </View>
          <View style={card.priceBlock}>
            <Text style={card.priceLabel}>from</Text>
            <Text style={card.price}>${hotel.pricePerNight}</Text>
            <Text style={card.priceNight}>/night</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const card = StyleSheet.create({
  wrap: {
    width: 260,
    borderRadius: 20,
    backgroundColor: N.cardBg,
    borderWidth: 1,
    borderColor: N.cardBorder,
    overflow: "hidden",
  },
  imgWrap: { position: "relative", height: 160 },
  img: { width: "100%", height: 160 },
  imgPlaceholder: {
    backgroundColor: N.stoneMid,
    alignItems: "center",
    justifyContent: "center",
  },
  typeBadge: {
    position: "absolute",
    bottom: 10,
    left: 12,
    backgroundColor: "rgba(28,16,8,0.72)",
    borderWidth: 0.5,
    borderColor: "rgba(200,155,90,0.4)",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  typeText: { fontSize: 10, color: N.saffronPale, fontWeight: "600", letterSpacing: 0.5 },
  saveBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(28,16,8,0.55)",
    borderWidth: 0.5,
    borderColor: "rgba(200,155,90,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: { padding: 14, gap: 5 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locText: { fontSize: 11, color: N.textMuted },
  name: { fontSize: 16, fontWeight: "700", color: N.textPrimary, lineHeight: 20 },
  desc: { fontSize: 12, color: N.textSecond, lineHeight: 16 },
  footer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 4 },
  ratingBlock: { gap: 3 },
  reviewCount: { fontSize: 10, color: N.textMuted },
  priceBlock: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  priceLabel: { fontSize: 10, color: N.textMuted },
  price: { fontSize: 20, fontWeight: "800", color: N.saffron },
  priceNight: { fontSize: 10, color: N.textMuted },
});

// ─── Quick-filter pill ────────────────────────────────────────────────────────
const FILTERS = ["All", "Hotel", "Resort", "Boutique", "Heritage", "Lodge"];

function FilterPills() {
  const [active, setActive] = useState("All");
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingRight: 20 }}
    >
      {FILTERS.map((f) => (
        <Pressable
          key={f}
          style={[pill.base, active === f && pill.active]}
          onPress={() => setActive(f)}
        >
          <Text style={[pill.text, active === f && pill.activeText]}>{f}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const pill = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: N.cardBorder,
    backgroundColor: N.cardBg,
  },
  active: {
    backgroundColor: N.crimson,
    borderColor: N.crimson,
  },
  text: { fontSize: 12, color: N.textSecond, fontWeight: "500" },
  activeText: { color: N.snowWhite, fontWeight: "700" },
});

// ─── Stat chip (for hero banner) ─────────────────────────────────────────────
function StatChip({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={stat.wrap}>
      <Ionicons name={icon as any} size={14} color={N.saffron} />
      <View>
        <Text style={stat.val}>{value}</Text>
        <Text style={stat.lbl}>{label}</Text>
      </View>
    </View>
  );
}

const stat = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(28,16,8,0.65)",
    borderWidth: 0.5,
    borderColor: "rgba(200,155,90,0.3)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  val: { fontSize: 13, fontWeight: "700", color: N.textPrimary },
  lbl: { fontSize: 9, color: N.textMuted, marginTop: 0 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const API_PROFILE = API_ENDPOINTS_AUTH.PROFILE;
  const FEATURED_HOTEL = API_ENDPOINTS_HOTEL.FEATURED_HOTELS;

  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Traveller");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationPreferenceLoading, setLocationPreferenceLoading] = useState(true);
  
  // Location hook - only used if location is enabled
  const { location, address, loading: locationLoading, permissionGranted, requestPermission } = useLocation();

  // Load location preference
  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync('locationEnabled');
        setLocationEnabled(saved === 'true');
      } catch (err) {
        console.error('Failed to load location preference:', err);
      } finally {
        setLocationPreferenceLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (!token) return;
        
        const res = await axios.get(API_PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });
        
        if (res.data.success && res.data.data) {
          setUserName(res.data.data.Name || "Traveller");
          setProfileImage(res.data.data.profileimage || null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally { 
        setProfileLoading(false); 
      }
    })();
  }, [API_PROFILE]);

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(FEATURED_HOTEL, {
          headers: { Accept: "application/json" },
          timeout: 15000,
        });
        if (r.data.success && r.data.data) setFeaturedHotels(r.data.data);
        else setError("No featured hotels available");
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load hotels");
      } finally { setLoading(false); }
    })();
  }, []);

  const { user } = useAuth();
  const router = useRouter();
  const displayName = userName;
  const firstName = displayName.split(" ")[0] || "Traveller";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <SafeAreaView style={s.container} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            style={({ pressed }) => [s.avatar, pressed && { opacity: 0.7 }]}
          >
            {profileLoading ? (
              <ActivityIndicator size="small" color={N.saffronPale} />
            ) : profileImage ? (
              <Image source={{ uri: profileImage }} style={s.avatarImg} />
            ) : (
              <Text style={s.avatarText}>{initials}</Text>
            )}
          </Pressable>

          <View style={s.headerCenter}>
            <Text style={s.greetingText}>{greeting},</Text>
            <Text style={s.greetingName}>{firstName}</Text>
          </View>

          <Pressable
            onPress={() => router.push("/(tabs)/profile/notifications")}
            style={({ pressed }) => [s.notifBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="notifications-outline" size={18} color={N.textSecond} />
            <View style={s.notifDot} />
          </Pressable>
        </View>

        {/* ── Location bar ── */}
        <Pressable 
          style={({ pressed }) => [s.locBar, pressed && { opacity: 0.8 }]}
          onPress={() => {
            if (!locationEnabled) {
              Alert.alert('Location Disabled', 'Enable location in your profile settings to see nearby properties.');
            } else if (!permissionGranted && !locationLoading) {
              requestPermission();
            }
          }}
        >
          <Ionicons name="location-sharp" size={13} color={N.crimson} />
          <Text style={s.locBarText} numberOfLines={1}>
            {!locationEnabled ? 'Location disabled' : locationLoading ? "Getting location..." : address || "Enable location"}
          </Text>
          {!locationEnabled && !locationPreferenceLoading && (
            <Ionicons name="alert-circle" size={13} color={N.saffron} />
          )}
          {locationEnabled && !permissionGranted && !locationLoading && (
            <Ionicons name="alert-circle" size={13} color={N.saffron} />
          )}
          {locationEnabled && permissionGranted && !locationLoading && (
            <Ionicons name="checkmark-circle" size={13} color={N.saffron} />
          )}
          <View style={s.locBarDivider} />
          <Ionicons name="calendar-outline" size={13} color={N.textMuted} />
          <Text style={s.locBarDate}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </Text>
        </Pressable>

        {/* ── AI mode bar ── */}
        <Pressable style={({ pressed }) => [s.aiBar, pressed && { opacity: 0.8 }]}>
          <View style={s.aiIconWrap}>
            <Ionicons name="sparkles" size={13} color={N.saffron} />
          </View>
          <Text style={s.aiText}>Find stays with AI — try "heritage hotel near Boudha"</Text>
          <Ionicons name="arrow-forward-circle" size={18} color={N.saffron} />
        </Pressable>

        {/* ── Hero banner ── */}
        <Pressable
          style={({ pressed }) => [s.heroBanner, pressed && { opacity: 0.92 }]}
          onPress={() => router.push("/(tabs)/explore")}
        >
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=400&fit=crop" }}
            style={s.heroImg}
          />
          <View style={s.heroOverlay}>
            <View style={s.heroTopRow}>
              <View style={s.heroBadge}>
                <Text style={s.heroBadgeText}>🏔  Nepal</Text>
              </View>
            </View>
            <View style={s.heroBottom}>
              <Text style={s.heroEyebrow}>DISCOVER</Text>
              <Text style={s.heroTitle}>Himalayas{"\n"}await you</Text>
              <View style={s.heroStats}>
                <StatChip icon="home-outline" value="240+" label="Properties" />
                <StatChip icon="star-outline" value="4.8★" label="Avg rating" />
                <StatChip icon="location-outline" value="18" label="Districts" />
              </View>
            </View>
          </View>
        </Pressable>

        {/* ── Filter pills ── */}
        <View style={s.sectionBlock}>
          <FilterPills />
        </View>

        {/* ── Featured properties ── */}
        <View style={s.sectionBlock}>
          <View style={s.sectionRow}>
            <View>
              <Text style={s.sectionEye}>CURATED PICKS</Text>
              <Text style={s.sectionTitle}>Featured stays</Text>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/explore/detail")}
              style={s.seeAllBtn}
            >
              <Text style={s.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={13} color={N.saffron} />
            </Pressable>
          </View>

          {loading ? (
            <View style={s.loadBox}>
              <ActivityIndicator color={N.saffron} />
              <Text style={s.loadText}>Finding the best stays…</Text>
            </View>
          ) : error || featuredHotels.length === 0 ? (
            <View style={s.errorBox}>
              <Ionicons name="cloud-offline-outline" size={28} color={N.textMuted} />
              <Text style={s.errorText}>{error || "No hotels available"}</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, paddingRight: 20 }}
              snapToInterval={274}
              decelerationRate="fast"
            >
              {featuredHotels.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/explore/detail",
                      params: { hotelId: hotel._id },
                    })
                  }
                />
              ))}
            </ScrollView>
          )}
        </View>

        <DhokaSeparator />

        {/* ── Special offers banner ── */}
        <Pressable
          style={({ pressed }) => [s.offerBanner, pressed && { opacity: 0.9 }]}
          onPress={() => router.push("/(tabs)/explore")}
        >
          <View style={s.offerLeft}>
            <Text style={s.offerEye}>LIMITED TIME</Text>
            <Text style={s.offerTitle}>Monsoon deals</Text>
            <Text style={s.offerSub}>Up to 40% off across Pokhara & beyond</Text>
            <View style={s.offerCTA}>
              <Text style={s.offerCTAText}>Browse offers</Text>
              <Ionicons name="arrow-forward" size={13} color={N.earthDark} />
            </View>
          </View>
          <View style={s.offerRight}>
            <Text style={s.offerEmoji}>🌿</Text>
            <Text style={s.offerPercent}>40%</Text>
            <Text style={s.offerOff}>OFF</Text>
          </View>
        </Pressable>

        {/* ── Nearby hotels ── */}
        <View style={s.sectionBlock}>
          <View style={s.sectionRow}>
            <View>
              <Text style={s.sectionEye}>AROUND YOU</Text>
              <Text style={s.sectionTitle}>Hotels nearby</Text>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/explore/detail")}
              style={s.seeAllBtn}
            >
              <Text style={s.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={13} color={N.saffron} />
            </Pressable>
          </View>

          {loading ? (
            <View style={s.loadBox}>
              <ActivityIndicator color={N.saffron} />
            </View>
          ) : error || featuredHotels.length === 0 ? (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error || "No hotels available"}</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, paddingRight: 20 }}
              snapToInterval={274}
              decelerationRate="fast"
            >
              {featuredHotels.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/explore/detail",
                      params: { hotelId: hotel._id },
                    })
                  }
                />
              ))}
            </ScrollView>
          )}
        </View>

        <DhokaSeparator />

        {/* ── Destination categories ── */}
        <View style={s.sectionBlock}>
          <Text style={s.sectionTitle}>Explore by region</Text>
          <View style={s.destGrid}>
            {[
              { name: "Kathmandu", sub: "Heritage & culture", emoji: "🛕" },
              { name: "Pokhara", sub: "Lakes & trekking", emoji: "⛵" },
              { name: "Chitwan", sub: "Wildlife & jungle", emoji: "🐘" },
              { name: "Mustang", sub: "High altitude stays", emoji: "🏔" },
            ].map((d) => (
              <Pressable
                key={d.name}
                style={({ pressed }) => [s.destItem, pressed && { opacity: 0.8 }]}
                onPress={() => router.push("/(tabs)/explore")}
              >
                <Text style={s.destEmoji}>{d.emoji}</Text>
                <Text style={s.destName}>{d.name}</Text>
                <Text style={s.destSub}>{d.sub}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Promo card ── */}
        <View style={s.promoCard}>
          <View style={s.promoLeft}>
            <Text style={s.promoEye}>PERSONALISED</Text>
            <Text style={s.promoTitle}>Stay somewhere{"\n"}memorable</Text>
            <Text style={s.promoSub}>
              Save your favourites, compare destinations and keep trip updates in one place.
            </Text>
            <Pressable
              style={s.promoBtn}
              onPress={() => router.push("/(tabs)/explore")}
            >
              <Text style={s.promoBtnText}>Explore now</Text>
            </Pressable>
          </View>
          <View style={s.promoRight}>
            <Text style={s.promoMountain}>🏔</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: N.stoneDeep },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 22 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: N.crimson,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(200,155,90,0.4)",
  },
  avatarImg: { width: 44, height: 44, borderRadius: 22 },
  avatarText: { color: N.snowWhite, fontSize: 15, fontWeight: "700" },
  headerCenter: { flex: 1, paddingHorizontal: 14 },
  greetingText: { fontSize: 11, color: N.textMuted, letterSpacing: 0.3 },
  greetingName: { fontSize: 17, fontWeight: "700", color: N.textPrimary },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: N.cardBg,
    borderWidth: 1,
    borderColor: N.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: N.crimson,
    borderWidth: 1.5,
    borderColor: N.stoneDeep,
  },

  // Location bar
  locBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: N.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: N.cardBorder,
  },
  locBarText: { flex: 1, fontSize: 13, fontWeight: "600", color: N.textPrimary },
  locBarDivider: { width: 0.5, height: 14, backgroundColor: N.divider, marginHorizontal: 4 },
  locBarDate: { fontSize: 13, color: N.textSecond },

  // AI bar
  aiBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: N.cardBg,
    borderWidth: 1,
    borderColor: "rgba(232,131,42,0.3)",
  },
  aiIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(232,131,42,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  aiText: { flex: 1, fontSize: 12, color: N.textSecond },

  // Hero
  heroBanner: { borderRadius: 24, overflow: "hidden", height: 280 },
  heroImg: { width: "100%", height: "100%", position: "absolute" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,8,2,0.45)",
    justifyContent: "space-between",
    padding: 20,
  },
  heroTopRow: { flexDirection: "row", justifyContent: "flex-end" },
  heroBadge: {
    backgroundColor: "rgba(28,16,8,0.7)",
    borderWidth: 0.5,
    borderColor: "rgba(200,155,90,0.5)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgeText: { fontSize: 11, color: N.saffronPale, fontWeight: "600" },
  heroBottom: { gap: 12 },
  heroEyebrow: {
    fontSize: 10,
    color: N.saffronPale,
    fontWeight: "700",
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: N.snowWhite,
    lineHeight: 38,
  },
  heroStats: { flexDirection: "row", gap: 8, flexWrap: "wrap" },

  // Section
  sectionBlock: { gap: 14 },
  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  sectionEye: {
    fontSize: 9,
    color: N.saffron,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: N.textPrimary },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingBottom: 2,
  },
  seeAllText: { fontSize: 12, color: N.saffron, fontWeight: "600" },

  // Load / error
  loadBox: {
    height: 220,
    backgroundColor: N.cardBg,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: N.cardBorder,
  },
  loadText: { fontSize: 13, color: N.textMuted },
  errorBox: {
    height: 180,
    backgroundColor: N.cardBg,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: N.cardBorder,
  },
  errorText: { fontSize: 13, color: N.textMuted, textAlign: "center", paddingHorizontal: 20 },

  // Offer banner
  offerBanner: {
    borderRadius: 20,
    backgroundColor: N.saffron,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    overflow: "hidden",
  },
  offerLeft: { flex: 1, gap: 4 },
  offerEye: { fontSize: 9, color: "rgba(28,16,8,0.7)", fontWeight: "700", letterSpacing: 1.5 },
  offerTitle: { fontSize: 22, fontWeight: "800", color: N.earthDark },
  offerSub: { fontSize: 12, color: "rgba(28,16,8,0.7)", lineHeight: 17 },
  offerCTA: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    backgroundColor: "rgba(28,16,8,0.12)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  offerCTAText: { fontSize: 12, fontWeight: "700", color: N.earthDark },
  offerRight: { alignItems: "center", paddingLeft: 12 },
  offerEmoji: { fontSize: 24, marginBottom: 2 },
  offerPercent: { fontSize: 36, fontWeight: "900", color: N.earthDark, lineHeight: 36 },
  offerOff: { fontSize: 13, fontWeight: "700", color: "rgba(28,16,8,0.65)" },

  // Destinations
  destGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  destItem: {
    width: "48%",
    backgroundColor: N.cardBg,
    borderWidth: 1,
    borderColor: N.cardBorder,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  destEmoji: { fontSize: 22, marginBottom: 2 },
  destName: { fontSize: 14, fontWeight: "700", color: N.textPrimary },
  destSub: { fontSize: 11, color: N.textMuted },

  // Promo
  promoCard: {
    borderRadius: 24,
    backgroundColor: N.cardBg,
    borderWidth: 1,
    borderColor: N.cardBorder,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  promoLeft: { flex: 1, gap: 6 },
  promoEye: { fontSize: 9, color: N.saffron, fontWeight: "700", letterSpacing: 1.5 },
  promoTitle: { fontSize: 22, fontWeight: "800", color: N.textPrimary, lineHeight: 26 },
  promoSub: { fontSize: 13, color: N.textSecond, lineHeight: 19 },
  promoBtn: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: N.crimson,
  },
  promoBtnText: { fontSize: 13, fontWeight: "700", color: N.snowWhite },
  promoRight: { alignItems: "center", justifyContent: "center" },
  promoMountain: { fontSize: 56 },
});