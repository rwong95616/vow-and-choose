import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vowandchoose.app',
  appName: 'Vow & Choose',
  webDir: 'public',
  server: {
    url: 'https://vow-and-choose.vercel.app',
    cleartext: false
  }
};

export default config;
