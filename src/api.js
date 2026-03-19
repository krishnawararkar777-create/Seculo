export const API_BASE_URL = 'https://seculo-2.onrender.com/api';

export const api = {
  async onboard(data) {
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
    } catch (error) {
      return { error: error.message };
    }
  },

  async createBot(userId) {
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
    } catch (error) {
      return { error: error.message };
    }
  },

  async startBot(userId) {
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
    } catch (error) {
      return { error: error.message };
    }
  },

  async stopBot(userId) {
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
    } catch (error) {
      return { error: error.message };
    }
  },

  async deleteBot(userId) {
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
    } catch (error) {
      return { error: error.message };
    }
  },

  async getDashboard(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get dashboard');
      }
      
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },
};
