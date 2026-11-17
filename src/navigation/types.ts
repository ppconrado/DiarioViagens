export type MainTabParamList = {
  Lista: undefined;
  Mapa: undefined;
  Estatísticas: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Cadastro: { id?: string } | undefined;
  Detalhes: { id: string };
};
