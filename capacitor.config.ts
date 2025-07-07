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
  }
  
};

export default config;
