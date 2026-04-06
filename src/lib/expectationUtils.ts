// Shared emoji lookup for expectation/requirement labels
const expectationEmojiMap: Record<string, string> = {
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

const FALLBACK_EMOJI = '📦';

export function getExpectationEmoji(label: string): string {
  return expectationEmojiMap[label] || FALLBACK_EMOJI;
}
