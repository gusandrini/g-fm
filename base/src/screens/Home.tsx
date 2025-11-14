import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  const openDashboard = () => {
    Linking.openURL("https://hellplink-iot-dashboard.streamlit.app");
  };

  // const goToProfile = () => {
  //   navigation.navigate("Perfil"); 
  // };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>👋 Bem-vindo!</Text>
        <Text style={styles.subtitle}>
          Acompanhe os indicadores, relatórios e gerencie seu perfil.
        </Text>

        {/* Botão Dashboard */}
        <TouchableOpacity style={styles.button} onPress={openDashboard}>
          <Ionicons name="bar-chart-outline" size={22} color="#FFF" />
          <Text style={styles.buttonText}>Abrir Dashboard</Text>
        </TouchableOpacity>

        {/* Botão Perfil */}
        {/* onPress={goToProfile} */}
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} >
          <Ionicons name="person-circle-outline" size={22} color="#FFF" />
          <Text style={styles.buttonText}>Meu Perfil</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    color: "#0B1220",
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
    marginBottom: 12,
  },

  buttonSecondary: {
    backgroundColor: "#3B82F6", // azul para diferenciar
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
