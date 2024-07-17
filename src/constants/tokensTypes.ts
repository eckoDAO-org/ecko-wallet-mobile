export type TTokens = {
  stage: {
    KDA: TToken;
    KDX: TToken;
    ABC: TToken;
    XYZ: TToken;
  };
  development: {
    KDA: TToken;
    KDX: TToken;
    ABC: TToken;
    XYZ: TToken;
  };
  mainnet: TMainnet;
};

export type TMainnet = {
  KDA: TToken;
  KDX: TToken;
  zUSD: TToken;
  FLUX: TToken;
  HYPE: TToken;
  MOK: TToken;
  KDL: TToken;
  KDS: TToken;
  BKA: TToken;
  KISHK: TToken;
  KAPY: TToken;
  ARKD: TToken;
  KAYC: TToken;
  CFLY: TToken;
  HERON: TToken;
  MAGA: TToken;
  CRKK: TToken;
  FINUX: TToken;
  BRO: TToken;
};
export type TToken = {
  name: string;
  coingeckoId: string;
  tokenNameKaddexStats: string;
  code: string;
  icon: string;
  statsID: string;
  precision: number;
};
