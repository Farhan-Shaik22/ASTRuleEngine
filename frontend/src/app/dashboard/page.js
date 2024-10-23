"use client";

import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useCallback } from "react";
import Loader from "../_components/Loading";
import Modal from "../_components/Modal";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [rules, setRules] = useState([]);
  const [isLoadingRules, setIsLoadingRules] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [newRuleString, setNewRuleString] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRuleIds, setSelectedRuleIds] = useState([]);
  const [isCombineMode, setIsCombineMode] = useState(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedRuleForEval, setSelectedRuleForEval] = useState(null);

  const userFullName = user?.fullName?.toUpperCase() || "GUEST";
  const userId = user?.id || user?.primaryEmailAddressId;

  const fetchRules = useCallback(async () => {
    if (!userId) return;
    
    setIsLoadingRules(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: userId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.data.message}`);
      }
      
      const data = await response.json();
      setRules(data.rules);
    } catch (error) {
      // console.error("Error fetching rules:", error);
      setError("Failed to fetch rules. Please try again later.");
    } finally {
      setIsLoadingRules(false);
    }
  }, [userId]);

  useEffect(() => {
    if (error) {
      toast(error);
    }
  }, [error]);

  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      fetchRules();
    }
  }, [isLoaded, isSignedIn, userId, fetchRules]);

  const handleEvaluate = (ruleIndex) => {
    setSelectedRuleForEval(rules[ruleIndex]);
    setIsEvalModalOpen(true);
    setJsonInput("");
    setEvaluationResult(null);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        setJsonInput(text);
        JSON.parse(text);
      } catch (error) {
        setError("Invalid JSON file. Please check the file content.");
      }
    }
  };

  const handleEvaluation = async () => {
    if (!jsonInput) {
      setError("Please provide JSON data for evaluation");
      return;
    }

    try {
      const jsonData = JSON.parse(jsonInput);
      setIsEvaluating(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/evaluate_rule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ruleId: selectedRuleForEval._id,
          data: jsonData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        
      }

      const res = await response.json()
      const result= res.result
      setEvaluationResult(result+"");
    } catch (error) {
      // console.error("Error evaluating rule:", error);
      setError(error.message || "Failed to evaluate rule. Please check your JSON input.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleVisualizeTree = (ruleIndex) => {
    setSelectedRule(ruleIndex);
    setIsTreeModalOpen(true);
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/create_rule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
          ruleString: newRuleString.trim(),
        }),
      });
      
      if (!response.ok) {
        
        let errorData = await response.json();
        console.log(errorData.error);
        throw new Error(errorData.error || 'An error occurred');
        
      }
      
      await fetchRules();
      setIsModalOpen(false);
      setNewRuleString("");
      setModalType("add");
    } catch (error) {
      // console.error("Error adding rule:", error);
      setError(error+"" || "Failed to add rule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCombineRules = async () => {
    if (selectedRuleIds.length < 2) {
      setError("Please select at least two rules to combine.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/combine_rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
          ruleIds: selectedRuleIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchRules();
      setIsModalOpen(false);
      setSelectedRuleIds([]);
      setIsCombineMode(false);
    } catch (error) {
      // console.error("Error combining rules:", error);
      setError("Failed to combine rules. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRuleSelection = (ruleId) => {
    setSelectedRuleIds(prev => {
      if (prev.includes(ruleId)) {
        return prev.filter(id => id !== ruleId);
      }
      return [...prev, ruleId];
    });
  };

  const openModal = (type) => {
    if (type === "combine") {
      setIsCombineMode(true);
      setSelectedRuleIds([]);
    } else {
      setModalType(type);
      setIsModalOpen(true);
    }
    setError(null);
  };

  const cancelCombineMode = () => {
    setIsCombineMode(false);
    setSelectedRuleIds([]);
    setError(null);
  };

  if (!isLoaded) return <Loader />;

  return (
    <div className="p-4">
      <div className="flex justify-center items-center mb-6">
        <h1 className="bg-clip-text font-semibold text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-gray-600/30 p-2 z-20 text-base md:text-xl lg:text-2xl">
          HELLO {userFullName}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {isLoadingRules ? (
        <Loader />
      ) : (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Rules List</h2>
            <div className="flex flex-row space-x-4">
              {isCombineMode ? (
                <>
                  <button
                    onClick={handleCombineRules}
                    disabled={selectedRuleIds.length < 2 || isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Combining..." : "Confirm Combine"}
                  </button>
                  <button
                    onClick={cancelCombineMode}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openModal("combine")}
                    className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 transition-colors"
                  >
                    Combine Rules
                  </button>
                  <button
                    onClick={() => openModal("add")}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <span className="mr-1">+</span> Add Rule
                  </button>
                </>
              )}
            </div>
          </div>
          
          {rules.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-16">
                    {isCombineMode ? "Select" : "S.No"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rule String
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-28">
                    Evaluate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-28">
                    Visualize
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {rules.map((rule, index) => (
                  <tr key={rule._id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      {isCombineMode ? (
                        <input
                          type="checkbox"
                          checked={selectedRuleIds.includes(rule._id)}
                          onChange={() => handleRuleSelection(rule._id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      ) : (
                        index + 1
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 break-words">
                      {rule.ruleString}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => handleEvaluate(index)}
                        disabled={isCombineMode}
                        className="px-3 py-1 bg-transparent border border-gray-600 text-gray-300 rounded hover:bg-gray-700 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Evaluate
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => handleVisualizeTree(index)}
                        disabled={isCombineMode}
                        className="px-3 py-1 bg-transparent border border-gray-600 text-gray-300 rounded hover:bg-gray-700 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Tree
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>          
          ) : (
            <p className="text-gray-400">No rules found</p>
          )}
        </div>
      )}

{isEvalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Evaluate Rule</h3>
              <button
                onClick={() => {
                  setIsEvalModalOpen(false);
                  setEvaluationResult(null);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-300 mb-2">Rule String:</p>
              <p className="p-2 bg-gray-700 rounded-md text-white">{selectedRuleForEval?.ruleString}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload JSON File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Or Enter JSON Data
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
                placeholder='{"key": "value"}'
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {evaluationResult && (
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">Evaluation Result:</h4>
                <pre className="text-gray-300 text-med whitespace-pre-wrap">
                  {JSON.stringify(evaluationResult, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEvalModalOpen(false);
                  setEvaluationResult(null);
                  setError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={handleEvaluation}
                disabled={isEvaluating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEvaluating ? "Evaluating..." : "Evaluate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isTreeModalOpen && (
        <Modal 
          value={isTreeModalOpen} 
          setvalue={setIsTreeModalOpen} 
          ast={rules[selectedRule]?.ast}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {modalType === "add" ? "Add New Rule" : "Combine Rules"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddRule}>
              <div className="mb-4">
                <label 
                  htmlFor="ruleString" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Rule String
                </label>
                <textarea
                  id="ruleString"
                  value={newRuleString}
                  onChange={(e) => setNewRuleString(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter your rule string"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : modalType === "add" ? "Add Rule" : "Combine Rules"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}