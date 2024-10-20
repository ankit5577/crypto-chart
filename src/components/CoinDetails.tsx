"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Header } from "./Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TwChart } from "./TwChart";
import SummaryTab from "./SummaryTab";
import StatisticsTab from "./StatisticTab";
import AnalysisTab from "./AnalysisTab";
import { CoinData } from "@/types";

export default function CoinDetails({ coin }: { coin: CoinData }) {
  const tabData = [
    {
      value: "summary",
      label: "Summary",
      content: <SummaryTab coin={coin} />,
      className: "rounded-tl-lg",
    },
    {
      value: "chart",
      label: "Chart",
      content: <TwChart coin={coin} />,
      className: "rounded-tr-lg",
    },
    {
      value: "statistics",
      label: "Statistics",
      content: <StatisticsTab coin={coin} />,
      className: "rounded-tr-lg",
    },
    {
      value: "analysis",
      label: "Analysis",
      content: <AnalysisTab coin={coin} />,
      className: "rounded-tr-lg",
    },
    {
      value: "settings",
      label: "Settings",
      content: "Coming soon...",
      className: "rounded-tr-lg",
    },
  ];

  const triggerClasses = `h-12 border-b-2 text-base text-gray-400 
    data-[state=active]:border-b-2 data-[state=active]:border-b-primary
    data-[state=active]:bg-white data-[state=active]:text-gray-700`;

  return (
    <Card className={`!bg-white neumorphic w-full`}>
      <Header coin={coin} />
      <CardContent>
        <div className="flex w-full mb-4 text-sm text-gray-500">
          <Tabs defaultValue="summary" className="w-full max-w-xl">
            <TabsList className="grid h-12 w-full grid-cols-6 rounded-none p-0 animate-fade-in-up">
              {tabData.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className={`${triggerClasses} ${tab.className}`}
                  value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex my-5 w-full min-h-[23rem] animate-fade-in-up">
              {tabData.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="w-full animate-fade-in-down"
                >
                  {tab.content}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
