
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  useColorScheme,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, borderRadius } from "@/theme/theme";
// Assuming you have a router setup like Expo Router
import { useRouter } from "expo-router";
import { useAuthStore } from "@/context/authContext";

export default function LoginScreen() {
  const { isAuth, setIsAuth } = useAuthStore();
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log("Login button pressed");

    setIsLoading(true);
    // validation for empty fields
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }
    // validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    // validation for password length
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }
    // validation for password complexity (at least one number and one special character)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least one number and one special character."
      );
      return;
    }


    // if (isLoading) return; // Prevent multiple submissions
    // TODO : add 3rd party authentication logic for google sign in 

    setIsAuth(true); // Set authentication state to true
    // if (isAuth) {
    //   router.replace("/(tabs)/"); // Navigate to main app or dashboard
    // } else {
    //   Alert.alert("Authentication Failed", "Please check your credentials and try again.");
    // }
    // setIsLoading(false); // Reset loading state
    // Simulate API Call
    setTimeout(() => {

      // setIsLoading(false);
      setIsLoading(false);
      // Navigate to main app or dashboard
      router.replace("/(tabs)/");
    }, 1000); // Simulate a 1-second delay for the API call
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={systemColorScheme === "light" ? "dark-content" : "light-content"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={[styles.logoText, { color: theme.primary }]}>AI Career</Text>
            <Text style={[styles.welcomeTitle, { color: theme.textPrimary }]}>Welcome Back</Text>
            <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
              Sign in to continue your learning journey.
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                placeholder="name@example.com"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Password

              </Text>

              {/* (6-20 characters, at least one number and one special character)  */}
              <View style={[styles.passwordContainer, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
                <TextInput
                  style={[styles.passwordInput, { color: theme.textPrimary }]}
                  placeholder="6-20 characters with at least one number and one special character"
                  // placeholder="••••••••"
                  placeholderTextColor={theme.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Text style={[styles.toggleText, { color: theme.primary }]}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Forgot Password Link */}
            <Pressable style={styles.forgotPassword}>
              <Text style={[styles.forgotText, { color: theme.textSecondary }]}>Forgot Password?</Text>
            </Pressable>

            {/* Login Button */}
            <Pressable
              style={[styles.button, { backgroundColor: isLoading ? theme.textMuted : theme.primary }]}
              onPress={() => {
                // setIsLoading(true);
                handleLogin();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={[styles.buttonText, { color: theme.primaryButtonText }]}>Sign In</Text>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text style={[styles.footerLink, { color: theme.primary }]}>Create one</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: spacing.lg },
  heroSection: { marginBottom: spacing.xl, alignItems: "center" },
  logoText: { fontSize: 16, fontWeight: "800", letterSpacing: 1, marginBottom: spacing.sm },
  welcomeTitle: { fontSize: 32, fontWeight: "800", marginBottom: spacing.xs },
  welcomeSubtitle: { fontSize: 16, textAlign: "center" },

  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: { marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: "600", marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: 16,
    height: 50,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    height: 50,
    paddingHorizontal: spacing.md,
  },
  passwordInput: { flex: 1, fontSize: 16, height: "100%" },
  toggleText: { fontSize: 14, fontWeight: "600" },

  forgotPassword: { alignSelf: "flex-end", marginBottom: spacing.xl },
  forgotText: { fontSize: 14, fontWeight: "500" },

  button: {
    height: 50,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: { fontSize: 16, fontWeight: "700" },

  footer: { flexDirection: "row", justifyContent: "center", marginTop: spacing.xl },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: "700" },
});