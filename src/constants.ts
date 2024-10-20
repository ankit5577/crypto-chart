import { PriceEntry } from "./types";

export const timeRanges = ["1d", "3d", "1w", "1m", "6m", "1y", "max"];

export const coinDummyData = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image:
    "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
  current_price: 68388,
  market_cap: 1351992976803,
  market_cap_rank: 1,
  fully_diluted_valuation: 1436125154813,
  total_volume: 29364236381,
  high_24h: 68970,
  low_24h: 67633,
  price_change_24h: 494.36,
  price_change_percentage_24h: 0.72813,
  market_cap_change_24h: 10008901682,
  market_cap_change_percentage_24h: 0.74583,
  circulating_supply: 19769762,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 73738,
  ath_change_percentage: -7.21797,
  ath_date: "2024-03-14T07:10:36.635Z",
  atl: 67.81,
  atl_change_percentage: 100794.49952,
  atl_date: "2013-07-06T00:00:00.000Z",
  roi: null,
  last_updated: "2024-10-19T09:29:11.404Z",
};

export const chartDummyData: PriceEntry[] = [
  [1729084750209, 67741.50537542607],
  [1729088072251, 67899.28204498948],
  [1729091917600, 67719.5946762508],
  [1729130663808, 67858.8459657333],
  [1729134149740, 67459.34522207073],
  [1729137883086, 67575.81038181401],
  [1729141974108, 67329.12323409185],
  [1729144943759, 67339.18303715023],
  [1729149211508, 67108.18186118477],
  [1729152164533, 67282.61792681798],
  [1729156642522, 67400.56598022403],
  [1729159694652, 67260.94179047293],
  [1729163151521, 67237.08796399015],
  [1729166869519, 66909.04088406198],
  [1729170443905, 67111.571368663],
  [1729174772362, 66882.70873243679],
  [1729177706255, 67027.42751254764],
  [1729180850678, 67542.60133051021],
];
