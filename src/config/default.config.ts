export interface ApplicationConfig {
  publicUrl: string;
  port: number;
  environment: string;
}

export interface AppConfig {
  application: ApplicationConfig;
}

const { env } = process;

export default (): AppConfig => ({
  application: {
    publicUrl: env.APP_PUBLIC_URL || 'http://localhost:3000',
    port: +env.APP_PORT || 3000,
    environment: env.NODE_ENV || 'development',
  },
});
