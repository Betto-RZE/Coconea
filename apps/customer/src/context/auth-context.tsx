'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '@coconea/types';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  dietaryPreferences?: string[];
  allergies?: string[];
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (demoType: 'standard' | 'keto' | 'vegan') => void;
  logout: () => void;
}

// Cuentas de demostración preconfiguradas para modo demo y pruebas locales
export const DEMO_ACCOUNTS: Record<'standard' | 'keto' | 'vegan', AuthUser> = {
  standard: {
    id: 'usr_demo_standard_01',
    email: 'sofia.mendez@coconea.local',
    fullName: 'Sofía Méndez',
    role: 'USER',
    dietaryPreferences: ['Alto en Proteína', 'Bajo en Sodio'],
    allergies: ['Mariscos'],
  },
  keto: {
    id: 'usr_demo_keto_02',
    email: 'carlos.gomez@coconea.local',
    fullName: 'Carlos Gómez',
    role: 'USER',
    dietaryPreferences: ['Cetogénica (Keto)', 'Sin Gluten'],
    allergies: ['Gluten'],
  },
  vegan: {
    id: 'usr_demo_vegan_03',
    email: 'valeria.rios@coconea.local',
    fullName: 'Valeria Ríos',
    role: 'USER',
    dietaryPreferences: ['Vegana', 'Orgánico'],
    allergies: ['Lácteos', 'Huevo'],
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'coconea_customer_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión persistida en el cliente
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch {
      // Ignorar errores de parsing o storage en ambientes restringidos
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulación de latencia de red para experiencia realista y responsiva
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedEmail = email.trim().toLowerCase();

    // Comprobar si coincide con alguna cuenta demo predeterminada
    const matchedDemo = Object.values(DEMO_ACCOUNTS).find(
      (demo) => demo.email.toLowerCase() === normalizedEmail
    );

    const loggedUser: AuthUser = matchedDemo || {
      id: `usr_${Date.now().toString(36)}`,
      email: normalizedEmail,
      fullName: normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      role: 'USER',
      dietaryPreferences: ['Plan Balanceado'],
      allergies: [],
    };

    setUser(loggedUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    } catch {
      // Fallback
    }

    setIsLoading(false);
    return { success: true };
  };

  const loginAsDemo = (demoType: 'standard' | 'keto' | 'vegan') => {
    const demoUser = DEMO_ACCOUNTS[demoType];
    setUser(demoUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    } catch {
      // Fallback
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Fallback
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
