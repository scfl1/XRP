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

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const registerMutation = trpc.auth.register.useMutation({
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
      alert(err.message || "تعذر إنشاء الحساب");
    },
  });

  const handleRegister = async () => {
    if (!username.trim()) {
      alert("يرجى إدخال اسم المستخدم");
      return;
    }

    if (username.trim().length < 3) {
      alert("يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      alert("اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام و(_) فقط، بدون مسافات أو رموز");
      return;
    }

    if (!email.trim()) {
      alert("يرجى إدخال البريد الإلكتروني");
      return;
    }

    if (!password) {
      alert("يرجى إدخال كلمة المرور");
      return;
    }

    if (password.length < 8) {
      alert("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);

    registerMutation.mutate({
      name: username.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
    });
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.logoSmall}>
              <Text style={styles.logoText}>C</Text>
            </View>

            <Text style={styles.brand}>CwaAX</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>إنشاء حساب</Text>

            <Text style={styles.description}>
              أنشئ حساب CwaAX جديد وابدأ الآن
            </Text>

            {/* Username */}
            <Text style={styles.label}>اسم المستخدم</Text>

            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="أدخل اسم المستخدم"
              placeholderTextColor="#8A8F98"
              autoCapitalize="none"
              textAlign="right"
            />

            {/* Email */}
            <Text style={styles.label}>البريد الإلكتروني</Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="أدخل البريد الإلكتروني"
              placeholderTextColor="#8A8F98"
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="right"
            />

            {/* Phone */}
            <Text style={styles.label}>رقم الهاتف</Text>

            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="أدخل رقم الهاتف"
              placeholderTextColor="#8A8F98"
              keyboardType="phone-pad"
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
              placeholder="8 أحرف على الأقل"
              placeholderTextColor="#8A8F98"
              secureTextEntry={!showPassword}
              textAlign="right"
            />

            {/* Confirm Password */}
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>تأكيد كلمة المرور</Text>

              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <Text style={styles.showPassword}>
                  {showConfirmPassword ? "إخفاء" : "إظهار"}
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="أعد إدخال كلمة المرور"
              placeholderTextColor="#8A8F98"
              secureTextEntry={!showConfirmPassword}
              textAlign="right"
            />

            {/* Referral */}
            <Text style={styles.label}>كود الإحالة</Text>

            <TextInput
              style={styles.input}
              value={referralCode}
              onChangeText={setReferralCode}
              placeholder="اختياري"
              placeholderTextColor="#8A8F98"
              autoCapitalize="none"
              textAlign="right"
            />

            {/* Terms */}
            <View style={styles.termsRow}>
              <Text style={styles.termsText}>
                بإنشاء الحساب، أنت توافق على الشروط والأحكام وسياسة الخصوصية.
              </Text>
            </View>

            {/* Register */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerText}>
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Text>
            </TouchableOpacity>

            {/* Login */}
            <View style={styles.loginRow}>
              <Text style={styles.loginQuestion}>
                لديك حساب بالفعل؟
              </Text>

              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLink}> تسجيل الدخول</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>CwaAX</Text>
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
    paddingVertical: 25,
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    position: "relative",
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 5,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 30,
    color: "#111827",
    marginTop: -3,
  },

  logoSmall: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  card: {
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
    marginBottom: 17,
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

  termsRow: {
    marginTop: 2,
    marginBottom: 20,
  },

  termsText: {
    color: "#777D87",
    fontSize: 12,
    lineHeight: 19,
    textAlign: "right",
  },

  registerButton: {
    height: 53,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.6,
  },

  registerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  loginRow: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 23,
  },

  loginQuestion: {
    color: "#737984",
    fontSize: 14,
  },

  loginLink: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    color: "#A0A4AC",
    fontSize: 12,
    marginTop: 25,
  },
});
