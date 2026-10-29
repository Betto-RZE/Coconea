'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole } from '@coconea/types';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  password?: string;
  phone?: string;
  dietaryPreferences?: string[];
  allergies?: string[];
}

export type AuthErrorType =
  | 'ACCOUNT_NOT_FOUND'
  | 'INVALID_PASSWORD'
  | 'EMAIL_ALREADY_EXISTS'
  | 'MISSING_FIELDS'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN';

export interface AuthResponse {
  success: boolean;
  error?: string;
  errorType?: AuthErrorType;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<AuthResponse>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    dietaryPreference?: string;
  }) => Promise<AuthResponse>;
  loginAsDemo: (demoType: 'standard' | 'keto' | 'vegan') => void;
  logout: () => void;
}

// Contraseña por defecto para cuentas demo
export const DEMO_DEFAULT_PASSWORD = 'Coconea2026!';

// Cuentas de demostración preconfiguradas para modo demo y pruebas locales
export const DEMO_ACCOUNTS: Record<'standard' | 'keto' | 'vegan', AuthUser> = {
  standard: {
    id: 'usr_demo_standard_01',
    email: 'sofia.mendez@coconea.local',
    fullName: 'Sofía Méndez',
    role: 'USER',
    password: DEMO_DEFAULT_PASSWORD,
    dietaryPreferences: ['Alto en Proteína', 'Bajo en Sodio'],
    allergies: ['Mariscos'],
  },
  keto: {
    id: 'usr_demo_keto_02',
    email: 'carlos.gomez@coconea.local',
    fullName: 'Carlos Gómez',
    role: 'USER',
    password: DEMO_DEFAULT_PASSWORD,
    dietaryPreferences: ['Cetogénica (Keto)', 'Sin Gluten'],
    allergies: ['Gluten'],
  },
  vegan: {
    id: 'usr_demo_vegan_03',
    email: 'valeria.rios@coconea.local',
    fullName: 'Valeria Ríos',
    role: 'USER',
    password: DEMO_DEFAULT_PASSWORD,
    dietaryPreferences: ['Vegana', 'Orgánico'],
    allergies: ['Lácteos', 'Huevo'],
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_SESSION_KEY = 'coconea_customer_session';
const STORAGE_USERS_KEY = 'coconea_registered_users';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar repositorio de usuarios registrados si no existe
  const getRegisteredUsers = (): AuthUser[] => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) {
        return JSON.parse(stored) as AuthUser[];
      }
    } catch {
      // Ignorar
    }
    // Cuentas iniciales por defecto
    const initial = Object.values(DEMO_ACCOUNTS);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initial));
    } catch {
      // Ignorar
    }
    return initial;
  };

  // Cargar sesión persistida
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
      // Asegurar que usuarios registrados existan
      getRegisteredUsers();
    } catch {
      // Ignorar
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password?.trim() || '';

    if (!normalizedEmail || !trimmedPassword) {
      setIsLoading(false);
      return {
        success: false,
        errorType: 'MISSING_FIELDS',
        error: 'El correo electrónico y la contraseña son obligatorios.',
      };
    }

    // 1. Intentar validar contra la API SQLite (si está disponible en backend NestJS)
    try {
      const apiResponse = await fetch('http://localhost:4000/v1/usuarios', {
        headers: { Accept: 'application/json' },
      });
      if (apiResponse.ok) {
        const remoteUsers = await apiResponse.json();
        if (Array.isArray(remoteUsers)) {
          const apiUser = remoteUsers.find(
            (u: any) =>
              u.email?.toLowerCase() === normalizedEmail &&
              u.passwordHash === trimmedPassword
          );

          if (apiUser) {
            const sessionData: AuthUser = {
              id: apiUser.id,
              email: apiUser.email,
              fullName: apiUser.nombre,
              role: (apiUser.rol === 'CUSTOMER' ? 'USER' : apiUser.rol) as UserRole,
              phone: apiUser.telefono || undefined,
              dietaryPreferences: ['Plan Personalizado'],
              allergies: [],
            };

            setUser(sessionData);
            try {
              localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
            } catch {
              // Fallback
            }
            setIsLoading(false);
            return { success: true };
          }
        }
      }
    } catch {
      // Si la API SQLite no está activa, continuar con repositorio local/demo
    }

    // 2. Verificación contra repositorio local y cuentas demo
    await new Promise((resolve) => setTimeout(resolve, 300));
    const allUsers = getRegisteredUsers();
    const existingUser = allUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!existingUser) {
      setIsLoading(false);
      return {
        success: false,
        errorType: 'ACCOUNT_NOT_FOUND',
        error: `No existe ninguna cuenta registrada con el correo "${normalizedEmail}".`,
      };
    }

    const expectedPassword = existingUser.password || DEMO_DEFAULT_PASSWORD;
    if (trimmedPassword !== expectedPassword) {
      setIsLoading(false);
      return {
        success: false,
        errorType: 'INVALID_PASSWORD',
        error: 'Contraseña incorrecta. Verifica tus datos o restablece tu clave.',
      };
    }

    const sessionData: AuthUser = {
      id: existingUser.id,
      email: existingUser.email,
      fullName: existingUser.fullName,
      role: existingUser.role,
      phone: existingUser.phone,
      dietaryPreferences: existingUser.dietaryPreferences || ['Plan Personalizado'],
      allergies: existingUser.allergies || [],
    };

    setUser(sessionData);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    } catch {
      // Fallback
    }

    setIsLoading(false);
    return { success: true };
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    dietaryPreference?: string;
  }): Promise<AuthResponse> => {
    setIsLoading(true);

    const normalizedEmail = data.email.trim().toLowerCase();
    const trimmedFullName = data.fullName.trim();
    const trimmedPassword = data.password.trim();

    if (!trimmedFullName || !normalizedEmail || !trimmedPassword) {
      setIsLoading(false);
      return {
        success: false,
        errorType: 'MISSING_FIELDS',
        error: 'Todos los campos obligatorios deben completarse.',
      };
    }

    const allUsers = getRegisteredUsers();
    const emailExists = allUsers.some(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      setIsLoading(false);
      return {
        success: false,
        errorType: 'EMAIL_ALREADY_EXISTS',
        error: `Ya existe una cuenta con el correo "${normalizedEmail}". Por favor inicia sesión.`,
      };
    }

    let generatedId = `usr_${Date.now().toString(36)}`;

    // Intentar sincronizar con la API SQLite
    try {
      const apiResponse = await fetch('http://localhost:4000/v1/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: trimmedFullName,
          email: normalizedEmail,
          passwordHash: trimmedPassword,
          telefono: data.phone?.trim() || '',
          rol: 'CUSTOMER',
        }),
      });

      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        if (apiData?.id) {
          generatedId = apiData.id;
        }
      }
    } catch {
      // Si la API SQLite está offline, el registro continúa con persistencia local
    }

    const newUser: AuthUser = {
      id: generatedId,
      email: normalizedEmail,
      fullName: trimmedFullName,
      password: trimmedPassword,
      phone: data.phone?.trim() || undefined,
      role: 'USER',
      dietaryPreferences: data.dietaryPreference
        ? [data.dietaryPreference]
        : ['Plan Equilibrado'],
      allergies: [],
    };

    const updatedUsers = [...allUsers, newUser];
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));
    } catch {
      // Fallback
    }

    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  };

  const loginAsDemo = (demoType: 'standard' | 'keto' | 'vegan') => {
    const demoUser = DEMO_ACCOUNTS[demoType];
    setUser(demoUser);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(demoUser));
    } catch {
      // Fallback
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
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
        register,
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
