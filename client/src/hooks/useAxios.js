import axios from 'axios';
import {createContext, useEffect, useState, useContext} from 'react';
import * as Keychain from 'react-native-keychain';
import {AuthContext} from './useAuth';
import JWT from 'expo-jwt';
import Config from 'react-native-config';

export const AxiosContext = createContext();

function useAxios() {
  const authContext = useContext(AuthContext);
  const authAxios = axios.create({
    baseURL: 'http://localhost:4000',
  });

  const publicAxios = axios.create({
    baseURL: 'http://localhost:4000',
  });

  const token = JWT.encode({foo: 'bar'}, Config.JWT_SECRET_KEY);

  authAxios.interceptors.request.use(
    config => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  publicAxios.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  return {authAxios, publicAxios};
}

export const AxiosProvider = ({children}) => {
  const axios = useAxios();

  return <AxiosContext.Provider value={axios} children={children} />;
};
