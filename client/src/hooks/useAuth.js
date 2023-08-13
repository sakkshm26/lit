import {createContext, useEffect, useState} from 'react';
import * as Keychain from "react-native-keychain"

export const AuthContext = createContext(null);

function useAuth() {
  const [authState, setAuthState] = useState({
    token: null,
    id: null,
    institute_id: null
  });

  const logout = async () => {
    await Keychain.resetGenericPassword();
    setAuthState({
      token: null,
      id: null,
      institute_id: null
    });
  };

  const getAccessToken = () => {
    return authState.token;
  };

  return {authState, setAuthState, getAccessToken, logout};
}

export const AuthProvider = ({children}) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth} children={children} />;
};
