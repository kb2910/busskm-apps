import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Busskm',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Geolocation: {
      backgroundPermissionRationale: {
        title: "Permiso de ubicación requerido",
        message: "Necesitamos tu ubicación para mostrarte las rutas cercanas.",
        buttonPositive: "Aceptar",
        buttonNegative: "Cancelar"
      }
    }
  },
  cordova: {
    preferences: {
      SplashScreen: 'screen',
      SplashScreenBackgroundColor: '#ffffff',
      SplashScreenDarkBackgroundColor: '#000000',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '500',
      ShowSplashScreen: 'true',
      SplashScreenDelay: '3000'
    }
  }
  
};

export default config;
