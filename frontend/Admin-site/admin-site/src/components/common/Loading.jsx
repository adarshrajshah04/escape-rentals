import React from "react";
// import { OrbitProgress } from "react-loading-indicators";
import { ThreeDot } from "react-loading-indicators";

const Loading = ({ text = "Please wait..." }) => {
  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-4 bg-transparent">
      {/* <OrbitProgress
        color={["#24563A", "#C5A46D", "#327fcd"]}
        size="small"
        text=""
        textColor="#64748B"
      /> */}
      <ThreeDot
        variant="bounce"
        color={[
          "#10B981", // Emerald
          "#06B6D4", // Cyan
          "#3B82F6", // Blue
          "#6366F1", // Indigo
          "#8B5CF6", // Violet
          "#D946EF", // Pink
          "#F59E0B", // Amber
          "#F97316", // Orange
        ]}
        size="large"
        text=""
      />

      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-slate-700">{text}</p>

        <p className="text-xs text-slate-400">This may take a few moments</p>
      </div>
    </div>
  );
};

export default Loading;
