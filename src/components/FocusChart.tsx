"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { BusinessCategory, CATEGORY_COLORS, GOAL_PRESETS } from "@/lib/business-types";

interface FocusChartProps {
  focusWeights: Record<BusinessCategory, number>;
  onWeightChange: (category: BusinessCategory, weight: number) => void;
  selectedPreset?: string;
  onPresetChange?: (presetId: string) => void;
}

export function FocusChart({ focusWeights, onWeightChange, selectedPreset, onPresetChange }: FocusChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(focusWeights).map(([category, weight]) => ({
      category,
      weight,
      color: CATEGORY_COLORS[category as BusinessCategory],
      icon: getCategoryIcon(category as BusinessCategory),
    }));
  }, [focusWeights]);

  const handleWeightChange = (category: BusinessCategory, newWeight: number) => {
    const totalWeight = Object.values(focusWeights).reduce((sum, w) => sum + w, 0);
    const otherCategories = Object.keys(focusWeights).filter(c => c !== category) as BusinessCategory[];
    const otherTotal = totalWeight - focusWeights[category];
    
    if (otherTotal === 0) {
      // If all other categories are 0, distribute remaining weight equally
      const equalWeight = (100 - newWeight) / otherCategories.length;
      otherCategories.forEach(cat => {
        onWeightChange(cat, Math.round(equalWeight));
      });
    } else {
      // Normalize other categories proportionally
      const normalizationFactor = (100 - newWeight) / otherTotal;
      otherCategories.forEach(cat => {
        onWeightChange(cat, Math.round(focusWeights[cat] * normalizationFactor));
      });
    }
    
    onWeightChange(category, newWeight);
  };

  function getCategoryIcon(category: BusinessCategory): string {
    const icons = {
      People: "👥",
      Product: "🚀",
      GTM: "📈",
      Tech: "⚙️",
      Strategy: "🎯",
      Operations: "⚡",
      Finance: "💰",
      Hiring: "🎯",
      Management: "👔",
    };
    return icons[category];
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${label} ${getCategoryIcon(label as BusinessCategory)}`}</p>
          <p className="text-sm text-gray-600">{`Focus: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Goal Presets */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Goal Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {GOAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetChange?.(preset.id)}
              className={`p-3 rounded-lg border text-sm transition-all hover:shadow-md ${
                selectedPreset === preset.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white hover:bg-gray-50"
              }`}
              title={preset.description}
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs opacity-75 mt-1">{preset.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Focus Distribution Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Focus Distribution</h3>
        <div className="bg-white p-4 rounded-lg border">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="category" 
                tickFormatter={(value) => `${getCategoryIcon(value as BusinessCategory)} ${value}`}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="weight" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Focus Weight Controls */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Adjust Focus Weights</h3>
        <div className="space-y-3">
          {Object.entries(focusWeights).map(([category, weight]) => (
            <div key={category} className="flex items-center space-x-3">
              <div className="w-24 text-sm font-medium flex items-center">
                <span className="mr-2">{getCategoryIcon(category as BusinessCategory)}</span>
                {category}
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weight}
                onChange={(e) => handleWeightChange(category as BusinessCategory, Number(e.target.value))}
                className="flex-1"
              />
              <div className="w-12 text-sm text-right font-mono">{weight}%</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Focus weights determine where attention should be allocated. The chart shows the current distribution across all business areas.
        </p>
      </div>
    </div>
  );
}