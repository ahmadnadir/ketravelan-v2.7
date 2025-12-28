// Mock data for Ketravelan app

export const mockTrips = [
  {
    id: "1",
    title: "Langkawi Island Adventure",
    destination: "Langkawi, Malaysia",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    startDate: "Jan 15, 2025",
    endDate: "Jan 18, 2025",
    price: 850,
    slotsLeft: 2,
    totalSlots: 8,
    tags: ["Nature & Outdoor", "Beach", "Community"],
    isAlmostFull: true,
    description: "Join us for an unforgettable adventure exploring the beautiful beaches and rainforests of Langkawi. We'll visit iconic spots like the Sky Bridge, cable car, and pristine beaches.",
    requirements: [
      "Comfortable with swimming",
      "Basic fitness level for hiking",
      "Bring own snorkeling gear (optional)",
      "Valid passport for duty-free shopping",
    ],
    budgetBreakdown: [
      { category: "Transport", amount: 200, icon: "car" },
      { category: "Accommodation", amount: 350, icon: "bed" },
      { category: "Food", amount: 200, icon: "utensils" },
      { category: "Activities", amount: 100, icon: "ticket" },
    ],
  },
  {
    id: "2",
    title: "Cameron Highlands Retreat",
    destination: "Cameron Highlands, Malaysia",
    imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
    startDate: "Feb 5, 2025",
    endDate: "Feb 7, 2025",
    price: 450,
    slotsLeft: 5,
    totalSlots: 10,
    tags: ["Nature & Outdoor", "Cross Border"],
    isAlmostFull: false,
    description: "Escape the city heat with a refreshing trip to Cameron Highlands. Enjoy tea plantations, strawberry farms, and cool mountain air.",
    requirements: [
      "Warm clothing for cool weather",
      "Comfortable walking shoes",
    ],
    budgetBreakdown: [
      { category: "Transport", amount: 100, icon: "car" },
      { category: "Accommodation", amount: 200, icon: "bed" },
      { category: "Food", amount: 100, icon: "utensils" },
      { category: "Activities", amount: 50, icon: "ticket" },
    ],
  },
  {
    id: "3",
    title: "Penang Food & Culture Tour",
    destination: "Penang, Malaysia",
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800",
    startDate: "Feb 20, 2025",
    endDate: "Feb 23, 2025",
    price: 650,
    slotsLeft: 4,
    totalSlots: 12,
    tags: ["City & Urban", "Food", "Culture"],
    isAlmostFull: false,
    description: "Discover the rich heritage and incredible street food of Georgetown, Penang. Visit temples, street art, and eat your way through hawker centers.",
    requirements: [
      "Adventurous appetite",
      "Comfortable walking shoes",
    ],
    budgetBreakdown: [
      { category: "Transport", amount: 150, icon: "car" },
      { category: "Accommodation", amount: 300, icon: "bed" },
      { category: "Food", amount: 150, icon: "utensils" },
      { category: "Activities", amount: 50, icon: "ticket" },
    ],
  },
  {
    id: "4",
    title: "Taman Negara Jungle Expedition",
    destination: "Pahang, Malaysia",
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
    startDate: "Mar 10, 2025",
    endDate: "Mar 13, 2025",
    price: 750,
    slotsLeft: 6,
    totalSlots: 8,
    tags: ["Nature & Outdoor", "Adventure"],
    isAlmostFull: false,
    description: "Explore one of the world's oldest rainforests! Canopy walk, night safari, river cruise, and indigenous village visit included.",
    requirements: [
      "Good physical fitness",
      "Insect repellent",
      "Rain gear",
      "Sense of adventure",
    ],
    budgetBreakdown: [
      { category: "Transport", amount: 180, icon: "car" },
      { category: "Accommodation", amount: 280, icon: "bed" },
      { category: "Food", amount: 140, icon: "utensils" },
      { category: "Activities", amount: 150, icon: "ticket" },
    ],
  },
];

export const mockMembers = [
  { id: "1", name: "Ahmad Razak", role: "Organizer", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", descriptor: "Outdoor enthusiast" },
  { id: "2", name: "Sarah Tan", role: "Member", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", descriptor: "First time in Langkawi" },
  { id: "3", name: "Lisa Wong", role: "Member", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", descriptor: "Frequent DIY traveler" },
  { id: "4", name: "John Lee", role: "Member", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200", descriptor: "Photography lover" },
  { id: "5", name: "Priya Kumar", role: "Member", descriptor: "Adventure seeker" },
];

export const mockExpenses = [
  { id: "1", title: "Accommodation - 3 nights", amount: 1200, paidBy: "Ahmad Razak", date: "Jan 15, 2025", hasReceipt: true, paymentProgress: 75 },
  { id: "2", title: "Ferry tickets", amount: 320, paidBy: "Sarah Tan", date: "Jan 15, 2025", hasReceipt: true, paymentProgress: 100 },
  { id: "3", title: "Rental car", amount: 450, paidBy: "Ahmad Razak", date: "Jan 15, 2025", hasReceipt: false, paymentProgress: 50 },
  { id: "4", title: "Group dinner", amount: 280, paidBy: "Lisa Wong", date: "Jan 16, 2025", hasReceipt: true, paymentProgress: 25 },
  { id: "5", title: "Sky Bridge tickets", amount: 180, paidBy: "John Lee", date: "Jan 17, 2025", hasReceipt: true, paymentProgress: 0 },
];

export const mockMessages = [
  { id: "1", senderId: "1", senderName: "Ahmad Razak", content: "Welcome everyone! Excited for our Langkawi trip 🎉", timestamp: "10:00 AM", type: "text" as const },
  { id: "2", senderId: "2", senderName: "Sarah Tan", content: "Can't wait! Should we meet at KL Sentral?", timestamp: "10:05 AM", type: "text" as const },
  { id: "3", senderId: "system", senderName: "System", content: "Lisa Wong joined the trip", timestamp: "10:10 AM", type: "system" as const },
  { id: "4", senderId: "3", senderName: "Lisa Wong", content: "Hey everyone! Happy to be here 😊", timestamp: "10:12 AM", type: "text" as const },
  { id: "5", senderId: "1", senderName: "Ahmad Razak", content: "Yes, KL Sentral at 7am works. I'll share the exact meeting point later.", timestamp: "10:15 AM", type: "text" as const },
  { id: "6", senderId: "system", senderName: "System", content: "Ahmad added expense: Ferry tickets - RM 320", timestamp: "10:30 AM", type: "system" as const },
];

export const mockNotes = [
  { id: "1", title: "Packing List", content: "- Sunscreen\n- Swimsuit\n- Comfortable shoes\n- Light jacket\n- Camera\n- Snorkeling gear", date: "Jan 10, 2025", pinned: true },
  { id: "2", title: "Restaurant Recommendations", content: "1. Wonderland Food Store - Laksa\n2. Orkid Ria - Seafood\n3. Manggo Lounge - Western", date: "Jan 8, 2025", pinned: false },
  { id: "3", title: "Emergency Contacts", content: "Trip Leader: Ahmad - 012-345-6789\nHotel: 04-123-4567\nEmergency: 999", date: "Jan 5, 2025", pinned: true },
];

export const mockChats = [
  { id: "trip-1", name: "Langkawi Adventure", type: "trip" as const, lastMessage: "Ahmad: See you all at 7am!", unread: 3, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200" },
  { id: "trip-2", name: "Cameron Highlands", type: "trip" as const, lastMessage: "Lisa: I'll bring the snacks", unread: 0, imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=200" },
  { id: "dm-1", name: "Sarah Tan", type: "direct" as const, lastMessage: "Thanks for the info!", unread: 1, imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" },
  { id: "dm-2", name: "John Lee", type: "direct" as const, lastMessage: "See you there", unread: 0, imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" },
];