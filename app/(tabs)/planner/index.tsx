import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrips } from '../../../hooks/use-trips';
import { useProfile } from '../../../context/profile-context';
import { colors } from '../../../constants/colors';
import { Calendar, Plus, MapPin, Bed, Utensils, Plane, DollarSign, Clock, Trash2 } from 'lucide-react-native';

// Define types for better type safety
interface Activity {
  name: string;
  date: string;
  price: number;
  booked: boolean;
}

interface Accommodation {
  name: string;
  image: string;
  type: string;
  address: string;
  price: number;
}

interface Destination {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  accommodation: Accommodation;
  activities: Activity[];
}

interface RecommendedItem {
  id: string;
  type: 'destination' | 'accommodation' | 'restaurant' | 'activity';
  name: string;
  image: string;
  price: number;
  description: string;
  suitableFor: string[];
}

interface ItineraryItem {
  id: string;
  date: string;
  type: string;
  name: string;
  price: number;
  custom?: boolean;
}

export default function PlannerScreen() {
  const { trips, isLoading, recommendations, addItineraryItem, removeItineraryItem } = useTrips();
  const { profile } = useProfile();
  const [selectedTrip, setSelectedTrip] = useState(trips.length > 0 ? trips[0].id : null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [customEvent, setCustomEvent] = useState({ name: '', price: '', date: '' });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const currentTrip = trips.find(trip => trip.id === selectedTrip);
  const tripDates = currentTrip ? getTripDates(currentTrip.startDate, currentTrip.endDate) : [];

  useEffect(() => {
    if (tripDates.length > 0 && !selectedDate) {
      setSelectedDate(tripDates[0]);
    }
  }, [tripDates]);

  const getTripDates = (start: string, end: string) => {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    while (startDate <= endDate) {
      dates.push(startDate.toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
  };

  const renderTripItem = ({ item }: { item: typeof trips[0] }) => (
    <TouchableOpacity
      style={[
        styles.tripItem,
        selectedTrip === item.id && styles.tripItemSelected
      ]}
      onPress={() => setSelectedTrip(item.id)}
    >
      <Text style={[
        styles.tripItemText,
        selectedTrip === item.id && styles.tripItemTextSelected
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderDateItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.dateItem,
        selectedDate === item && styles.dateItemSelected
      ]}
      onPress={() => setSelectedDate(item)}
    >
      <Text style={[
        styles.dateItemText,
        selectedDate === item && styles.dateItemTextSelected
      ]}>
        {new Date(item).toLocaleDateString('he-IL')}
      </Text>
    </TouchableOpacity>
  );

  const renderRecommendationItem = ({ item }: { item: RecommendedItem }) => (
    <TouchableOpacity
      style={styles.recommendationItem}
      onPress={() => {
        if (selectedDate && currentTrip) {
          addItineraryItem(currentTrip.id, selectedDate, {
            id: item.id,
            date: selectedDate,
            type: item.type,
            name: item.name,
            price: item.price
          });
        }
      }}
    >
      <Image source={{ uri: item.image }} style={styles.recommendationImage} />
      <View style={styles.recommendationDetails}>
        <Text style={styles.recommendationName}>{item.name}</Text>
        <Text style={styles.recommendationDescription}>{item.description}</Text>
        <Text style={styles.recommendationPrice}>${item.price}</Text>
      </View>
      <View style={styles.addButton}>
        <Plus size={16} color={colors.white} />
      </View>
    </TouchableOpacity>
  );

  const renderItineraryItem = ({ item }: { item: ItineraryItem }) => (
    <View style={styles.itineraryItem}>
      <View style={styles.itineraryItemDetails}>
        <Text style={styles.itineraryItemName}>{item.name}</Text>
        <Text style={styles.itineraryItemType}>{getTypeLabel(item.type)}</Text>
        <Text style={styles.itineraryItemPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => currentTrip && removeItineraryItem(currentTrip.id, selectedDate, item.id)}
      >
        <Trash2 size={16} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'destination': return 'יעד';
      case 'accommodation': return 'לינה';
      case 'restaurant': return 'מסעדה';
      case 'activity': return 'פעילות';
      default: return 'מותאם אישית';
    }
  };

  const getDailyBudget = () => {
    if (!currentTrip || !selectedDate) return { total: 0, accommodation: 0 };
    const dayItems = currentTrip.itinerary?.[selectedDate] || [];
    const total = dayItems.reduce((sum, item) => sum + item.price, 0);
    const accommodation = dayItems
      .filter(item => item.type === 'accommodation')
      .reduce((sum, item) => sum + item.price, 0);
    return { total, accommodation };
  };

  const handleAddCustomEvent = () => {
    if (!customEvent.name || !customEvent.price || !customEvent.date || !currentTrip) return;
    
    addItineraryItem(currentTrip.id, customEvent.date, {
      id: `custom-${Date.now()}`,
      date: customEvent.date,
      type: 'custom',
      name: customEvent.name,
      price: parseFloat(customEvent.price) || 0,
      custom: true
    });
    setCustomEvent({ name: '', price: '', date: '' });
    setShowCustomForm(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>טוען טיולים...</Text>
      </View>
    );
  }

  if (trips.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>אין לך טיולים מתוכננים</Text>
          <Text style={styles.emptyDescription}>
            התחל לתכנן את הטיול הבא שלך ונעזור לך לארגן את כל הפרטים
          </Text>
          <TouchableOpacity style={styles.createButton}>
            <Plus size={20} color={colors.white} />
            <Text style={styles.createButtonText}>צור טיול חדש</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const dailyBudget = getDailyBudget();
  const filteredRecommendations = recommendations.filter(rec => {
    if (!profile) return true;
    if (profile.budget && parseInt(profile.budget) < rec.price) return false;
    if (profile.preferredActivities && profile.preferredActivities.length > 0) {
      return rec.suitableFor.some(activity => profile.preferredActivities?.includes(activity));
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.tripsContainer}>
        <FlatList
          data={trips}
          renderItem={renderTripItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tripsList}
        />
        <TouchableOpacity style={styles.addTripButton}>
          <Plus size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {currentTrip && (
        <ScrollView style={styles.tripDetails} showsVerticalScrollIndicator={false}>
          <View style={styles.tripHeader}>
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitle}>{currentTrip.title}</Text>
              <View style={styles.tripDates}>
                <Clock size={16} color={colors.textLight} />
                <Text style={styles.tripDatesText}>
                  {new Date(currentTrip.startDate).toLocaleDateString('he-IL')} - {new Date(currentTrip.endDate).toLocaleDateString('he-IL')}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.calendarContainer}>
            <Text style={styles.sectionTitle}>לוח זמנים</Text>
            <FlatList
              data={tripDates}
              renderItem={renderDateItem}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
            />
          </View>
          
          {selectedDate && (
            <View style={styles.itineraryContainer}>
              <Text style={styles.sectionTitle}>מסלול ל-{new Date(selectedDate).toLocaleDateString('he-IL')}</Text>
              <View style={styles.budgetSummary}>
                <View style={styles.budgetSummaryItem}>
                  <Text style={styles.budgetSummaryLabel}>סה"כ יומי:</Text>
                  <Text style={styles.budgetSummaryValue}>${dailyBudget.total}</Text>
                </View>
                <View style={styles.budgetSummaryItem}>
                  <Text style={styles.budgetSummaryLabel}>לינה:</Text>
                  <Text style={[styles.budgetSummaryValue, styles.accommodationFocus]}>${dailyBudget.accommodation}</Text>
                </View>
              </View>
              
              <FlatList
                data={currentTrip.itinerary?.[selectedDate] || []}
                renderItem={renderItineraryItem}
                keyExtractor={(item) => item.id}
                style={styles.itineraryList}
                ListEmptyComponent={
                  <Text style={styles.emptyItineraryText}>אין פריטים מתוכננים ליום זה</Text>
                }
              />
            </View>
          )}
          
          <View style={styles.recommendationsContainer}>
            <View style={styles.recommendationsHeader}>
              <Text style={styles.sectionTitle}>המלצות</Text>
              <TouchableOpacity 
                style={styles.customButton}
                onPress={() => setShowCustomForm(!showCustomForm)}
              >
                <Text style={styles.customButtonText}>+ הוסף אירוע מותאם אישית</Text>
              </TouchableOpacity>
            </View>
            
            {showCustomForm && (
              <View style={styles.customForm}>
                <TextInput
                  style={styles.input}
                  placeholder="שם האירוע"
                  value={customEvent.name}
                  onChangeText={text => setCustomEvent({ ...customEvent, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="מחיר ($)"
                  value={customEvent.price}
                  keyboardType="numeric"
                  onChangeText={text => setCustomEvent({ ...customEvent, price: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="תאריך (YYYY-MM-DD)"
                  value={customEvent.date}
                  onChangeText={text => setCustomEvent({ ...customEvent, date: text })}
                />
                <TouchableOpacity 
                  style={styles.submitCustomButton}
                  onPress={handleAddCustomEvent}
                >
                  <Text style={styles.submitCustomButtonText}>הוסף ללוח זמנים</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <FlatList
              data={filteredRecommendations}
              renderItem={renderRecommendationItem}
              keyExtractor={(item) => item.id}
              style={styles.recommendationsList}
              ListEmptyComponent={
                <Text style={styles.emptyRecommendationsText}>אין המלצות זמינות כרגע</Text>
              }
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    fontFamily: 'Heebo-Bold',
    fontSize: 16,
    color: colors.white,
    marginRight: 8,
  },
  tripsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tripsList: {
    paddingHorizontal: 16,
  },
  tripItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    marginRight: 8,
  },
  tripItemSelected: {
    backgroundColor: colors.primary,
  },
  tripItemText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    color: colors.text,
  },
  tripItemTextSelected: {
    color: colors.white,
  },
  addTripButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tripDetails: {
    flex: 1,
    padding: 16,
  },
  tripHeader: {
    marginBottom: 24,
  },
  tripInfo: {
    marginBottom: 16,
  },
  tripTitle: {
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  tripDates: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  tripDatesText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Heebo-Bold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  dateList: {
    paddingLeft: 16,
  },
  dateItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    marginRight: 8,
  },
  dateItemSelected: {
    backgroundColor: colors.secondary,
  },
  dateItemText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    color: colors.text,
  },
  dateItemTextSelected: {
    color: colors.white,
  },
  itineraryContainer: {
    marginBottom: 24,
  },
  budgetSummary: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  budgetSummaryItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  budgetSummaryLabel: {
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  budgetSummaryValue: {
    fontFamily: 'Heebo-Bold',
    fontSize: 16,
    color: colors.text,
  },
  accommodationFocus: {
    color: colors.primary,
    fontSize: 18,
  },
  itineraryList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itineraryItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itineraryItemDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itineraryItemName: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  itineraryItemType: {
    fontFamily: 'Heebo-Regular',
    fontSize: 12,
    color: colors.textLight,
  },
  itineraryItemPrice: {
    fontFamily: 'Heebo-Bold',
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  emptyItineraryText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    padding: 20,
  },
  recommendationsContainer: {
    marginBottom: 24,
  },
  recommendationsHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customButton: {
    padding: 8,
  },
  customButtonText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  customForm: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    textAlign: 'right',
  },
  submitCustomButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitCustomButtonText: {
    fontFamily: 'Heebo-Bold',
    fontSize: 14,
    color: colors.white,
  },
  recommendationsList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationItem: {
    flexDirection: 'row-reverse',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  recommendationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  recommendationDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  recommendationName: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  recommendationDescription: {
    fontFamily: 'Heebo-Regular',
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  recommendationPrice: {
    fontFamily: 'Heebo-Bold',
    fontSize: 14,
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyRecommendationsText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    padding: 20,
  },
});