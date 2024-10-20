import { useLayoutEffect, useState } from "react";
import { getCoinsList } from "./api/endpoints";
import CoinDetails from "./components/CoinDetails";
import { coinDummyData } from "./constants";
import { useStore } from "./store";
import { CoinData } from "./types";

function App() {
  const { setCoinsList } = useStore((state) => state);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);

  useLayoutEffect(() => {
    (async () => {
      try {
        if (
          coinDummyData &&
          typeof coinDummyData === "object" &&
          coinDummyData.id
        ) {
          setSelectedCoin(coinDummyData);
          setCoinsList([coinDummyData]);
        } else {
          const fetchedCoinsList = await getCoinsList();
          setCoinsList(fetchedCoinsList);
          if (fetchedCoinsList?.length > 0) {
            setSelectedCoin(fetchedCoinsList[0]);
          }
        }
      } catch (error) {
        console.error("Error setting up coin data:", error);
      }
    })();
  }, []);

  if (!selectedCoin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex mx-auto my-20 max-w-screen-md">
      <CoinDetails coin={selectedCoin} />
    </div>
  );
}

export default App;
