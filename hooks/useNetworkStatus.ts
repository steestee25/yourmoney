import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Hook per verificare lo stato della connessione di rete
 * Ritorna true se online, false se offline
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial network state
    const checkNetworkState = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsOnline(state.isConnected ?? true);
        setIsLoading(false);
      } catch (err) {
        console.error('Errore nel check dello stato di rete:', err);
        setIsOnline(true); // Default to online on error
        setIsLoading(false);
      }
    };

    checkNetworkState();

    // Subscribe to network state changes
    const subscription = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
      console.log(`🌐 Network status: ${state.isConnected ? 'ONLINE' : 'OFFLINE'}`);
    });

    return () => {
      // Cleanup subscription
      subscription();
    };
  }, []);

  return { isOnline, isLoading };
};

/**
 * Funzione utility per verificare lo stato della rete (senza hook)
 * Utile quando non sei in un componente React
 */
export const checkNetworkState = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected ?? true;
  } catch (err) {
    console.error('Errore nel check della rete:', err);
    return true; // Default to online on error
  }
};
