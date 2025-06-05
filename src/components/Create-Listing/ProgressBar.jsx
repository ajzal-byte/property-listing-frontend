import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 w-full z-0"></div>

        {/* Completed progress */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 z-10 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Step markers */}
        <div className="flex justify-between w-full relative z-20">
          {steps.map((step) => (
            <TooltipProvider key={step.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        step.id < currentStep 
                          ? "bg-blue-500 text-white" 
                          : step.id === currentStep 
                            ? "bg-blue-500 text-white ring-4 ring-blue-100" 
                            : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {step.id + 1}
                    </div>
                    <span 
                      className={cn(
                        "mt-2 text-xs font-medium hidden sm:block",
                        step.id <= currentStep ? "text-blue-500" : "text-gray-500"
                      )}
                    >
                      {step.shortName}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{step.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
