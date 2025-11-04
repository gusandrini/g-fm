# 📱 Projeto Base - Expo

Template inicial para criação de projetos **React Native com Expo**, já preparado para desenvolvimento multiplataforma (Android, iOS e Web).

---

## 🚀 **Como Iniciar o Projeto**

### Criar novo projeto
```bash
npx create-expo-app@latest nome-do-projeto
```

### Instalar dependências
```bash
npm install
```

---

## ▶️ **Como Rodar o Projeto (Mobile)**

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
📱 Android → `a`  
🍎 iOS → `i`  
🌐 Web → `w`

> ⚠️ No iOS, certifique-se de que o **Expo Go** e o computador estejam na **mesma rede Wi-Fi**.

---

## 🗂️ **Estrutura de Pastas (Mobile)**

```
base/
│
├── android/              # Configurações específicas do Android
│
├── assets/               # Ícones, imagens e fontes
│
├── scripts/
│   └── update-commit-hash.cjs  # Atualiza hash de commit no build
│
├── src/
│   ├── api/              # Axios + endpoints da API
│   ├── components/       # Componentes reutilizáveis (Header, Footer, etc.)
│   ├── context/          # Contextos globais (ex: ThemeContext)
│   ├── i18n/             # Internacionalização (pt-BR, es-ES)
│   ├── images/           # Logos e imagens locais
│   ├── models/           # Tipos e interfaces TypeScript
│   ├── screens/          # Telas principais (Login, Cliente, Moto, etc.)
│   ├── services/         # Providers e serviços (ex: autenticação)
│   ├── theme/            # Paleta de cores e estilos globais
│   └── Notificacao.ts    # Funções de notificação push/local
│
├── App.tsx
├── app.json
├── eas.json
├── index.tsx
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# 🧭 Documentação Técnica — Estrutura e Fluxo do App Base

## 📚 Sumário
1. [Visão Geral](#visão-geral)  
2. [Fluxo de Inicialização](#fluxo-de-inicialização)  
3. [Camadas e Responsabilidades](#camadas-e-responsabilidades)  
4. [Hierarquia de Componentes](#hierarquia-de-componentes)  
5. [Como o Tema e Contextos se Propagam](#como-o-tema-e-contextos-se-propagam)  
6. [Navegação (Header + Footer)](#navegação-header--footer)  
7. [Resumo Visual (Diagrama)](#resumo-visual-diagrama)  
8. [Boas Práticas e Extensões Futuras](#boas-práticas-e-extensões-futuras)

---

## 1️⃣ Visão Geral

Este projeto foi estruturado como uma **base reutilizável** para aplicações React Native com Expo, utilizando:

- **React Navigation** (Stack e Tabs)  
- **Context API** (para tema, idioma e sessão)  
- **Arquitetura modular** (providers, navigation, screens e styles separados)  
- **Tema claro e escuro dinâmico**  
- **Header e Footer globais integrados à navegação**  

---

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
- Configurar a **StatusBar** conforme o tema atual.
- Iniciar o **sistema de navegação** (`AppNavigation`).

```tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { AppProviders } from '@/providers/AppProviders';
import { AppNavigation } from '@/navigation/AppNavigation';
import { useTheme } from '@/context/ThemeContext';

function Root() {
  const { theme, isDark } = useTheme();
  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <AppNavigation />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Root />
    </AppProviders>
  );
}
```

#### 🧩 Por que existe o componente `Root`?
- O `Root` é **definido dentro do `App.tsx`** apenas para poder usar `useTheme()`.
- Ele é renderizado **dentro dos providers**, garantindo que os hooks de contexto já estejam disponíveis.

---

### 🔹 Etapa 3 — `AppProviders.tsx`
Centraliza todos os **contextos globais** da aplicação.

```tsx
import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from '@/services/SessionProvider';
import { I18nProvider } from '@/i18n/I18nProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
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
| `ThemeProvider` | Gerencia tema claro/escuro e fornece o hook `useTheme()` |
| `I18nProvider` | Fornece internacionalização e traduções (`t('chave')`) |

---

### 🔹 Etapa 4 — `AppNavigation.tsx`
Responsável por inicializar o **React Navigation** e aplicar o tema.

```tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { RootTabs } from './RootTabs';

export function AppNavigation() {
  const { theme } = useTheme();

  const navigationTheme = {
    ...(theme.name === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootTabs />
    </NavigationContainer>
  );
}
```

🔹 Esse componente:
- Envolve toda a navegação com `NavigationContainer`.
- Define o **tema visual da navegação**.
- Chama o **Tab Navigator** (onde ficam Header e Footer).

---

### 🔹 Etapa 5 — `RootTabs.tsx`
Configura as abas inferiores (**footer**) e o **header global**.

```tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Home from '@/screens/Home';
import SobreNos from '@/screens/SobreNos';
import Cadastro from '@/screens/Cadastro';
import { Header } from '@/components/Header';

const Tab = createBottomTabNavigator();

export function RootTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} />,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: theme.sizes.footer,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
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
- O tema do `ThemeProvider` é usado para definir todas as cores e estilos.

---

### 🔹 Etapa 6 — Telas (`screens`)
Cada tela (`Home`, `SobreNos`, `Cadastro`, etc.) é um componente simples:

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: theme.colors.text }}>🏠 Tela Inicial</Text>
    </View>
  );
}
```

➡️ A tela **não precisa importar Header ou Footer** — eles já são renderizados automaticamente pelo `RootTabs`.

---

## 3️⃣ Camadas e Responsabilidades

| Camada | Arquivo | Responsabilidade |
|--------|----------|------------------|
| **Entry Point** | `index.tsx` | Inicia o app e registra o componente `App` |
| **App Root** | `App.tsx` | Monta providers e chama navegação |
| **Context Providers** | `AppProviders.tsx` | Garante que todo o app tenha acesso a tema, sessão e i18n |
| **Navigation Container** | `AppNavigation.tsx` | Inicializa React Navigation com o tema atual |
| **Tab Navigator** | `RootTabs.tsx` | Configura header/footer globais e abas |
| **Header/Footer** | `src/components/` | Aparência do topo e rodapé |
| **Telas** | `src/screens/` | Conteúdo principal de cada rota |
| **Estilos** | `src/styles/` | Estilos separados por tela ou componente |

---

## 4️⃣ Hierarquia de Componentes

```text
index.tsx
 └── App.tsx
      ├── AppProviders (SafeArea + Session + Theme + I18n)
      │     └── Root (usa useTheme e define StatusBar + AppNavigation)
      │           └── AppNavigation (NavigationContainer)
      │                 └── RootTabs (Header + Footer)
      │                       ├── HomeScreen
      │                       ├── SobreNosScreen
      │                       └── CadastroScreen
```

---

## 5️⃣ Como o Tema e Contextos se Propagam

- `ThemeProvider` define um objeto com as cores, espaçamentos e tamanhos.
- O hook `useTheme()` fornece acesso ao tema em qualquer lugar do app.
- O `ThemeProvider` é declarado **acima** de `AppNavigation`, então:
  - `Header`, `Footer`, `Tab.Navigator` e `Screens` têm acesso às cores via `useTheme()`.

```tsx
const { theme } = useTheme();
<View style={{ backgroundColor: theme.colors.background }} />
```

---

## 6️⃣ Navegação (Header + Footer)

- **Header:** Componente global mostrado no topo de cada tela (`screenOptions.header`).
- **Footer (Tab Bar):** É a navegação principal (`createBottomTabNavigator`).

Cores e ícones são controlados pelo `ThemeProvider` e pela aba ativa:

| Estado | Cor | Origem |
|--------|-----|---------|
| Ativa | `theme.colors.primary` | Tema atual |
| Inativa | `theme.colors.mutedText` | Tema atual |
| Fundo | `theme.colors.surface` | Tema atual |
| Texto | `theme.colors.text` | Tema atual |

---

## 7️⃣ Resumo Visual (Diagrama)

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
│ │   ├── SessionProvider               │
│ │   ├── ThemeProvider                 │
│ │   └── I18nProvider                  │
│ └── Root (StatusBar + AppNavigation)  │
└───────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────┐
│ AppNavigation                         │
│ └── NavigationContainer (tema atual)  │
│     └── RootTabs                      │
│         ├── Header (global)           │
│         ├── Tab.Navigator (Footer)    │
│         ├── HomeScreen                │
│         ├── SobreNosScreen            │
│         └── CadastroScreen            │
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

✅ **Tema global coerente**  
Definir paleta única em `theme/theme.ts` (light/dark).

✅ **Extensões sugeridas:**
- Adicionar contexto de autenticação (`AuthContext`) para login/logout.
- Adicionar `NotificationsContext` para centralizar push notifications.
- Criar `useAppConfig()` para variáveis globais (ex: URL da API).
- Implementar modo “offline” com AsyncStorage.

---

## 🎯 Conclusão

Esse fluxo garante:
- Estrutura limpa e modular.  
- Navegação consistente com tema global.  
- Contextos compartilhados em todo o app.  
- Header/Footer automáticos em todas as telas.  
- Base sólida e reaproveitável para futuros projetos.


---

## 🔗 **Repositórios e Deploys**

| Tipo | Link |
|------|------|
| 📱 **Mobile (GitHub)** | [https://github.com/](https://github.com/) |
| ☁️ **API (GitHub)** | [https://github.com/](https://github.com/) |
| 🗄️ **API Online (H2 Console)** | [https://projeto.onrender.com/h2-console](https://projeto.onrender.com/h2-console) |
| 🧱 **Build EAS (Expo)** | [https://expo.dev/](https://expo.dev/) |
| 🔥 **Firebase App Distribution (Android)** | [https://console.firebase.google.com](https://console.firebase.google.com) |

---

## 🧰 **Stack Utilizada**

- **React Native (Expo SDK mais recente)**  
- **TypeScript**  
- **Axios** para consumo de API  
- **Context API** para gerenciamento de estado  
- **i18n-js** para tradução e suporte multilíngue  
- **Expo Notifications** (push/local)  
- **EAS Build** para deploy e distribuição  
- **Firebase App Distribution** para testes internos  

---

## 💡 **Dicas e Boas Práticas**

- Sempre execute `npm install` após clonar ou atualizar o repositório.  
- Use `git pull` antes de começar a programar, garantindo que está com a versão mais recente.  
- Ao atualizar o código, gere um novo build com:
  ```bash
  npx expo build:android
  ```
- Configure variáveis sensíveis no arquivo `.env` (não versionado).  

---

## 👥 **Autores**

Projeto mantido por [Gustavo Sandrini](https://github.com/gusandrini) 
