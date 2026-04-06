// Shared emoji lookup for expectation/requirement labels

// Exact match map from RequirementsSection predefined options
const exactEmojiMap: Record<string, string> = {
  'Budget-focused trip': '💰',
  'Shared expenses throughout': '🤝',
  'Pay upfront for some bookings': '💳',
  'Reimbursements via expense tracking': '📊',
  'Eat local, not fancy': '🍜',
  'Moderate walking involved': '🚶',
  'Physically active days': '💪',
  'Early starts on some days': '🌅',
  'Flexible itinerary': '🔀',
  'Weather-dependent activities': '🌦️',
  'Passport required': '🛂',
  'Visa may be required': '📋',
  'Travel insurance recommended': '🛡️',
  'Self-responsible for documents': '📄',
  'Flights booked individually': '✈️',
  'Shared accommodation': '🏠',
  'Budget stays': '🛏️',
  'Basic amenities': '🚿',
  'Limited luggage space': '🎒',
  'Small group travel': '👥',
  'Open to meeting new people': '🙋',
  'Group decisions & voting': '🗳️',
  'Respect personal space': '🧘',
  'Chill / non-party vibes': '😌',
  'Vegetarian-friendly': '🥗',
  'Alcohol-optional': '🍵',
  'Photography-friendly': '📸',
  'Culture-focused': '🏛️',
  'Nature-heavy itinerary': '🌿',
};

// Keyword-based fallback matching
const keywordEmojiMap: [string[], string][] = [
  [['swim', 'water', 'beach', 'snorkel', 'dive'], '🏊'],
  [['walk', 'hike', 'trek', 'fitness', 'active', 'physical'], '🚶'],
  [['passport', 'visa', 'document'], '🛂'],
  [['insurance'], '🛡️'],
  [['budget', 'expense', 'money', 'cost', 'pay'], '💰'],
  [['food', 'eat', 'appetite', 'cuisine', 'diet', 'vegetarian', 'halal'], '🍜'],
  [['warm', 'cold', 'weather', 'rain', 'clothing', 'clothes', 'jacket'], '🌦️'],
  [['shoe', 'boot', 'footwear'], '👟'],
  [['camera', 'photo', 'photography'], '📸'],
  [['yoga', 'wellness', 'meditation', 'spa'], '🧘'],
  [['luggage', 'bag', 'pack', 'backpack'], '🎒'],
  [['group', 'team', 'people'], '👥'],
  [['nature', 'forest', 'jungle', 'rainforest', 'mountain', 'outdoor'], '🌿'],
  [['culture', 'temple', 'heritage', 'history', 'museum'], '🏛️'],
  [['insect', 'mosquito', 'repellent', 'sunscreen', 'protection'], '🧴'],
  [['early', 'morning', 'sunrise'], '🌅'],
  [['flexible', 'open'], '🔀'],
  [['gear', 'equipment', 'bring'], '🎒'],
  [['flight', 'fly', 'airport', 'plane'], '✈️'],
  [['accommodation', 'hotel', 'hostel', 'stay'], '🏠'],
];

export function getExpectationEmoji(label: string): string {
  // Try exact match first
  if (exactEmojiMap[label]) return exactEmojiMap[label];

  // Try keyword match
  const lower = label.toLowerCase();
  for (const [keywords, emoji] of keywordEmojiMap) {
    if (keywords.some(kw => lower.includes(kw))) return emoji;
  }

  // Fallback
  return '✅';
}
