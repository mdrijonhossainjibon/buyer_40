// API client for ads settings management

export interface AdsSettings {
  _id?: string;
  enableGigaPubAds: boolean;
  gigaPubAppId: string;
  defaultAdsReward: number;
  adsWatchLimit: number;
  adsRewardMultiplier: number;
  minWatchTime: number;
  monetagEnabled: boolean;
  monetagZoneId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class AdsAPI {
  private baseUrl = '/api/admin/ads';

  // Get ads settings
  async getSettings(): Promise<ApiResponse<AdsSettings>> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ads settings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch ads settings'
      };
    }
  }

  // Update ads settings
  async updateSettings(settings: Omit<AdsSettings, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AdsSettings>> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating ads settings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update ads settings'
      };
    }
  }
}

// Export singleton instance
export const adsAPI = new AdsAPI();
export default adsAPI;
