import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { CwaLogo } from "@/components/cwaax-ui";
import { CWAAX } from "@/constants/cwaax";
import { trpc } from "@/lib/trpc";
import * as Auth from "@/lib/_core/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = trpc.auth.login.useMutation();
  const submit = async () => {
    if (!identifier.trim() || !password) return Alert.alert("بيانات ناقصة", "أدخل البريد الإلكتروني أو اسم المستخدم وكلمة المرور.");
    setLoading(true);
    try {
      const result = await login.mutateAsync({ identifier: identifier.trim(), password });
      if (result.token) await Auth.setSessionToken(result.token);
      await Auth.setUserInfo({ ...result.user, lastSignedIn: new Date(result.user.lastSignedIn) });
      router.replace(result.user.role === "admin" ? "/admin" : "/(tabs)");
    } catch (e: any) {
      Alert.alert("تعذر تسجيل الدخول", e?.message || "تحقق من بياناتك وحاول مرة أخرى.");
    } finally { setLoading(false); }
  };
  return <ScreenContainer className="px-6" edges={["top", "left", "right"]}><View style={styles.content}><CwaLogo/><View style={styles.intro}><Text style={styles.title}>مرحباً بعودتك</Text><Text style={styles.subtitle}>سجّل الدخول إلى CwaAX</Text></View><Text style={styles.label}>البريد الإلكتروني أو اسم المستخدم</Text><View style={styles.inputRow}><MaterialIcons name="person-outline" size={19} color={CWAAX.muted}/><TextInput value={identifier} onChangeText={setIdentifier} placeholder="name@email.com" placeholderTextColor="#9CA8A1" autoCapitalize="none" style={styles.input}/></View><Text style={styles.label}>كلمة المرور</Text><View style={styles.inputRow}><MaterialIcons name="lock-outline" size={19} color={CWAAX.muted}/><TextInput value={password} onChangeText={setPassword} placeholder="أدخل كلمة المرور" placeholderTextColor="#9CA8A1" secureTextEntry={!show} style={styles.input}/><Pressable onPress={() => setShow(!show)}><MaterialIcons name={show ? "visibility" : "visibility-off"} size={19} color={CWAAX.muted}/></Pressable></View><Pressable onPress={submit} disabled={loading} style={({pressed}) => [styles.button, pressed && styles.pressed]}>{loading ? <ActivityIndicator color={CWAAX.white}/> : <><Text style={styles.buttonText}>تسجيل الدخول</Text><MaterialIcons name="arrow-back" size={18} color={CWAAX.white}/></>}</Pressable><View style={styles.signup}><Text style={styles.signupText}>ليس لديك حساب؟</Text><Pressable onPress={() => router.push("/register")}><Text style={styles.signupLink}> إنشاء حساب</Text></Pressable></View></View></ScreenContainer>;
}
const styles = StyleSheet.create({content:{flex:1,paddingTop:26},intro:{marginTop:55,marginBottom:28},title:{color:CWAAX.ink,fontSize:29,fontWeight:"900",textAlign:"right"},subtitle:{color:CWAAX.muted,fontSize:13,marginTop:7,textAlign:"right"},label:{color:CWAAX.ink,fontSize:12,fontWeight:"800",textAlign:"right",marginBottom:8,marginTop:10},inputRow:{height:52,borderWidth:1,borderColor:CWAAX.line,borderRadius:14,paddingHorizontal:13,flexDirection:"row",alignItems:"center",gap:8},input:{flex:1,color:CWAAX.ink,textAlign:"right",fontSize:12},button:{height:52,borderRadius:15,backgroundColor:CWAAX.green,justifyContent:"center",alignItems:"center",flexDirection:"row",gap:8,marginTop:24},buttonText:{color:CWAAX.white,fontSize:14,fontWeight:"900"},signup:{flexDirection:"row-reverse",justifyContent:"center",marginTop:24},signupText:{color:CWAAX.muted,fontSize:11},signupLink:{color:CWAAX.green,fontSize:11,fontWeight:"900"},pressed:{opacity:.62}});
