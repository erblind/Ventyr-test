
export enum ViewState {
   PROJECT_OVERVIEW = 'PROJECT_OVERVIEW',
  ONBOARDING = 'ONBOARDING',
  DISCOVER = 'DISCOVER',
  EVENT_DETAIL = 'EVENT_DETAIL',
  CHECKOUT = 'CHECKOUT',
  MY_TICKETS = 'MY_TICKETS',
  RESELL_MARKET = 'RESELL_MARKET',
  ORGANIZER_DASHBOARD = 'ORGANIZER_DASHBOARD',
  CREATE_EVENT = 'CREATE_EVENT', 
  SWIPE_DISCOVERY = 'SWIPE_DISCOVERY',
  NETWORKING = 'NETWORKING',
  CHAT_HUB = 'CHAT_HUB',
  CHAT_CONVERSATION = 'CHAT_CONVERSATION',
  PROFILE = 'PROFILE'
}

export type UserRole = 'USER' | 'ORGANIZER';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  role: string;
  company: string;
  stats: {
    eventsAttended: number;
    connections: number;
    points: number;
  };
  stories: Story[];
}

export interface Story {
  id: string;
  thumbnail: string;
  mediaUrl: string;
  type: 'image' | 'video';
  isViewed: boolean;
  title?: string;
}

export interface ScheduleItem {
    id: string;
    time: string;
    title: string;
    description: string;
    type: 'performance' | 'panel' | 'break' | 'vip';
}

export interface Comment {
    id: string;
    user: string;
    avatar: string;
    text: string;
    timestamp: string;
}

export interface Organizer {
    id: string;
    name: string;
    avatar: string;
    followers: number;
    rating: number;
    description: string;
    isFollowed?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: number;
  tags: string[];
  description: string;
  organizer: Organizer; 
  venueDetails?: string;
  promoVideoUrl?: string;
  waitTimeMinutes?: number; 
  isResaleAvailable?: boolean;
  schedule?: ScheduleItem[];
  status?: 'published' | 'draft' | 'paused';
  // Engagement
  likes: number;
  attendees: number;
  comments: Comment[];
  stories?: Story[]; // New stories field
  // Socials
  hostSocials?: {
      instagram?: string;
      tiktok?: string;
      facebook?: string;
      twitter?: string;
      website?: string;
  };
  // AI Generated fields
  marketingCopy?: string;
  targetAudience?: string;
  suggestedTicketPricing?: { name: string; price: number }[];
  aiStrategy?: AIStrategy; // Link full strategy
}

// New AI Strategy Types
export interface AIStrategy {
    marketingPlan: string[];
    emailFlows: { step: number; subject: string; trigger: string }[];
    socialCampaign: { platform: string; content: string }[];
    predictedAttendance: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  purchaseDate: string;
  status: 'active' | 'used' | 'reselling' | 'sold';
  qrCodeData: string;
  pricePaid: number;
  resalePrice?: number;
  seat?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  avatar?: string;
}

export interface ChatConversation {
    id: string;
    type: 'event_group' | 'direct';
    name: string;
    lastMessage: string;
    avatar: string; 
    unreadCount: number;
    eventId?: string; 
    participantId?: string; 
}

export interface Person {
    id: string;
    name: string;
    role: string;
    company: string;
    image: string;
    interests: string[];
}

// CRM & Analytics Types
export interface Lead {
    id: string;
    name: string;
    email: string;
    status: 'interested' | 'purchased' | 'abandoned_cart' | 'vip';
    source: 'social' | 'organic' | 'referral' | 'ads';
    automationStep: 'welcome_sent' | 'reminder_sent' | 'upsell_queued' | 'completed';
    conversionProb: number; // 0-100
    phone?: string;
    ltv?: number;
    history?: string[];
}

export interface AnalyticsData {
    totalViews: number;
    totalSales: number;
    conversionRate: number;
    revenue: number;
    trafficSources: { name: string; value: number; color: string }[];
    salesOverTime: { name: string; value: number }[];
    conversionFunnel: { stage: string; count: number }[];
}
