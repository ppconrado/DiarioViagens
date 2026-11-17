# Diário de Viagens

Aplicativo mobile para registrar lugares que o usuário deseja conhecer ou já
visitou. O projeto foi desenvolvido com React Native, Expo SDK 58 e
TypeScript, com foco em funcionamento local no dispositivo.

O diário não depende de backend ou autenticação. Os dados são
armazenados no próprio dispositivo com `AsyncStorage`.

## Integrantes

1. **Jose Paulo Archetti Conrado**

## Funcionalidades

- Cadastro de lugares com nome, descrição e endereço.
- Status do lugar: **Quero visitar** ou **Visitado**.
- Geocodificação nativa do endereço para latitude e longitude.
- Exibição dos lugares em mapa nativo.
- Solicitação da localização atual do dispositivo.
- Captura de fotos pela câmera.
- Seleção de fotos da galeria.
- Salvamento de fotos capturadas na Media Library.
- Edição, consulta e remoção de lugares.
- Estatísticas por status e por cidade/estado.
- Tratamento de permissões, erros de armazenamento e falhas de geocodificação.

## Requisitos

- Node.js e npm.
- Dispositivo físico ou emulador Android/iOS.
- Development Build do Expo para os módulos nativos, como câmera, localização
  e mapas.
- Chave do Google Maps para o Android quando o app for executado em um
  Development Build ou APK.

O projeto não possui suporte web. Os diretórios nativos `android/` e `ios/`
são gerados pelo Expo quando necessário e não devem ser editados manualmente.

Durante testes no Expo Go, o `react-native-maps` pode funcionar sem
configuração adicional. Em um build nativo Android, entretanto, a chave do
Google Maps deve ser configurada para que o mapa seja exibido corretamente.
No iOS, a implementação padrão usa Apple Maps e não exige chave; uma chave
para Google Maps no iOS só é necessária se esse provedor for utilizado.

## Instalação

```sh
npm install
```

Após instalar as dependências, a aplicação pode ser executada em um
Development Build:

```sh
npm start
npm run android
npm run ios
```

Os comandos `android` e `ios` usam `expo run:android` e `expo run:ios`,
respectivamente.

## Variáveis de ambiente

Crie um arquivo `.env` local na raiz do projeto:

```env
GOOGLE_MAPS_ANDROID_API_KEY=sua_chave_android
GOOGLE_MAPS_IOS_API_KEY=sua_chave_ios
```

Para a execução no Android com Development Build ou APK, a variável
`GOOGLE_MAPS_ANDROID_API_KEY` é necessária. A variável
`GOOGLE_MAPS_IOS_API_KEY` só é necessária caso o aplicativo seja configurado
para usar Google Maps no iOS. O Expo Go pode ser usado para testes sem essas
variáveis, conforme o ambiente e o provedor de mapas.

O arquivo `.env` não deve ser versionado, e as chaves devem ser restringidas
no Google Cloud por plataforma, pacote/bundle ID e certificado quando
aplicável. Elas são credenciais públicas do aplicativo nativo, não segredos
de backend, mas ainda assim não devem ser expostas desnecessariamente no
repositório. O arquivo é carregado por
[`scripts/load-env.js`](./scripts/load-env.js), que:

1. lê `.env` e `.env.local`, quando existirem;
2. preserva variáveis já definidas pelo sistema;
3. não imprime valores no terminal;
4. disponibiliza as chaves somente para a configuração nativa do Expo.

Quando informadas, as chaves de mapas são inseridas em
`ios.config.googleMapsApiKey` e `android.config.googleMaps.apiKey` pelo
[`app.config.ts`](./app.config.ts). Como essa configuração é incorporada ao
build nativo, é necessário recriar o Development Build ou APK depois de
alterar as chaves. A localização do usuário e a geocodificação com
`Location.geocodeAsync` são independentes da chave do Google Maps; a chave
afeta principalmente a exibição do mapa Android em builds nativos.

## Configuração nativa

O [`app.config.ts`](./app.config.ts) é a fonte única da configuração do Expo.
Ele define:

- nome, slug, esquema e versão do aplicativo;
- bundle ID iOS `com.diarioviagens`;
- package Android `com.diarioviagens`;
- ícone principal e ícones adaptativos;
- imagem e cor da splash screen;
- chave do Google Maps em cada plataforma;
- permissões e mensagens de localização;
- permissões e mensagens da câmera;
- acesso à galeria pelo Image Picker;
- acesso e salvamento de fotos pela Media Library.

Os plugins nativos usados na configuração são `expo-location`,
`expo-camera`, `expo-image-picker`, `expo-media-library` e
`expo-splash-screen`.

## Fluxo de funcionamento

### Inicialização

1. [`index.tsx`](./index.tsx) registra o componente raiz com
   `registerRootComponent`.
2. [`src/App.tsx`](./src/App.tsx) carrega os assets de navegação e impede que a
   splash screen desapareça antes da navegação estar pronta.
3. `App` escolhe o tema claro ou escuro conforme o sistema.
4. `PlacesProvider` é montado acima do `NavigationContainer`, permitindo que
   todas as telas acessem os mesmos lugares.
5. [`AppNavigator.tsx`](./src/navigation/AppNavigator.tsx) monta o Stack
   Navigator principal.
6. Quando a navegação termina de carregar, a splash screen é ocultada.

### Cadastro de um lugar

1. O usuário toca em **Adicionar lugar** na lista.
2. A tela `PlaceFormScreen` valida nome, rua, número, cidade e estado.
3. O app solicita permissão de localização.
4. O endereço completo é enviado para `Location.geocodeAsync`.
5. Se o endereço não for localizado, o cadastro é interrompido e uma mensagem
   é exibida.
6. Com coordenadas válidas, o formulário cria um `PlaceDraft`.
7. `PlacesContext.savePlace` cria um ID, define `createdAt` e persiste o lugar.
8. Após salvar, a tela retorna para a tela anterior.

### Consulta e edição

- A lista exibe cada lugar em um `PlaceCard`.
- Ao tocar em um card, a navegação abre `PlaceDetailsScreen`.
- A tela de detalhes mostra foto, status, endereço, coordenadas e mapa.
- **Editar lugar** abre o mesmo formulário com o ID do lugar.
- O contexto identifica o registro existente e o substitui mantendo o ID e a
  data de criação.
- **Marcar como Visitado** atualiza somente o status.
- **Remover do diário** pede confirmação e exclui o registro local.

### Mapa e estatísticas

- A aba **Mapa** usa `useLocation` para solicitar e atualizar a localização
  atual.
- `MapSurface.native.tsx` renderiza um `MapView` e um `Marker` para cada
  lugar salvo.
- Os pins dos lugares usam as cores do status: laranja para **Quero visitar**
  e verde para **Visitado**.
- Quando a localização do usuário é obtida depois da abertura da tela, o mapa
  é recentralizado automaticamente nessa posição, com zoom regional. Se a
  permissão for negada, os lugares salvos continuam disponíveis e o app
  informa o problema.
- O mapa compacto da tela de detalhes é centralizado no lugar selecionado e
  usa um zoom aproximado para visualizar sua região, em vez de mostrar o país
  inteiro.
- Tocar em um marcador abre os detalhes do lugar.
- A aba **Estatísticas** calcula os totais em memória a partir de `places`,
  agrupando por status e por cidade/estado.

## Arquitetura da aplicação

O fluxo geral de dependências é:

```text
index.tsx
  └── App
      ├── PlacesProvider
      │   └── AsyncStorage
      └── AppNavigator
          ├── MainTabsNavigator
          │   ├── ListScreen
          │   ├── MapScreen
          │   └── StatsScreen
          ├── PlaceFormScreen
          └── PlaceDetailsScreen
```

A aplicação usa uma arquitetura de apresentação com estado compartilhado:

- as telas cuidam da interface e das interações;
- o contexto concentra o estado e a persistência dos lugares;
- o hook de localização concentra permissões e leitura do GPS;
- a biblioteca de geocodificação converte endereços em coordenadas;
- os componentes reutilizáveis encapsulam elementos visuais e ações comuns;
- os tipos TypeScript definem o contrato dos dados e das rotas.

## Navegação

### Stack Navigator

[`AppNavigator.tsx`](./src/navigation/AppNavigator.tsx) usa
`createNativeStackNavigator` e define:

| Rota       | Tela                 | Função                           |
| ---------- | -------------------- | -------------------------------- |
| `MainTabs` | `MainTabsNavigator`  | Navegação principal por abas     |
| `Cadastro` | `PlaceFormScreen`    | Criar ou editar um lugar         |
| `Detalhes` | `PlaceDetailsScreen` | Consultar e administrar um lugar |

### Tab Navigator

[`MainTabsNavigator.tsx`](./src/navigation/MainTabsNavigator.tsx) usa
`createBottomTabNavigator` e define:

| Aba            | Tela          | Função                                   |
| -------------- | ------------- | ---------------------------------------- |
| `Lista`        | `ListScreen`  | Lista, resumo e entrada de novos lugares |
| `Mapa`         | `MapScreen`   | Mapa, marcadores e localização atual     |
| `Estatísticas` | `StatsScreen` | Gráficos e totais do diário              |

Os parâmetros são definidos em
[`navigation-types.ts`](./src/navigation/navigation-types.ts):

- `Cadastro` recebe opcionalmente `{ id }` para edição;
- `Detalhes` recebe obrigatoriamente `{ id }`;
- as abas não recebem parâmetros.

As telas usam `useNavigation` e `useRoute` do React Navigation. Não há
Expo Router no projeto.

## Modelo de dados

O tipo `Place` está em [`src/types/place.ts`](./src/types/place.ts):

```ts
type Place = {
  id: string;
  name: string;
  description: string;
  street: string;
  number: string;
  city: string;
  state: string;
  status: 'Quero visitar' | 'Visitado';
  photoAssetId: string | null;
  photoUri?: string | null; // compatibilidade com registros antigos
  latitude: number;
  longitude: number;
  createdAt: string;
};
```

`PlaceDraft` é usado pelo formulário antes de o ID e a data de criação serem
definidos pelo contexto.

## Armazenamento de dados

[`PlacesContext.tsx`](./src/context/PlacesContext.tsx) usa
`@react-native-async-storage/async-storage`.

Chave utilizada:

```text
diario-de-viagens:places:v1
```

O valor armazenado é um array JSON de `Place`.

### Carregamento

- O contexto chama `AsyncStorage.getItem` ao montar.
- O JSON é validado minimamente antes de atualizar o estado.
- `isLoaded` indica quando a leitura inicial terminou.
- `storageError` informa falhas de leitura ou impede novas alterações quando o
  armazenamento está indisponível.

### Persistência

As operações `savePlace`, `updateStatus` e `removePlace` criam um novo array e
chamam `AsyncStorage.setItem`. O estado React só é atualizado depois que a
persistência termina com sucesso.

Não existe banco remoto ou sincronização entre dispositivos. A remoção do app
ou a limpeza dos dados do aplicativo pode apagar o diário.

As fotos novas são salvas na Media Library, e o `Place` guarda somente o
identificador do asset (`photoAssetId`). Ao exibir a imagem, o app resolve esse
identificador com `MediaLibrary.getAssetInfoAsync`, sem duplicar o arquivo no
armazenamento privado. Se o usuário apagar a foto da biblioteca, o app mantém o
cadastro e exibe o estado sem imagem. Registros antigos podem conter
`photoUri`, mantido apenas para compatibilidade.

## Contexto `PlacesContext`

O contexto expõe:

- `places`: lugares carregados;
- `isLoaded`: status da leitura inicial;
- `storageError`: erro de persistência ou carregamento;
- `savePlace(draft)`: cria ou atualiza um lugar;
- `updateStatus(id, status)`: atualiza o status;
- `removePlace(id)`: remove um lugar;
- `findPlace(id)`: localiza um lugar pelo ID.

`usePlaces` lança um erro explícito quando utilizado fora de
`PlacesProvider`, evitando uma falha silenciosa.

## Hook `useLocation.ts`

[`useLocation.ts`](./src/hooks/useLocation.ts) encapsula:

- solicitação de `requestForegroundPermissionsAsync`;
- leitura por `getCurrentPositionAsync`;
- precisão balanceada com `Location.Accuracy.Balanced`;
- estado de carregamento;
- indicação de permissão negada;
- mensagem de erro;
- atualização manual por `refreshLocation`.

O hook tenta obter a localização uma vez após a montagem da tela e também pode
ser acionado pelo botão de atualizar da tela de mapa.

## Biblioteca `lib/geocoding.ts`

[`geocoding.ts`](./src/lib/geocoding.ts) possui uma função pequena e
especializada:

```ts
geocodeAddress(enderecoCompleto): Promise<Coordinates | null>
```

Ela usa exclusivamente `Location.geocodeAsync`. O primeiro resultado é
convertido para `{ latitude, longitude }`; quando nenhum resultado é
encontrado, retorna `null`. Não existe fallback web ou chamada ao Nominatim.

## Telas (`src/screens`)

### `ListScreen.tsx`

Tela inicial do diário. Exibe:

- marca do aplicativo;
- botão para novo cadastro;
- resumo de lugares planejados e visitados;
- quantidade total;
- estado de carregamento;
- mensagem de erro de armazenamento;
- lista de `PlaceCard`.

### `MapScreen.tsx`

Exibe o mapa nativo, marcadores dos lugares, legenda de status, estado da
localização e mensagens de permissão ou erro.

### `StatsScreen.tsx`

Calcula e apresenta:

- total de lugares;
- gráfico de pizza por status;
- gráfico de barras por cidade e estado;
- estado vazio quando não existem dados.

### `PlaceFormScreen.tsx`

É usada tanto para criar quanto para editar. Controla os campos do formulário,
status, foto, validação, permissões, geocodificação, estado de salvamento e
mensagens de erro.

### `PlaceDetailsScreen.tsx`

Exibe todos os dados de um lugar, incluindo foto, endereço, coordenadas e mapa.
Também permite marcar como visitado, editar ou remover.

## Componentes (`src/components`)

- `ActionButton.tsx`: botão padronizado com variantes, ícone, loading e estado
  desabilitado.
- `BrandMark.tsx`: identidade visual do diário.
- `CameraModal.tsx`: fluxo de permissão, preview e captura de foto.
- `MapSurface.native.tsx`: mapa nativo com marcadores.
- `PhotoField.tsx`: preview, câmera, seleção de galeria e mensagens de erro.
- `PlaceCard.tsx`: item visual da lista de lugares.
- `ScreenShell.tsx`: layout comum com `SafeAreaView`, rolagem, espaçamento e
  fundo do aplicativo.
- `StatusBadge.tsx`: indicador visual do status do lugar.

## Tema

[`src/theme/colors.ts`](./src/theme/colors.ts) centraliza as cores, fontes,
contraste, superfícies, bordas e cores de status usadas pelas telas e
componentes. Isso evita valores visuais espalhados e mantém a identidade
consistente.

## Arquitetura de pastas

```text
.
├── assets/
│   └── images/                  # Ícones, splash e imagens nativas
├── scripts/
│   └── load-env.js             # Carregamento local de .env
├── src/
│   ├── App.tsx                 # Tema, splash, provider e navigator
│   ├── components/             # Componentes reutilizáveis
│   ├── context/
│   │   └── PlacesContext.tsx   # Estado e persistência dos lugares
│   ├── hooks/
│   │   └── useLocation.ts      # Permissão e localização atual
│   ├── lib/
│   │   └── geocoding.ts        # Conversão de endereço em coordenadas
│   ├── navigation/             # Stack, tabs e tipos de rotas
│   ├── screens/                # Telas do aplicativo
│   ├── theme/                  # Cores e fontes
│   └── types/                  # Tipos do domínio e bibliotecas
├── app.config.ts               # Configuração Expo nativa
├── babel.config.js             # Configuração Babel
├── metro.config.js             # Configuração Metro
├── package.json                # Scripts e dependências
└── tsconfig.json               # Configuração TypeScript
```

## Bibliotecas utilizadas

### Base e plataforma

- `expo`: runtime e ferramentas Expo.
- `react` e `react-native`: interface e componentes nativos.
- `typescript`: tipagem estática.
- `expo-dev-client`: execução em Development Build.
- `expo-asset`: pré-carregamento de assets.
- `expo-font`: dependência nativa das fontes e ícones.
- `expo-splash-screen`: controle da splash screen.
- `expo-system-ui`: integração visual com o sistema.

### Navegação

- `@react-navigation/native`: `NavigationContainer`, hooks e tipos base.
- `@react-navigation/native-stack`: Stack Navigator nativo.
- `@react-navigation/bottom-tabs`: navegação por abas.
- `@react-navigation/elements`: assets auxiliares da navegação.

### Recursos nativos

- `expo-location`: localização e geocodificação.
- `react-native-maps`: mapa e marcadores.
- `expo-camera`: câmera.
- `expo-image-picker`: seleção de imagens.
- `expo-media-library`: leitura e salvamento na galeria.
- `@react-native-async-storage/async-storage`: persistência local.
- `react-native-safe-area-context`: áreas seguras.
- `@expo/vector-icons`: ícones Ionicons.

### Gráficos e suporte

- `react-native-svg`: renderização vetorial.
- `react-native-svg-charts`: gráficos de pizza e barras.
- `react-native-gesture-handler` e `react-native-screens`: suporte aos
  navegadores nativos.

## Comandos de validação

```sh
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

Antes de gerar uma build nativa, confirme que as chaves do Google Maps estão
configuradas e que as permissões foram declaradas no `app.config.ts`.
