import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const API_BASE_URL = 'https://seculo-2.onrender.com/api';

export function useBot() {
  const [botStatus, setBotStatus] = useState('stopped');
  const [qrCode, setQrCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const pollingRef = useRef(null);

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  };

  const fetchStatus = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/bot/status`, { headers });
      const data = await response.json();

      if (response.ok) {
        setBotStatus(data.status || 'stopped');
        setQrCode(data.qrCode || null);

        if (data.status === 'qr_ready') {
          setQrCode(data.qrCode);
        }

        if (data.status === 'live') {
          setBotStatus('live');
          setQrCode(null);
          stopPolling();
        }

        if (data.status === 'stopped') {
          stopPolling();
        }
      }
    } catch (err) {
      console.error('Status fetch error:', err);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(fetchStatus, 2000);
  }, [fetchStatus]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchStatus().then(() => {
      if (botStatus === 'connecting' || botStatus === 'qr_ready') {
        startPolling();
      }
    });

    return () => {
      stopPolling();
    };
  }, []);

  const deployBot = async () => {
    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/bot/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok) {
        setBotStatus('connecting');
        startPolling();
      } else {
        console.error('Deploy error:', data.error);
      }
    } catch (err) {
      console.error('Deploy error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopBot = async () => {
    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/bot/stop`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      if (response.ok) {
        setBotStatus('stopped');
        setQrCode(null);
        stopPolling();
      }
    } catch (err) {
      console.error('Stop error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { botStatus, qrCode, isLoading, deployBot, stopBot };
}
