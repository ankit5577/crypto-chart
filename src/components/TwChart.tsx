import { getCoinHistoricData } from "@/api/endpoints";
import { timeRanges } from "@/constants";
import { useStore } from "@/store";
import { CoinData } from "@/types";
import { getDaysFromTimeRange } from "@/utils";
import { ColorType, createChart } from "lightweight-charts";
import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChartSkeleton } from "./ChartSkeleton";
import { Button } from "./ui/button";

export const ChartComponent = (props: any) => {
  const {
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#6366F1",
      textColor = "#64748B",
      areaTopColor = "rgba(99, 102, 241, 0.2)",
      areaBottomColor = "rgba(99, 102, 241, 0.02)",
    } = {},
    loading,
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>();

  console.log("@price", data, loading);
  useEffect(() => {
    if (loading) {
      return;
    }
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef?.current as HTMLDivElement, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        attributionLogo: false,
        textColor,
        fontFamily: "Inter, -apple-system, system-ui, sans-serif",
      },
      width: chartContainerRef?.current?.clientWidth,
      height: 300,
      rightPriceScale: {
        visible: true,
        borderVisible: true,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
        autoScale: true,
        borderColor: "rgba(197, 203, 206, 0.3)",
        textColor: "white",
      },
      leftPriceScale: {
        visible: false,
      },
      grid: {
        vertLines: {
          visible: true,
          color: "rgba(197, 203, 206, 0.5)",
          style: 1,
        },
        horzLines: {
          visible: false,
          color: "rgba(197, 203, 206, 0.0)",
          style: 1,
        },
      },
      crosshair: {
        vertLine: {
          visible: true,
          labelVisible: false,
        },
        horzLine: {
          visible: true,
          labelVisible: true,
        },
      },
      timeScale: {
        borderVisible: false,
        visible: false,
        timeVisible: false,
        secondsVisible: false,
        tickMarkFormatter: (time: any) => {
          const date = new Date(time);
          return date.toLocaleDateString("default", {
            month: "short",
            day: "numeric",
          });
        },
      },
      handleScale: {
        axisPressedMouseMove: {
          time: false,
          price: false,
        },
      },
    });

    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor,
      lineWidth: 2,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
      lastValueVisible: true,
      priceLineVisible: false,
      crosshairMarkerVisible: false,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: lineColor,
      crosshairMarkerBackgroundColor: "white",
    });

    const formattedData = data.map(([timestamp, value]: any) => ({
      time: timestamp / 1000,
      value: value,
    }));

    newSeries.setData(formattedData);
    const style = document.createElement("style");
    document.head.appendChild(style);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.head.removeChild(style);
      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    loading,
  ]);

  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <div
      id="currency-card"
      ref={chartContainerRef as unknown as LegacyRef<HTMLDivElement>}
      style={{
        position: "relative",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "16px",
      }}
    />
  );
};

export function TwChart({ coin }: { coin: CoinData }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    setCoinPrices,
    clearCoinPrices,
    timeRange,
    coinPrices,
    setTimeRange,
  } = useStore((state) => state);

  useLayoutEffect(() => {
    const fetchData = async () => {
      const coinId = coin?.id?.toLowerCase();
      const days = getDaysFromTimeRange(timeRange);

      if (coinId) {
        clearCoinPrices();
        const historicData = await getCoinHistoricData(coinId, days);
        const { prices } = historicData;
        setCoinPrices(prices);
      }
    };

    setLoading(true);
    if (/* import.meta.env.MODE === "development" */ false) {
    } else {
      fetchData();
    }
  }, [timeRange, coin?.id, setCoinPrices, clearCoinPrices]);

  useEffect(() => {
    if (coinPrices) {
      setLoading(false);
    }
  }, [coinPrices]);

  const toggleFullscreen = () => {
    const chartElement = document.getElementById("currency-card");

    if (!document.fullscreenElement) {
      if (chartElement?.requestFullscreen) {
        chartElement?.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-gray-700 p-0"
            onClick={toggleFullscreen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
            </svg>
            Fullscreen
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-gray-700 p-0"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#6F7177"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8V16"
                stroke="#6F7177"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12H16"
                stroke="#6F7177"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Compare
          </Button>
        </div>
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              onClick={() => setTimeRange(range)}
              className={`px-4 !py-0 text-xs rounded-[0.5rem] ${
                timeRange === range
                  ? "bg-primary text-white"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      <div
        className={`${
          isFullscreen ? "h-[calc(100vh-200px)] bg-white" : "h-[300px]"
        } w-full`}
      >
        <ChartComponent data={coinPrices} loading={loading}></ChartComponent>
      </div>
    </div>
  );
}
