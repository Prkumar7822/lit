import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Keychain from 'react-native-keychain';

// Define the context type
type AuthContextType = {
  authToken: string | null;
  setAuthToken: (token: string) => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access the context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Store the token and handle its expiration
  const handleSetAuthToken = (token: string) => {
    setAuthToken(token);
    storeToken(token); // Store token securely using Keychain
  };

  // Function to retrieve the stored token from Keychain
  const getStoredToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setAuthToken(credentials.password); // Set the token if found
      }
    } catch (error) {
      console.error('Error retrieving token from Keychain', error);
    }
  };

  // Store the token securely in Keychain
  const storeToken = async (token: string) => {
    try {
      await Keychain.setGenericPassword('authToken', token);
    } catch (error) {
      console.error('Error storing token in Keychain', error);
    }
  };

  // Get the stored token when the app starts
  useEffect(() => {
    getStoredToken();
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken: handleSetAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};


//const { authToken } = useAuthContext();, 