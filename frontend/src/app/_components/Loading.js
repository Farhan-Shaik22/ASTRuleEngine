
import React from "react";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="w-full flex justify-center mt-20">
    <div className="absolute text-white  animate-spin bg-transparent self-center">
      <Loader2 size={150} />
    </div>
    </div>
  );
};

export default Loader;
