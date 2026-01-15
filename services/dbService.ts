
import { User, HistoryItem } from '../types';
import { validateEmailSecurity } from './geminiService';

const USER_STORAGE_KEY = 'trusthire_user';

const lookupGmailProfile = (email: string): { name: string; avatar: string } => {
  const normalizedEmail = email.toLowerCase().trim();
  if (normalizedEmail.includes('24r01a6658')) {
    return {
      name: 'S. School',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SS&backgroundColor=6366f1&fontWeight=800'
    };
  }
  const prefix = normalizedEmail.split('@')[0];
  const formattedName = prefix.split(/[\._]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  return {
    name: formattedName,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formattedName}&backgroundColor=6366f1&fontWeight=800`
  };
};

export const dbService = {
  async getUser(): Promise<User | null> {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  async saveHistory(item: Omit<HistoryItem, 'id' | 'date'>) {
    const user = await this.getUser();
    if (!user) return;
    
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(7),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    
    user.history = [newItem, ...(user.history || [])].slice(0, 10);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  // Added missing updateUser method
  async updateUser(user: User): Promise<void> {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  async signInWithGoogle(email: string): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profile = lookupGmailProfile(email);
        const user: User = {
          id: 'google_' + Math.random().toString(36).substring(2, 11),
          name: profile.name, 
          email: email,
          skills: ['Problem Solving', 'Security Analysis', 'AI Navigation'],
          isAuthenticated: true,
          avatar: profile.avatar,
          history: []
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      }, 1200);
    });
  },

  async signIn(email: string): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profile = lookupGmailProfile(email);
        const user: User = {
          id: 'user_' + Math.random().toString(36).substring(2, 11),
          name: profile.name,
          email: email,
          skills: ['Research', 'Analysis'],
          isAuthenticated: true,
          avatar: profile.avatar,
          history: []
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  },

  async signUp(email: string, manualName?: string): Promise<User> {
    // validateEmailSecurity now returns { analysis, sources }
    const result = await validateEmailSecurity(email);
    const securityCheck = result.analysis;
    if (!securityCheck.isValid || !securityCheck.isSafe) {
      throw new Error(`Google Security Check Refused: ${securityCheck.reason}`);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const profile = lookupGmailProfile(email);
        const user: User = {
          id: 'new_mail_' + Math.random().toString(36).substring(2, 11),
          name: manualName || profile.name,
          email: email,
          skills: [],
          isAuthenticated: true,
          avatar: manualName ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${manualName}` : profile.avatar,
          history: []
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  },

  async signOut() {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};
