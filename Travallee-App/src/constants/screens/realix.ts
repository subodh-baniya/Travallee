export const RealixColors = {
  pageBackground: '#1a1a1a',
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

export const realixDestinations = [
  { id: 'kathmandu', label: 'Kathmandu', emoji: '🏔️', color: '#8b4513' },
  { id: 'pokhara', label: 'Pokhara', emoji: '🏞️', color: '#1f5c39' },
  { id: 'chitwan', label: 'Chitwan National Park', emoji: '🐅', color: '#4a7c3d' },
  { id: 'nagarkot', label: 'Nagarkot', emoji: '⛰️', color: '#6b4a18' },
  { id: 'bhaktapur', label: 'Bhaktapur', emoji: '🏯', color: '#8b6914' },
] as const;

export const realixSearchResults = [
  { id: 'sr1', name: 'Hotel Himalaya', address: 'Thamel, Kathmandu', emoji: '🏨' },
  { id: 'sr2', name: 'Pokhara Lakeside Resort', address: 'Lakeside, Pokhara', emoji: '🏝️' },
  { id: 'sr3', name: 'Nagarkot Farmhouse', address: 'Nagarkot, Bhaktapur', emoji: '🏡' },
  { id: 'sr4', name: 'Chitwan Jungle Lodge', address: 'Sauraha, Chitwan', emoji: '🏕️' },
  { id: 'sr5', name: 'Bhaktapur Heritage Inn', address: 'Durbar Square, Bhaktapur', emoji: '🏯' },
] as const;

export const realixMapPins = [
  { id: 'pin1', label: '₨2500', top: 100, left: 38, active: false },
  { id: 'pin2', label: '₨1800', top: 168, left: 42, active: true },
  { id: 'pin3', label: '₨3200', top: 170, right: 20, active: false },
  { id: 'pin4', label: '₨1450', top: 240, left: 36, active: false },
  { id: 'pin5', label: '₨2900', top: 300, right: 18, active: false },
  { id: 'pin6', label: '₨1750', top: 370, left: 40, active: false },
] as const;

export const realixPropertyTypes = ['Luxury Hotel', 'Budget Lodge', 'Heritage Resort', 'Adventure Camp'] as const;

export const realixFilterSortOptions = ['Best Match', 'Most Popular'] as const;

export const realixLanguages = [
  'Indonesian',
  'English (US)',
  'Italian',
  'French',
  'German',
  'Japanese',
  'Swedish',
  'Russian',
] as const;

export const realixFaqs = [
  {
    id: 'how-realix-works',
    question: 'How does Travallee work?',
    answer:
      'Browse hotels in Nepal, compare rates, read reviews, save favorites, and confirm bookings in a few taps. Search by city (Kathmandu, Pokhara, Bhaktapur), date, and budget to find the perfect stay.',
  },
  {
    id: 'who-can-book',
    question: 'Who can book a hotel in Nepal?',
    answer:
      'Any signed-in traveler can browse hotels across Nepal, review property details, check availability, and confirm bookings. We welcome tourists and domestic travelers.',
  },
  {
    id: 'payment-currency',
    question: 'What currency and payment methods are accepted?',
    answer:
      'We accept payments in Nepali Rupees (NPR). Payment methods include debit/credit cards, digital wallets (eSewa, Khalti), and online banking. Popular destinations include Kathmandu, Pokhara, Nagarkot, and Chitwan National Park.',
  },
  {
    id: 'cancellation-policy',
    question: 'What is the cancellation policy?',
    answer:
      'Most hotels allow free cancellation up to 48 hours before check-in. Some premium properties may have stricter policies. Check individual hotel terms before confirming your booking.',
  },
  {
    id: 'booking-confirmation',
    question: 'How do I receive booking confirmation?',
    answer:
      'Confirmation details are sent to your registered email and mobile number. You\'ll receive a booking reference code to show at hotel check-in. Save this reference or take a screenshot.',
  },
  {
    id: 'contact-support',
    question: 'How do I contact hotel support?',
    answer:
      'Use the in-app chat feature to contact hotel management or our support team. For urgent issues, call the hotel directly using the number provided in your booking confirmation.',
  },
  {
    id: 'covid-guidelines',
    question: 'Are there COVID-19 safety protocols at hotels?',
    answer:
      'Hotels in Nepal follow government health guidelines. Check individual hotel descriptions for specific safety measures like vaccination verification, mask policies, and sanitization protocols.',
  },
  {
    id: 'group-bookings',
    question: 'Can I make group or bulk bookings?',
    answer:
      'Yes! For groups of 5+ rooms, use the contact support feature to negotiate special rates. Our team will assist with multi-room bookings and provide personalized packages.',
  },
] as const;

export const realixNotificationFeed = [
  {
    id: 'booking-success',
    title: 'Booking Successful - Hotel Himalaya',
    message:
      'Your booking at Hotel Himalaya, Thamel is confirmed! Check-in: Apr 25, 2024. Reference: BKG-2024-5847. Total: ₨5,290. Have a wonderful stay!',
    timestamp: '2 days ago',
    group: 'Recent',
  },
  {
    id: 'new-services',
    title: 'New Features: Group Bookings & Tours',
    message:
      'Book accommodations for your group and explore guided tours across Kathmandu, Pokhara, and Chitwan directly from the app!',
    timestamp: '5 days ago',
    group: 'Recent',
  },
  {
    id: 'event-reminder',
    title: 'Check-in Reminder',
    message:
      'Your check-in at Hotel Himalaya is in 2 hours. Reach the hotel by 3 PM for smooth check-in. Call: +977-1-4123456',
    timestamp: '1 week ago',
    group: 'Last Month',
  },
  {
    id: 'account-setup',
    title: 'Account Setup Successful',
    message:
      'Welcome to Travallee! Your account is ready to explore hotels across Nepal. Start discovering amazing stays in Kathmandu, Pokhara, and beyond!',
    timestamp: '2 weeks ago',
    group: 'Last Month',
  },
] as const;

export const realixEmptyNotificationsCopy = {
  title: 'No Notifications Yet',
  body: 'No notification right now, notifications about your activity will show up here.',
} as const;

export const realixNotificationSections = [
  {
    id: 'special',
    title: 'Special tips and offers',
    options: [
      { id: 'special-push', label: 'Push notifications', defaultValue: false },
      { id: 'special-email', label: 'Email', defaultValue: false },
    ],
  },
  {
    id: 'activity',
    title: 'Activity',
    options: [
      { id: 'activity-push', label: 'Push notifications', defaultValue: false },
      { id: 'activity-email', label: 'Email', defaultValue: false },
    ],
  },
  {
    id: 'reminders',
    title: 'Reminders',
    options: [
      { id: 'reminders-push', label: 'Push notifications', defaultValue: false },
      { id: 'reminders-email', label: 'Email', defaultValue: false },
    ],
  },
] as const;

export const realixAmenityList = [
  { id: 'wifi', label: 'Free Wifi', icon: 'wifi-outline' },
  { id: 'restaurant', label: 'Restaurant', icon: 'restaurant-outline' },
  { id: 'mountain-view', label: 'Mountain View', icon: 'mountain-outline' },
  { id: 'hot-water', label: 'Hot Water 24/7', icon: 'water-outline' },
  { id: 'hiking', label: 'Hiking Tours', icon: 'walk-outline' },
] as const;

export const realixGallery = [
  { id: 'g1', title: 'Living Room', tone: '#1a2a3a' },
  { id: 'g2', title: 'Bathroom', tone: '#2a1a1a' },
  { id: 'g3', title: 'Bedroom', tone: '#1a2a1a' },
] as const;

export const realixRatingBars = [
  { stars: 5, percent: 60 },
  { stars: 4, percent: 20 },
  { stars: 3, percent: 10 },
  { stars: 2, percent: 5 },
  { stars: 1, percent: 5 },
] as const;

export const realixDiscoverProperty = {
  id: 'hotel-himalaya-thamel',
  name: 'Hotel Himalaya Thamel',
  location: 'Thamel, Kathmandu, Nepal',
  about:
    'Experience authentic Nepali hospitality in the heart of Kathmandu. Our hotel offers stunning views of the Kathmandu Valley and easy access to UNESCO World Heritage Sites. Enjoy traditional Nepali cuisine, modern amenities, and warm service.',
  nightlyPrice: 2500,
  discountedPrice: 2150,
  discountValue: 350,
  tax: 290,
  reviewScore: 4.8,
  reviewCount: 342,
  cardDate: '15 April 2024',
} as const;

export const realixPaymentMethods = [
  { id: 'esewa', label: 'eSewa', shortCode: 'ESW' },
  { id: 'khalti', label: 'Khalti', shortCode: 'KHL' },
  { id: 'mastercard', label: '•••• •••• •••• 4242', shortCode: 'MC' },
  { id: 'bank-transfer', label: 'Bank Transfer', shortCode: 'BT' },
] as const;

export const realixInboxThreads = [
  {
    id: 'daria',
    name: 'Daria',
    avatar: '👩',
    message: 'Oh hello Wiliam...',
    time: '20:16',
    unreadCount: 1,
    online: true,
  },
  {
    id: 'silvain-sastre',
    name: 'Silvain Sastre',
    avatar: '👨',
    message: 'Hey my friend, how are you?',
    time: '20:16',
    unreadCount: 0,
    online: true,
  },
  {
    id: 'michael-huss',
    name: 'Michael Huss',
    avatar: '🧔',
    message: 'Can I meet you today?',
    time: '21:00',
    unreadCount: 0,
    online: true,
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    avatar: '👧',
    message: 'Can I meet you today?',
    time: 'Yesterday',
    unreadCount: 0,
    online: false,
  },
  {
    id: 'lee-chang',
    name: 'Lee Chang',
    avatar: '🧑',
    message: 'Can I meet you today?',
    time: 'Nov 15',
    unreadCount: 0,
    online: false,
  },
] as const;

export const realixChatMessages = [
  {
    id: 't0',
    type: 'time',
    value: 'Today, 11:20',
  },
  {
    id: 'm1',
    type: 'incoming',
    value: 'I\'m looking for information about your house. Can I visit to see your house?',
  },
  {
    id: 'm2',
    type: 'outgoing',
    value: 'Ok, Bob!',
  },
  {
    id: 'm3',
    type: 'incoming',
    value: 'Hi, Band Of Course, the door is always open.',
  },
  {
    id: 'm4',
    type: 'outgoing',
    value: 'That\'s great, thank you! Sunday at 12 PM does that work for you?',
  },
  {
    id: 'm5',
    type: 'incoming',
    value: 'Of course, see you on Sunday!',
  },
] as const;

export const realixHistoryBookings = [
  {
    id: 'h1',
    name: 'Pullman Legian Bali',
    detail: '1 room, 2 Adults',
    dates: 'Thu, 23 Feb 22 – Sat, 26 Feb 22',
    emoji: '🏖️',
  },
  {
    id: 'h2',
    name: 'Pullman Legian Bali',
    detail: '1 room, 2 Adults',
    dates: 'Thu, 23 Feb 22 – Sat, 26 Feb 22',
    emoji: '🌴',
  },
] as const;

export const realixReviewCopy = {
  title: 'Thank you for review',
  body: 'Your review has been submitted successfully. Thank you!',
} as const;