const { execSync } = require('child_process');

let commitHash = 'desconhecido';

try {
  // pega o hash curto do commit atual (ex: a1b2c3d)
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  console.warn('Não foi possível obter o commit hash:', e.message);
}

module.exports = {
  expo: {
    name: 'base',
    slug: 'base',
    version: '1.0.0',            // controla a versão da release aqui
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'base',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    extra: {
      commitHash,                // vem automático do Git
    },

    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },

    ios: {
      buildNumber: '42',
      supportsTablet: true,
    },

    android: {
      versionCode: 42,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },

    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
  },
};
