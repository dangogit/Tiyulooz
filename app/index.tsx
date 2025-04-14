import { useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/auth-context";
import { useProfile } from "../context/profile-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { colors } from "../constants/colors";

export default function StartScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasProfile, isLoading: profileLoading } = useProfile();
  
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      if (!authLoading && !profileLoading) {
        // Wait a bit to show splash screen
        setTimeout(() => {
          if (!isAuthenticated) {
            router.replace("/auth");
          } else if (!hasProfile) {
            router.replace("/onboarding");
          } else {
            router.replace("/(tabs)");
          }
        }, 1500);
      }
    };
    
    checkAuthAndNavigate();
  }, [isAuthenticated, hasProfile, authLoading, profileLoading, router]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=200&auto=format&fit=crop" }}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
      <ActivityIndicator size="large" color={colors.white} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
});