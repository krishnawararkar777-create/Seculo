const API_BASE_URL = 'https://seculo-2.onrender.com';

export interface OnboardData {
  whatsapp_number: string;
  gemini_api_key: string;
  plan: string;
}

export interface BotCreateData {
  user_id: string;
}

export interface DashboardData {
  bot_status: string;
  plan: string;
  whatsapp_number: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}

export const api = {
  async onboard(data: OnboardData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to onboard');
      }
      
      return await response.json();
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async createBot(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bot/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create bot');
      }
      
      return await response.json();
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async startBot(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bot/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start bot');
      }
      
      return await response.json();
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async stopBot(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bot/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to stop bot');
      }
      
      return await response.json();
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async deleteBot(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bot/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete bot');
      }
      
      return await response.json();
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getDashboard(userId: string): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get dashboard');
      }
      
      return await response.json();
    } catch (error: any) {
      return { error: error.message };
    }
  },
};
