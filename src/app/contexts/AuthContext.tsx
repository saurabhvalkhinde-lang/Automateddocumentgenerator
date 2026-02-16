import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserPlan = 'free' | 'pro';

export interface BusinessProfile {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyGST?: string;
  upiId?: string;
  logo?: string;
  defaultTaxRate?: number;
  customFooter?: string;
  invoicePrefix?: string;
}

export interface PDFHistoryItem {
  id: string;
  type: 'invoice' | 'certificate' | 'quotation' | 'bill' | 'receipt' | 'offer-letter';
  templateId: number;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  email: string;
  plan: UserPlan;
  subscriptionExpiry?: string;
  businessProfile?: BusinessProfile;
  pdfHistory?: PDFHistoryItem[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPro: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<boolean>;
  upgradeToPro: (plan: 'monthly' | 'yearly') => Promise<boolean>;
  updateBusinessProfile: (profile: BusinessProfile) => void;
  savePDFToHistory: (item: Omit<PDFHistoryItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePDFInHistory: (id: string, data: any) => void;
  deletePDFFromHistory: (id: string) => void;
  getPDFFromHistory: (id: string) => PDFHistoryItem | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('pdfdecor_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Check if subscription is expired
      if (userData.plan === 'pro' && userData.subscriptionExpiry) {
        const expiryDate = new Date(userData.subscriptionExpiry);
        if (expiryDate < new Date()) {
          // Subscription expired, downgrade to free
          userData.plan = 'free';
          userData.subscriptionExpiry = undefined;
          localStorage.setItem('pdfdecor_user', JSON.stringify(userData));
        }
      }
      setUser(userData);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In production, this would call your backend API
    // For now, simulate login with localStorage
    const users = JSON.parse(localStorage.getItem('pdfdecor_users') || '{}');
    const userData = users[email];
    
    if (userData && userData.password === password) {
      // Check subscription expiry
      if (userData.plan === 'pro' && userData.subscriptionExpiry) {
        const expiryDate = new Date(userData.subscriptionExpiry);
        if (expiryDate < new Date()) {
          userData.plan = 'free';
          userData.subscriptionExpiry = undefined;
        }
      }
      
      const userSession = { ...userData };
      delete userSession.password;
      setUser(userSession);
      localStorage.setItem('pdfdecor_user', JSON.stringify(userSession));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pdfdecor_user');
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    // In production, this would call your backend API
    const users = JSON.parse(localStorage.getItem('pdfdecor_users') || '{}');
    
    if (users[email]) {
      return false; // User already exists
    }
    
    const newUser = {
      email,
      password,
      plan: 'free' as UserPlan,
      businessProfile: {},
      pdfHistory: [],
    };
    
    users[email] = newUser;
    localStorage.setItem('pdfdecor_users', JSON.stringify(users));
    
    // Auto-login after signup
    const userSession = { 
      email, 
      plan: 'free' as UserPlan,
      businessProfile: {},
      pdfHistory: [],
    };
    setUser(userSession);
    localStorage.setItem('pdfdecor_user', JSON.stringify(userSession));
    return true;
  };

  const upgradeToPro = async (plan: 'monthly' | 'yearly'): Promise<boolean> => {
    if (!user) return false;
    
    // In production, this would:
    // 1. Create Razorpay order
    // 2. Process payment
    // 3. Update backend with subscription
    // 4. Return success/failure
    
    // For demo, simulate successful upgrade
    const expiryDate = new Date();
    if (plan === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    
    const updatedUser = {
      ...user,
      plan: 'pro' as UserPlan,
      subscriptionExpiry: expiryDate.toISOString(),
    };
    
    setUser(updatedUser);
    localStorage.setItem('pdfdecor_user', JSON.stringify(updatedUser));
    
    // Update in users database
    const users = JSON.parse(localStorage.getItem('pdfdecor_users') || '{}');
    if (users[user.email]) {
      users[user.email].plan = 'pro';
      users[user.email].subscriptionExpiry = expiryDate.toISOString();
      localStorage.setItem('pdfdecor_users', JSON.stringify(users));
    }
    
    return true;
  };

  const updateBusinessProfile = (profile: BusinessProfile) => {
    if (!user || user.plan !== 'pro') return;
    
    const updatedUser = {
      ...user,
      businessProfile: { ...user.businessProfile, ...profile },
    };
    
    setUser(updatedUser);
    localStorage.setItem('pdfdecor_user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('pdfdecor_users') || '{}');
    if (users[user.email]) {
      users[user.email].businessProfile = updatedUser.businessProfile;
      localStorage.setItem('pdfdecor_users', JSON.stringify(users));
    }
  };

  const savePDFToHistory = (item: Omit<PDFHistoryItem, 'id' | 'createdAt' | 'updatedAt'>): string => {
    if (!user || user.plan !== 'pro') return '';
    
    const id = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newItem: PDFHistoryItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedHistory = [newItem, ...(user.pdfHistory || [])];
    
    const updatedUser = {
      ...user,
      pdfHistory: updatedHistory,
    };
    
    setUser(updatedUser);
    localStorage.setItem('pdfdecor_user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('pdfdecor_users') || '{}');
    if (users[user.email]) {
      users[user.email].pdfHistory = updatedHistory;
      localStorage.setItem('pdfdecor_users', JSON.stringify(users));
    }
    
    return id;
  };

  const updatePDFInHistory = (id: string, data: any) => {
    if (!user || user.plan !== 'pro') return;
    
    const updatedHistory = (user.pdfHistory || []).map(item => 
      item.id === id 
        ? { ...item, data, updatedAt: new Date().toISOString() }
        : item
    );
    
    const updatedUser = {
      ...user,
      pdfHistory: updatedHistory,
    };
    
    setUser(updatedUser);
    localStorage.setItem('pdfdecor_user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('pdfdecor_users') || '{}');
    if (users[user.email]) {
      users[user.email].pdfHistory = updatedHistory;
      localStorage.setItem('pdfdecor_users', JSON.stringify(users));
    }
  };

  const deletePDFFromHistory = (id: string) => {
    if (!user || user.plan !== 'pro') return;
    
    const updatedHistory = (user.pdfHistory || []).filter(item => item.id !== id);
    
    const updatedUser = {
      ...user,
      pdfHistory: updatedHistory,
    };
    
    setUser(updatedUser);
    localStorage.setItem('pdfdecor_user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('pdfdecor_users') || '{}');
    if (users[user.email]) {
      users[user.email].pdfHistory = updatedHistory;
      localStorage.setItem('pdfdecor_users', JSON.stringify(users));
    }
  };

  const getPDFFromHistory = (id: string): PDFHistoryItem | undefined => {
    if (!user || user.plan !== 'pro') return undefined;
    return (user.pdfHistory || []).find(item => item.id === id);
  };

  const isPro = user?.plan === 'pro';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPro,
        login,
        logout,
        signup,
        upgradeToPro,
        updateBusinessProfile,
        savePDFToHistory,
        updatePDFInHistory,
        deletePDFFromHistory,
        getPDFFromHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}