
import React from "react";
import { ThreeDot } from "react-loading-indicators";

const Loading = ({ text = "Please wait..." }) => {
  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-4 bg-transparent">

      <ThreeDot
        variant="bounce"
        color="#A6533C"
        size="large"
        text=""
        textColor="#6B625C"
      />

      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-text-primary">
          {text}
        </p>

        <p className="text-xs text-text-secondary">
          This may take a few moments...
        </p>
      </div>

    </div>
  );
};

export default Loading;
