import React from "react";

export default function Home() {
  return (
    (
      <div
        className="z-10 absolute inset-0 text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-5xl lg:text-8xl w-full min-h-screen flex flex-col items-center justify-center bg-transparent">
        <p
          className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20 p-2 z-20">
          Abstract Syntax Trees
        </p>
        <p
          className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/60 to-gray-700/40 p-2 z-20 text-base md:text-xl lg:text-2xl">
          Please Sign In or Sign Up to continue
        </p>
      </div>)
  );
}
