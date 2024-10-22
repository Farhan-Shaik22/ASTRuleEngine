'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

// Constants
const THEME = {
  OPERATOR_NODE: {
    fill: '#93c5fd',
    stroke: '#3b82f6',
    textColor: '#1e3a8a',
  },
  REGULAR_NODE: {
    fill: '#bfdbfe',
    stroke: '#3b82f6',
    textColor: '#1e3a8a',
  },
  LINE: {
    stroke: '#3b82f6',
    width: 2,
  },
};

const NODE_DIMENSIONS = {
  width: 70,
  height: 60,
  verticalGap: 100,
  borderRadius: 8,
  fontSize: 11,
};

const LEVEL_WIDTHS = [650, 470, 350, 275, 200, 150];
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

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

// Helper function to get node content
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

// TreeNode Component
const TreeNode = React.memo(({ node, x, y, level }) => {
  const { width, height, verticalGap, borderRadius, fontSize } = NODE_DIMENSIONS;
  const horizontalGap = (LEVEL_WIDTHS[level] || 120) / Math.pow(1.5, level);
  const nodeContent = getNodeContent(node.value);
  const { fill, stroke, textColor } = node.type === 'operator' 
    ? THEME.OPERATOR_NODE 
    : THEME.REGULAR_NODE;

  return (
    <g>
      <rect
        x={x - width / 2}
        y={y}
        width={width}
        height={height}
        rx={borderRadius}
        ry={borderRadius}
        fill={fill}
        stroke={stroke}
        strokeWidth={THEME.LINE.width}
      />
      <text
        x={x}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={fontSize}
        fontWeight="bold"
      >
        {nodeContent}
      </text>
      {node.left && (
        <>
          <line
            x1={x}
            y1={y + height}
            x2={x - horizontalGap / 2}
            y2={y + verticalGap}
            stroke={THEME.LINE.stroke}
            strokeWidth={THEME.LINE.width}
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
            y1={y + height}
            x2={x + horizontalGap / 2}
            y2={y + verticalGap}
            stroke={THEME.LINE.stroke}
            strokeWidth={THEME.LINE.width}
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
});

TreeNode.displayName = 'TreeNode';

// Main ASTVisualization Component
const ASTVisualization = ({ ast }) => {
  const [svgDimensions, setSvgDimensions] = useState({ width: 1000, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const calculateDimensions = useMemo(() => {
    const calculate = (node, level = 0, leftOffset = 0) => {
      if (!node) return { width: 0, height: 0 };

      const leftDimensions = calculate(node.left, level + 1, leftOffset);
      const rightDimensions = calculate(
        node.right,
        level + 1,
        leftOffset + leftDimensions.width
      );

      const width = Math.max(220, leftDimensions.width + rightDimensions.width);
      const height = (level + 1) * 100 + 60;

      return { width, height };
    };

    const dimensions = calculate(ast);
    return {
      width: 1450,
      height: Math.max(600, dimensions.height),
    };
  }, [ast]);

  useEffect(() => {
    setSvgDimensions(calculateDimensions);
  }, [calculateDimensions]);

  const handleZoom = (delta) => {
    setZoom((prevZoom) => {
      const newZoom = prevZoom + delta;
      return Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <CustomCard className="w-full">
      <CustomCardContent className="flex flex-col">
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => handleZoom(ZOOM_STEP)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-black"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => handleZoom(-ZOOM_STEP)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-black"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-black"
            title="Reset View"
          >
            <RefreshCw size={20} />
          </button>
        </div>
        <div 
          className="overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg 
            width={svgDimensions.width} 
            height={svgDimensions.height}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              <TreeNode
                node={ast}
                x={svgDimensions.width / 2}
                y={30}
                level={0}
              />
            </g>
          </svg>
        </div>
      </CustomCardContent>
    </CustomCard>
  );
};

// Main Tree Component
export default function Tree({ astData }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Abstract Syntax Tree Visualization
      </h1>
      <ASTVisualization ast={astData} />
    </div>
  );
}