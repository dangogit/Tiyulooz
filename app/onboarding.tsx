import { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import { useProfile } from "../context/profile-context";
import { ChevronRight, ChevronLeft, Calendar, MapPin, Plane, Wallet, Utensils, Home, Activity, Globe, Target } from "lucide-react-native";
import { countries, activities, accommodationTypes, foodPreferences, travelGoals } from "../constants/onboarding-data";

export default function OnboardingScreen() {
  const router = useRouter();
  const { saveProfile } = useProfile();
  const scrollViewRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [profile, setProfile] = useState({
    flightDate: new Date(),
    currentLocation: "",
    countriesOfInterest: [],
    budget: "medium", // low, medium, high
    preferredActivities: [],
    customActivities: "",
    foodPreferences: [],
    accommodationType: [],
    travelGoals: [],
  });

  const steps = [
    {
      title: "מתי אתה טס?",
      icon: <Plane size={32} color={colors.primary} />,
      component: (
        <View style={styles.stepContent}>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => {
              // For simplicity, we'll just show a message on web
              if (Platform.OS === 'web') {
                alert('בחר תאריך בדפדפן או באפליקציה');
              }
            }}
          >
            <Calendar size={24} color={colors.text} />
            <Text style={styles.dateText}>
              {profile.flightDate.toLocaleDateString("he-IL")}
            </Text>
          </TouchableOpacity>
          
          {Platform.OS === 'web' && (
            <TextInput
              style={styles.textInput}
              placeholder="הכנס תאריך (YYYY-MM-DD)"
              onChangeText={(text) => {
                const date = new Date(text);
                if (!isNaN(date.getTime())) {
                  setProfile({ ...profile, flightDate: date });
                }
              }}
              value={profile.flightDate.toISOString().split('T')[0]}
              textAlign="right"
            />
          )}
        </View>
      ),
    },
    {
      title: "איפה אתה נמצא כרגע?",
      icon: <MapPin size={32} color={colors.primary} />,
      component: (
        <View style={styles.stepContent}>
          <TextInput
            style={styles.textInput}
            placeholder="הכנס את המיקום הנוכחי שלך"
            value={profile.currentLocation}
            onChangeText={(text) => setProfile({ ...profile, currentLocation: text })}
            textAlign="right"
          />
        </View>
      ),
    },
    {
      title: "לאן אתה מעוניין לטייל?",
      icon: <Globe size={32} color={colors.primary} />,
      component: (
        <View style={styles.stepContent}>
          <ScrollView style={styles.optionsScrollView}>
            <View style={styles.optionsContainer}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country.id}
                  style={[
                    styles.optionButton,
                    profile.countriesOfInterest.includes(country.id) && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    const updatedCountries = profile.countriesOfInterest.includes(country.id)
                      ? profile.countriesOfInterest.filter((id) => id !== country.id)
                      : [...profile.countriesOfInterest, country.id];
                    setProfile({ ...profile, countriesOfInterest: updatedCountries });
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      profile.countriesOfInterest.includes(country.id) && styles.optionTextSelected,
                    ]}
                  >
                    {country.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      ),
    },
    {
      title: "מה התקציב שלך לטיול?",
      icon: <Wallet size={32} color={colors.primary} />,
      component: (
        <View style={styles.stepContent}>
          <View style={styles.budgetContainer}>
            <TouchableOpacity
              style={[
                styles.budgetButton,
                profile.budget === "low" && styles.budgetButtonSelected,
              ]}
              onPress={() => setProfile({ ...profile, budget: "low" })}
            >
              <Text
                style={[
                  styles.budgetText,
                  profile.budget === "low" && styles.budgetTextSelected,
                ]}
              >
                נמוך
              </Text>
              <Text style={styles.budgetSubtext}>עד 50$ ליום</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.budgetButton,
                profile.budget === "medium" && styles.budgetButtonSelected,
              ]}
              onPress={() => setProfile({ ...profile, budget: "medium" })}
            >
              <Text
                style={[
                  styles.budgetText,
                  profile.budget === "medium" && styles.budgetTextSelected,
                ]}
              >
                בינוני
              </Text>
              <Text style={styles.budgetSubtext}>50$-100$ ליום</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.budgetButton,
                profile.budget === "high" && styles.budgetButtonSelected,
              ]}
              onPress={() => setProfile({ ...profile, budget: "high" })}
            >
              <Text
                style={[
                  styles.budgetText,
                  profile.budget === "high" && styles.budgetTextSelected,
                ]}
              >
                גבוה
              </Text>
              <Text style={styles.budgetSubtext}>מעל 100$ ליום</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    },
    {
      title: "אילו פעילויות אתה מעדיף?",
      icon: <Activity size={32} color={colors.primary} />,
      component: (
        <View style={styles.stepContent}>
          <ScrollView style={styles.optionsScrollView}>
            <View style={styles.optionsContainer}>
              {activities.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.optionButton,
                    profile.preferredActivities.includes(activity.id) && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    const updatedActivities = profile.preferredActivities.includes(activity.id)
                      ? profile.preferredActivities.filter((id) => id !== activity.id)
                      : [...profile.preferredActivities, activity.id];
                    setProfile({ ...profile, preferredActivities: updatedActivities });
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      profile.preferredActivities.includes(activity.id) && styles.optionTextSelected,
                    ]}
                  >
                    {activity.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TextInput
            style={[styles.textInput, styles.customInput]}
            placeholder="פעילויות נוספות (אופציונלי)"
            value={profile.customActivities}
            onChangeText={(text) => setProfile({ ...profile, customActivities: text })}
            textAlign="right"
          />
        </View>
      ),
    },
    {
      title: "אילו מאכלים אתה אוהב?",
      icon: <Utensils size={32} color={colors.primary} />,
      component: (
        <View style={styles.stepContent}>
          <ScrollView style={styles.optionsScrollView}>
            <View style={styles.optionsContainer}>
              {foodPreferences.map((food) => (
                <TouchableOpacity
                  key={food.id}
                  style={[
                    styles.optionButton,
                    profile.foodPreferences.includes(food.id) && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    const updatedFoods = profile.foodPreferences.includes(food.id)
                      ? profile.foodPreferences.filter((id) => id !== food.id)
                      : [...profile.foodPreferences, food.id];
                    setProfile({ ...profile, foodPreferences: updatedFoods });
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      profile.foodPreferences.includes(food.id) && styles.optionTextSelected,
                    ]}
                  >
                    {food.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      ),
    },
    {
      title: "איפה אתה מעדיף לישון?",
      icon: <Home size={32} color={colors.primary} />,
      component: (
        <View style={styles.stepContent}>
          <ScrollView style={styles.optionsScrollView}>
            <View style={styles.optionsContainer}>
              {accommodationTypes.map((accommodation) => (
                <TouchableOpacity
                  key={accommodation.id}
                  style={[
                    styles.optionButton,
                    profile.accommodationType.includes(accommodation.id) && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    const updatedAccommodations = profile.accommodationType.includes(accommodation.id)
                      ? profile.accommodationType.filter((id) => id !== accommodation.id)
                      : [...profile.accommodationType, accommodation.id];
                    setProfile({ ...profile, accommodationType: updatedAccommodations });
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      profile.accommodationType.includes(accommodation.id) && styles.optionTextSelected,
                    ]}
                  >
                    {accommodation.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      ),
    },
    {
      title: "מה המטרות שלך בטיול?",
      icon: <Target size={32} color={colors.primary} />,
      component: (
        <View style={styles.stepContent}>
          <ScrollView style={styles.optionsScrollView}>
            <View style={styles.optionsContainer}>
              {travelGoals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.optionButton,
                    profile.travelGoals.includes(goal.id) && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    const updatedGoals = profile.travelGoals.includes(goal.id)
                      ? profile.travelGoals.filter((id) => id !== goal.id)
                      : [...profile.travelGoals, goal.id];
                    setProfile({ ...profile, travelGoals: updatedGoals });
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      profile.travelGoals.includes(goal.id) && styles.optionTextSelected,
                    ]}
                  >
                    {goal.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    } else {
      saveProfile(profile);
      router.replace("/(tabs)/guides");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    }
  };

  const handleSkip = () => {
    saveProfile(profile);
    router.replace("/(tabs)/guides");
  };

  const currentStepData = steps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepTitle}>{currentStepData.title}</Text>
        <View style={styles.iconContainer}>{currentStepData.icon}</View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.contentContainer}
        contentContainerStyle={styles.content}
      >
        {currentStepData.component}
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={24} color={colors.textLight} />
          <Text style={styles.navButtonText}>חזור</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>דלג</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? "סיים" : "הבא"}
          </Text>
          <ChevronRight size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.grayLight,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  stepTitle: {
    fontSize: 22,
    fontFamily: "Heebo-Bold",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  stepContent: {
    marginBottom: 40,
  },
  datePickerButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
    textAlign: "right",
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: "Heebo-Regular",
  },
  customInput: {
    marginTop: 20,
  },
  optionsScrollView: {
    maxHeight: 400,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    width: "48%",
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Heebo-Medium",
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
  },
  budgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  budgetButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "30%",
  },
  budgetButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  budgetText: {
    fontSize: 16,
    fontFamily: "Heebo-Medium",
    color: colors.text,
    marginBottom: 4,
  },
  budgetTextSelected: {
    color: colors.primary,
  },
  budgetSubtext: {
    fontSize: 12,
    fontFamily: "Heebo-Regular",
    color: colors.textLight,
    textAlign: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.grayLight,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: "Heebo-Medium",
    color: colors.textLight,
    marginRight: 8,
  },
  nextButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: "Heebo-Bold",
    color: colors.white,
    marginRight: 8,
  },
  skipButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.grayLight,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: "Heebo-Medium",
    color: colors.textLight,
  },
});