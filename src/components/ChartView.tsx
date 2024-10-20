import { ColorType, createChart, ISeriesApi } from "lightweight-charts";
import { LegacyRef, useEffect, useRef } from "react";
import { ChartSkeleton } from "./ChartSkeleton";

export default function ChartComponent(props: any) {
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
    limitExceeded,
    useDummyDataHandler,
  } = props;
  const chartContainerRef = useRef<HTMLDivElement>();

  console.log("@price", data, loading);
  useEffect(() => {
    if (loading || !data || !chartContainerRef?.current) {
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
        visible: true,
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScale: {
        axisPressedMouseMove: {
          time: false,
          price: false,
        },
      },
    });

    chart.timeScale().fitContent();

    const newSeries: ISeriesApi<"Area"> = chart.addAreaSeries({
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

    const formattedData = data?.map(([timestamp, value]: any) => ({
      time: timestamp / 1000,
      value: value,
    }));

    const sortedData = [...formattedData].sort((a, b) => a.time - b.time);

    if (sortedData.length === 0) {
      console.error("No data available to render the chart.");
      return;
    }

    newSeries.setData(sortedData);

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

  if (loading || !data || limitExceeded) {
    if (limitExceeded)
      return (
        <ChartSkeleton
          text="CoinGecko API Limit Exceeded"
          actionHandlerText="use dummy data"
          actionHandler={useDummyDataHandler}
        />
      );
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
}
