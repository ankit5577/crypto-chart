function ChartSkeleton() {
  return (
    <div className="relative isolate h-full w-full cursor-wait space-y-5 overflow-hidden rounded-xl bg-[#F8FAFC]">
      <div className="absolute inset-0 -top-11 z-50 h-[125rem] w-full -translate-x-full animate-shimmer blur-2xl delay-0">
        <div className="absolute h-[125rem] w-[12.3125rem] bg-[#F1F5F9]"></div>
      </div>
    </div>
  );
}

export { ChartSkeleton };
