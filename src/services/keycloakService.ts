import Constants from 'expo-constants';

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token?: string;
  token_type: string;
  scope?: string;
}

interface KeycloakUserInfo {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles?: string[];
  };
}

interface KeycloakConfig {
  baseUrl: string;
  realm: string;
  clientId: string;
  clientSecret?: string;
}

const normalize = (value?: string | null): string => (value ?? '').trim();

const getExtraConfig = (): Record<string, any> => {
  const expoExtra = (Constants.expoConfig?.extra ?? {}) as Record<string, any>;
  const manifestExtra = ((Constants as any).manifest?.extra ?? {}) as Record<string, any>;
  const manifest2Extra = ((Constants as any).manifest2?.extra ?? {}) as Record<string, any>;

  return { ...manifestExtra, ...manifest2Extra, ...expoExtra };
};

const getKeycloakConfig = (): KeycloakConfig => {
  const extra = getExtraConfig();
  const keycloak = (extra.keycloak ?? {}) as Record<string, string>;

  const envBaseUrl = process.env.EXPO_PUBLIC_KEYCLOAK_BASE_URL;
  const envRealm = process.env.EXPO_PUBLIC_KEYCLOAK_REALM;
  const envClientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID;
  const envClientSecret = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET;

  const baseUrl = normalize(keycloak.baseUrl || envBaseUrl).replace(/\/$/, '');
  const realm = normalize(keycloak.realm || envRealm);
  const clientId = normalize(keycloak.clientId || envClientId);
  const clientSecret = normalize(keycloak.clientSecret || envClientSecret);

  const missing: string[] = [];
  if (!baseUrl) missing.push('baseUrl');
  if (!realm) missing.push('realm');
  if (!clientId) missing.push('clientId');

  if (missing.length > 0) {
    throw new Error(
      `Configuração do Keycloak incompleta (${missing.join(', ')}). ` +
      'Defina EXPO_PUBLIC_KEYCLOAK_BASE_URL, EXPO_PUBLIC_KEYCLOAK_REALM e EXPO_PUBLIC_KEYCLOAK_CLIENT_ID '
    );
  }

  return {
    baseUrl,
    realm,
    clientId,
    clientSecret: clientSecret || undefined,
  };
};

const createTokenUrl = (config: KeycloakConfig) =>
  `${config.baseUrl}/realms/${config.realm}/protocol/openid-connect/token`;

const createUserInfoUrl = (config: KeycloakConfig) =>
  `${config.baseUrl}/realms/${config.realm}/protocol/openid-connect/userinfo`;

export const authenticateWithKeycloak = async (
  username: string,
  password: string
): Promise<KeycloakTokenResponse> => {
  const config = getKeycloakConfig();

  const payload = new URLSearchParams({
    grant_type: 'password',
    client_id: config.clientId,
    username,
    password,
  });

  if (config.clientSecret) {
    payload.append('client_secret', config.clientSecret);
  }

  const response = await fetch(createTokenUrl(config), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload.toString(),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Falha ao autenticar no Keycloak (${response.status}): ${responseText}`);
  }

  return response.json();
};

export const fetchKeycloakUserInfo = async (accessToken: string): Promise<KeycloakUserInfo> => {
  const config = getKeycloakConfig();

  const response = await fetch(createUserInfoUrl(config), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Falha ao obter dados do usuário Keycloak (${response.status}): ${responseText}`);
  }

  return response.json();
};
