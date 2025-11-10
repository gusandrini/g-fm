# 🚀 Base Template React Native (Expo + TypeScript)

Template inicial para desenvolvimento de aplicativos **React Native com Expo**, preparado para Android, iOS e Web.  
Inclui estrutura modular, navegação global (Header/Footer) e Context API.

---

## 🧩 Sumário
1. [Como Iniciar o Projeto](#como-iniciar-o-projeto)
2. [Como Rodar o Projeto (Mobile)](#como-rodar-o-projeto-mobile)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Documentação Técnica — Estrutura e Fluxo](#documentação-técnica--estrutura-e-fluxo)
5. [Boas Práticas e Dicas](#boas-práticas-e-dicas)
6. [Repositórios e Deploys](#repositórios-e-deploys)
7. [Stack Utilizada](#stack-utilizada)
8. [Autores](#autores)

---

## 🚀 Como Iniciar o Projeto

### 🏗️ Criar novo projeto
```bash
npx create-expo-app@latest nome-do-projeto --template
```

### 📦 Instalar dependências
```bash
npm install
```

---

## ▶️ Como Rodar o Projeto (Mobile)

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/gusandrini/chall-mottu.git
cd mottu
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Executar o projeto
```bash
npx expo start
```

**Atalhos rápidos:**  
📱 Android → `a` | 🍎 iOS → `i` | 🌐 Web → `w`

> ⚠️ No iOS, certifique-se de que o **Expo Go** e o computador estejam na **mesma rede Wi-Fi**.

---

## 🗂️ Estrutura de Pastas

```
base/
│
├── android/              # Configurações específicas do Android
├── assets/               # Ícones, imagens e fontes
│
├── scripts/
│   └── update-commit-hash.cjs  # Atualiza hash de commit no build
│
├── src/
│   ├── api/              # Axios + endpoints da API
│   ├── components/       # Componentes reutilizáveis (Header, Footer, etc.)
│   ├── images/           # Logos e imagens locais
│   ├── models/           # Tipos e interfaces TypeScript
│   ├── navigation/       # Estrutura de navegação (Stack, Tabs)
│   ├── screens/          # Telas principais (Login, Cadastro, Home, etc.)
│   ├── services/         # Providers e serviços (ex: autenticação)
│   ├── styles/           # Estilos centralizados (screens/components)
│   └── utils/            # Funções auxiliares
│
├── App.tsx
├── app.json
├── eas.json
├── index.tsx
├── package.json
└── tsconfig.json
```

---

# 🧭 Documentação Técnica — Estrutura e Fluxo do App Base

## 📚 Visão Geral

Projeto estruturado como uma **base reutilizável** para aplicações React Native com Expo, utilizando:

- **React Navigation** (Stack + Tabs)  
- **Context API** (sessão)  
- **Arquitetura modular** (providers, navigation, screens e styles)  
- **Header e Footer globais integrados à navegação**  

---

## ⚙️ Fluxo de Inicialização

## 2️⃣ Fluxo de Inicialização

O fluxo do app ocorre em **camadas**, desde a inicialização até a renderização das telas.

### 🔹 Etapa 1 — `index.tsx`
É o **entry point** do app Expo.  
Registra o componente raiz do React Native (App):

```tsx
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

👉 Aqui o Expo identifica `App.tsx` como o **componente principal do app**.

---

### 🔹 Etapa 2 — `App.tsx`
É o **orquestrador** da aplicação.

Responsável por:
- Montar todos os **providers globais** (`AppProviders`).
- Configurar a **StatusBar**.
- Iniciar o **sistema de navegação** (`AppNavigation`).

```tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { AppProviders } from '@/providers/AppProviders';
import { AppNavigation } from '@/navigation/AppNavigation';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppProviders>
        <AppNavigation />
      </AppProviders>
    </>
  );
}
```

---

### 🔹 Etapa 3 — `AppProviders.tsx`
Centraliza todos os **contextos globais** da aplicação.

```tsx
import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from '@/services/SessionProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </SafeAreaProvider>
  );
}
```

📌 **Função de cada provider:**

| Provider | Função |
|-----------|--------|
| `SafeAreaProvider` | Adapta o layout a áreas seguras (notch, bordas, status bar) |
| `SessionProvider` | Gerencia sessão, autenticação e dados do usuário |

---

### 🔹 Etapa 4 — `AppNavigation.tsx`
Responsável por inicializar o **React Navigation**.

```tsx
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { RootTabs } from './RootTabs';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#22C55E',
    background: '#F7F8FA',
    card: '#FFFFFF',
    text: '#0B1220',
    border: '#E5E7EB',
    notification: '#22C55E',
  },
};

export function AppNavigation() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <RootTabs />
    </NavigationContainer>
  );
}
```

🔹 Esse componente:
- Envolve toda a navegação com `NavigationContainer`.
- Define as **cores da navegação**.
- Chama o **Tab Navigator** (onde ficam Header e Footer).

---

### 🔹 Etapa 5 — `RootTabs.tsx`
Configura as abas inferiores (**footer**) e o **header global**.

```tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '@/screens/Home';
import SobreNos from '@/screens/SobreNos';
import Cadastro from '@/screens/Cadastro';
import { Header } from '@/components/Header';

const Tab = createBottomTabNavigator();

export function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} />,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 64,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'SobreNos') icon = 'information-circle-outline';
          if (route.name === 'Cadastro') icon = 'person-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="SobreNos" component={SobreNos} />
      <Tab.Screen name="Cadastro" component={Cadastro} />
    </Tab.Navigator>
  );
}
```

📌 Aqui:
- O **Footer** é o próprio `Tab.Navigator`.
- O **Header** é adicionado automaticamente via `screenOptions.header`.
- As cores são definidas diretamente no componente.

---

### 🔹 Etapa 6 — Telas (`screens`)
Cada tela (`Home`, `SobreNos`, `Cadastro`, etc.) é um componente simples:

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Tela Inicial</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
  },
  text: {
    color: '#0B1220',
    fontSize: 18,
  },
});
```

➡️ A tela **não precisa importar Header ou Footer** — eles já são renderizados automaticamente pelo `RootTabs`.

---

## 3️⃣ Camadas e Responsabilidades

| Camada | Arquivo | Responsabilidade |
|--------|----------|------------------|
| **Entry Point** | `index.tsx` | Inicia o app e registra o componente `App` |
| **App Root** | `App.tsx` | Monta providers e chama navegação |
| **Context Providers** | `AppProviders.tsx` | Garante que todo o app tenha acesso à sessão |
| **Navigation Container** | `AppNavigation.tsx` | Inicializa React Navigation |
| **Tab Navigator** | `RootTabs.tsx` | Configura header/footer globais e abas |
| **Header/Footer** | `src/components/` | Aparência do topo e rodapé |
| **Telas** | `src/screens/` | Conteúdo principal de cada rota |
| **Estilos** | `src/styles/` | Estilos separados por tela ou componente |

---

## 4️⃣ Hierarquia de Componentes

```text
index.tsx
 └── App.tsx
      ├── AppProviders (SafeArea + Session)
      │     └── AppNavigation (NavigationContainer)
      │           └── RootTabs (Header + Footer)
      │                 ├── HomeScreen
      │                 ├── SobreNosScreen
      │                 └── CadastroScreen
```

---

## 5️⃣ Navegação (Header + Footer)

- **Header:** Componente global mostrado no topo de cada tela (`screenOptions.header`).
- **Footer (Tab Bar):** É a navegação principal (`createBottomTabNavigator`).

Cores e ícones são definidos diretamente nos componentes:

| Estado | Cor |
|--------|-----|
| Ativa | `#22C55E` |
| Inativa | `#6B7280` |
| Fundo | `#FFFFFF` |
| Texto | `#0B1220` |

---

## 6️⃣ Resumo Visual (Diagrama)

```text
┌───────────────────────────────────────┐
│ index.tsx                             │
│ └── registerRootComponent(App)        │
└───────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────┐
│ App.tsx                               │
│ ├── AppProviders                      │
│ │   ├── SafeAreaProvider              │
│ │   └── SessionProvider               │
│ └── AppNavigation                     │
│     └── NavigationContainer           │
│         └── RootTabs                  │
│             ├── Header (global)       │
│             ├── Tab.Navigator (Footer)│
│             ├── HomeScreen            │
│             ├── SobreNosScreen        │
│             └── CadastroScreen        │
└───────────────────────────────────────┘
```

---

## 8️⃣ Boas Práticas e Extensões Futuras

✅ **Manter tudo desacoplado**  
Cada camada deve ter uma única responsabilidade (providers, navegação, telas, estilos).

✅ **Usar aliases (`@/`)**  
Melhora legibilidade e evita caminhos relativos longos.

✅ **Separar estilos por pasta**  
`src/styles/screens` e `src/styles/components` deixam o código escalável.

✅ **Cores consistentes**  
Definir paleta de cores centralizada para manter consistência visual.

✅ **Controle de versão** — sempre `git pull` antes de desenvolver. 

✅ **Extensões sugeridas:**
- Adicionar contexto de autenticação (`AuthContext`) para login/logout.
- Criar `useAppConfig()` para variáveis globais (ex: URL da API).
- Implementar modo "offline" com AsyncStorage.
 
 

---

## 🎯 Conclusão

Esse fluxo garante:
- Estrutura limpa e modular.  
- Navegação consistente.  
- Contextos compartilhados em todo o app.  
- Header/Footer automáticos em todas as telas.  
- Base sólida e reaproveitável para futuros projetos.


---

## 🔗 Repositórios e Deploys

| Tipo | Link |
|------|------|
| 📱 **Mobile (GitHub)** | [https://github.com/](https://github.com/) |
| ☁️ **API (GitHub)** | [https://github.com/](https://github.com/) |
| 🗄️ **API Online (H2 Console)** | [https://projeto.onrender.com/h2-console](https://projeto.onrender.com/h2-console) |
| 🧱 **Build EAS (Expo)** | [https://expo.dev/](https://expo.dev/) |
| 🔥 **Firebase App Distribution (Android)** | [https://console.firebase.google.com](https://console.firebase.google.com) |

---

## 🧰 Stack Utilizada

- ⚛️ **React Native (Expo SDK mais recente)**  
- 📘 **TypeScript**  
- 🌐 **Axios** para consumo de API  
- 🎨 **Context API** para gerenciamento de estado global  
- 🧱 **EAS Build** para deploy e distribuição  
- 🔥 **Firebase App Distribution** para testes internos  

---

## 👥 Autores

Projeto mantido por [**Gustavo Sandrini**](https://github.com/gusandrini)  
