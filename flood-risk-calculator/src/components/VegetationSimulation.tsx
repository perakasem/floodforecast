// src/components/VegetationSimulation.tsx
import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import Navbar from './Navbar';

// Updated academic references:
// - "What Is the Contribution of Urban Trees to Mitigate Pluvial Flooding?" (MDPI, 2022) - 50% Weighting for Trees
// - "The Role of Woodland in Flood Control" (Forestry Research, UK) - 30% Weighting for Shrubs
// - "Selection, Planning, and Modelling of Nature-Based Solutions for Flood Mitigation" (MDPI, 2024) - 20% Weighting for Grass

interface VegetationData {
    treeCoverage: number;
    shrubCoverage: number;
    grassCoverage: number;
}

export default function VegetationSimulation() {
    const [vegetationData, setVegetationData] = useState<VegetationData>({
        treeCoverage: 0,
        shrubCoverage: 0,
        grassCoverage: 0
    });

    const [impactDetails, setImpactDetails] = useState<any>(null);

    const handleSliderChange = (name: keyof VegetationData, value: number) => {
        setVegetationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateImpact = () => {
        const { treeCoverage, shrubCoverage, grassCoverage } = vegetationData;

        // Calculate cumulative flood mitigation score
        const treeImpact = (treeCoverage * 0.50);  // Trees contribute 50% weighting
        const shrubImpact = (shrubCoverage * 0.30); // Shrubs contribute 30% weighting
        const grassImpact = (grassCoverage * 0.20); // Grass contributes 20% weighting

        // Total flood mitigation percentage based on combined factors
        const totalImpact = Math.min(100, treeImpact + shrubImpact + grassImpact);

        const remainingRisk = 100 - totalImpact;
        const chartData = [
            {
                name: 'Impact',
                Trees: treeImpact,
                Shrubs: shrubImpact,
                Grass: grassImpact,
                RemainingRisk: remainingRisk
            }
        ];

        setImpactDetails({
            totalImpact,
            chartData
        });
    };

    // Calculate impact initially and when slider values change
    useEffect(() => {
        calculateImpact();
    }, [vegetationData]); // Depend on vegetationData to trigger recalculation

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Navbar /> {/* Add Navbar at the top */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Simulation Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Vegetation Impact Simulation</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Tree Coverage (%)
                            </label>
                            <input
                                type="range"
                                name="treeCoverage"
                                className="w-full"
                                min="0"
                                max="100"
                                step="1"
                                value={vegetationData.treeCoverage}
                                onChange={(e) => handleSliderChange('treeCoverage', Number(e.target.value))}
                            />
                            <div className="text-sm text-gray-500">Coverage: {vegetationData.treeCoverage}%</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Shrub Coverage (%)
                            </label>
                            <input
                                type="range"
                                name="shrubCoverage"
                                className="w-full"
                                min="0"
                                max="100"
                                step="1"
                                value={vegetationData.shrubCoverage}
                                onChange={(e) => handleSliderChange('shrubCoverage', Number(e.target.value))}
                            />
                            <div className="text-sm text-gray-500">Coverage: {vegetationData.shrubCoverage}%</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Grass Coverage (%)
                            </label>
                            <input
                                type="range"
                                name="grassCoverage"
                                className="w-full"
                                min="0"
                                max="100"
                                step="1"
                                value={vegetationData.grassCoverage}
                                onChange={(e) => handleSliderChange('grassCoverage', Number(e.target.value))}
                            />
                            <div className="text-sm text-gray-500">Coverage: {vegetationData.grassCoverage}%</div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6">Simulation Results</h2>

                    {impactDetails ? (
                        <>
                            <div
                                className={`mb-6 p-4 rounded text-center font-bold ${
                                    impactDetails.totalImpact >= 75 ? 'bg-green-100 text-green-700' :
                                        impactDetails.totalImpact >= 45 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                }`}
                            >
                                <div className="text-lg">Flood Impact Reduction: {impactDetails.totalImpact.toFixed(1)}%</div>
                            </div>

                            <div className="h-32 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={impactDetails.chartData}
                                        barCategoryGap={10}
                                    >
                                        <XAxis type="number" domain={[0, 100]} ticks={[0, 50, 100]} />
                                        <YAxis type="category" dataKey="name" hide />
                                        <Tooltip />
                                        <Bar dataKey="RemainingRisk" stackId="a" fill="#e57373" />
                                        <Bar dataKey="Grass" stackId="a" fill="#9ccc65" />
                                        <Bar dataKey="Shrubs" stackId="a" fill="#66bb6a" />
                                        <Bar dataKey="Trees" stackId="a" fill="#2e7d32" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Interpretation Section */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-700 mt-2">
                                    Use the sliders to explore how varying vegetation levels can mitigate flood risks.
                                </p>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="font-semibold text-lg mb-2">How to Interpret Your Results</h3>
                                    <p className="text-sm text-gray-700">
                                        This simulation uses different weights to evaluate how vegetation
                                        influences flood risk:
                                    </p>
                                    <ul className="list-disc ml-5 text-sm mt-2">
                                        <li>
                                            <b>Tree Coverage (50% Impact)</b>: Trees are highly effective due to their
                                            deep roots and water absorption capabilities.
                                        </li>
                                        <li>
                                            <b>Shrub Coverage (30% Impact)</b>: Shrubs provide moderate water retention
                                            and soil stability.
                                        </li>
                                        <li>
                                            <b>Grass Coverage (20% Impact)</b>: Grass reduces surface runoff, though it
                                            has less impact than trees or shrubs.
                                        </li>
                                    </ul>
                                    <p className="text-sm text-gray-700 mt-2">
                                        Use the sliders to explore how varying vegetation levels can mitigate flood
                                        risks based on reliable academic research.
                                    </p>
                                    <p className="text-sm text-red-600 mt-4">
                                        <strong>Disclaimer:</strong> This simulation is an approximation and cannot
                                        determine the actual percentage reduction of flood risk. The term "100%
                                        reduction" refers to 100% out of the maximum possible reduction achievable
                                        through vegetation, not a complete elimination of all flood damage risks.
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500">
                            Adjust the sliders to see updated impact results
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
