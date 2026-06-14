# Gygas

Aplicativo mobile para registro, organizacao e envio de dados de manejo do pirarucu. O Gygas apoia a operacao em campo com cadastro local de pescas, controle de comunidades e lagos, formacao de lotes, geracao de guias em PDF e integracao com uma API remota para sincronizacao de lotes e pescados.

## Sumario

- [Visao geral](#visao-geral)
- [Principais recursos](#principais-recursos)
- [Stack tecnica](#stack-tecnica)
- [Arquitetura do app](#arquitetura-do-app)
- [Requisitos](#requisitos)
- [Configuracao de ambiente](#configuracao-de-ambiente)
- [Instalacao e execucao](#instalacao-e-execucao)
- [Banco local e migracoes](#banco-local-e-migracoes)
- [Builds](#builds)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Qualidade e manutencao](#qualidade-e-manutencao)
- [Solucao de problemas](#solucao-de-problemas)

## Visao geral

O app foi desenvolvido com Expo e React Native para funcionar como ferramenta operacional de campo. A experiencia principal comeca no login, permite acesso autenticado via Keycloak ou entrada como convidado, e conduz o usuario por fluxos de:

- registro de pescados;
- consulta, edicao e remocao de pescas atuais;
- cadastro e manutencao de comunidades;
- cadastro e manutencao de lagos vinculados a comunidades;
- selecao de pescados para formacao de lote;
- listagem de lotes prontos para envio;
- geracao e compartilhamento de guia de transporte em PDF;
- envio de lote e pescados para a API remota.

Os dados operacionais de campo sao persistidos localmente em SQLite por meio do Drizzle ORM. A autenticacao, quando usada, e feita contra um provedor Keycloak configurado por variaveis de ambiente.

## Principais recursos

- **Autenticacao**: login com Keycloak e sessao persistida em `AsyncStorage`; modo convidado para uso local sem token.
- **Persistencia local**: banco SQLite embarcado com migracoes Drizzle aplicadas na inicializacao do app.
- **Registro de pescas**: formulario com validacao de lacre, sexo, peso, comprimento, horarios, comunidade e lago.
- **Gestao de pescados ativos**: listagem local, edicao e remocao de registros ainda nao alocados em lote.
- **Formacao de lotes**: selecao de pescados ativos, consolidacao de quantidades e armazenamento local do lote.
- **Comunidades e lagos**: CRUD local de comunidades e lagos, com lagos associados a uma comunidade.
- **Base inicial**: criacao automatica de comunidades e lagos base ao abrir a Home.
- **Guias em PDF**: geracao de relatorio A4 com os dados do lote e pescados, usando `expo-print` e `expo-sharing`.
- **Integracao remota**: services para usuarios, lotes e pescados usando Axios contra a API configurada em `src/services/api.ts`.

## Stack tecnica

- **Runtime mobile**: Expo `~54`, React Native `0.81`, React `19`
- **Linguagem**: TypeScript com `strict: true`
- **Navegacao**: React Navigation Native Stack
- **UI**: React Native Paper, Expo Vector Icons e componentes internos em `src/components/ui`
- **Banco local**: Expo SQLite + Drizzle ORM
- **Migracoes**: Drizzle Kit, arquivos SQL versionados em `drizzle/`
- **Autenticacao**: Keycloak/OpenID Connect via password grant
- **HTTP client**: Axios
- **PDF e compartilhamento**: Expo Print, Expo Sharing e Expo FileSystem
- **Build**: EAS Build

## Arquitetura do app

O ponto de entrada e `App.tsx`. Ele abre o banco `database.db`, aplica as migracoes Drizzle, configura o tema, autentica a sessao e entrega a navegacao principal.

Fluxo de alto nivel:

1. `App.tsx` inicializa Splash Screen, SQLite, Drizzle, Paper Theme e Auth Provider.
2. `AuthContext` restaura a sessao local ou direciona para `LoginScreen`.
3. `AppNavigator` decide entre fluxo autenticado/convidado e tela de login.
4. `Home` semeia comunidades e lagos base e apresenta as opcoes principais.
5. Telas e hooks acessam SQLite local com `useSQLiteContext` e `drizzle`.
6. Services em `src/services` centralizam chamadas HTTP para API e Keycloak.

## Requisitos

- Node.js LTS
- npm
- Expo CLI via `npx expo`
- Android Studio e Android SDK para execucao Android local
- Xcode para execucao iOS local, quando em macOS
- Conta/configuracao EAS para builds remotos
- Provedor Keycloak, caso o login autenticado seja usado

## Configuracao de ambiente

Crie um arquivo `.env` na raiz do projeto com as variaveis publicas usadas pelo Expo:

```env
EXPO_PUBLIC_KEYCLOAK_BASE_URL=https://seu-keycloak.example.com
EXPO_PUBLIC_KEYCLOAK_REALM=seu-realm
EXPO_PUBLIC_KEYCLOAK_CLIENT_ID=seu-client-id
EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET=seu-client-secret-opcional
```

Essas variaveis sao lidas em `app.config.js` e consumidas por `src/services/keycloakService.ts`.

Observacoes importantes:

- O modo convidado nao depende do Keycloak.
- A API principal esta centralizada em `src/services/api.ts`.
- Chaves de API, URLs privadas e segredos devem ser tratados como informacao sensivel. Evite versionar credenciais reais.
- O `.gitignore` ja ignora `.env` e arquivos `.env*.local`.

## Instalacao e execucao

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Execute em Android:

```bash
npm run android
```

Execute em iOS:

```bash
npm run ios
```

Execute no navegador:

```bash
npm run web
```

Scripts disponiveis no `package.json`:

| Script | Descricao |
| --- | --- |
| `npm start` | Inicia o Expo Dev Server. |
| `npm run android` | Executa o app em Android com Expo. |
| `npm run ios` | Executa o app em iOS com Expo. |
| `npm run web` | Inicia a versao web via Expo. |

## Banco local e migracoes

O app usa SQLite local com o arquivo `database.db`. As migracoes ficam em `drizzle/` e sao carregadas por `drizzle/migrations.js`.

Arquivos principais:

- `drizzle.config.ts`: configuracao do Drizzle Kit para SQLite/Expo.
- `drizzle/*.sql`: migracoes SQL versionadas.
- `src/database/schemas`: schemas Drizzle do banco local.
- `src/database/relations.ts`: relacoes entre comunidades e lagos.
- `App.tsx`: aplica as migracoes na inicializacao com `useMigrations`.

Para gerar novas migracoes apos alterar schemas:

```bash
npx drizzle-kit generate
```

Apos gerar migracoes, confirme se `drizzle/migrations.js` continua importando todos os arquivos SQL necessarios para o ambiente Expo/React Native.

## Builds

O projeto possui configuracao EAS em `eas.json` com perfis:

- `development`: build interno com development client;
- `preview`: build interno Android em APK;
- `production`: build de producao com auto incremento Android.

Exemplos:

```bash
npx eas build --profile preview --platform android
npx eas build --profile production --platform android
```

Antes de gerar builds, valide as variaveis de ambiente do Keycloak e a configuracao de acesso a API.

## Estrutura de pastas

```text
.
|-- App.tsx                     # Bootstrap do app, providers, SQLite e migracoes
|-- app.config.js               # Configuracao Expo e variaveis publicas
|-- eas.json                    # Perfis de build EAS
|-- drizzle/                    # Migracoes SQL e manifest para Expo SQLite
|-- assets/                     # Icones, imagens, splash e fontes
`-- src/
    |-- components/             # Componentes reutilizaveis e formularios
    |-- contexts/               # Contextos globais, incluindo AuthContext
    |-- database/               # Schemas e relacoes Drizzle
    |-- hooks/                  # Hooks de dominio e persistencia local/remota
    |-- interfaces/             # Tipos e DTOs
    |-- navigation/             # Tipagem da navegacao
    |-- pages/                  # Telas da aplicacao
    |-- routes/                 # Stack navigator principal
    |-- services/               # Clientes e services HTTP/local
    |-- theme/                  # Tema React Native Paper
    `-- utils/                  # Validadores, sanitizadores, PDF e dados base
```

## Qualidade e manutencao

Recomendacoes para evolucao do projeto:

- Manter `src/database/schemas` e `drizzle/` sempre sincronizados.
- Evitar duplicar regras de negocio entre telas; preferir hooks/services existentes.
- Concentrar novas chamadas HTTP em `src/services`.
- Proteger dados sensiveis fora do codigo-fonte versionado.
- Adicionar scripts de qualidade ao `package.json`, como typecheck, lint e testes automatizados.

Comando util para verificacao TypeScript:

```bash
npx tsc --noEmit
```

Atualmente o `package.json` nao define scripts de teste, lint ou typecheck dedicados. Se o typecheck retornar `Invalid value for '--ignoreDeprecations'`, alinhe a versao do TypeScript com o `tsconfig.json` ou ajuste o valor de `ignoreDeprecations`.

## Solucao de problemas

### Erro de configuracao do Keycloak

Se o login autenticado falhar com erro de configuracao incompleta, confira:

- `EXPO_PUBLIC_KEYCLOAK_BASE_URL`
- `EXPO_PUBLIC_KEYCLOAK_REALM`
- `EXPO_PUBLIC_KEYCLOAK_CLIENT_ID`
- `EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET`, quando o client exigir secret

### Dados locais inesperados

O app usa SQLite local. Em desenvolvimento, dados antigos podem permanecer no dispositivo/emulador. Reinstale o app ou limpe os dados do aplicativo para testar uma base limpa.

### Migracoes nao aplicadas

Confira se:

- os arquivos SQL existem em `drizzle/`;
- `drizzle/migrations.js` importa as novas migracoes;
- `metro.config.js` inclui `.sql` em `sourceExts`;
- `babel.config.js` mantem o plugin `inline-import` para `.sql`.

### PDF nao compartilhado

A geracao usa `expo-print` e o compartilhamento usa `expo-sharing`. Em plataformas sem suporte ao compartilhamento nativo, o app salva o arquivo e exibe o caminho em alerta.

## Licenca

Defina aqui a licenca do projeto antes de distribuicao publica ou comercial.
