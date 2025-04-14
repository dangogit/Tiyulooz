import { useState, useEffect } from 'react';
import { trips as mockTrips, recommendations as mockRecommendations } from '../mocks/trips';

export type TripType = typeof mockTrips[0];
export type RecommendationType = typeof mockRecommendations[0];
export type ItineraryItemType = { id: string; date: string; type: string; name: string; price: number; custom?: boolean };

export function useTrips() {
  const [trips, setTrips] = useState<TripType[]>(mockTrips);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendationType[]>(mockRecommendations);

  useEffect(() => {
    // In a real app, this would fetch trips from an API
    // For demo purposes, we'll just use the mock data
    setIsLoading(false);
  }, []);

  const addTrip = (trip: TripType) => {
    setTrips([...trips, trip]);
  };

  const updateTrip = (tripId: string, updatedTrip: Partial<TripType>) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, ...updatedTrip } : trip
    ));
  };

  const deleteTrip = (tripId: string) => {
    setTrips(trips.filter(trip => trip.id !== tripId));
  };

  const addItineraryItem = (tripId: string, date: string, item: ItineraryItemType) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        const currentItinerary = trip.itinerary || {};
        const currentDayItems = currentItinerary[date] || [];
        return {
          ...trip,
          itinerary: {
            ...currentItinerary,
            [date]: [...currentDayItems, item]
          }
        };
      }
      return trip;
    }));
  };

  const removeItineraryItem = (tripId: string, date: string, itemId: string) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId && trip.itinerary && trip.itinerary[date]) {
        return {
          ...trip,
          itinerary: {
            ...trip.itinerary,
            [date]: trip.itinerary[date].filter(item => item.id !== itemId)
          }
        };
      }
      return trip;
    }));
  };

  return {
    trips,
    isLoading,
    recommendations,
    addTrip,
    updateTrip,
    deleteTrip,
    addItineraryItem,
    removeItineraryItem
  };
}