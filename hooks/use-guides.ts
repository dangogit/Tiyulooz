import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guides as mockGuides } from '../mocks/guides';

export function useGuides() {
  const [guides, setGuides] = useState(mockGuides);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        // In a real app, this would fetch guides from an API or scrape content from websites
        // For demo purposes, we'll use the mock data and check for offline status
        const offlineGuides = await AsyncStorage.getItem('offlineGuides');
        if (offlineGuides) {
          const offlineGuideIds = JSON.parse(offlineGuides);
          const updatedGuides = guides.map(guide => ({
            ...guide,
            isOffline: offlineGuideIds.includes(guide.id)
          }));
          setGuides(updatedGuides);
        }
      } catch (error) {
        console.error('Error loading guides:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGuides();
  }, []);

  const downloadGuide = async (guideId: string) => {
    try {
      // In a real app, this would download the guide content for offline use
      const offlineGuides = await AsyncStorage.getItem('offlineGuides');
      let offlineGuideIds = offlineGuides ? JSON.parse(offlineGuides) : [];
      
      if (!offlineGuideIds.includes(guideId)) {
        offlineGuideIds.push(guideId);
        await AsyncStorage.setItem('offlineGuides', JSON.stringify(offlineGuideIds));
      }
      
      // Update the guides state to reflect the change
      setGuides(guides.map(guide => 
        guide.id === guideId ? { ...guide, isOffline: true } : guide
      ));
    } catch (error) {
      console.error('Error downloading guide:', error);
    }
  };

  const getGuideById = (guideId: string) => {
    return guides.find(guide => guide.id === guideId);
  };

  return {
    guides,
    isLoading,
    downloadGuide,
    getGuideById,
  };
}