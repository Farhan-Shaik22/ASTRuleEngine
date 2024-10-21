
import React from "react";

const Loader = () => {
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute border-[16px] border-[#f5f5f5] box1 animate-box1"></div>
      <div className="absolute border-[16px] border-[#f5f5f5] box2 animate-box2"></div>
      <div className="absolute border-[16px] border-[#f5f5f5] box3 animate-box3"></div>

      <style jsx>{`
        @keyframes box1 {
          0%, 12.5%, 25%, 37.5%, 50%, 62.5% {
            width: 112px;
            height: 48px;
            margin-top: 64px;
            margin-left: 0;
          }
          75% {
            width: 48px;
            height: 48px;
            margin-top: 0;
            margin-left: 0;
          }
          87.5%, 100% {
            width: 48px;
            height: 48px;
            margin-top: 0;
            margin-left: 0;
          }
        }

        @keyframes box2 {
          0%, 12.5%, 25%, 37.5% {
            width: 48px;
            height: 48px;
            margin-top: 0;
            margin-left: 0;
          }
          50% {
            width: 112px;
            height: 48px;
            margin-top: 0;
            margin-left: 0;
          }
          62.5%, 75%, 87.5%, 100% {
            width: 48px;
            height: 48px;
            margin-top: 0;
            margin-left: 64px;
          }
        }

        @keyframes box3 {
          0%, 12.5%, 62.5%, 75%, 87.5% {
            width: 48px;
            height: 48px;
            margin-top: 0;
            margin-left: 64px;
          }
          25% {
            width: 48px;
            height: 112px;
            margin-top: 0;
            margin-left: 64px;
          }
          37.5%, 50% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 64px;
          }
          100% {
            width: 112px;
            height: 48px;
            margin-top: 64px;
            margin-left: 0;
          }
        }

        .box1 {
          animation: box1 4s 1s forwards ease-in-out infinite;
        }

        .box2 {
          animation: box2 4s 1s forwards ease-in-out infinite;
        }

        .box3 {
          animation: box3 4s 1s forwards ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
