import Tree from "./Treevis";

export default function Modal ({ value, setvalue , ast }) {
    const handleclose = () =>{
        setvalue(false);
    }
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 w-full h-full overflow-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">AST Visualization</h2>
            <button
              onClick={handleclose}
              className="text-gray-300 hover:text-white text-xl"
              
            >
              ✕
            </button>
          </div>
          <Tree astData={ast}/>
        </div>
      </div>
    );
  };