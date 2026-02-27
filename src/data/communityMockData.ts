// Community Mock Data

// Legacy story types for backwards compatibility
export type LegacyStoryType = 
  | "lessons-learned"
  | "budget-breakdown"
  | "first-time-diy"
  | "solo-to-group"
  | "mistakes-wins";

// New story types for guided creation
export type StoryType = 
  | LegacyStoryType
  | "trip-recap"
  | "lesson-insight"
  | "destination-snapshot";

export type DiscussionTopic = 
  | "budget"
  | "transport"
  | "visa"
  | "safety"
  | "food"
  | "accommodation"
  | "activities"
  | "general";

export type BlockType = 
  | "text"
  | "image"
  | "moment"
  | "lesson"
  | "tip"
  | "location"
  | "social-link";

// Story focus chips for new story creation (optional, multi-select)
export type StoryFocus =
  | "trip-recap"
  | "lessons-learned"
  | "tips-for-others"
  | "destination-guide"
  | "budget-breakdown"
  | "solo-travel"
  | "first-time-experience";

export const storyFocusOptions: { value: StoryFocus; label: string; icon: string }[] = [
  { value: "trip-recap", label: "Trip Recap", icon: "🗺️" },
  { value: "lessons-learned", label: "Lessons Learned", icon: "💡" },
  { value: "tips-for-others", label: "Tips for Others", icon: "💬" },
  { value: "destination-guide", label: "Destination Guide", icon: "🧭" },
  { value: "budget-breakdown", label: "Budget Breakdown", icon: "💰" },
  { value: "solo-travel", label: "Solo Travel", icon: "🧳" },
  { value: "first-time-experience", label: "First-Time Experience", icon: "✨" },
];

// Travel Style options with Lucide icon names for story categorization
export type TravelStyleId =
  | "nature-outdoor"
  | "adventure"
  | "beach"
  | "food"
  | "city-urban"
  | "culture"
  | "hiking"
  | "photography"
  | "backpacking"
  | "budget";

export const travelStyleOptions: { id: TravelStyleId; label: string; icon: string }[] = [
  { id: "nature-outdoor", label: "Nature & Outdoor", icon: "🌿" },
  { id: "adventure", label: "Adventure", icon: "🧗" },
  { id: "beach", label: "Beach", icon: "🏖️" },
  { id: "food", label: "Food & Culinary", icon: "🍜" },
  { id: "city-urban", label: "City & Urban", icon: "🏙️" },
  { id: "culture", label: "Culture", icon: "🏛️" },
  { id: "hiking", label: "Hiking", icon: "🥾" },
  { id: "photography", label: "Photography", icon: "📸" },
  { id: "backpacking", label: "Backpacking", icon: "🎒" },
  { id: "budget", label: "Budget-friendly", icon: "💵" },
];

export type TextPrompt =
  | "free"
  | "what-happened"
  | "lesson"
  | "tip"
  | "why-place-matters";

export type SocialPlatform = "instagram" | "tiktok" | "youtube" | "facebook" | "twitter";

export type StoryVisibility = "public" | "community" | "profile";

export interface StoryBlock {
  id: string;
  type: BlockType;
  content: string;
  // Optional guidance for text blocks (keeps creation flexible)
  textPrompt?: TextPrompt;
  caption?: string;
  imageUrl?: string;
  url?: string;
  platform?: SocialPlatform;
  locationName?: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface StoryAuthor {
  id: string;
  name: string;
  avatar: string;
  socialLinks?: SocialLink[];
}

export interface Location {
  country: string;
  city?: string;
  flag: string;
}

// Inline media for stories (images/galleries inserted in content)
export interface InlineMediaImage {
  url: string;
  caption?: string;
}

export interface StoryInlineMedia {
  id: string;
  type: "image" | "gallery";
  images: InlineMediaImage[];
  insertPosition: number;
}

// User social profile for inline social links
export interface UserSocialProfile {
  platform: SocialPlatform;
  handle: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  excerpt: string;
  content: string;
  contentAfterMedia?: string;
  blocks?: StoryBlock[];
  inlineMedia?: StoryInlineMedia[];
  selectedSocialLinks?: UserSocialProfile[];
  editorBlocks?: import("@/lib/storyEditorBlocks").EditorBlock[];
  author: StoryAuthor;
  location: Location;
  readingTime: number;
  storyType: StoryType;
  linkedTripId?: string;
  likes: number;
  saves: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isDraft?: boolean;
  visibility?: StoryVisibility;
  tags?: string[];
  socialLinks?: SocialLink[];
  createdAt: Date;
  relatedDiscussionId?: string;
}

export interface Discussion {
  id: string;
  title: string;
  details?: string;
  author: StoryAuthor;
  location: Location;
  topic: DiscussionTopic;
  replyCount: number;
  isAnswered: boolean;
  isAnonymous: boolean;
  createdAt: Date;
  relatedStoryId?: string;
}

export const storyTypeLabels: Record<StoryType, string> = {
  "lessons-learned": "Lessons Learned",
  "budget-breakdown": "Budget Breakdown",
  "first-time-diy": "First-Time DIY",
  "solo-to-group": "Solo → Group",
  "mistakes-wins": "Mistakes & Wins",
  "trip-recap": "Trip Recap",
  "lesson-insight": "Lesson / Insight",
  "destination-snapshot": "Destination Snapshot",
};

// Story types available for new story creation
export const newStoryTypes: StoryType[] = [
  "trip-recap",
  "lesson-insight",
  "destination-snapshot",
];

export const discussionTopicLabels: Record<DiscussionTopic, string> = {
  budget: "Budget",
  transport: "Transport",
  visa: "Visa",
  safety: "Safety",
  food: "Food",
  accommodation: "Accommodation",
  activities: "Activities",
  general: "General",
};

// Block type configurations with friendly guidance
export const blockTypeConfig: Record<BlockType, { label: string; icon: string; description: string; placeholder: string }> = {
  "text": {
    label: "Text",
    icon: "📝",
    description: "Share your thoughts and experiences",
    placeholder: "What happened next? Share your thoughts...",
  },
  "image": {
    label: "Photo",
    icon: "📷",
    description: "Add a photo with optional caption",
    placeholder: "Add a caption to your photo...",
  },
  "moment": {
    label: "Key Moment",
    icon: "✨",
    description: "Highlight a memorable experience",
    placeholder: "Describe this special moment...",
  },
  "lesson": {
    label: "Lesson Learned",
    icon: "💡",
    description: "Share something you learned",
    placeholder: "What did this experience teach you?",
  },
  "tip": {
    label: "Tip for Others",
    icon: "💬",
    description: "Give advice to future travelers",
    placeholder: "What advice would you give others?",
  },
  "location": {
    label: "Location",
    icon: "📍",
    description: "Highlight a specific place",
    placeholder: "What was special about this place?",
  },
  "social-link": {
    label: "Social Link",
    icon: "🔗",
    description: "Link to your social media content",
    placeholder: "Add the URL to your post...",
  },
};

export const mockStories: Story[] = [
  {
    id: "story-1",
    slug: "backpacking-vietnam-budget-breakdown",
    title: "How I Spent RM2,500 on 3 Weeks in Vietnam",
    coverImage: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800",
    excerpt: "A detailed breakdown of every ringgit spent during my solo backpacking adventure through Vietnam.",
    content: "Full story content here...",
    blocks: [
      { id: "b1", type: "text", content: "When I first decided to backpack through Vietnam, everyone told me it would be expensive. They were wrong." },
      { id: "b2", type: "image", content: "", imageUrl: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800", caption: "The streets of Hanoi at sunset" },
      { id: "b3", type: "moment", content: "The moment I realized I could live on RM80/day including accommodation was life-changing." },
      { id: "b4", type: "tip", content: "Book overnight buses to save on accommodation costs - you travel and sleep at the same time!" },
    ],
    author: {
      id: "user-1",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      socialLinks: [
        { platform: "instagram", url: "https://instagram.com/sarahchen" },
        { platform: "youtube", url: "https://youtube.com/@sarahtravels" },
      ],
    },
    location: { country: "Vietnam", city: "Hanoi", flag: "🇻🇳" },
    readingTime: 8,
    storyType: "budget-breakdown",
    visibility: "public",
    tags: ["budget", "backpacking", "vietnam", "solo-travel"],
    likes: 234,
    saves: 89,
    createdAt: new Date("2025-01-05"),
  },
  {
    id: "story-2",
    slug: "first-solo-trip-japan",
    title: "My First Solo Trip to Japan: What I Wish I Knew",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    excerpt: "The mistakes I made, the lessons I learned, and why I'd do it all over again.",
    content: "Full story content here...",
    blocks: [
      { id: "b1", type: "text", content: "Japan had been on my bucket list for years. When I finally booked that ticket, I had no idea what I was getting into." },
      { id: "b2", type: "lesson", content: "Learn basic Japanese phrases. Even 'sumimasen' (excuse me) goes a long way." },
      { id: "b3", type: "moment", content: "Getting lost in Shibuya and finding the most amazing hidden ramen shop." },
    ],
    author: {
      id: "user-2",
      name: "Ahmad Razak",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      socialLinks: [
        { platform: "instagram", url: "https://instagram.com/ahmadrazak" },
      ],
    },
    location: { country: "Japan", city: "Tokyo", flag: "🇯🇵" },
    readingTime: 12,
    storyType: "first-time-diy",
    visibility: "public",
    tags: ["japan", "solo-travel", "first-time", "lessons"],
    likes: 456,
    saves: 178,
    createdAt: new Date("2025-01-03"),
  },
  {
    id: "story-3",
    slug: "bali-travel-mistakes",
    title: "5 Expensive Mistakes I Made in Bali",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    excerpt: "From overpriced taxis to tourist trap restaurants - learn from my wallet's suffering.",
    content: "Full story content here...",
    author: {
      id: "user-3",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    },
    location: { country: "Indonesia", city: "Bali", flag: "🇮🇩" },
    readingTime: 6,
    storyType: "mistakes-wins",
    likes: 312,
    saves: 145,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "story-4",
    slug: "solo-to-group-thailand",
    title: "From Solo Traveler to Group Leader in Thailand",
    coverImage: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
    excerpt: "How I accidentally started leading group trips after meeting strangers in hostels.",
    content: "Full story content here...",
    author: {
      id: "user-4",
      name: "Marcus Lee",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    },
    location: { country: "Thailand", city: "Chiang Mai", flag: "🇹🇭" },
    readingTime: 10,
    storyType: "solo-to-group",
    likes: 189,
    saves: 67,
    createdAt: new Date("2024-12-28"),
  },
  {
    id: "story-5",
    slug: "lessons-from-europe-trip",
    title: "10 Lessons from 30 Days Across Europe",
    coverImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
    excerpt: "Train passes, budget airlines, and everything I learned about traveling smart.",
    content: "Full story content here...",
    author: {
      id: "user-5",
      name: "Jessica Wong",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    },
    location: { country: "France", city: "Paris", flag: "🇫🇷" },
    readingTime: 15,
    storyType: "lessons-learned",
    likes: 567,
    saves: 234,
    createdAt: new Date("2024-12-25"),
  },
];

export const mockDiscussions: Discussion[] = [
  {
    id: "disc-1",
    title: "Best way to get from KLIA to Langkawi?",
    details: "I'm arriving at KLIA late at night and need to get to Langkawi the next day. Should I take a bus to Kuala Perlis or fly?",
    author: {
      id: "user-6",
      name: "David Tan",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    },
    location: { country: "Malaysia", flag: "🇲🇾" },
    topic: "transport",
    replyCount: 12,
    isAnswered: true,
    isAnonymous: false,
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "disc-2",
    title: "Is RM150/day enough for Bangkok?",
    details: "Planning a week trip to Bangkok. Can I survive on RM150 per day including accommodation?",
    author: {
      id: "user-7",
      name: "Anonymous",
      avatar: "",
    },
    location: { country: "Thailand", city: "Bangkok", flag: "🇹🇭" },
    topic: "budget",
    replyCount: 8,
    isAnswered: false,
    isAnonymous: true,
    createdAt: new Date("2025-01-09"),
  },
  {
    id: "disc-3",
    title: "Vietnam visa on arrival - still valid in 2025?",
    details: "I've read conflicting info. Do Malaysians still get 30 days visa-free in Vietnam?",
    author: {
      id: "user-8",
      name: "Mei Ling",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    },
    location: { country: "Vietnam", flag: "🇻🇳" },
    topic: "visa",
    replyCount: 15,
    isAnswered: true,
    isAnonymous: false,
    createdAt: new Date("2025-01-08"),
  },
  {
    id: "disc-4",
    title: "Safe areas to stay in Jakarta for solo female?",
    details: "First time visiting Jakarta alone. Which areas should I look for accommodation?",
    author: {
      id: "user-9",
      name: "Nina Abdullah",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200",
    },
    location: { country: "Indonesia", city: "Jakarta", flag: "🇮🇩" },
    topic: "safety",
    replyCount: 23,
    isAnswered: true,
    isAnonymous: false,
    createdAt: new Date("2025-01-07"),
  },
  {
    id: "disc-5",
    title: "Must-try street food in Penang?",
    details: "Spending 3 days in Penang. What are the absolute must-try dishes and where?",
    author: {
      id: "user-6",
      name: "Kevin Lim",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    },
    location: { country: "Malaysia", city: "Penang", flag: "🇲🇾" },
    topic: "food",
    replyCount: 31,
    isAnswered: false,
    isAnonymous: false,
    createdAt: new Date("2025-01-06"),
  },
  {
    id: "disc-6",
    title: "Cheapest hostels in Tokyo?",
    details: "Looking for budget accommodation in Tokyo. Any recommendations under RM100/night?",
    author: {
      id: "user-11",
      name: "Ryan Goh",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200",
    },
    location: { country: "Japan", city: "Tokyo", flag: "🇯🇵" },
    topic: "accommodation",
    replyCount: 19,
    isAnswered: true,
    isAnonymous: false,
    createdAt: new Date("2025-01-05"),
  },
];

export const countries = [
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Taiwan", flag: "🇹🇼" },
  { name: "China", flag: "🇨🇳" },
  { name: "India", flag: "🇮🇳" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "United States", flag: "🇺🇸" },
];

// Title placeholder examples for story creation
export const storyTitleExamples = [
  "How I Spent RM2,500 on 3 Weeks in Vietnam",
  "My First Solo Trip to Japan: What I Wish I Knew",
  "5 Expensive Mistakes I Made in Bali",
  "The Hidden Gems of Langkawi Nobody Talks About",
  "How I Met My Best Travel Buddy in Thailand",
];
