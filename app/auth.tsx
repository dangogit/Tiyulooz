import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { colors } from "../constants/colors";
import { useAuth } from "../context/auth-context";
import { Facebook, Mail, Globe } from "lucide-react-native";

export default function AuthScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithFacebook, isLoading } = useAuth();
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      const success = await signInWithGoogle();
      if (success) {
        router.replace("/onboarding");
      }
    } catch (err) {
      setError("התחברות נכשלה. נסה שוב מאוחר יותר.");
      console.error(err);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setError("");
      const success = await signInWithFacebook();
      if (success) {
        router.replace("/onboarding");
      }
    } catch (err) {
      setError("התחברות נכשלה. נסה שוב מאוחר יותר.");
      console.error(err);
    }
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=200&auto=format&fit=crop" }}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.title}>בקפקר</Text>
            <Text style={styles.subtitle}>המדריך השלם למטייל הישראלי</Text>
          </View>

          <View style={styles.authContainer}>
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <View style={styles.buttonContent}>
                <Globe size={24} color={colors.black} />
                <Text style={styles.buttonText}>התחבר עם Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.authButton}
              onPress={handleFacebookSignIn}
              disabled={isLoading}
            >
              <View style={styles.buttonContent}>
                <Facebook size={24} color={colors.black} />
                <Text style={styles.buttonText}>התחבר עם Facebook</Text>
              </View>
            </TouchableOpacity>

            {Platform.OS !== "web" && (
              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: colors.info }]}
                disabled={isLoading}
              >
                <View style={styles.buttonContent}>
                  <Mail size={24} color={colors.white} />
                  <Text style={[styles.buttonText, { color: colors.white }]}>
                    התחבר עם אימייל
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              בהתחברות אתה מסכים לתנאי השימוש ומדיניות הפרטיות
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
    opacity: 0.9,
    textAlign: "center",
  },
  authContainer: {
    width: "100%",
    maxWidth: 320,
    marginVertical: 40,
  },
  authButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginLeft: 12,
    textAlign: "center",
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    marginTop: 16,
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    color: colors.white,
    opacity: 0.8,
    textAlign: "center",
    fontSize: 14,
  },
});