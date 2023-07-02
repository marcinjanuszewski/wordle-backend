export interface ApplicationConfig {
  publicUrl: string;
  port: number;
  environment: string;
}

export interface AuthConfig {
  jwtSecret: string;
  issuer: string;
  jwtExpirationInMinutes: number;
  rtExpirationInMinutes: number;
}

export interface AppConfig {
  application: ApplicationConfig;
  auth: AuthConfig;
}

const { env } = process;

const getIntOrDefault = (
  value: string | undefined,
  fallback: number,
): number => {
  const num = parseInt(value);
  return Number.isNaN(num) ? fallback : num;
};

export default (): AppConfig => ({
  application: {
    publicUrl: env.APP_PUBLIC_URL || 'http://localhost:3000',
    port: +env.APP_PORT || 3000,
    environment: env.NODE_ENV || 'development',
  },
  auth: {
    jwtSecret: env.AUTH_JWT_SECRET!,
    issuer: env.AUTH_ISSUER!,
    jwtExpirationInMinutes: getIntOrDefault(
      env.AUTH_JWT_EXPIRATION_IN_MINUTES,
      10,
    ),
    rtExpirationInMinutes: getIntOrDefault(
      env.AUTH_RT_EXPIRATION_IN_MINUTES,
      7 * 60 * 24,
    ),
  },
});
