import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './auth-context';
import { supabase } from '../lib/supabase';

type ProfileType = {
  flightDate?: Date;
  currentLocation?: string;
  countriesOfInterest?: string[];
  budget?: string;
  preferredActivities?: string[];
  customActivities?: string;
  foodPreferences?: string[];
  accommodationType?: string[];
  travelGoals?: string[];
  [key: string]: any;
};

type ProfileContextType = {
  profile: ProfileType | null;
  isLoading: boolean;
  saveProfile: (data: ProfileType) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile from Supabase:', error);
          const profileJson = await AsyncStorage.getItem('profile');
          if (profileJson) {
            setProfile(JSON.parse(profileJson));
          } else {
            setProfile(null);
          }
        } else if (data) {
          setProfile(data);
          await AsyncStorage.setItem('profile', JSON.stringify(data));
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const saveProfile = async (data: ProfileType) => {
    try {
      setIsLoading(true);
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            ...data,
            flightDate: data.flightDate ? data.flightDate.toISOString() : null,
          });

        if (error) {
          console.error('Error saving profile to Supabase:', error);
          throw error;
        }
      }

      const updatedProfile = { ...profile, ...data };
      await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, isLoading, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}