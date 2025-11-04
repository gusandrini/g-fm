import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { FuncionarioCad } from "../models/funcionarioCad";
import { addFuncionario } from "../api/funcionario";
import { useTheme } from "../context/ThemeContext";
import { useI18n } from "@/i18n/I18nProvider";

export default function CadastroFuncionario({ navigation }: any) {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [nome, setNome] = useState("");
  const [emailCorporativo, setEmailCorporativo] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [idFilial, setIdFilial] = useState("");
  const [loading, setLoading] = useState(false);

  const validarEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSave = async () => {
    if (!nome || !emailCorporativo || !senha || !cargo) {
      Alert.alert(t("employeeForm.alerts.errorTitle"), t("employeeForm.alerts.required"));
      return;
    }
    if (!validarEmail(emailCorporativo)) {
      Alert.alert(t("employeeForm.alerts.errorTitle"), t("employeeForm.alerts.invalidEmail"));
      return;
    }

    const payload: FuncionarioCad = {
      idFuncionario: 0,
      idFilial: idFilial ? Number(idFilial) : 0,
      nome,
      emailCorporativo,
      senhaHash: senha,
      cargo,
    };

    try {
      setLoading(true);
      await addFuncionario(payload);
      Alert.alert(t("employeeForm.alerts.successTitle"), t("employeeForm.alerts.created"), [
        { text: t("common.ok"), onPress: () => navigation.replace("Login") },
      ]);
      setNome("");
      setEmailCorporativo("");
      setSenha("");
      setCargo("");
      setIdFilial("");
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert(t("employeeForm.alerts.unauthorizedTitle"), t("employeeForm.alerts.unauthorizedMsg"));
        } else if (error.response.status === 403) {
          Alert.alert(t("employeeForm.alerts.forbiddenTitle"), t("employeeForm.alerts.forbiddenMsg"));
        } else {
          const msg =
            error.response.data?.message ||
            error.response.data?.error ||
            t("employeeForm.alerts.unknownServerError");
          Alert.alert(`${t("employeeForm.alerts.errorCode")} ${error.response.status}`, msg);
        }
      } else {
        Alert.alert(t("employeeForm.alerts.errorTitle"), t("employeeForm.alerts.cannotConnect"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Overlay de carregamento */}
      <Modal transparent visible={loading}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            {t("employeeForm.loading")}
          </Text>
        </View>
      </Modal>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
        <Text style={[styles.backText, { color: theme.text }]}>{t("common.back")}</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={[styles.label, { color: theme.text }]}>{t("employeeForm.labels.name")}</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
          value={nome}
          onChangeText={setNome}
          placeholder={t("employeeForm.placeholders.name")}
          placeholderTextColor={theme.text}
        />

        <Text style={[styles.label, { color: theme.text }]}>
          {t("employeeForm.labels.corpEmail")}
        </Text>
        <TextInput
          style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
          value={emailCorporativo}
          onChangeText={setEmailCorporativo}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={t("employeeForm.placeholders.corpEmail")}
          placeholderTextColor={theme.text}
        />

        <Text style={[styles.label, { color: theme.text }]}>{t("employeeForm.labels.password")}</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder={t("employeeForm.placeholders.password")}
          placeholderTextColor={theme.text}
        />

        <Text style={[styles.label, { color: theme.text }]}>{t("employeeForm.labels.role")}</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
          value={cargo}
          onChangeText={setCargo}
          placeholder={t("employeeForm.placeholders.role")}
          placeholderTextColor={theme.text}
        />

        <Text style={[styles.label, { color: theme.text }]}>
          {t("employeeForm.labels.branchIdOptional")}
        </Text>
        <TextInput
          style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
          value={idFilial}
          onChangeText={setIdFilial}
          keyboardType="numeric"
          placeholder={t("employeeForm.placeholders.branchId")}
          placeholderTextColor={theme.text}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.buttonText}>{t("employeeForm.actions.saveEmployee")}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  inner: { flex: 1, justifyContent: "center" },
  label: { marginTop: 12, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { fontSize: 16, marginLeft: 6 },
  loadingOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", alignItems: "center",
  },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: "600" },
});
