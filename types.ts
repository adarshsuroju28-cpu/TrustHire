export interface User {
  id: string;
  name: string;
  email: string;
  skills: string[];
  isAuthenticated: boolean;
  avatar?: string;
  history?: HistoryItem[];
}

export interface HistoryItem {
  id: string;
  type: 'Scam Check' | 'Company Verify' | 'Career Guidance';
  title: string;
  status: 'Safe' | 'Warning' | 'High Risk' | 'Verified';
  date: string;
}

export interface ScamAnalysis {
  score: number; // 0-100, 100 being most trustworthy
  riskLevel: 'Low' | 'Medium' | 'High';
  redFlags: string[];
  verdict: string;
  recommendations: string[];
}

export interface CareerSuggestion {
  role: string;
  description: string;
  matchingSkills: string[];
  topCompanies: string[];
}

export interface UpskillingResource {
  title: string;
  description: string;
  provider: string;
  url: string;
  type: 'Video' | 'Course' | 'Article';
  ratingInfo?: string;
}

export interface CompanyInfo {
  name: string;
  rating: number;
  description: string;
  headquarters: string;
  verificationStatus: 'Verified' | 'Unverified' | 'Warning';
  sourceUrls: { title: string; url: string }[];
}