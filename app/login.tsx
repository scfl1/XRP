import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { trpc } from "@/lib/trpc";
import * as Auth from "@/lib/_core/auth";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      if (data.token) {
        await Auth.setSessionToken(data.token);
      }
      await utils.auth.me.invalidate();
      setLoading(false);
      router.replace("/(tabs)");
    },
    onError: (err) => {
      setLoading(false);
      alert(err.message || "بيانات تسجيل الدخول غير صحيحة");
    },
  });

  const handleLogin = async () => {
    if (!identifier.trim()) {
      alert("يرجى إدخال البريد الإلكتروني أو رقم الهاتف");
      return;
    }

    if (!password) {
      alert("يرجى إدخال كلمة المرور");
      return;
    }

    setLoading(true);
    loginMutation.mutate({ identifier: identifier.trim(), password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>C</Text>
            </View>

            <Text style={styles.brand}>CwaAX</Text>
            <Text style={styles.subtitle}>مرحباً بعودتك</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>تسجيل الدخول</Text>

            <Text style={styles.description}>
              قم بتسجيل الدخول إلى حسابك للمتابعة
            </Text>

            {/* Email / Phone */}
            <Text style={styles.label}>البريد الإلكتروني أو رقم الهاتف</Text>

            <TextInput
              style={styles.input}
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="أدخل البريد الإلكتروني أو رقم الهاتف"
              placeholderTextColor="#8A8F98"
              autoCapitalize="none"
              keyboardType="email-address"
              textAlign="right"
            />

            {/* Password */}
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>كلمة المرور</Text>

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showPassword}>
                  {showPassword ? "إخفاء" : "إظهار"}
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="أدخل كلمة المرور"
              placeholderTextColor="#8A8F98"
              secureTextEntry={!showPassword}
              textAlign="right"
            />

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => alert("سيتم إضافة استعادة كلمة المرور لاحقاً")}
            >
              <Text style={styles.forgot}>نسيت كلمة المرور؟</Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Text>
            </TouchableOpacity>

            {/* Register */}
            <View style={styles.registerRow}>
              <Text style={styles.registerQuestion}>
                ليس لديك حساب؟
              </Text>

              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}> إنشاء حساب</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            باستخدامك CwaAX فإنك توافق على الشروط والأحكام وسياسة الخصوصية.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 35,
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
  },

  brand: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.5,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#737984",
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E9EBEF",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#111827",
    textAlign: "right",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: "#737984",
    textAlign: "right",
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#252A32",
    textAlign: "right",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDE1E7",
    borderRadius: 12,
    backgroundColor: "#FAFBFC",
    paddingHorizontal: 15,
    color: "#111827",
    fontSize: 15,
    marginBottom: 18,
  },

  passwordHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  showPassword: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  forgotContainer: {
    alignItems: "flex-start",
    marginTop: -5,
    marginBottom: 20,
  },

  forgot: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
  },

  loginButton: {
    height: 53,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.6,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  registerRow: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 23,
  },

  registerQuestion: {
    color: "#737984",
    fontSize: 14,
  },

  registerLink: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    color: "#969BA4",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 25,
    paddingHorizontal: 15,
  },
});
