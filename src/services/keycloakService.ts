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

const getKeycloakConfig = (): KeycloakConfig => {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, any>;
  const keycloak = (extra.keycloak ?? {}) as Record<string, string>;

  const baseUrl = keycloak.baseUrl;
  const realm = keycloak.realm;
  const clientId = keycloak.clientId;
  const clientSecret = keycloak.clientSecret;

  if (!baseUrl || !realm || !clientId) {
    throw new Error('Configuração do Keycloak incompleta. Defina expo.extra.keycloak no app.config.js');
  }

  return { baseUrl, realm, clientId, clientSecret };
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
