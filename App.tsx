
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Calendar, Clock, ArrowRight, User, 
  Ticket as TicketIcon, Plus, LayoutGrid, ChevronLeft, CreditCard, 
  CheckCircle2, Share2, DollarSign, Image as ImageIcon,
  Video, Wand2, Info, Users, Flame, Heart, X as XIcon, Edit3, Repeat, Timer, Wallet, Star, TrendingUp, RefreshCw, Navigation as NavIcon, Camera, MessageCircle, Send, MoreVertical, Bell,
  PieChart, BarChart3, Mail, GripVertical, Sparkles, BrainCircuit, Target, ArrowUpRight, Megaphone, Settings, Activity, MoreHorizontal, Filter, Download, Pause, Play, AlertCircle, Eye, MousePointer2, LogOut, ChevronRight,
  Instagram, Facebook, Globe, Twitter, Linkedin, MessageSquare, Phone, UserPlus, Check, Zap, Layers, MailOpen, TrendingDown, Copy, MousePointerClick, ListTodo, Map as MapIcon, RotateCcw, Briefcase, Smartphone, CornerDownRight, BarChart4, MoveRight, ArrowRightLeft, PenTool, Link, History, Save, ShoppingBag, Youtube, MessageCircleWarning, ArrowRightCircle, LayoutTemplate, Palette, Grip
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart as RePieChart, Pie, Cell, AreaChart, Area, CartesianGrid, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from 'recharts';
import { ViewState, Event, Ticket, UserRole, Person, ChatConversation, ChatMessage, ScheduleItem, Lead, AnalyticsData, ToastMessage, Comment, Organizer, AIStrategy, UserProfile, Story } from './types';
import { GlassCard, Button, Input, Badge, ToastContainer, Modal } from './components/UI';
import { ChatAssistant } from './components/ChatAssistant';
import { generateEventStrategy } from './services/geminiService';

// --- ENUMS & TYPES EXTENSION ---

enum DashboardTab {
    OVERVIEW = 'OVERVIEW',
    EVENTS = 'EVENTS',
    CRM = 'CRM',
    TASKS = 'TASKS',
    TEAMS = 'TEAMS',
    ANALYTICS = 'ANALYTICS',
    BUILDER = 'BUILDER'
}

// --- MOCK DATA ---

const MOCK_STORIES: Story[] = [
    { id: 'st1', thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=300', mediaUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1080', type: 'image', isViewed: false, title: 'Backstage' },
    { id: 'st2', thumbnail: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=300', mediaUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=1080', type: 'image', isViewed: false, title: 'Hype' },
    { id: 'st3', thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=300', mediaUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1080', type: 'image', isViewed: true, title: 'Setup' },
];

const DEFAULT_USER_PROFILE: UserProfile = {
    id: 'u1',
    name: 'Alex Cyber',
    handle: '@alex_future',
    avatar: 'https://i.pravatar.cc/300?u=alex',
    bio: 'Digital nomad exploring the intersection of art and technology. Always looking for the next neon adventure.',
    role: 'Visual Artist',
    company: 'Freelance',
    stats: {
        eventsAttended: 42,
        connections: 128,
        points: 2400
    },
    stories: MOCK_STORIES
};

const MOCK_SCHEDULE: ScheduleItem[] = [
    { id: 's1', time: '18:00', title: 'Doors Open', description: 'Entry & Security Check', type: 'break' },
    { id: 's2', time: '19:30', title: 'Opening Act: Cyber Punks', description: 'Main Stage', type: 'performance' },
    { id: 's3', time: '21:00', title: 'Headliner: Neon Dreams', description: 'Main Stage - Laser Show', type: 'performance' },
    { id: 's4', time: '23:00', title: 'VIP Afterparty', description: 'Sky Lounge (Access Required)', type: 'vip' },
];

const MOCK_COMMENTS: Comment[] = [
    { id: 'c1', user: 'Alex R.', avatar: 'https://i.pravatar.cc/150?u=10', text: 'Can’t wait for this! 🔥', timestamp: '2m' },
    { id: 'c2', user: 'Sarah K.', avatar: 'https://i.pravatar.cc/150?u=11', text: 'Anyone selling VIP tickets?', timestamp: '15m' },
];

const MOCK_ORGANIZERS: Organizer[] = [
    { id: 'org1', name: 'Future Sounds', avatar: 'https://i.pravatar.cc/150?u=org1', followers: 12500, rating: 4.9, description: 'Pioneering the next generation of audio-visual experiences.', isFollowed: false },
    { id: 'org2', name: 'MoMA', avatar: 'https://i.pravatar.cc/150?u=org2', followers: 850000, rating: 4.8, description: 'Museum of Modern Art.', isFollowed: true },
    { id: 'org3', name: 'TechCrunch', avatar: 'https://i.pravatar.cc/150?u=org3', followers: 200000, rating: 4.7, description: 'Reporting on the business of technology, startups, venture capital funding, and Silicon Valley.', isFollowed: false },
];

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Neon Horizon Festival',
    date: 'Oct 24 • Tokyo',
    location: 'Cyber Arena',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1920',
    price: 150,
    tags: ['Music', 'Tech'],
    description: 'Immerse yourself in a sonic landscape where digital meets physical. The future of sound is here.',
    organizer: MOCK_ORGANIZERS[0],
    venueDetails: 'Tokyo Dome City',
    waitTimeMinutes: 15,
    isResaleAvailable: true,
    schedule: MOCK_SCHEDULE,
    status: 'published',
    likes: 1240,
    attendees: 3500,
    comments: MOCK_COMMENTS,
    stories: MOCK_STORIES,
    hostSocials: { instagram: 'neon_horizon', tiktok: '@neonfest', website: 'neon.events' }
  },
  {
    id: '2',
    title: 'Quantum Art Expo',
    date: 'Nov 12 • NYC',
    location: 'MoMA',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920',
    price: 45,
    tags: ['Art', 'AI'],
    description: 'Witness art generated in real-time by quantum processors.',
    organizer: MOCK_ORGANIZERS[1],
    waitTimeMinutes: 5,
    isResaleAvailable: false,
    schedule: [],
    status: 'published',
    likes: 850,
    attendees: 1200,
    comments: [],
    stories: [MOCK_STORIES[0]],
    hostSocials: { instagram: 'moma_art', website: 'moma.org' }
  },
  {
    id: '3',
    title: 'TechCrunch Disrupt',
    date: 'Jan 15 • SF',
    location: 'Moscone Ctr',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1920',
    price: 299,
    tags: ['Tech', 'Startup'],
    description: 'The world\'s leading authority in debuting revolutionary startups.',
    organizer: MOCK_ORGANIZERS[2],
    waitTimeMinutes: 45,
    isResaleAvailable: true,
    status: 'published',
    likes: 5000,
    attendees: 10000,
    comments: [],
    stories: [],
    hostSocials: { twitter: '@techcrunch', website: 'techcrunch.com' }
  },
  {
    id: '4',
    title: 'Cyber Fashion Week',
    date: 'Feb 20 • Paris',
    location: 'Grand Palais Ephémère',
    image: 'https://images.unsplash.com/photo-1581375074612-d1fd0e661aeb?auto=format&fit=crop&q=80&w=1920',
    price: 500,
    tags: ['Fashion', 'Design'],
    description: 'Holographic runways and AI-generated couture redefining style.',
    organizer: MOCK_ORGANIZERS[0],
    waitTimeMinutes: 10,
    isResaleAvailable: true,
    status: 'published',
    likes: 3200,
    attendees: 1500,
    comments: [],
    stories: [MOCK_STORIES[1], MOCK_STORIES[2]],
    hostSocials: { instagram: 'cyberfashion', website: 'fashion.ai' }
  },
  {
    id: '5',
    title: 'Drone Racing League',
    date: 'Mar 05 • Dubai',
    location: 'Skydive Dubai',
    image: 'https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=1920',
    price: 85,
    tags: ['Sports', 'Tech'],
    description: 'High-speed FPV drone racing through neon obstacles.',
    organizer: MOCK_ORGANIZERS[2],
    waitTimeMinutes: 20,
    isResaleAvailable: true,
    status: 'published',
    likes: 4100,
    attendees: 8000,
    comments: [],
    hostSocials: { tiktok: '@droneracing', website: 'thedroneracingleague.com' }
  },
  {
    id: '6',
    title: 'Neural Link Symposium',
    date: 'Apr 12 • Austin',
    location: 'Giga Factory',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1920',
    price: 1200,
    tags: ['Science', 'Tech'],
    description: 'Direct brain-computer interface demonstrations and future talks.',
    organizer: MOCK_ORGANIZERS[1],
    waitTimeMinutes: 0,
    isResaleAvailable: false,
    status: 'published',
    likes: 9000,
    attendees: 500,
    comments: [],
    hostSocials: { twitter: '@neuralink', website: 'neuralink.com' }
  }
];

const MOCK_PEOPLE: Person[] = [
    { id: '1', name: 'Sarah Connor', role: 'UX Designer', company: 'CyberDyne', image: 'https://i.pravatar.cc/150?u=1', interests: ['AI', 'Design'] },
    { id: '2', name: 'John Smith', role: 'Investor', company: 'Goldman', image: 'https://i.pravatar.cc/150?u=2', interests: ['Fintech', 'Crypto'] },
    { id: '3', name: 'Aiko Tanaka', role: 'Developer', company: 'Nintendo', image: 'https://i.pravatar.cc/150?u=3', interests: ['Gaming', 'VR'] },
    { id: '4', name: 'Mike Chen', role: 'Artist', company: 'Freelance', image: 'https://i.pravatar.cc/150?u=4', interests: ['Art', 'Music'] },
];

const MOCK_CHATS: ChatConversation[] = [
    { id: 'c1', type: 'event_group', name: 'Neon Horizon Community', lastMessage: 'Anyone going to the afterparty?', avatar: MOCK_EVENTS[0].image, unreadCount: 12, eventId: '1' },
    { id: 'c2', type: 'direct', name: 'Sarah Connor', lastMessage: 'Hey! Are you at the main stage?', avatar: MOCK_PEOPLE[0].image, unreadCount: 1, participantId: '1' },
    { id: 'c3', type: 'event_group', name: 'Marketing Team', lastMessage: 'Ad spend approved for Q4', avatar: 'https://i.pravatar.cc/150?u=mt', unreadCount: 5 },
    { id: 'c4', type: 'event_group', name: 'Ops Team', lastMessage: 'Security check complete', avatar: 'https://i.pravatar.cc/150?u=ot', unreadCount: 0 },
];

const MOCK_LEADS: (Lead & { ltv: number, history: string[], phone: string, lastInteraction: string, preferredCategory: string })[] = [
    { id: 'l1', name: 'Alex Rivera', email: 'alex@example.com', phone: '+1 555-0192', status: 'interested', source: 'social', automationStep: 'reminder_sent', conversionProb: 65, ltv: 150, history: ['Viewed "Neon Horizon"', 'Clicked "VIP"'], lastInteraction: 'Opened Email', preferredCategory: 'Music' },
    { id: 'l2', name: 'Jamie Lee', email: 'jamie@tech.co', phone: '+1 555-0394', status: 'purchased', source: 'referral', automationStep: 'upsell_queued', conversionProb: 100, ltv: 450, history: ['Purchased "TechCrunch" VIP', 'Attended "AI Summit"'], lastInteraction: 'Bought Ticket', preferredCategory: 'Tech' },
    { id: 'l3', name: 'Sam Altman', email: 'sam@openai.com', phone: '+1 555-0001', status: 'vip', source: 'organic', automationStep: 'completed', conversionProb: 100, ltv: 5000, history: ['Speaker at "Global AI"', 'Purchased "Mars Talk" Front Row'], lastInteraction: 'Meeting', preferredCategory: 'Tech' },
    { id: 'l4', name: 'Jessica Day', email: 'jess@newgirl.com', phone: '+1 555-0123', status: 'abandoned_cart', source: 'ads', automationStep: 'welcome_sent', conversionProb: 35, ltv: 0, history: ['Added "Quantum Art" to cart', 'Abandonded cart'], lastInteraction: 'Site Visit', preferredCategory: 'Art' },
    { id: 'l5', name: 'Nick Miller', email: 'nick@bar.com', phone: '+1 555-0999', status: 'interested', source: 'social', automationStep: 'reminder_sent', conversionProb: 60, ltv: 50, history: ['Subscribed to newsletter'], lastInteraction: 'Click Link', preferredCategory: 'Music' },
];

const MOCK_ANALYTICS: AnalyticsData = {
    totalViews: 12500,
    totalSales: 480,
    conversionRate: 3.8,
    revenue: 72000,
    trafficSources: [
        { name: 'Instagram', value: 45, color: '#E1306C' },
        { name: 'Google Ads', value: 25, color: '#4285F4' },
        { name: 'Direct', value: 20, color: '#34A853' },
        { name: 'Referral', value: 10, color: '#FBBC05' },
    ],
    salesOverTime: [
        { name: 'Mon', value: 4000 },
        { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 7000 },
        { name: 'Thu', value: 12000 },
        { name: 'Fri', value: 18000 },
    ],
    conversionFunnel: [
        { stage: 'Impressions', count: 12500 },
        { stage: 'Page Views', count: 5600 },
        { stage: 'Add to Cart', count: 1200 },
        { stage: 'Checkout', count: 800 },
        { stage: 'Purchase', count: 480 },
    ]
};

// New Data for Analytics Deep Dive
const MOCK_REVENUE_COMPARISON = [
    { name: 'Neon Horizon', primary: 45000, resale: 12000 },
    { name: 'Quantum Art', primary: 28000, resale: 5000 },
    { name: 'TechCrunch', primary: 85000, resale: 32000 },
    { name: 'Cyber Fashion', primary: 55000, resale: 15000 },
];

const MOCK_SALES_FORECAST = [
    { name: 'Week 1', sales: 12000, forecast: 12000 },
    { name: 'Week 2', sales: 15000, forecast: 14500 },
    { name: 'Week 3', sales: 18000, forecast: 19000 },
    { name: 'Week 4', sales: 0, forecast: 24000 },
    { name: 'Week 5', sales: 0, forecast: 28000 },
];

const MOCK_PEAK_TRAFFIC = [
    { time: '00:00', visitors: 120 }, { time: '04:00', visitors: 50 },
    { time: '08:00', visitors: 450 }, { time: '12:00', visitors: 1200 },
    { time: '16:00', visitors: 980 }, { time: '20:00', visitors: 2100 },
    { time: '23:59', visitors: 400 },
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: 't1',
    eventId: '1',
    purchaseDate: '2025-09-10',
    status: 'active',
    qrCodeData: 'ventyr-ticket-valid-23948',
    pricePaid: 150
  }
];

const MOCK_TASKS = [
    { id: 't1', text: "Approve 'Summer Vibes' ad creative", due: 'Today', status: 'pending', department: 'Marketing' },
    { id: 't2', text: "Finalize catering for VIP lounge", due: 'Tomorrow', status: 'pending', department: 'Operations' },
    { id: 't3', text: "Review security protocol", due: 'Fri', status: 'done', department: 'Operations' },
    { id: 't4', text: "Fix ticketing gateway bug", due: 'ASAP', status: 'pending', department: 'Tech' },
    { id: 't5', text: "Update app graphics", due: 'Mon', status: 'pending', department: 'Tech' },
];

const MOCK_ADS = [
    { id: 'ad1', name: 'Insta Story - Hype', platform: 'Instagram', spend: 1200, roas: 4.2, status: 'active', impressions: 45000, clicks: 1200, ctr: 2.6 },
    { id: 'ad2', name: 'Google Search - KW', platform: 'Google', spend: 800, roas: 2.5, status: 'active', impressions: 12000, clicks: 800, ctr: 6.6 },
    { id: 'ad3', name: 'TikTok Influencer', platform: 'TikTok', spend: 2000, roas: 5.1, status: 'paused', impressions: 80000, clicks: 5400, ctr: 6.7 },
];

const MOCK_TEAMS = [
    { id: 'tm1', name: 'Marketing', activeTasks: 12, completedTasks: 45, members: 4, progress: 75 },
    { id: 'tm2', name: 'Operations', activeTasks: 8, completedTasks: 120, members: 8, progress: 90 },
    { id: 'tm3', name: 'Tech', activeTasks: 24, completedTasks: 200, members: 6, progress: 60 },
];

const MOCK_RESALE_TICKETS = [
    { id: 'rt1', eventId: '1', price: 140, originalPrice: 150, seat: 'General Admission' },
    { id: 'rt2', eventId: '1', price: 135, originalPrice: 150, seat: 'General Admission' },
    { id: 'rt3', eventId: '3', price: 250, originalPrice: 299, seat: 'Row 12' },
];

// --- COMPONENTS ---

const ParallaxImage: React.FC<{ src: string, className?: string, speed?: number }> = ({ src, className, speed = 0.5 }) => {
    const ref = useRef<HTMLImageElement>(null);
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const scrollParent = element.closest('.overflow-y-scroll') || element.closest('.overflow-y-auto') || document.documentElement;
        if (!scrollParent) return;
        let ticking = false;
        const update = () => {
            if (!element) return;
            const parentRect = (scrollParent instanceof Element) ? scrollParent.getBoundingClientRect() : { top: 0 };
            const elementRect = element.parentElement?.getBoundingClientRect(); 
            if (elementRect) {
                const relativeY = elementRect.top - parentRect.top;
                element.style.transform = `translateY(${relativeY * speed}px) scale(1.15)`;
            }
            ticking = false;
        };
        const onScroll = () => { if (!ticking) { window.requestAnimationFrame(update); ticking = true; } };
        scrollParent.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll);
        update();
        return () => { scrollParent.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
    }, [src, speed]);
    return <img ref={ref} src={src} className={`${className} will-change-transform transition-transform duration-75 ease-out`} alt="Event" />;
};

const StoryViewer: React.FC<{ stories: Story[], onClose: () => void }> = ({ stories, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const story = stories[currentIndex];
    useEffect(() => {
        const timer = setTimeout(() => { if (currentIndex < stories.length - 1) setCurrentIndex(c => c + 1); else onClose(); }, 3000);
        return () => clearTimeout(timer);
    }, [currentIndex, stories.length, onClose]);
    const handleNext = (e: React.MouseEvent) => { e.stopPropagation(); if (currentIndex < stories.length - 1) setCurrentIndex(c => c + 1); else onClose(); };
    const handlePrev = (e: React.MouseEvent) => { e.stopPropagation(); if (currentIndex > 0) setCurrentIndex(c => c - 1); };
    return (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
            <div className="absolute top-4 right-4 z-10"><button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white"><XIcon /></button></div>
            <div className="absolute top-4 left-4 right-16 flex gap-1 z-10">
                {stories.map((s, idx) => (
                    <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div className={`h-full bg-white transition-all duration-300 ease-linear ${idx < currentIndex ? 'w-full' : idx === currentIndex ? 'w-full animate-[width_3s_linear]' : 'w-0'}`}></div>
                    </div>
                ))}
            </div>
            <div className="relative w-full h-full md:max-w-md md:aspect-[9/16] bg-black">
                <img src={story.mediaUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
                <div className="absolute bottom-8 left-6 text-white"><h3 className="text-xl font-bold mb-1">{story.title}</h3><p className="text-sm opacity-80">Posted 2h ago</p></div>
                <div className="absolute inset-y-0 left-0 w-1/3 z-0" onClick={handlePrev}></div><div className="absolute inset-y-0 right-0 w-2/3 z-0" onClick={handleNext}></div>
            </div>
        </div>
    );
};

const StoryBubbles: React.FC<{ stories: Story[], onOpen: () => void }> = ({ stories, onOpen }) => {
    if (!stories || stories.length === 0) return null;
    return (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pl-4">
            {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={onOpen}>
                    <div className="w-[68px] h-[68px] rounded-full p-[2px] bg-gradient-to-tr from-neon-blue to-neon-purple group-hover:scale-105 transition-transform">
                        <img src={story.thumbnail} className="w-full h-full rounded-full object-cover border-4 border-dark-bg" />
                    </div>
                    <span className="text-[11px] text-text-tertiary truncate w-16 text-center font-medium">{story.title}</span>
                </div>
            ))}
        </div>
    );
}

const EditProfileModal: React.FC<{ isOpen: boolean, onClose: () => void, profile: UserProfile, onSave: (p: UserProfile) => void }> = ({ isOpen, onClose, profile, onSave }) => {
    const [formData, setFormData] = useState(profile);
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <div className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                    <div className="relative"><img src={formData.avatar} className="w-24 h-24 rounded-full border-2 border-neon-blue" /><button className="absolute bottom-0 right-0 p-2 bg-neon-blue rounded-full text-white"><Camera className="w-4 h-4" /></button></div>
                </div>
                <Input label="Display Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <Input label="Handle" value={formData.handle} onChange={e => setFormData({...formData, handle: e.target.value})} />
                <Input label="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                <Input label="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                <div>
                    <label className="text-xs text-text-tertiary mb-1 block">Bio</label>
                    <textarea className="w-full bg-[#0F1316] border border-white/10 rounded-xl p-3 text-white text-[16px] focus:border-neon-blue outline-none" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3} />
                </div>
                <Button className="w-full" onClick={() => { onSave(formData); onClose(); }}>Save Changes</Button>
            </div>
        </Modal>
    );
}

const ProfileScreen: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void, setView: (v: ViewState) => void, myTickets: Ticket[], events: Event[], likedEvents: Event[], connections: Person[] }> = ({ profile, setProfile, setView, myTickets, events, likedEvents, connections }) => {
    const [activeTab, setActiveTab] = useState<'history' | 'likes' | 'network'>('history');
    const [isEditing, setIsEditing] = useState(false);
    const [viewingStory, setViewingStory] = useState(false);
    const pastEvents = myTickets.map(t => events.find(e => e.id === t.eventId)).filter(e => e !== undefined) as Event[];
    return (
        <div className="min-h-screen bg-dark-bg p-6 pb-24 overflow-y-auto">
            <EditProfileModal isOpen={isEditing} onClose={() => setIsEditing(false)} profile={profile} onSave={setProfile} />
            {viewingStory && <StoryViewer stories={profile.stories} onClose={() => setViewingStory(false)} />}
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">My Profile</h2>
                <div className="flex gap-2">
                    <Button variant="ghost" className="!p-2 text-neon-purple border border-neon-purple/20 bg-neon-purple/10" onClick={() => setView(ViewState.ORGANIZER_DASHBOARD)}><LayoutGrid className="w-5 h-5" /></Button>
                    <Button variant="ghost" className="!p-2" onClick={() => setIsEditing(true)}><Edit3 className="w-5 h-5" /></Button>
                </div>
            </div>
            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4 cursor-pointer" onClick={() => profile.stories.length > 0 && setViewingStory(true)}>
                    <div className="p-[3px] rounded-full bg-gradient-to-tr from-neon-blue via-neon-purple to-neon-blue animate-pulse-slow">
                        <img src={profile.avatar} className="w-24 h-24 rounded-full border-4 border-dark-bg object-cover" />
                    </div>
                    {profile.stories.length > 0 && (<div className="absolute bottom-0 right-0 bg-dark-bg rounded-full p-1"><div className="bg-neon-blue rounded-full p-1"><Plus className="w-3 h-3 text-white" /></div></div>)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{profile.name}</h3>
                <p className="text-neon-blue text-sm mb-2">{profile.handle}</p>
                <p className="text-text-tertiary text-center text-sm max-w-xs mb-4">{profile.bio}</p>
                <div className="flex gap-2 mb-6"><Badge color="blue">{profile.role}</Badge><Badge color="purple">{profile.company}</Badge></div>
                <div className="flex justify-center gap-8 w-full border-t border-white/10 py-4">
                    <div className="text-center"><p className="text-lg font-bold text-white">{pastEvents.length}</p><p className="text-[10px] text-text-tertiary uppercase tracking-wider">Events</p></div>
                    <div className="text-center"><p className="text-lg font-bold text-white">{connections.length}</p><p className="text-[10px] text-text-tertiary uppercase tracking-wider">Network</p></div>
                    <div className="text-center"><p className="text-lg font-bold text-white">{profile.stats.points}</p><p className="text-[10px] text-text-tertiary uppercase tracking-wider">Points</p></div>
                </div>
            </div>
            {profile.stories.length > 0 && (<div className="mb-8"><h4 className="text-sm font-bold text-white mb-3">My Stories</h4><StoryBubbles stories={profile.stories} onOpen={() => setViewingStory(true)} /></div>)}
            <div className="flex p-1 bg-dark-surface rounded-xl mb-6 border border-white/[0.03]">
                <button onClick={() => setActiveTab('history')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'history' ? 'bg-white/10 text-white shadow-lg' : 'text-text-tertiary'}`}>History</button>
                <button onClick={() => setActiveTab('likes')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'likes' ? 'bg-white/10 text-white shadow-lg' : 'text-text-tertiary'}`}>Likes</button>
                <button onClick={() => setActiveTab('network')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'network' ? 'bg-white/10 text-white shadow-lg' : 'text-text-tertiary'}`}>Network</button>
            </div>
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                {activeTab === 'history' && (pastEvents.length > 0 ? pastEvents.map(event => (<div key={event.id} className="flex gap-4 items-center bg-dark-surface p-3 rounded-xl border border-white/[0.03]"><img src={event.image} className="w-16 h-16 rounded-lg object-cover grayscale opacity-70" /><div><h4 className="font-bold text-white text-sm">{event.title}</h4><p className="text-xs text-text-secondary">{event.date} • {event.location}</p><div className="flex gap-1 mt-1"><Badge color="gray" className="text-[9px] py-0">Attended</Badge></div></div></div>)) : <p className="text-center text-text-tertiary py-8">No event history yet.</p>)}
                {activeTab === 'likes' && (likedEvents.length > 0 ? likedEvents.map(event => (<div key={event.id} className="flex gap-4 items-center bg-dark-surface p-3 rounded-xl border border-white/[0.03] cursor-pointer" onClick={() => {}}><img src={event.image} className="w-16 h-16 rounded-lg object-cover" /><div><h4 className="font-bold text-white text-sm">{event.title}</h4><p className="text-xs text-text-secondary">{event.date}</p><Button variant="secondary" className="h-6 text-[10px] px-2 mt-2">View</Button></div></div>)) : <p className="text-center text-text-tertiary py-8">No liked events yet.</p>)}
                {activeTab === 'network' && (connections.length > 0 ? connections.map(person => (<div key={person.id} className="flex items-center justify-between bg-dark-surface p-3 rounded-xl border border-white/[0.03]"><div className="flex items-center gap-3"><img src={person.image} className="w-10 h-10 rounded-full" /><div><h4 className="font-bold text-white text-sm">{person.name}</h4><p className="text-[10px] text-text-secondary">{person.role} @ {person.company}</p></div></div><Button variant="ghost" className="!p-2"><MessageCircle className="w-4 h-4 text-neon-blue"/></Button></div>)) : <p className="text-center text-text-tertiary py-8">No connections yet.</p>)}
            </div>
        </div>
    );
};

const OnboardingScreen: React.FC<{ setUserRole: (r: UserRole) => void, setView: (v: ViewState) => void }> = ({ setUserRole, setView }) => (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-dark-bg">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>
      </div>
      <div className="relative z-10 text-center space-y-8 p-6 max-w-md animate-in fade-in zoom-in duration-700">
        <div className="inline-block p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-neon-blue/30 shadow-float animate-float">
          <TicketIcon className="w-16 h-16 text-neon-pink" />
        </div>
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 brand-gradient bg-clip-text text-transparent drop-shadow-sm">Ventyr</h1>
          <p className="text-text-secondary text-lg">The future of live experiences.</p>
        </div>
        <div className="flex flex-col gap-4 w-full">
            <Button onClick={() => { setUserRole('USER'); setView(ViewState.DISCOVER); }} variant="primary" className="w-full text-lg h-14">
            Enter as User <ArrowRight className="w-5 h-5" />
            </Button>
            <Button onClick={() => { setUserRole('ORGANIZER'); setView(ViewState.ORGANIZER_DASHBOARD); }} variant="secondary" className="w-full text-lg h-14">
            Event Manager
            </Button>
        </div>
      </div>
    </div>
);
// --- PROJECT OVERVIEW SCREEN ---
const ProjectOverviewScreen: React.FC<{ setView: (v: ViewState) => void, setUserRole: (r: UserRole) => void }> = ({ setView, setUserRole }) => {
    const features = [
        { icon: <TicketIcon className="w-6 h-6" />, title: 'Smart Ticketing', description: 'Buy, sell, and manage tickets with built-in resale marketplace' },
        { icon: <BrainCircuit className="w-6 h-6" />, title: 'AI-Powered', description: 'Gemini AI assistant helps discover events and answers questions' },
        { icon: <Users className="w-6 h-6" />, title: 'Social Features', description: 'Chat with attendees, follow organizers, and build your network' },
        { icon: <BarChart3 className="w-6 h-6" />, title: 'Organizer Dashboard', description: 'Full event management with analytics, CRM, and AI marketing tools' },
        { icon: <Sparkles className="w-6 h-6" />, title: 'Modern UI', description: 'Futuristic mobile-first design with smooth animations' },
        { icon: <MapIcon className="w-6 h-6" />, title: 'Event Discovery', description: 'TikTok-style vertical swipe feed to discover events' },
    ];

    return (
        <div className="min-h-screen bg-dark-bg overflow-y-auto">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 text-center px-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="inline-block p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-neon-blue/30 shadow-float animate-float mb-8">
                        <TicketIcon className="w-20 h-20 text-neon-pink" />
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4 brand-gradient bg-clip-text text-transparent drop-shadow-sm">Ventyr 3.0</h1>
                    <p className="text-text-secondary text-xl md:text-2xl mb-2 max-w-2xl mx-auto">AI-Powered Event Ecosystem</p>
                    <p className="text-text-tertiary text-base md:text-lg max-w-xl mx-auto mb-8">A futuristic, mobile-first platform for discovering, buying, and reselling event tickets — powered by Gemini AI.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => { setUserRole('USER'); setView(ViewState.DISCOVER); }} variant="primary" className="text-lg h-14 px-8">
                            Explore Events <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button onClick={() => { setUserRole('ORGANIZER'); setView(ViewState.ORGANIZER_DASHBOARD); }} variant="secondary" className="text-lg h-14 px-8">
                            Organizer Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="px-6 py-16 max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Key Features</h2>
                <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">Everything you need to discover events, manage tickets, and connect with the community.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-dark-surface border border-white/[0.05] rounded-2xl p-6 hover:border-neon-blue/30 transition-all hover:shadow-neon-brand group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-neon-blue mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-text-secondary text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack Section */}
            <div className="px-6 py-16 bg-dark-surface/50 border-y border-white/[0.03]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built With Modern Tech</h2>
                    <p className="text-text-secondary mb-8">Powered by cutting-edge technologies for the best experience.</p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Gemini AI', 'Recharts', 'Lucide Icons'].map((tech) => (
                            <span key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-text-secondary text-sm hover:border-neon-blue/30 hover:text-white transition-all">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Flows Section */}
            <div className="px-6 py-16 max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Two Experiences, One Platform</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div
                        className="bg-dark-surface border border-white/[0.05] rounded-2xl p-8 hover:border-neon-blue/30 transition-all cursor-pointer group"
                        onClick={() => { setUserRole('USER'); setView(ViewState.DISCOVER); }}
                    >
                        <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Attendee Experience</h3>
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> Discover events with vertical swipe feed</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> Buy and manage tickets</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> Resale marketplace for tickets</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> Chat with attendees and organizers</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> AI assistant for recommendations</li>
                        </ul>
                        <Button variant="ghost" className="mt-6 group-hover:text-neon-blue">
                            Enter as Attendee <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <div
                        className="bg-dark-surface border border-white/[0.05] rounded-2xl p-8 hover:border-neon-purple/30 transition-all cursor-pointer group"
                        onClick={() => { setUserRole('ORGANIZER'); setView(ViewState.ORGANIZER_DASHBOARD); }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <LayoutGrid className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Organizer Dashboard</h3>
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> Full event management suite</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> Real-time analytics and insights</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> CRM with lead tracking</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> AI-powered marketing strategies</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neon-green" /> Team collaboration tools</li>
                        </ul>
                        <Button variant="ghost" className="mt-6 group-hover:text-neon-purple">
                            Enter as Organizer <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-20 text-center bg-gradient-to-b from-transparent to-dark-surface/50">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Experience the Future?</h2>
                <p className="text-text-secondary mb-8 max-w-xl mx-auto">Join Ventyr and discover a new way to experience live events.</p>
                <Button onClick={() => { setUserRole('USER'); setView(ViewState.DISCOVER); }} variant="primary" className="text-lg h-14 px-10">
                    Get Started <Sparkles className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
};
// --- NEW ORGANIZER PROFILE VIEW ---
const OrganizerProfileView: React.FC<{ organizer: Organizer, events: Event[], onBack: () => void }> = ({ organizer, events, onBack }) => {
    const orgEvents = events.filter(e => e.organizer.id === organizer.id);
    
    return (
        <div className="h-full bg-dark-bg overflow-y-auto pb-24 relative p-6">
            <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 z-20">
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <div className="flex flex-col items-center mt-12 mb-8 animate-in fade-in slide-in-from-bottom-5">
                <img src={organizer.avatar} className="w-28 h-28 rounded-full border-4 border-neon-blue shadow-neon-brand object-cover mb-4" />
                <h2 className="text-2xl font-bold text-white mb-1">{organizer.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-bold">{organizer.rating}</span>
                    <span className="text-gray-500">• {organizer.followers.toLocaleString()} Followers</span>
                </div>
                <p className="text-center text-text-secondary max-w-sm mb-6">{organizer.description}</p>
                <div className="flex gap-3 w-full max-w-xs">
                     <Button className="flex-1 h-10 text-sm">Follow</Button>
                     <Button variant="secondary" className="flex-1 h-10 text-sm">Message</Button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-4">Upcoming Events</h3>
            <div className="space-y-4">
                {orgEvents.map(e => (
                    <div key={e.id} className="flex gap-4 items-center bg-dark-surface p-3 rounded-xl border border-white/[0.03]">
                        <img src={e.image} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                            <h4 className="font-bold text-white text-sm">{e.title}</h4>
                            <p className="text-xs text-text-secondary">{e.date} • {e.location}</p>
                            <div className="flex gap-1 mt-1">
                                <Badge color="blue" className="text-[9px] py-0">{e.tags[0]}</Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const MusicIcon = (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);

const EventDetailView: React.FC<{ event: Event, onBack: () => void, onBuy: () => void, currentUser: UserProfile, onOpenOrganizer: (o: Organizer) => void, onGroupChat: () => void, onResell: () => void, myTickets: Ticket[] }> = ({ event, onBack, onBuy, currentUser, onOpenOrganizer, onGroupChat, onResell, myTickets }) => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Timeline' | 'Tickets' | 'My Ticket'>('Overview');
    const hasTicket = myTickets.some(t => t.eventId === event.id);

    // Update tab selection if ticket status changes
    useEffect(() => {
        if(hasTicket && activeTab === 'Tickets') {
            setActiveTab('My Ticket');
        }
    }, [hasTicket, activeTab]);

    return (
        <div className="h-full bg-dark-bg overflow-y-auto pb-32 relative">
            {/* Hero Image */}
            <div className="relative h-80 w-full">
                <ParallaxImage src={event.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-black/30"></div>
                <button onClick={onBack} className="absolute top-14 left-6 p-3 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 z-20">
                    <ChevronLeft className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Content Container - overlapping image slightly */}
            <div className="relative -mt-10 bg-dark-bg rounded-t-[32px] px-6 pt-8 pb-4 animate-in slide-in-from-bottom-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                
                {/* Event Title & Date & Status */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white leading-tight mb-2">{event.title}</h1>
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{event.date}</span>
                    </div>
                    {/* 1.1 Status Badge Relocated */}
                    <Badge color="red" className="bg-orange-500/20 text-orange-400 border-orange-500/30 self-start inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Current Status: {event.waitTimeMinutes}m Wait
                    </Badge>
                </div>

                {/* Host Card with Follow Button */}
                <div className="flex items-center justify-between bg-[#15171B] p-3 rounded-2xl mb-6 border border-white/[0.05]">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onOpenOrganizer(event.organizer)}>
                        <img src={event.organizer.avatar} className="w-10 h-10 rounded-full border border-white/10 object-cover"/>
                        <div>
                            <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">Hosted By</p>
                            <p className="text-sm font-bold text-white">{event.organizer.name}</p>
                        </div>
                    </div>
                    {/* 1.2 Follow Button */}
                    <Button variant="blue" className="!h-8 !px-4 text-xs font-bold bg-[#4B6BFF]/10 text-[#4B6BFF] hover:bg-[#4B6BFF]/20">+ Follow</Button>
                </div>

                {/* 3.2 External Links (Scrollable Buttons) */}
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar mb-6">
                    {event.hostSocials?.instagram && (
                        <Button variant="secondary" onClick={() => window.open(`https://instagram.com/${event.hostSocials?.instagram}`, '_blank')} className="!h-10 text-xs whitespace-nowrap bg-[#1A1D21] border-white/5">
                            <Instagram className="w-4 h-4 mr-2"/> Instagram
                        </Button>
                    )}
                    <Button variant="secondary" className="!h-10 text-xs whitespace-nowrap bg-[#1A1D21] border-white/5">
                        <MusicIcon className="w-4 h-4 mr-2"/> Lineup Playlist
                    </Button>
                    {event.hostSocials?.website && (
                        <Button variant="secondary" onClick={() => window.open(`https://${event.hostSocials?.website}`, '_blank')} className="!h-10 text-xs whitespace-nowrap bg-[#1A1D21] border-white/5">
                            <Globe className="w-4 h-4 mr-2"/> Official Website
                        </Button>
                    )}
                </div>

                {/* 2.1 Social Proof (Enhanced) */}
                <div className="flex items-center justify-between bg-[#15171B] p-4 rounded-2xl mb-6 cursor-pointer hover:bg-white/5 transition-colors border border-white/[0.05]">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                             {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-gray-700 border-2 border-[#15171B] bg-cover" style={{backgroundImage: `url(https://i.pravatar.cc/100?u=${i+10})`}}></div>)}
                        </div>
                        <div>
                             <p className="text-sm font-bold text-white">{event.attendees > 1000 ? (event.attendees/1000).toFixed(1) + 'k' : event.attendees} Attendees</p>
                             <p className="text-xs text-neon-blue font-medium">Who's going?</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-disabled"/>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Button variant="ghost" onClick={onGroupChat} className="border border-neon-blue text-neon-blue bg-neon-blue/5 hover:bg-neon-blue/10 h-[48px] rounded-xl text-sm font-semibold">
                        <MessageSquare className="w-4 h-4 mr-2"/> Group Chat
                    </Button>
                    {/* 2.2 Resell Market Count */}
                    <Button variant="secondary" onClick={onResell} className="h-[48px] rounded-xl text-sm font-semibold border-white/10 text-white bg-[#1A1D21] hover:bg-white/10 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 mr-2"/> Resell <span className="text-neon-green ml-1 font-bold">(+12)</span>
                    </Button>
                </div>

                {/* 3.1 Segmented Control Tabs */}
                <div className="bg-[#15171B] p-1 rounded-xl flex mb-6">
                    {['Overview', 'Timeline', hasTicket ? 'My Ticket' : 'Tickets'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setActiveTab(t as any)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center ${activeTab === t ? 'bg-[#2C3036] text-white shadow-sm' : 'text-text-tertiary hover:text-white'}`}
                        >
                            {t === 'My Ticket' && <CheckCircle2 className="w-3 h-3 mr-1 text-neon-green" />}
                            {t}
                        </button>
                    ))}
                </div>

                {/* Overview Content */}
                {activeTab === 'Overview' && (
                    <div className="space-y-6 animate-in fade-in">
                        {/* 4.1 Compact Map View */}
                        <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-[#15171B] border border-white/10 group">
                            {/* Dark map visual placeholder */}
                            <div className="absolute inset-0 bg-[#0D1113] bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-122.4,37.7,14,0,0/800x400?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-60"></div>
                            
                            {/* Pin */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neon-blue">
                                <MapPin className="w-8 h-8 fill-neon-blue/20" />
                            </div>

                            {/* Map Info Overlay */}
                            <div className="absolute bottom-3 left-4">
                                <h4 className="text-white font-bold text-sm">{event.location}</h4>
                            </div>

                            {/* 4.2 Enhanced Directions CTA */}
                            <button 
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, '_blank')}
                                className="absolute bottom-3 right-3 bg-neon-blue text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-lg hover:bg-neon-blue/80 flex items-center gap-1.5 transition-all active:scale-95"
                            >
                                <NavigationIcon className="w-3 h-3 stroke-[3px]"/> Get Directions
                            </button>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
                        </div>
                    </div>
                )}

                {/* Timeline Content */}
                {activeTab === 'Timeline' && (
                    <div className="space-y-6 animate-in fade-in pl-2">
                         {event.schedule && event.schedule.length > 0 ? (
                             <div className="space-y-6 border-l-2 border-white/10 ml-2">
                                {event.schedule.map((item) => (
                                    <div key={item.id} className="relative pl-6">
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-dark-bg ${item.type === 'performance' ? 'bg-neon-blue' : item.type === 'vip' ? 'bg-neon-purple' : 'bg-gray-600'}`}></div>
                                        <span className="text-xs font-mono text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded mb-1 inline-block">{item.time}</span>
                                        <h4 className="font-bold text-white text-base">{item.title}</h4>
                                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                    </div>
                                ))}
                             </div>
                         ) : (
                             <div className="text-center py-10 text-gray-500">
                                 <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                                 <p>Schedule to be announced.</p>
                             </div>
                         )}
                    </div>
                )}

                {/* Tickets Content (Standard) */}
                {activeTab === 'Tickets' && (
                    <div className="space-y-4 animate-in fade-in">
                         <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center group cursor-pointer hover:border-neon-blue/50 transition-colors">
                             <div className="flex gap-4 items-center">
                                 <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                                     <TicketIcon className="w-6 h-6"/>
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-white">General Admission</h4>
                                     <p className="text-xs text-gray-400">Standard entry to all areas</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="font-bold text-xl text-white">${event.price}</p>
                                 <span className="text-[10px] text-green-400">Available</span>
                             </div>
                         </div>

                         <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center opacity-60 grayscale cursor-not-allowed">
                             <div className="flex gap-4 items-center">
                                 <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                                     <Star className="w-6 h-6"/>
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-white">VIP Experience</h4>
                                     <p className="text-xs text-gray-400">Skip the line + Lounge Access</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="font-bold text-xl text-white">${event.price * 2}</p>
                                 <span className="text-[10px] text-red-400">Sold Out</span>
                             </div>
                         </div>
                    </div>
                )}

                {/* My Ticket Content (Personalized) */}
                {activeTab === 'My Ticket' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-gradient-to-br from-[#15171B] to-[#0B0C0F] p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3">
                                <div className="w-20 h-20 bg-neon-green/10 rounded-full blur-2xl"></div>
                            </div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-xs text-text-tertiary uppercase font-bold tracking-wider mb-1">Event</p>
                                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                                </div>
                                <div className="bg-neon-green/20 text-neon-green px-2 py-1 rounded text-[10px] font-bold border border-neon-green/30">
                                    CONFIRMED
                                </div>
                            </div>
                            <div className="border-t border-dashed border-white/10 my-4"></div>
                            <div className="flex justify-center py-4">
                                <div className="w-48 h-48 bg-white p-2 rounded-xl">
                                    <div className="w-full h-full bg-black pattern-dots opacity-20"></div>
                                    {/* Mock QR */}
                                </div>
                            </div>
                            <p className="text-center text-xs text-gray-500 font-mono mt-2">Ticket ID: 8X92-2938-44</p>
                            <Button variant="secondary" className="w-full mt-6 h-10 text-xs">Add to Apple Wallet</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Bottom Bar CTA */}
            {activeTab !== 'My Ticket' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0B0C0F]/80 backdrop-blur-2xl border-t border-white/10 z-50 pb-8 animate-in slide-in-from-bottom-full duration-500">
                    <div className="max-w-md mx-auto">
                        <Button 
                            className="w-full h-[60px] rounded-2xl text-lg font-bold shadow-[0_0_40px_rgba(75,107,255,0.3)] hover:shadow-[0_0_60px_rgba(75,107,255,0.5)] transition-all transform active:scale-[0.98] border border-white/10 flex justify-between px-8" 
                            onClick={onBuy}
                        >
                            <span>Get Tickets</span>
                            <span className="bg-black/20 px-3 py-1 rounded-lg text-white/90 font-mono">${event.price}</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper for Navigation Icon
const NavigationIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
);

// --- MANAGER HUB SUB-COMPONENTS ---

const LeadDetailModal: React.FC<{ lead: Lead | null, onClose: () => void, onAction: (type: 'email' | 'sms', lead: Lead) => void }> = ({ lead, onClose, onAction }) => {
    if (!lead) return null;
    return (
        <Modal isOpen={!!lead} onClose={onClose} title="Lead Details">
            <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xl font-bold">{lead.name.charAt(0)}</div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                        <p className="text-text-tertiary">{lead.email}</p>
                        <p className="text-text-tertiary text-sm">{lead.phone}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                     <div className="bg-white/5 p-3 rounded-lg"><p className="text-xs text-gray-500">LTV</p><p className="text-lg font-bold text-green-400">${(lead as any).ltv}</p></div>
                     <div className="bg-white/5 p-3 rounded-lg"><p className="text-xs text-gray-500">Conversion Prob</p><p className="text-lg font-bold text-neon-blue">{lead.conversionProb}%</p></div>
                </div>
                <div>
                    <p className="text-sm font-bold text-white mb-2">History</p>
                    <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1">
                        {(lead as any).history.map((h: string, i: number) => <li key={i}>{h}</li>)}
                    </ul>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button variant="secondary" className="flex-1 text-sm h-10" onClick={() => onAction('email', lead)}><Mail className="w-4 h-4 mr-2"/> Email</Button>
                    <Button variant="secondary" className="flex-1 text-sm h-10" onClick={() => onAction('sms', lead)}><MessageSquare className="w-4 h-4 mr-2"/> SMS</Button>
                </div>
            </div>
        </Modal>
    )
}

const AIComposerModal: React.FC<{ isOpen: boolean, onClose: () => void, type: 'email' | 'sms', target: string }> = ({ isOpen, onClose, type, target }) => {
    const [prompt, setPrompt] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        if(!prompt) return;
        setIsGenerating(true);
        // Mock AI Generation
        setTimeout(() => {
            setGeneratedText(type === 'email' 
                ? `Subject: Exclusive Offer for ${target}\n\nHi ${target},\n\nWe noticed you checked out our VIP packages. Since you're a valued fan, here is a 10% discount code just for you.\n\nSee you there!` 
                : `Hey ${target}! Don't miss out on Neon Horizon. Tickets are selling fast! 🎟️`);
            setIsGenerating(false);
        }, 1500);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`AI ${type === 'email' ? 'Email' : 'SMS'} Composer`}>
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Describe what you want to say</label>
                    <Input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="E.g. Send a reminder about early bird ending..." />
                </div>
                <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!prompt} className="w-full h-10 text-sm"><Sparkles className="w-4 h-4 mr-2"/> Generate Draft</Button>
                
                {generatedText && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 animate-in fade-in">
                        <textarea className="w-full bg-transparent border-none outline-none text-white text-sm" rows={6} value={generatedText} onChange={e => setGeneratedText(e.target.value)} />
                    </div>
                )}
                
                {generatedText && (
                    <Button className="w-full" onClick={onClose}><Send className="w-4 h-4 mr-2"/> Send {type === 'email' ? 'Email' : 'SMS'}</Button>
                )}
            </div>
        </Modal>
    )
}

const MoveTaskModal: React.FC<{ isOpen: boolean, onClose: () => void, onMove: (dept: string) => void }> = ({ isOpen, onClose, onMove }) => {
    const depts = ['Marketing', 'Operations', 'Tech', 'Legal', 'Finance'];
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Move Task To">
            <div className="grid grid-cols-2 gap-3">
                {depts.map(d => (
                    <button key={d} onClick={() => onMove(d)} className="p-3 rounded-xl bg-white/5 hover:bg-neon-blue/20 hover:border-neon-blue border border-white/10 text-left transition-all">
                        <span className="font-bold text-white text-sm">{d}</span>
                    </button>
                ))}
            </div>
        </Modal>
    )
}

const AdDetailModal: React.FC<{ ad: any, onClose: () => void }> = ({ ad, onClose }) => {
    if (!ad) return null;
    return (
        <Modal isOpen={!!ad} onClose={onClose} title="Ad Performance">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                     <div>
                         <h3 className="font-bold text-xl text-white">{ad.name}</h3>
                         <Badge color={ad.status === 'active' ? 'green' : 'gray'}>{ad.status}</Badge>
                     </div>
                     <div className="text-right">
                         <p className="text-xs text-gray-500">Spend</p>
                         <p className="text-lg font-bold text-white">${ad.spend}</p>
                     </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 p-2 rounded text-center"><p className="text-[10px] text-gray-500">Impressions</p><p className="font-bold">{ad.impressions.toLocaleString()}</p></div>
                    <div className="bg-white/5 p-2 rounded text-center"><p className="text-[10px] text-gray-500">Clicks</p><p className="font-bold">{ad.clicks.toLocaleString()}</p></div>
                    <div className="bg-white/5 p-2 rounded text-center"><p className="text-[10px] text-gray-500">ROAS</p><p className="font-bold text-green-400">{ad.roas}x</p></div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1 h-10 text-sm">Edit Creative</Button>
                    <Button variant={ad.status === 'active' ? 'danger' : 'primary'} className="flex-1 h-10 text-sm">{ad.status === 'active' ? 'Pause' : 'Activate'}</Button>
                </div>
            </div>
        </Modal>
    )
}

const TeamDetailModal: React.FC<{ team: any, onClose: () => void }> = ({ team, onClose }) => {
    if(!team) return null;
    return (
        <Modal isOpen={!!team} onClose={onClose} title={`${team.name} Team`}>
             <div className="space-y-4">
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                     <div>
                         <p className="text-xs text-gray-400">Completion Rate</p>
                         <p className="text-2xl font-bold text-neon-blue">{team.progress}%</p>
                     </div>
                     <div className="h-12 w-12 rounded-full border-4 border-neon-blue border-t-transparent animate-spin"></div>
                 </div>
                 <div>
                     <p className="font-bold text-white mb-2">Active Tasks</p>
                     <ul className="space-y-2">
                         {[1,2,3].map(i => (
                             <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                 <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                 Task #{i} in progress...
                             </li>
                         ))}
                     </ul>
                 </div>
                 <Button className="w-full">Message Team</Button>
             </div>
        </Modal>
    )
}

// --- BUILDER COMPONENTS ---

const BuilderVisualEditor: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="bg-[#15171B] p-4 border-b border-white/10 flex gap-4 overflow-x-auto">
                {['Stage', 'Seating', 'Entrance', 'Food', 'VIP', 'Restroom'].map(item => (
                    <div key={item} className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing p-2 hover:bg-white/5 rounded-lg min-w-[60px]">
                        <div className="w-10 h-10 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                            <Grip className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{item}</span>
                    </div>
                ))}
            </div>
            <div className="flex-1 bg-dark-bg relative overflow-hidden p-8 flex items-center justify-center border-2 border-dashed border-white/5 m-4 rounded-xl">
                <div className="text-center text-gray-500 pointer-events-none">
                    <MousePointer2 className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                    <p>Drag elements here to build your event map</p>
                </div>
                {/* Mock Dropped Items */}
                <div className="absolute top-1/4 left-1/3 w-32 h-20 bg-neon-blue/20 border border-neon-blue rounded-lg flex items-center justify-center">
                    <span className="text-neon-blue text-xs font-bold">Main Stage</span>
                </div>
                <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-purple-500/20 border border-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 text-xs font-bold">VIP Area</span>
                </div>
            </div>
        </div>
    )
}

const BuilderAIArchitect: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        const data = await generateEventStrategy(prompt);
        setResult(data);
        setIsGenerating(false);
    };

    return (
        <div className="h-full overflow-y-auto p-4 space-y-6">
            {!result ? (
                <div className="flex flex-col items-center justify-center h-3/4 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple flex items-center justify-center animate-pulse-slow">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center max-w-sm">
                        <h3 className="text-2xl font-bold text-white mb-2">AI Event Architect</h3>
                        <p className="text-gray-400 text-sm">Describe your event idea, and I'll generate the landing page copy, pricing, marketing plan, and email flows.</p>
                    </div>
                    <div className="w-full max-w-md space-y-4">
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="E.g. A techno rave in Berlin for 500 people in September..."
                            className="w-full bg-[#15171B] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-neon-pink outline-none h-32 resize-none"
                        />
                        <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!prompt} className="w-full">
                            <Sparkles className="w-4 h-4 mr-2"/> Generate Strategy
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Event Strategy</h2>
                        <Button variant="secondary" onClick={() => setResult(null)} className="h-8 text-xs">New Prompt</Button>
                    </div>

                    <GlassCard>
                        <h3 className="font-bold text-neon-pink mb-2">Landing Page Copy</h3>
                        <h1 className="text-xl font-bold text-white mb-2">{result.title || "Untitled Event"}</h1>
                        <p className="text-sm text-gray-300 italic">{result.description}</p>
                        <div className="flex gap-2 mt-3">
                            {(result.tags || []).map((t: string) => <Badge key={t} color="blue">{t}</Badge>)}
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-2 gap-4">
                        <GlassCard>
                            <h3 className="font-bold text-neon-green mb-2">Ticket Pricing</h3>
                            <ul className="space-y-2">
                                {(result.suggestedTicketPricing || []).map((p: any, i: number) => (
                                    <li key={i} className="flex justify-between text-sm">
                                        <span className="text-gray-300">{p.name}</span>
                                        <span className="font-bold text-white">${p.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </GlassCard>
                        <GlassCard>
                            <h3 className="font-bold text-neon-purple mb-2">Target Audience</h3>
                            <p className="text-xs text-gray-400">{result.targetAudience}</p>
                        </GlassCard>
                    </div>

                    <GlassCard>
                        <h3 className="font-bold text-white mb-3">Marketing Plan</h3>
                        <ul className="list-disc pl-4 space-y-2">
                            {(result.marketingPlan || []).map((step: string, i: number) => (
                                <li key={i} className="text-sm text-gray-300">{step}</li>
                            ))}
                        </ul>
                    </GlassCard>

                    <Button className="w-full bg-green-600 hover:bg-green-500 text-white border-none shadow-lg">
                        <Check className="w-5 h-5 mr-2" /> Apply to Event Draft
                    </Button>
                </div>
            )}
        </div>
    )
}

const OrganizerDashboard: React.FC<{ events: Event[], analytics: AnalyticsData, leads: Lead[], tasks: any[], onExit: () => void }> = ({ events, analytics, leads, tasks: initialTasks, onExit }) => {
    const [tab, setTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
    const [builderMode, setBuilderMode] = useState<'select' | 'visual' | 'ai'>('select');
    const [tasks, setTasks] = useState(initialTasks);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [aiComposer, setAiComposer] = useState<{ isOpen: boolean, type: 'email'|'sms', target: string }>({ isOpen: false, type: 'email', target: '' });
    const [moveTaskModal, setMoveTaskModal] = useState<{ isOpen: boolean, taskId: string }>({ isOpen: false, taskId: '' });
    const [selectedAd, setSelectedAd] = useState<any>(null);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? {...t, status: t.status === 'done' ? 'pending' : 'done'} : t));
    };

    const handleMoveTask = (dept: string) => {
        setTasks(prev => prev.map(t => t.id === moveTaskModal.taskId ? {...t, department: dept} : t));
        setMoveTaskModal({ isOpen: false, taskId: '' });
    };

    return (
        <div className="h-full overflow-y-auto pb-24 p-4 space-y-6 bg-dark-bg">
            <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onAction={(type, lead) => setAiComposer({ isOpen: true, type, target: lead.name })} />
            <AIComposerModal isOpen={aiComposer.isOpen} onClose={() => setAiComposer({ ...aiComposer, isOpen: false })} type={aiComposer.type} target={aiComposer.target} />
            <MoveTaskModal isOpen={moveTaskModal.isOpen} onClose={() => setMoveTaskModal({ isOpen: false, taskId: '' })} onMove={handleMoveTask} />
            <AdDetailModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
            <TeamDetailModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />

            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                     <button onClick={onExit} className="p-2 bg-white/5 rounded-full"><ChevronLeft className="w-5 h-5"/></button>
                     <h1 className="text-2xl font-bold text-white">Manager Hub</h1>
                </div>
            </div>
            
            {/* Scrollable Nav */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[DashboardTab.OVERVIEW, DashboardTab.EVENTS, DashboardTab.CRM, DashboardTab.TASKS, DashboardTab.TEAMS, DashboardTab.ANALYTICS, DashboardTab.BUILDER].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${tab === t ? 'bg-neon-blue text-white shadow-neon-brand' : 'text-gray-400 bg-white/5 border border-white/5'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {tab === DashboardTab.OVERVIEW && (
                <div className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-3">
                        <GlassCard className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
                            <p className="text-[10px] text-green-400 uppercase font-bold tracking-wider mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-white">${(analytics.revenue / 1000).toFixed(1)}k</p>
                        </GlassCard>
                        <GlassCard className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                            <p className="text-[10px] text-purple-400 uppercase font-bold tracking-wider mb-1">Tickets Sold</p>
                            <p className="text-2xl font-bold text-white">{analytics.totalSales}</p>
                        </GlassCard>
                    </div>

                    <GlassCard>
                         <h3 className="font-bold text-white mb-4 text-sm">Revenue Comparison</h3>
                         <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={MOCK_REVENUE_COMPARISON}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" tick={{fontSize: 9}} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{backgroundColor: '#0F1623', border: '1px solid #ffffff20'}} />
                                    <Legend />
                                    <Bar dataKey="primary" stackId="a" fill="#4B6BFF" name="Primary" radius={[0,0,4,4]} />
                                    <Bar dataKey="resale" stackId="a" fill="#37D67A" name="Resale" radius={[4,4,0,0]} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                     <GlassCard>
                         <h3 className="font-bold text-white mb-4 text-sm">Sales Forecast</h3>
                         <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_SALES_FORECAST}>
                                    <defs>
                                        <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#E74BFF" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#E74BFF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} axisLine={false} />
                                    <Tooltip contentStyle={{backgroundColor: '#0F1623', border: '1px solid #ffffff20'}} />
                                    <Area type="monotone" dataKey="forecast" stroke="#E74BFF" fill="url(#forecastGrad)" strokeDasharray="5 5" />
                                    <Area type="monotone" dataKey="sales" stroke="#4B6BFF" fill="transparent" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </div>
            )}

            {tab === DashboardTab.TASKS && (
                 <div className="space-y-4 animate-in fade-in">
                     <div className="bg-dark-surface rounded-xl border border-white/10 overflow-hidden">
                         <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between">
                             <h3 className="font-bold text-white">All Tasks</h3>
                             <Badge color="blue">{tasks.length}</Badge>
                         </div>
                         <div className="divide-y divide-white/5">
                             {tasks.map(task => (
                                 <div key={task.id} className="p-3 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                     <div className="flex items-center gap-3">
                                         <button onClick={() => toggleTask(task.id)} className={`w-5 h-5 rounded border flex items-center justify-center ${task.status === 'done' ? 'bg-neon-green border-neon-green' : 'border-gray-500'}`}>
                                             {task.status === 'done' && <Check className="w-3 h-3 text-black"/>}
                                         </button>
                                         <div>
                                             <p className={`text-sm ${task.status === 'done' ? 'line-through text-gray-500' : 'text-white'}`}>{task.text}</p>
                                             <div className="flex gap-2 mt-1">
                                                 <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{task.department}</span>
                                                 <span className={`text-[10px] px-1.5 py-0.5 rounded ${task.due === 'Today' ? 'bg-red-500/20 text-red-400' : 'text-gray-500'}`}>{task.due}</span>
                                             </div>
                                         </div>
                                     </div>
                                     <Button variant="secondary" className="!p-1 h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setMoveTaskModal({ isOpen: true, taskId: task.id })}>Move</Button>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
            )}

            {tab === DashboardTab.CRM && (
                <div className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <Button className="h-10 text-xs" onClick={() => setAiComposer({ isOpen: true, type: 'email', target: 'All Leads' })}><Mail className="w-3 h-3 mr-2"/> Campaign</Button>
                        <Button variant="secondary" className="h-10 text-xs"><Filter className="w-3 h-3 mr-2"/> Filter</Button>
                    </div>
                    {leads.map(lead => (
                        <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center hover:bg-white/10 cursor-pointer transition-all active:scale-[0.98]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white border border-white/10">
                                    {lead.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{lead.name}</p>
                                    <p className="text-xs text-gray-500">{lead.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge color={lead.status === 'vip' ? 'purple' : lead.status === 'purchased' ? 'green' : 'blue'}>{lead.status}</Badge>
                                <p className="text-[10px] text-gray-500 mt-1">Prob: {lead.conversionProb}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === DashboardTab.EVENTS && (
                <div className="space-y-4 animate-in fade-in">
                    <Button variant="secondary" className="w-full border-dashed border-white/20" onClick={() => { setTab(DashboardTab.BUILDER); setBuilderMode('select'); }}><Plus className="w-4 h-4 mr-2"/> Create New Event</Button>
                    {events.map(e => (
                        <div key={e.id} className="flex gap-3 items-start bg-white/5 p-3 rounded-xl border border-white/10">
                            <img src={e.image} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-bold text-white truncate">{e.title}</p>
                                    <Badge color={e.status === 'published' ? 'green' : 'gray'} className="text-[10px] py-0 px-1.5">{e.status}</Badge>
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{e.date}</p>
                                <div className="flex gap-4 border-t border-white/5 pt-2 mt-1">
                                    <div><p className="text-[10px] text-gray-500">Sold</p><p className="text-xs font-bold">{Math.floor(Math.random()*100)}%</p></div>
                                    <div><p className="text-[10px] text-gray-500">Rev</p><p className="text-xs font-bold">${Math.floor(Math.random()*10)}k</p></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === DashboardTab.TEAMS && (
                <div className="space-y-6 animate-in fade-in">
                    <h3 className="font-bold text-white">Team Workload</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {MOCK_TEAMS.map(team => (
                            <div key={team.id} onClick={() => setSelectedTeam(team)} className="bg-white/5 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-white">{team.name}</h4>
                                    <Badge color="blue">{team.members} Members</Badge>
                                </div>
                                <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-neon-blue" style={{ width: `${team.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>{team.activeTasks} Active</span>
                                    <span>{team.completedTasks} Done</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 className="font-bold text-white">Ad Campaigns</h3>
                    <div className="space-y-3">
                        {MOCK_ADS.map(ad => (
                            <div key={ad.id} onClick={() => setSelectedAd(ad)} className="bg-dark-surface p-3 rounded-xl border border-white/10 flex justify-between items-center cursor-pointer hover:border-neon-blue/50 transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-white">{ad.name}</p>
                                    <p className="text-xs text-gray-500">{ad.platform}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-green-400">{ad.roas}x ROAS</p>
                                    <p className="text-[10px] text-gray-500">${ad.spend} spent</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 className="font-bold text-white">Team Chats</h3>
                     <div className="space-y-2">
                        <div className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-neon-purple flex items-center justify-center font-bold">M</div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-dark-bg"></div>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Marketing Team</h4>
                                <p className="text-xs text-gray-400">Sarah: Approved the Q4 budget.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tab === DashboardTab.ANALYTICS && (
                 <div className="space-y-4 animate-in fade-in">
                      <GlassCard>
                          <h3 className="font-bold text-white mb-4">Traffic Sources</h3>
                          <div className="h-48 w-full">
                               <ResponsiveContainer width="100%" height="100%">
                                   <RePieChart>
                                       <Pie data={analytics.trafficSources} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                           {analytics.trafficSources.map((entry, index) => (
                                               <Cell key={`cell-${index}`} fill={entry.color} />
                                           ))}
                                       </Pie>
                                       <Tooltip contentStyle={{backgroundColor: '#0F1623', border: '1px solid #ffffff20'}}/>
                                       <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={8} wrapperStyle={{fontSize: '10px'}}/>
                                   </RePieChart>
                               </ResponsiveContainer>
                          </div>
                      </GlassCard>
                      
                      <GlassCard>
                          <h3 className="font-bold text-white mb-4">Peak Traffic Times</h3>
                          <div className="h-48 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={MOCK_PEAK_TRAFFIC}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                      <XAxis dataKey="time" stroke="#666" tick={{fontSize: 9}} axisLine={false} tickLine={false} />
                                      <Tooltip contentStyle={{backgroundColor: '#0F1623', border: '1px solid #ffffff20'}} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                      <Bar dataKey="visitors" fill="#4B6BFF" radius={[4,4,0,0]} />
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </GlassCard>
                 </div>
            )}

            {tab === DashboardTab.BUILDER && (
                <div className="h-full">
                    {builderMode === 'select' && (
                        <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
                            <h2 className="text-2xl font-bold text-white text-center">Choose Building Method</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                                <div onClick={() => setBuilderMode('ai')} className="bg-[#15171B] border border-white/10 p-6 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-neon-pink transition-all group text-center">
                                    <div className="w-16 h-16 rounded-full bg-neon-pink/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Sparkles className="w-8 h-8 text-neon-pink" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">AI Event Architect</h3>
                                    <p className="text-sm text-gray-400">Generate full strategy, copy, and plans from a single prompt.</p>
                                </div>
                                <div onClick={() => setBuilderMode('visual')} className="bg-[#15171B] border border-white/10 p-6 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-neon-blue transition-all group text-center">
                                    <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <LayoutTemplate className="w-8 h-8 text-neon-blue" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Visual Builder</h3>
                                    <p className="text-sm text-gray-400">Drag & Drop map elements to design your venue layout.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {builderMode === 'visual' && (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-2 p-2">
                                <Button variant="secondary" className="h-8 !px-3 text-xs" onClick={() => setBuilderMode('select')}><ChevronLeft className="w-4 h-4 mr-1"/> Back</Button>
                                <h3 className="font-bold text-white">Visual Editor</h3>
                            </div>
                            <BuilderVisualEditor />
                        </div>
                    )}

                    {builderMode === 'ai' && (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-2 p-2">
                                <Button variant="secondary" className="h-8 !px-3 text-xs" onClick={() => setBuilderMode('select')}><ChevronLeft className="w-4 h-4 mr-1"/> Back</Button>
                                <h3 className="font-bold text-white">AI Architect</h3>
                            </div>
                            <BuilderAIArchitect />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TicketWalletView: React.FC<{ tickets: Ticket[], events: Event[] }> = ({ tickets, events }) => {
    return (
        <div className="h-full bg-dark-bg p-6 pb-24 overflow-y-auto">
            <h1 className="text-2xl font-bold text-white mb-6">My Tickets</h1>
            {tickets.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <TicketIcon className="w-16 h-16 mx-auto mb-4"/>
                    <p>No tickets yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {tickets.map(ticket => {
                        const event = events.find(e => e.id === ticket.eventId);
                        if (!event) return null;
                        return (
                            <div key={ticket.id} className="relative group perspective-1000">
                                {/* Ticket Card */}
                                <div className="bg-dark-surface border border-white/10 rounded-2xl overflow-hidden relative">
                                    <div className="h-32 relative">
                                        <img src={event.image} className="w-full h-full object-cover opacity-60"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-surface to-transparent"></div>
                                        <div className="absolute bottom-3 left-4">
                                            <h3 className="font-bold text-white text-lg">{event.title}</h3>
                                            <p className="text-xs text-neon-blue">{event.date} • {event.location}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 relative">
                                         {/* Tear Line */}
                                         <div className="absolute -top-3 -left-3 w-6 h-6 bg-dark-bg rounded-full"></div>
                                         <div className="absolute -top-3 -right-3 w-6 h-6 bg-dark-bg rounded-full"></div>
                                         <div className="border-t-2 border-dashed border-white/10 mb-4"></div>
                                         
                                         <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Attendee</p>
                                                <p className="text-sm text-white">Alex Cyber</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Seat</p>
                                                <p className="text-sm text-white">GA - Standing</p>
                                            </div>
                                         </div>
                                         
                                         <div className="bg-white p-2 rounded-lg mb-3">
                                             {/* Fake QR */}
                                             <div className="w-full h-12 bg-black opacity-10 pattern-dots"></div> 
                                             <p className="text-center text-black text-[10px] font-mono mt-1">{ticket.qrCodeData}</p>
                                         </div>

                                         <Button variant="secondary" className="w-full h-10 text-xs">Sell on Marketplace</Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ResellMarketView: React.FC<{ events: Event[], onBuy: (eventId: string, price: number) => void }> = ({ events, onBuy }) => {
    return (
        <div className="h-full bg-dark-bg p-4 pb-24 overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Resell Market</h1>
                <div className="p-2 bg-white/5 rounded-full"><Filter className="w-5 h-5"/></div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {MOCK_RESALE_TICKETS.map(ticket => {
                    const event = events.find(e => e.id === ticket.eventId);
                    if (!event) return null;
                    return (
                        <div key={ticket.id} className="bg-dark-surface p-4 rounded-xl border border-white/5 flex gap-4">
                             <img src={event.image} className="w-20 h-24 rounded-lg object-cover" />
                             <div className="flex-1 flex flex-col justify-between">
                                 <div>
                                     <h4 className="font-bold text-white text-sm line-clamp-1">{event.title}</h4>
                                     <p className="text-[10px] text-gray-400">{event.date}</p>
                                     <p className="text-xs text-gray-300 mt-1">Seat: {ticket.seat}</p>
                                 </div>
                                 <div className="flex justify-between items-end">
                                     <div>
                                         <span className="text-xs text-gray-500 line-through mr-2">${ticket.originalPrice}</span>
                                         <span className="text-lg font-bold text-neon-green">${ticket.price}</span>
                                     </div>
                                     <Button className="!h-8 !px-4 text-xs" onClick={() => onBuy(event.id, ticket.price)}>Buy</Button>
                                 </div>
                             </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

const ChatConversationView: React.FC<{ chat: ChatConversation | null, onBack: () => void }> = ({ chat, onBack }) => {
    if (!chat) return null;
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', senderId: 'other', senderName: chat.name.split(' ')[0], text: chat.lastMessage, timestamp: '10:00 AM', isMe: false, avatar: chat.avatar }
    ]);
    const [input, setInput] = useState('');

    const send = () => {
        if(!input) return;
        setMessages([...messages, { id: Date.now().toString(), senderId: 'me', senderName: 'Me', text: input, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isMe: true }]);
        setInput('');
    };

    return (
        <div className="h-full flex flex-col bg-dark-bg pb-20 relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-dark-bg/95 backdrop-blur-xl z-20">
                <button onClick={onBack} className="p-2 -ml-2"><ChevronLeft className="text-white"/></button>
                <img src={chat.avatar} className="w-8 h-8 rounded-full object-cover"/>
                <span className="font-bold text-white text-sm">{chat.name}</span>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.isMe ? 'bg-neon-blue text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}>
                            {!m.isMe && <p className="text-[10px] text-gray-400 mb-1">{m.senderName}</p>}
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            {/* Input */}
            <div className="p-3 border-t border-white/10 flex gap-2 bg-dark-bg">
                <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="!mb-0"/>
                <Button onClick={send} className="!w-14 !h-[50px]"><Send className="w-5 h-5"/></Button>
            </div>
        </div>
    )
}

const ChatHubView: React.FC<{ conversations: ChatConversation[], onOpenChat: (c: ChatConversation) => void }> = ({ conversations, onOpenChat }) => {
    return (
        <div className="h-full bg-dark-bg p-4 pb-24 overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <Button variant="ghost" className="!p-2"><Edit3 className="w-5 h-5"/></Button>
            </div>
            
            <div className="space-y-2">
                {conversations.map(chat => (
                    <div key={chat.id} onClick={() => onOpenChat(chat)} className="flex gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-white/5">
                        <div className="relative">
                            <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover"/>
                            {chat.unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-neon-blue text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-dark-bg">
                                    {chat.unreadCount}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-white truncate">{chat.name}</h4>
                                <span className="text-[10px] text-gray-500">2m</span>
                            </div>
                            <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- UPDATED DESIGN: Vertical Snap "Reels" Card with New Visuals ---
const VerticalSnapEventCard: React.FC<{ 
    event: Event, 
    onOpen: (e: Event) => void, 
    onBuy: (e: Event) => void,
    onLike: () => void, 
    isLiked: boolean, 
    addToast: (t: Omit<ToastMessage, 'id'>) => void,
    onFollow: (orgId: string) => void
}> = ({ event, onOpen, onBuy, onLike, isLiked, addToast, onFollow }) => {
  const [showComments, setShowComments] = useState(false);

  return (
  <div className="h-full w-full snap-start relative flex-shrink-0 bg-dark-bg overflow-hidden flex items-center justify-center">
     
     {/* Immersive Background with Parallax */}
     <div className="absolute inset-0 overflow-hidden">
         <ParallaxImage src={event.image} className="w-full h-full object-cover" speed={0.3} />
         <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
     </div>

     {/* Unique Bottom "Command Strip" Interface */}
     <div className="absolute bottom-24 left-4 right-4 z-20 flex flex-col gap-6">
         
         {/* Info Block */}
         <div className="flex items-end justify-between">
             <div className="text-left max-w-[75%] space-y-3">
                 <div className="flex items-center gap-2">
                     <span className="text-[12px] font-bold text-white bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2">
                         <img src={event.organizer.avatar} className="w-4 h-4 rounded-full"/>
                         {event.organizer.name}
                     </span>
                     <Badge color="blue" className="shadow-none border-white/10 bg-black/40 text-white">{event.tags[0]}</Badge>
                 </div>
                 
                 <h2 className="text-[34px] font-bold text-white leading-[1.02] drop-shadow-xl shadow-black">{event.title}</h2>
                 
                 <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-4 text-text-secondary font-medium text-sm">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-neon-blue"/> {event.date}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-neon-purple"/> {event.location}</span>
                     </div>
                     {/* Attendees */}
                     <div className="flex items-center gap-2 text-xs text-white bg-black/30 px-2 py-1 rounded-lg w-fit backdrop-blur-sm">
                        <Users className="w-3 h-3 text-neon-green" />
                        <span className="font-bold">{event.attendees.toLocaleString()}</span> Going
                     </div>
                 </div>
                 
                 <div className="flex items-center gap-3 mt-2">
                     <div className="px-4 py-2 bg-[#0F1720] rounded-xl border border-white/[0.04]">
                         <p className="text-[16px] font-bold text-white leading-none">${event.price}</p>
                     </div>
                     {/* Removed Buy Button here as requested */}
                     <Button variant="primary" className="h-[44px] px-6 rounded-xl shadow-neon-brand text-sm" onClick={() => onOpen(event)}>
                         View Details
                     </Button>
                 </div>
             </div>

             {/* Action Stack (Right Side) */}
             <div className="flex flex-col gap-5 items-center pb-2">
                 <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={onLike}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-xl transition-all active:scale-95 ${isLiked ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-black/30 border-white/10 text-white hover:bg-white/10'}`}
                    >
                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <span className="text-xs font-bold text-white shadow-black drop-shadow-md">{event.likes}</span>
                 </div>

                 <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={() => setShowComments(true)}
                        className="w-12 h-12 rounded-full bg-black/30 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </button>
                    <span className="text-xs font-bold text-white shadow-black drop-shadow-md">{event.comments.length}</span>
                 </div>

                 {/* Shared Button Added */}
                 <div className="flex flex-col items-center gap-1">
                    <button 
                        className="w-12 h-12 rounded-full bg-black/30 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
                    >
                        <Share2 className="w-6 h-6" />
                    </button>
                    <span className="text-xs font-bold text-white shadow-black drop-shadow-md">Share</span>
                 </div>
             </div>
         </div>
     </div>

     {/* Comments Modal Overlay */}
     {showComments && (
         <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-in slide-in-from-bottom-10">
             <div className="bg-dark-surface rounded-t-[24px] border-t border-white/10 h-3/4 flex flex-col">
                 <div className="p-4 border-b border-white/5 flex justify-between items-center">
                     <h3 className="font-bold text-white">Comments ({event.comments.length})</h3>
                     <button onClick={() => setShowComments(false)} className="p-2 rounded-full bg-white/5"><XIcon className="w-5 h-5"/></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {event.comments.map(c => (
                         <div key={c.id} className="flex gap-3">
                             <img src={c.avatar} className="w-8 h-8 rounded-full bg-gray-700"/>
                             <div>
                                 <p className="text-xs text-text-secondary font-bold">{c.user} <span className="font-normal opacity-50">• {c.timestamp}</span></p>
                                 <p className="text-sm text-white">{c.text}</p>
                             </div>
                         </div>
                     ))}
                     {event.comments.length === 0 && <p className="text-gray-500 text-center mt-10">No comments yet. Be the first!</p>}
                 </div>
                 <div className="p-4 border-t border-white/5">
                     <Input placeholder="Add a comment..." className="!mb-0 h-10 text-sm" />
                 </div>
             </div>
         </div>
     )}
  </div>
)};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.ONBOARDING);
  const [userRole, setUserRole] = useState<UserRole>('USER');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [myTickets, setMyTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [likedEvents, setLikedEvents] = useState<Event[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleLike = (event: Event) => {
    if (likedEvents.find(e => e.id === event.id)) {
      setLikedEvents(prev => prev.filter(e => e.id !== event.id));
      addToast({ type: 'info', message: 'Removed from likes' });
    } else {
      setLikedEvents(prev => [...prev, event]);
      addToast({ type: 'success', message: 'Added to likes' });
    }
  };

  const handleBuy = (eventId: string, price: number) => {
      const newTicket: Ticket = {
          id: Date.now().toString(),
          eventId: eventId,
          purchaseDate: new Date().toISOString().split('T')[0],
          status: 'active',
          qrCodeData: `ticket-${eventId}-${Date.now()}`,
          pricePaid: price
      };

      setMyTickets(prev => [...prev, newTicket]);
      addToast({ type: 'success', message: 'Ticket purchased successfully!' });
      setViewState(ViewState.MY_TICKETS);
  }

  const handleGroupChat = () => {
      const groupChat = MOCK_CHATS[0]; // Assuming first is the group chat for now
      setSelectedChat(groupChat);
      setViewState(ViewState.CHAT_CONVERSATION);
  }

  // Simple Navigation Bar
  const NavBar = () => {
    if (userRole === 'ORGANIZER') return null; // Organizers might have different nav

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 p-4 flex justify-around items-center z-40 pb-8 md:pb-4">
        <button onClick={() => setViewState(ViewState.DISCOVER)} className={`flex flex-col items-center gap-1 ${viewState === ViewState.DISCOVER ? 'text-neon-blue' : 'text-text-tertiary'}`}>
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] font-bold">Discover</span>
        </button>
         <button onClick={() => setViewState(ViewState.RESELL_MARKET)} className={`flex flex-col items-center gap-1 ${viewState === ViewState.RESELL_MARKET ? 'text-neon-blue' : 'text-text-tertiary'}`}>
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-bold">Market</span>
        </button>
        <button onClick={() => setViewState(ViewState.MY_TICKETS)} className={`flex flex-col items-center gap-1 ${viewState === ViewState.MY_TICKETS ? 'text-neon-blue' : 'text-text-tertiary'}`}>
          <TicketIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold">Tickets</span>
        </button>
        <button onClick={() => setViewState(ViewState.CHAT_HUB)} className={`flex flex-col items-center gap-1 ${viewState === ViewState.CHAT_HUB ? 'text-neon-blue' : 'text-text-tertiary'}`}>
          <MessageSquare className="w-6 h-6" />
          <span className="text-[10px] font-bold">Chat</span>
        </button>
        <button onClick={() => setViewState(ViewState.PROFILE)} className={`flex flex-col items-center gap-1 ${viewState === ViewState.PROFILE ? 'text-neon-blue' : 'text-text-tertiary'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-dark-bg text-white min-h-screen font-sans selection:bg-neon-pink selection:text-white">
      {viewState === ViewState.ONBOARDING && (
        <OnboardingScreen setUserRole={setUserRole} setView={setViewState} />
      )}

      {viewState !== ViewState.ONBOARDING && (
        <>
          <div className="h-screen w-full pb-20 overflow-hidden relative">
            
            {/* Top Bar for Discover - Shortcut to Management Hub */}
            {viewState === ViewState.DISCOVER && (
                <>
                    <h1 className="absolute top-6 left-0 right-0 text-center text-neon-purple font-bold text-xl z-30 drop-shadow-[0_0_10px_rgba(231,75,255,0.5)]">VENTYR</h1>
                    <div className="absolute top-0 right-0 p-4 z-20">
                        <button 
                            onClick={() => setViewState(ViewState.ORGANIZER_DASHBOARD)}
                            className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>
                </>
            )}

            {viewState === ViewState.DISCOVER && (
              <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth">
                {MOCK_EVENTS.map(event => (
                  <VerticalSnapEventCard 
                    key={event.id} 
                    event={event} 
                    onOpen={(e) => { setSelectedEvent(e); setViewState(ViewState.EVENT_DETAIL); }}
                    onBuy={(e) => handleBuy(e.id, e.price)}
                    onLike={() => toggleLike(event)}
                    isLiked={!!likedEvents.find(e => e.id === event.id)}
                    addToast={addToast}
                    onFollow={() => {}}
                  />
                ))}
              </div>
            )}

            {viewState === ViewState.EVENT_DETAIL && selectedEvent && (
                <EventDetailView 
                    event={selectedEvent} 
                    onBack={() => setViewState(ViewState.DISCOVER)} 
                    onBuy={() => handleBuy(selectedEvent.id, selectedEvent.price)}
                    currentUser={userProfile}
                    onOpenOrganizer={(o) => { setSelectedOrganizer(o); setViewState(ViewState.PROFILE); }} 
                    onGroupChat={handleGroupChat}
                    onResell={() => setViewState(ViewState.RESELL_MARKET)}
                    myTickets={myTickets}
                />
            )}
            
            {viewState === ViewState.PROFILE && selectedOrganizer && (
                 <OrganizerProfileView 
                    organizer={selectedOrganizer} 
                    events={MOCK_EVENTS} 
                    onBack={() => { setSelectedOrganizer(null); setViewState(ViewState.EVENT_DETAIL); }} 
                 />
            )}

            {viewState === ViewState.ORGANIZER_DASHBOARD && (
                <OrganizerDashboard 
                    events={MOCK_EVENTS} 
                    analytics={MOCK_ANALYTICS} 
                    leads={MOCK_LEADS} 
                    tasks={MOCK_TASKS}
                    onExit={() => setViewState(ViewState.DISCOVER)}
                />
            )}

            {viewState === ViewState.MY_TICKETS && (
                <TicketWalletView tickets={myTickets} events={MOCK_EVENTS} />
            )}
            
            {viewState === ViewState.RESELL_MARKET && (
                <ResellMarketView events={MOCK_EVENTS} onBuy={handleBuy} />
            )}

            {viewState === ViewState.CHAT_HUB && (
                <ChatHubView conversations={MOCK_CHATS} onOpenChat={(c) => { setSelectedChat(c); setViewState(ViewState.CHAT_CONVERSATION); }} />
            )}

            {viewState === ViewState.CHAT_CONVERSATION && (
                <ChatConversationView chat={selectedChat} onBack={() => setViewState(ViewState.CHAT_HUB)} />
            )}

            {viewState === ViewState.PROFILE && !selectedOrganizer && (
              <ProfileScreen 
                profile={userProfile} 
                setProfile={setUserProfile} 
                setView={setViewState}
                myTickets={myTickets}
                events={MOCK_EVENTS}
                likedEvents={likedEvents}
                connections={MOCK_PEOPLE}
              />
            )}
          </div>
          
          <NavBar />
          <ChatAssistant />
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
      )}
    </div>
  );
};

export default App;
