
import React from "react";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="absolute text-white  animate-spin bg-transparent self-center">
      <Loader2 size={150} />
    </div>
  );
};

export default Loader;
