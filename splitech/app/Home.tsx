// Home.js
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth0 Configuration
const AUTH0_DOMAIN = 'dev-2l54u7lu3bidibfm.us.auth0.com';
const AUTH0_CLIENT_ID = 'UqYXERixdhnqf7XeqK87KHq18ANY3Aqm';

// Redirect URI configuration using AuthSession.makeRedirectUri
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: Platform.OS !== 'web', // Use proxy on native platforms
  // Optionally, specify a custom scheme for native platforms
});

console.log('Redirect URI:', redirectUri);

const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
};

// Helper function to decode JWT
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid token format', error);
    return null;
  }
}

const Home = ({ navigation }) => { // Receive navigation prop
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHandledResponse, setHasHandledResponse] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: {
        nonce: 'nonce', // Consider generating a unique nonce for each request
      },
    },
    discovery
  );

  // Detect and handle web id_token in URL hash
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleAuth = () => {
        const hash = window.location.hash;
        const idTokenMatch = hash.match(/id_token=([^&]+)/);
        if (idTokenMatch) {
          const idToken = idTokenMatch[1];
          const decoded = decodeJWT(idToken);
          if (decoded) {
            setUserInfo(decoded);
            AsyncStorage.setItem('authToken', idToken);
            setLoggedOut(false);
            Alert.alert('Logged in!', `Welcome ${decoded.name}`);
            window.history.replaceState(null, '', window.location.pathname); // Clear the hash from the URL
            navigation.replace('Dashboard', { user: decoded }); // Navigate to Dashboard
          }
        }
      };

      handleAuth();
    }
  }, [navigation]);

  useEffect(() => {
    if (response?.type === 'success' && !hasHandledResponse && !loggedOut) {
      setHasHandledResponse(true);
      const { id_token } = response.params;
      const decoded = decodeJWT(id_token);
      if (decoded) {
        setUserInfo(decoded);
        AsyncStorage.setItem('authToken', id_token);
        setLoggedOut(false);
        Alert.alert('Logged in!', `Welcome ${decoded.name}`);
        navigation.replace('Dashboard', { user: decoded }); // Navigate to Dashboard
      }
    } else if (response?.type === 'error') {
      Alert.alert('Authentication error', response.error?.message || 'An error occurred');
    }
  }, [response, hasHandledResponse, loggedOut, navigation]);

  const onLogin = async () => {
    if (!userInfo) {
      setIsLoading(true);
      try {
        setHasHandledResponse(false);
        setLoggedOut(false);
        if (Platform.OS === 'web') {
          // Construct the authorization URL manually for web
          const authUrl = `${discovery.authorizationEndpoint}?` +
            `client_id=${encodeURIComponent(AUTH0_CLIENT_ID)}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=id_token` +
            `&scope=${encodeURIComponent('openid profile email')}` +
            `&nonce=${encodeURIComponent('nonce')}`;

          // Redirect the current window to the Auth0 login page
          window.location.assign(authUrl);
        } else {
          // For native platforms, use promptAsync to open the auth session
          const result = await promptAsync({ useProxy: false });
          // Navigation is handled in useEffect after response
        }
      } catch (error) {
        console.error('Login error', error);
        Alert.alert('Login error', error.message || 'An error occurred during login');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onLogout = async () => {
    setUserInfo(null);
    await AsyncStorage.removeItem('authToken');
    setHasHandledResponse(false);
    setLoggedOut(true);
    Alert.alert('Logged out');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Auth0 Login</Text>
      {isLoading && <ActivityIndicator size="large" color="#2D9CDB" />}
      {userInfo ? (
        <>
          <Text style={styles.userText}>Logged in as {userInfo.name}</Text>
          <Text style={styles.userText}>Email: {userInfo.email}</Text>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={onLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.message}>You are not logged in</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onLogin}
            disabled={!request && Platform.OS !== 'web'}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  userText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2D9CDB',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#EB5757',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
