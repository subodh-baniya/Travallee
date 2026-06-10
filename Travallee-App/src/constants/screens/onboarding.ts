export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "discover",
    title: "Discover Amazing Places",
    subtitle:
      "Find the best hotels, resorts, and vacation rentals around the world",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
  },
  {
    id: "global",
    title: "Global Accessibility",
    subtitle:
      "Book hotels anywhere in the world with ease. Access thousands of properties across 190+ countries.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
  },
  {
    id: "secure",
    title: "Safe and Secure",
    subtitle:
      "Your bookings and payments are protected with industry-leading security. Travel with peace of mind.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  },
];
