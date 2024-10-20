'use client';

import React, { useEffect, useState } from 'react';

const CustomCard = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`}>
    {children}
  </div>
);

const CustomCardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const TreeNode = ({ node, x, y, level }) => {
  const nodeWidth = 70;
  const nodeHeight = 60;
  const verticalGap = 100;
  const widths = [650, 470, 350, 275, 150, 120];
  const wd = widths[level] ? widths[level] : 120;
  const horizontalGap = wd / Math.pow(1.5, level); 

  const getNodeContent = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      const key = Object.keys(value)[0];
      if (key && value[key] && value[key].operator && value[key].value) {
        return `${key} ${value[key].operator} ${value[key].value}`;
      }
    }
    return 'Invalid Node';
  };

  const nodeContent = getNodeContent(node.value);

  return (
    <g>
      <rect
        x={x - nodeWidth / 2}
        y={y}
        width={nodeWidth}
        height={nodeHeight}
        rx={8}
        ry={8}
        fill={node.type === 'operator' ? '#93c5fd' : '#bfdbfe'}
        stroke="#3b82f6"
        strokeWidth={2}
      />
      <text
        x={x}
        y={y + nodeHeight / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1e3a8a"
        fontSize={11}
        fontWeight="bold"
      >
        {nodeContent}
      </text>
      {node.left && (
        <>
          <line
            x1={x}
            y1={y + nodeHeight}
            x2={x - horizontalGap / 2}
            y2={y + verticalGap}
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <TreeNode
            node={node.left}
            x={x - horizontalGap / 2}
            y={y + verticalGap}
            level={level + 1}
          />
        </>
      )}
      {node.right && (
        <>
          <line
            x1={x}
            y1={y + nodeHeight}
            x2={x + horizontalGap / 2}
            y2={y + verticalGap}
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <TreeNode
            node={node.right}
            x={x + horizontalGap / 2}
            y={y + verticalGap}
            level={level + 1}
          />
        </>
      )}
    </g>
  );
};

const ASTVisualization = ({ ast }) => {
  const [svgDimensions, setSvgDimensions] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    const calculateDimensions = (node, level = 0, leftOffset = 0) => {
      if (!node) return { width: 0, height: 0 };

      const leftDimensions = calculateDimensions(node.left, level + 1, leftOffset);
      const rightDimensions = calculateDimensions(node.right, level + 1, leftOffset + leftDimensions.width);

      const width = Math.max(220, leftDimensions.width + rightDimensions.width);
      const height = (level + 1) * 100 + 60;

      return { width, height };
    };

    const dimensions = calculateDimensions(ast);
    setSvgDimensions({
      width: Math.min(1300, dimensions.width),
      height: Math.max(600, dimensions.height),
    });
  }, [ast]);

  return (
    <CustomCard className="w-full overflow-x-auto">
      <CustomCardContent className=" flex flex-row p-6 justify-center overflow-auto flex-grow">
        <svg width={svgDimensions.width} height={svgDimensions.height}>
          <TreeNode node={ast} x={svgDimensions.width / 2} y={30} level={0} />
        </svg>
      </CustomCardContent>
    </CustomCard>
  );
};

export default function Tree() {
  const [astData, setAstData] = useState(null);

  useEffect(() => {
    const fetchAST = async () => {
      const response = await fetch("http://localhost:4000/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "67154f067edd14cee2d2712b",
        }),
      });
      const data = await response.json();
      console.log(data);
      setAstData(data.ast);
    };

    fetchAST();
  }, []);

  if (!astData) return <div>Loading AST...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Abstract Syntax Tree Visualization</h1>
      <ASTVisualization ast={astData} />
    </div>
  );
}
