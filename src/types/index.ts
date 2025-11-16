export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  address?: string;
  type: 'workshop' | 'community-service' | 'career' | 'social' | 'fundraiser';
  tags: string[];
  capacity: number;
  registered: number;
  status: 'open' | 'waitlist' | 'closed';
  imageUrl?: string;
  leadContact?: {
    name: string;
    email: string;
    phone?: string;
  };
  partners?: Partner[];
  agenda?: string[];
  whatYouWillDo?: string[];
  isPast: boolean;
  recap?: EventRecap;
}

export interface EventRecap {
  summary: string;
  volunteersCount: number;
  hoursServed: number;
  beneficiaries: number;
  gallery: string[];
  quotes: { text: string; author: string; role?: string }[];
  attachments?: { name: string; url: string }[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedInUrl?: string;
  isExecutive: boolean;
  order: number;
}

export interface Award {
  id: string;
  name: string;
  years: string[];
  description: string;
  eligibility: string;
  timeline: string;
  applicationUrl?: string;
  pdfUrl?: string;
  pastRecipients: { name: string; year: string; achievement?: string }[];
}

export interface AnnualReport {
  id: string;
  year: number;
  title: string;
  highlights: string[];
  coverImageUrl: string;
  pdfUrl: string;
  totalVolunteers?: number;
  totalHours?: number;
  totalEvents?: number;
}

export interface VolunteerRole {
  id: string;
  title: string;
  program: string;
  description: string;
  commitment: string;
  skills: string[];
  tags: string[];
}

export interface VolunteerApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interests: string[];
  availability: string;
  experience: string;
  motivation: string;
  resume?: File;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  imageUrl?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ContactInfo {
  id: string;
  type: 'office' | 'email' | 'phone' | 'press';
  title: string;
  value: string;
  icon?: string;
}

export interface SiteSettings {
  organizationName: string;
  tagline: string;
  donationUrl: string;
  volunteerFormUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  territoryAcknowledgement: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}
