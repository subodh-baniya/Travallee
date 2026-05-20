"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExploreScreen;
var react_1 = require("react");
var vector_icons_1 = require("@expo/vector-icons");
var expo_status_bar_1 = require("expo-status-bar");
var expo_router_1 = require("expo-router");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var realix_1 = require("@/src/constants/screens/realix");
var apiClient_1 = require("@/src/services/apiClient");
var api_1 = require("@/src/constants/api");
// ─── Nepal Data ──────────────────────────────────────────────────────────────
var FILTER_CHIPS = [
    { id: 'all', label: 'All Hotels', icon: 'globe-outline' },
    { id: 'hotels', label: 'Hotels', icon: 'business-outline' },
    { id: 'resorts', label: 'Resorts', icon: 'umbrella-outline' },
];
var NEPAL_DESTINATIONS = [
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
var FEATURED_PROPERTIES = [
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
var TREKKING_PACKAGES = [
    { id: '1', name: 'EBC Trek', days: 14, from: 850, region: 'Khumbu' },
    { id: '2', name: 'Annapurna Circuit', days: 12, from: 720, region: 'Annapurna' },
    { id: '3', name: 'Langtang Valley', days: 7, from: 420, region: 'Langtang' },
];
var UPCOMING_FESTIVALS = [
    { id: '1', name: 'Dashain', date: 'Oct 2026', desc: 'Nepal\'s biggest festival' },
    { id: '2', name: 'Tihar', date: 'Nov 2026', desc: 'Festival of lights' },
    { id: '3', name: 'Holi', date: 'Mar 2027', desc: 'Festival of colors' },
];
var TABS = [
    { id: 'explore', label: 'Explore', icon: 'compass-outline' },
    { id: 'trekking', label: 'Trekking', icon: 'trail-sign-outline' },
    { id: 'favorites', label: 'Saved', icon: 'bookmark-outline' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
];
// ─── Component ───────────────────────────────────────────────────────────────
function ExploreScreen() {
    var _this = this;
    var router = (0, expo_router_1.useRouter)();
    var _a = (0, react_1.useState)('explore'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)('all'), activeFilter = _b[0], setActiveFilter = _b[1];
    var _c = (0, react_1.useState)([]), filteredData = _c[0], setFilteredData = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    // Fetch hotels or resorts based on filter
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, response, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, 8, 9]);
                        setLoading(true);
                        if (!(activeFilter === 'hotels')) return [3 /*break*/, 2];
                        return [4 /*yield*/, apiClient_1.default.get(api_1.API_ENDPOINTS_HOTEL.GET_ALL_HOTELS)];
                    case 1:
                        response = _a.sent();
                        if (response.data.success && Array.isArray(response.data.data)) {
                            setFilteredData(response.data.data);
                        }
                        else {
                            setFilteredData([]);
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(activeFilter === 'resorts')) return [3 /*break*/, 4];
                        return [4 /*yield*/, apiClient_1.default.get(api_1.API_ENDPOINTS_HOTEL.GET_ALL_RESORTS)];
                    case 3:
                        response = _a.sent();
                        if (response.data.success && Array.isArray(response.data.data)) {
                            setFilteredData(response.data.data);
                        }
                        else {
                            setFilteredData([]);
                        }
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, apiClient_1.default.get(api_1.API_ENDPOINTS_HOTEL.FEATURED_HOTELS)];
                    case 5:
                        response = _a.sent();
                        if (response.data.success && Array.isArray(response.data.data)) {
                            setFilteredData(response.data.data);
                        }
                        else {
                            setFilteredData([]);
                        }
                        _a.label = 6;
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        error_1 = _a.sent();
                        console.error('Error fetching data:', error_1);
                        setFilteredData([]);
                        return [3 /*break*/, 9];
                    case 8:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [activeFilter]);
    return (<react_native_safe_area_context_1.SafeAreaView style={styles.container} edges={['top']}>
      <expo_status_bar_1.StatusBar style="auto"/>

      {/* ── Fixed Header ── */}
      <react_native_1.View style={styles.header}>
        <react_native_1.View>
          <react_native_1.Text style={styles.title}>Discover Nepal</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.headerActions}>
          <react_native_1.Pressable style={styles.iconBtn} onPress={function () { return router.push('/(tabs)/explore/search'); }}>
            <vector_icons_1.Ionicons name="notifications-outline" size={18} color={realix_1.RealixColors.textPrimary}/>
          </react_native_1.Pressable>
          <react_native_1.Pressable style={styles.iconBtn} onPress={function () { return router.push('/(tabs)/explore/search'); }}>
            <vector_icons_1.Ionicons name="search-outline" size={18} color={realix_1.RealixColors.textPrimary}/>
          </react_native_1.Pressable>
        </react_native_1.View>
      </react_native_1.View>

      {/* ── Tab Bar ── */}
      <react_native_1.View style={styles.tabBarWrap}>
        <react_native_1.View style={styles.tabBar}>
          {TABS.map(function (tab) { return (<react_native_1.Pressable key={tab.id} style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]} onPress={function () { return setActiveTab(tab.id); }}>
              <vector_icons_1.Ionicons name={tab.icon} size={15} color={activeTab === tab.id ? '#fff' : realix_1.RealixColors.textMuted}/>
              <react_native_1.Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {tab.label}
              </react_native_1.Text>
            </react_native_1.Pressable>); })}
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════════ EXPLORE TAB */}
        {activeTab === 'explore' && (<>
            {/* Search Bar */}
            <react_native_1.Pressable style={styles.searchBar} onPress={function () { return router.push('/(tabs)/explore/search'); }}>
              <react_native_1.View style={styles.searchInner}>
                <vector_icons_1.Ionicons name="search" size={16} color={realix_1.RealixColors.textMuted}/>
                <react_native_1.Text style={styles.searchText}>Hotels, cities, landmarks…</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.filterBtn}>
                <vector_icons_1.Ionicons name="options-outline" size={16} color={realix_1.RealixColors.accent}/>
              </react_native_1.View>
            </react_native_1.Pressable>

            {/* Season Banner */}
            <react_native_1.View style={styles.seasonBanner}>
              <react_native_1.View>
                <react_native_1.Text style={styles.seasonTitle}>🍂 Peak Season</react_native_1.Text>
                <react_native_1.Text style={styles.seasonSub}>Oct – Dec · Best weather for trekking</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Pressable style={styles.seasonBtn}>
                <react_native_1.Text style={styles.seasonBtnText}>Plan Trip</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            {/* Filter Chips */}
            <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {FILTER_CHIPS.map(function (chip) { return (<react_native_1.Pressable key={chip.id} style={[styles.chip, activeFilter === chip.id && styles.chipActive]} onPress={function () { return setActiveFilter(chip.id); }}>
                  <vector_icons_1.Ionicons name={chip.icon} size={13} color={activeFilter === chip.id ? '#fff' : realix_1.RealixColors.textMuted}/>
                  <react_native_1.Text style={[styles.chipText, activeFilter === chip.id && styles.chipTextActive]}>
                    {chip.label}
                  </react_native_1.Text>
                </react_native_1.Pressable>); })}
            </react_native_1.ScrollView>

            {/* Featured Properties */}
            <react_native_1.View style={styles.sectionHeader}>
              <react_native_1.Text style={styles.sectionTitle}>
                {activeFilter === 'hotels' ? 'Hotels' : activeFilter === 'resorts' ? 'Resorts' : 'Featured Properties'}
              </react_native_1.Text>
              <react_native_1.Pressable>
                <react_native_1.Text style={styles.seeAll}>See all →</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            {loading ? (<react_native_1.View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <react_native_1.ActivityIndicator size="large" color={realix_1.RealixColors.accent}/>
              </react_native_1.View>) : (<react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
                {filteredData.length > 0 ? (filteredData.map(function (prop) {
                    var _a;
                    var imageUri = ((_a = prop.hotelImages) === null || _a === void 0 ? void 0 : _a[0]) || prop.image || 'https://via.placeholder.com/300';
                    return (<react_native_1.Pressable key={prop._id || prop.id} style={styles.featuredCard} onPress={function () {
                            return router.replace({
                                pathname: '/(tabs)/explore/detail',
                                params: { hotelId: prop._id || prop.id },
                            });
                        }}>
                        <react_native_1.Image source={{ uri: imageUri }} style={styles.featuredImg} resizeMode="cover"/>
                        <react_native_1.View style={styles.featuredTag}>
                          <react_native_1.Text style={[styles.featuredTagText, { color: prop.tagTextColor || '#2E7D32' }]}>
                          {prop.tag || (prop.isFeatured ? 'Featured' : prop.propertyType || 'Hotel')}
                        </react_native_1.Text>
                      </react_native_1.View>
                  <react_native_1.Pressable style={styles.featuredHeart}>
                    <vector_icons_1.Ionicons name="heart-outline" size={14} color="#fff"/>
                  </react_native_1.Pressable>
                  <react_native_1.View style={styles.featuredBody}>
                    <react_native_1.View style={styles.featuredTypeRow}>
                      <react_native_1.Text style={styles.featuredType}>{prop.type || prop.propertyType || 'Hotel'}</react_native_1.Text>
                      <react_native_1.View style={styles.ratingPill}>
                        <vector_icons_1.Ionicons name="star" size={10} color="#FFB800"/>
                        <react_native_1.Text style={styles.ratingText}>{prop.rating}</react_native_1.Text>
                      </react_native_1.View>
                    </react_native_1.View>
                    <react_native_1.Text style={styles.featuredName} numberOfLines={1}>{prop.name || prop.hotelName}</react_native_1.Text>
                    <react_native_1.View style={styles.featuredLocRow}>
                      <vector_icons_1.Ionicons name="location-outline" size={11} color={realix_1.RealixColors.textMuted}/>
                      <react_native_1.Text style={styles.featuredLoc} numberOfLines={1}>{prop.location || prop.hotelLocation}</react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles.featuredPriceRow}>
                      <react_native_1.Text style={styles.featuredPrice}>${prop.price || prop.pricePerNight || 'N/A'}</react_native_1.Text>
                      <react_native_1.Text style={styles.featuredPriceSub}>/night</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>
                </react_native_1.Pressable>);
                })) : (<react_native_1.View />)}
              </react_native_1.ScrollView>)}

            {/* Destinations */}
            <react_native_1.View style={styles.sectionHeader}>
              <react_native_1.Text style={styles.sectionTitle}>Popular Destinations</react_native_1.Text>
              <react_native_1.Pressable>
                <react_native_1.Text style={styles.seeAll}>See all →</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            <react_native_1.View style={styles.destGrid}>
              {NEPAL_DESTINATIONS.map(function (dest) { return (<react_native_1.Pressable key={dest.id} style={[styles.destCard, { backgroundColor: dest.color }]} onPress={function () { return router.push('/(tabs)/explore/search'); }}>
                  <react_native_1.Text style={styles.destEmoji}>{dest.emoji}</react_native_1.Text>
                  <react_native_1.Text style={styles.destCity}>{dest.city}</react_native_1.Text>
                  <react_native_1.Text style={styles.destTagline}>{dest.tagline}</react_native_1.Text>
                  <react_native_1.View style={styles.destMeta}>
                    <react_native_1.Text style={styles.destFrom}>From ${dest.from}</react_native_1.Text>
                    <react_native_1.Text style={styles.destCount}>{dest.properties}+</react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.Pressable>); })}
            </react_native_1.View>

            {/* Festivals */}
            <react_native_1.View style={styles.sectionHeader}>
              <react_native_1.Text style={styles.sectionTitle}>Upcoming Festivals</react_native_1.Text>
              <react_native_1.Pressable>
                <react_native_1.Text style={styles.seeAll}>Plan →</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            {UPCOMING_FESTIVALS.map(function (fest) { return (<react_native_1.Pressable key={fest.id} style={styles.festCard}>
                <react_native_1.View style={styles.festLeft}>
                  <react_native_1.View style={styles.festDot}/>
                  <react_native_1.View>
                    <react_native_1.Text style={styles.festName}>{fest.name}</react_native_1.Text>
                    <react_native_1.Text style={styles.festDesc}>{fest.desc}</react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={styles.festDateBox}>
                  <react_native_1.Text style={styles.festDate}>{fest.date}</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.Pressable>); })}

            {/* Quick Actions */}
            <react_native_1.View style={styles.sectionHeader}>
              <react_native_1.Text style={styles.sectionTitle}>Quick Access</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.quickGrid}>
              <react_native_1.Pressable style={styles.quickCard} onPress={function () { return router.push('/(tabs)/explore/map'); }}>
                <react_native_1.View style={[styles.quickIcon, { backgroundColor: '#E3F2FD' }]}>
                  <vector_icons_1.Ionicons name="map-outline" size={20} color="#1565C0"/>
                </react_native_1.View>
                <react_native_1.Text style={styles.quickTitle}>Map View</react_native_1.Text>
                <react_native_1.Text style={styles.quickText}>Browse by location</react_native_1.Text>
              </react_native_1.Pressable>
              <react_native_1.Pressable style={styles.quickCard} onPress={function () { return router.push('/(tabs)/explore/filter-price'); }}>
                <react_native_1.View style={[styles.quickIcon, { backgroundColor: '#E8F5E9' }]}>
                  <vector_icons_1.Ionicons name="options-outline" size={20} color="#2E7D32"/>
                </react_native_1.View>
                <react_native_1.Text style={styles.quickTitle}>Filters</react_native_1.Text>
                <react_native_1.Text style={styles.quickText}>Price, type & more</react_native_1.Text>
              </react_native_1.Pressable>
              <react_native_1.Pressable style={styles.quickCard}>
                <react_native_1.View style={[styles.quickIcon, { backgroundColor: '#FFF3E0' }]}>
                  <vector_icons_1.Ionicons name="car-outline" size={20} color="#E65100"/>
                </react_native_1.View>
                <react_native_1.Text style={styles.quickTitle}>Transfers</react_native_1.Text>
                <react_native_1.Text style={styles.quickText}>Airport pickups</react_native_1.Text>
              </react_native_1.Pressable>
              <react_native_1.Pressable style={styles.quickCard}>
                <react_native_1.View style={[styles.quickIcon, { backgroundColor: '#FCE4EC' }]}>
                  <vector_icons_1.Ionicons name="shield-checkmark-outline" size={20} color="#880E4F"/>
                </react_native_1.View>
                <react_native_1.Text style={styles.quickTitle}>Insurance</react_native_1.Text>
                <react_native_1.Text style={styles.quickText}>Travel protection</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            {/* Currency helper */}
            <react_native_1.View style={styles.currencyCard}>
              <react_native_1.View style={styles.currencyLeft}>
                <vector_icons_1.Ionicons name="swap-horizontal-outline" size={18} color={realix_1.RealixColors.accent}/>
                <react_native_1.View>
                  <react_native_1.Text style={styles.currencyTitle}>1 USD = 133.5 NPR</react_native_1.Text>
                  <react_native_1.Text style={styles.currencySub}>Live rate · Updated just now</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>
              <react_native_1.Pressable style={styles.currencyBtn}>
                <react_native_1.Text style={styles.currencyBtnText}>Convert</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>
          </>)}

        {/* ══════════════════════════════════════════════ TREKKING TAB */}
        {activeTab === 'trekking' && (<>
            <react_native_1.View style={styles.trekkingHero}>
              <react_native_1.Text style={styles.trekkingHeroTitle}>Nepal Trekking</react_native_1.Text>
              <react_native_1.Text style={styles.trekkingHeroSub}>
                From Everest Base Camp to the Annapurna Circuit — find lodges along every route.
              </react_native_1.Text>
            </react_native_1.View>

            <react_native_1.View style={styles.sectionHeader}>
              <react_native_1.Text style={styles.sectionTitle}>Popular Routes</react_native_1.Text>
            </react_native_1.View>

            {TREKKING_PACKAGES.map(function (pkg) { return (<react_native_1.Pressable key={pkg.id} style={styles.trekkingCard}>
                <react_native_1.View style={styles.trekkingCardLeft}>
                  <vector_icons_1.Ionicons name="trail-sign-outline" size={20} color={realix_1.RealixColors.accent}/>
                  <react_native_1.View style={{ gap: 2 }}>
                    <react_native_1.Text style={styles.trekkingName}>{pkg.name}</react_native_1.Text>
                    <react_native_1.Text style={styles.trekkingRegion}>{pkg.region} Region</react_native_1.Text>
                    <react_native_1.Text style={styles.trekkingDays}>{pkg.days} days avg.</react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={styles.trekkingRight}>
                  <react_native_1.Text style={styles.trekkingFrom}>From</react_native_1.Text>
                  <react_native_1.Text style={styles.trekkingPrice}>${pkg.from}</react_native_1.Text>
                  <vector_icons_1.Ionicons name="chevron-forward" size={14} color={realix_1.RealixColors.textMuted}/>
                </react_native_1.View>
              </react_native_1.Pressable>); })}

            <react_native_1.View style={styles.trekkingInfoCard}>
              <vector_icons_1.Ionicons name="information-circle-outline" size={18} color="#1565C0"/>
              <react_native_1.Text style={styles.trekkingInfoText}>
                TIMS card and ACAP/SAARC permits required for most trekking routes.
                Our lodges include permit guidance.
              </react_native_1.Text>
            </react_native_1.View>

            <react_native_1.View style={styles.sectionHeader}>
              <react_native_1.Text style={styles.sectionTitle}>Trek Essentials</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.essGrid}>
              {[
                { icon: 'bed-outline', label: 'Tea Houses', color: '#E8F5E9', tc: '#2E7D32' },
                { icon: 'medkit-outline', label: 'First Aid', color: '#FCE4EC', tc: '#880E4F' },
                { icon: 'cloud-outline', label: 'Weather', color: '#E3F2FD', tc: '#1565C0' },
                { icon: 'people-outline', label: 'Guides', color: '#FFF3E0', tc: '#E65100' },
            ].map(function (item) { return (<react_native_1.Pressable key={item.label} style={styles.essCard}>
                  <react_native_1.View style={[styles.essIcon, { backgroundColor: item.color }]}>
                    <vector_icons_1.Ionicons name={item.icon} size={18} color={item.tc}/>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.essLabel}>{item.label}</react_native_1.Text>
                </react_native_1.Pressable>); })}
            </react_native_1.View>
          </>)}

        {/* ══════════════════════════════════════════════ FAVORITES TAB */}
        {activeTab === 'favorites' && (<react_native_1.View style={styles.emptyState}>
            <react_native_1.View style={styles.emptyIconWrap}>
              <vector_icons_1.Ionicons name="bookmark-outline" size={36} color={realix_1.RealixColors.accent}/>
            </react_native_1.View>
            <react_native_1.Text style={styles.emptyTitle}>No saved properties</react_native_1.Text>
            <react_native_1.Text style={styles.emptyText}>
              Tap the heart on any property to save it here for later.
            </react_native_1.Text>
            <react_native_1.Pressable style={styles.emptyBtn} onPress={function () { return setActiveTab('explore'); }}>
              <react_native_1.Text style={styles.emptyBtnText}>Explore Properties</react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>)}

        {/* ══════════════════════════════════════════════ BOOKINGS TAB */}
        {activeTab === 'bookings' && (<react_native_1.View style={styles.emptyState}>
            <react_native_1.View style={styles.emptyIconWrap}>
              <vector_icons_1.Ionicons name="calendar-outline" size={36} color={realix_1.RealixColors.accent}/>
            </react_native_1.View>
            <react_native_1.Text style={styles.emptyTitle}>No upcoming bookings</react_native_1.Text>
            <react_native_1.Text style={styles.emptyText}>
              When you book a property, your reservation will appear here.
            </react_native_1.Text>
            <react_native_1.Pressable style={styles.emptyBtn} onPress={function () { return setActiveTab('explore'); }}>
              <react_native_1.Text style={styles.emptyBtnText}>Find a Stay</react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>)}

      </react_native_1.ScrollView>
    </react_native_safe_area_context_1.SafeAreaView>);
}
// ─── Styles ─────────────────────────────────────────────────────────────────
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: realix_1.RealixColors.pageBackground,
    },
    // ── Header ──
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 8,
        backgroundColor: realix_1.RealixColors.pageBackground,
    },
    greeting: {
        fontSize: 12,
        color: realix_1.RealixColors.textMuted,
        marginBottom: 2,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: realix_1.RealixColors.textPrimary,
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
        backgroundColor: realix_1.RealixColors.cardBackground,
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // ── Tab Bar ──
    tabBarWrap: {
        paddingHorizontal: 20,
        paddingBottom: 8,
        backgroundColor: realix_1.RealixColors.pageBackground,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: realix_1.RealixColors.cardBackground,
        borderRadius: 14,
        padding: 4,
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
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
        backgroundColor: realix_1.RealixColors.accent,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: realix_1.RealixColors.textMuted,
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
        backgroundColor: realix_1.RealixColors.inputBackground,
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.inputBorder,
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
        color: realix_1.RealixColors.textMuted,
    },
    filterBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: realix_1.RealixColors.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
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
        backgroundColor: realix_1.RealixColors.accent,
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
        backgroundColor: realix_1.RealixColors.cardBackground,
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
    },
    chipActive: {
        backgroundColor: realix_1.RealixColors.accent,
        borderColor: realix_1.RealixColors.accent,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: realix_1.RealixColors.textMuted,
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
        color: realix_1.RealixColors.textPrimary,
    },
    seeAll: {
        fontSize: 13,
        color: realix_1.RealixColors.accent,
        fontWeight: '600',
    },
    // ── Featured Properties ──
    featuredScroll: {
        gap: 12,
        paddingRight: 4,
    },
    featuredCard: {
        width: 200,
        backgroundColor: realix_1.RealixColors.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
    },
    featuredImg: {
        width: '100%',
        height: 120,
        backgroundColor: realix_1.RealixColors.border,
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
        color: realix_1.RealixColors.textMuted,
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
        color: realix_1.RealixColors.textPrimary,
    },
    featuredLocRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    featuredLoc: {
        fontSize: 10,
        color: realix_1.RealixColors.textMuted,
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
        color: realix_1.RealixColors.accent,
    },
    featuredPriceSub: {
        fontSize: 10,
        color: realix_1.RealixColors.textMuted,
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
        backgroundColor: realix_1.RealixColors.cardBackground,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
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
        backgroundColor: realix_1.RealixColors.accent,
    },
    festName: {
        fontSize: 14,
        fontWeight: '700',
        color: realix_1.RealixColors.textPrimary,
        marginBottom: 2,
    },
    festDesc: {
        fontSize: 11,
        color: realix_1.RealixColors.textMuted,
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
        backgroundColor: realix_1.RealixColors.cardBackground,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
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
        color: realix_1.RealixColors.textPrimary,
    },
    quickText: {
        fontSize: 11,
        color: realix_1.RealixColors.textSecondary,
        lineHeight: 16,
    },
    // ── Currency ──
    currencyCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: realix_1.RealixColors.cardBackground,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
    },
    currencyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    currencyTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: realix_1.RealixColors.textPrimary,
    },
    currencySub: {
        fontSize: 10,
        color: realix_1.RealixColors.textMuted,
        marginTop: 1,
    },
    currencyBtn: {
        backgroundColor: realix_1.RealixColors.accent,
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
        backgroundColor: realix_1.RealixColors.cardBackground,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
    },
    trekkingCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    trekkingName: {
        fontSize: 14,
        fontWeight: '700',
        color: realix_1.RealixColors.textPrimary,
    },
    trekkingRegion: {
        fontSize: 11,
        color: realix_1.RealixColors.textMuted,
    },
    trekkingDays: {
        fontSize: 11,
        color: realix_1.RealixColors.accent,
        fontWeight: '600',
    },
    trekkingRight: {
        alignItems: 'center',
        gap: 4,
        flexDirection: 'row',
    },
    trekkingFrom: {
        fontSize: 10,
        color: realix_1.RealixColors.textMuted,
    },
    trekkingPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: realix_1.RealixColors.textPrimary,
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
        backgroundColor: realix_1.RealixColors.cardBackground,
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: realix_1.RealixColors.border,
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
        color: realix_1.RealixColors.textPrimary,
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
        color: realix_1.RealixColors.textPrimary,
    },
    emptyText: {
        fontSize: 14,
        color: realix_1.RealixColors.textSecondary,
        textAlign: 'center',
        maxWidth: 260,
        lineHeight: 20,
    },
    emptyBtn: {
        marginTop: 4,
        backgroundColor: realix_1.RealixColors.accent,
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
