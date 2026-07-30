import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.gradeflow.mobile',
  appName: 'Gradeflow',
  webDir: 'dist',
  android: {
    backgroundColor: '#f5f6f2',
    allowMixedContent: false,
  },
};

export default config;
