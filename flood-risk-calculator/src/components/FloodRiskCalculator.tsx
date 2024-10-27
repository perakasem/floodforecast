import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer
} from 'recharts';
import Navbar from './Navbar';

interface FormData {
    elevation: string;
    distanceFromWater: string;
    soilType: string;
    previousFlooding: string;
    annualRainfall: string;
    treeCoverage: string;
    shrubCoverage: string;
    grassCoverage: string;
}

export default function FloodRiskCalculator() {
    const [formData, setFormData] = useState<FormData>({
        elevation: '',
        distanceFromWater: '',
        soilType: 'sandy',
        previousFlooding: 'no',
        annualRainfall: '',
        treeCoverage: '0',
        shrubCoverage: '0',
        grassCoverage: '0'
    });

    const [showVegetation, setShowVegetation] = useState(false);
    const [riskDetails, setRiskDetails] = useState<any>(null);
    const [factors, setFactors] = useState({
        elevation: 0,
        distance: 0,
        soil: 0,
        history: 0,
        rainfall: 0,
        vegetation: 0
    });

    const SCALE_FACTOR = 0.9;
    const MIN_REMAINING_RISK = 30;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateRisk = () => {
        let updatedFactors = {
            elevation: 0,
            distance: 0,
            soil: 0,
            history: 0,
            rainfall: 0,
            vegetation: 0
        };

        // Elevation factor (25% weight)
        const elevation = parseFloat(formData.elevation);
        if (elevation < 10) updatedFactors.elevation = 3;
        else if (elevation < 30) updatedFactors.elevation = 2;
        else if (elevation < 50) updatedFactors.elevation = 1;

        // Distance from water (20% weight)
        const distance = parseFloat(formData.distanceFromWater);
        if (distance < 100) updatedFactors.distance = 3;
        else if (distance < 500) updatedFactors.distance = 2;
        else if (distance < 1000) updatedFactors.distance = 1;

        // Soil type (15% weight)
        if (formData.soilType === 'clay') updatedFactors.soil = 3;
        else if (formData.soilType === 'loam') updatedFactors.soil = 2;
        else updatedFactors.soil = 1;

        // Flooding history (20% weight)
        updatedFactors.history = formData.previousFlooding === 'yes' ? 3 : 0;

        // Rainfall (15% weight)
        const rainfall = parseFloat(formData.annualRainfall);
        if (rainfall > 2000) updatedFactors.rainfall = 3;
        else if (rainfall > 1000) updatedFactors.rainfall = 2;
        else updatedFactors.rainfall = 1;

        // Vegetation calculation with diminishing returns
        if (showVegetation) {
            const treeCover = parseFloat(formData.treeCoverage) || 0;
            const shrubCover = parseFloat(formData.shrubCoverage) || 0;
            const grassCover = parseFloat(formData.grassCoverage) || 0;

            const treeImpact = (1 - Math.pow(1 - (treeCover / 100), SCALE_FACTOR)) * 50;
            const shrubImpact = (1 - Math.pow(1 - (shrubCover / 100), SCALE_FACTOR)) * 30;
            const grassImpact = (1 - Math.pow(1 - (grassCover / 100), SCALE_FACTOR)) * 20;

            const totalImpact = treeImpact + shrubImpact + grassImpact;
            updatedFactors.vegetation = Math.max(MIN_REMAINING_RISK, 100 - totalImpact);
        }

        // Update the factors in state
        setFactors(updatedFactors);

        // Calculate final risk with weighted factors
        const weights = {
            elevation: 0.25,
            distance: 0.20,
            soil: 0.15,
            history: 0.20,
            rainfall: 0.15,
            vegetation: 0.05
        };

        const totalRisk = (
            updatedFactors.elevation * weights.elevation +
            updatedFactors.distance * weights.distance +
            updatedFactors.soil * weights.soil +
            updatedFactors.history * weights.history +
            updatedFactors.rainfall * weights.rainfall +
            (showVegetation ? updatedFactors.vegetation * weights.vegetation : 0)
        ) * 100 / 3; // Normalize to percentage

        let riskLevel;
        if (totalRisk >= 65) riskLevel = 'High';
        else if (totalRisk >= 35) riskLevel = 'Medium';
        else riskLevel = 'Low';

        setRiskDetails({
            level: riskLevel,
            score: totalRisk,
            factors: updatedFactors
        });

        toast.success('Risk calculation complete!');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Navbar /> {/* Full-width Navbar */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                    Flood Risk Calculator
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                            Enter Location Details
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ground Elevation (meters)
                                </label>
                                <input
                                    type="number"
                                    name="elevation"
                                    className="w-full p-2 border rounded"
                                    value={formData.elevation}
                                    onChange={handleInputChange}
                                    placeholder="Enter elevation"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Distance from Water Body (meters)
                                </label>
                                <input
                                    type="number"
                                    name="distanceFromWater"
                                    className="w-full p-2 border rounded"
                                    value={formData.distanceFromWater}
                                    onChange={handleInputChange}
                                    placeholder="Enter distance"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Soil Type
                                </label>
                                <select
                                    name="soilType"
                                    className="w-full p-2 border rounded"
                                    value={formData.soilType}
                                    onChange={handleInputChange}
                                >
                                    <option value="sandy">Sandy (Good drainage)</option>
                                    <option value="loam">Loam (Medium drainage)</option>
                                    <option value="clay">Clay (Poor drainage)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Previous Flooding?
                                </label>
                                <select
                                    name="previousFlooding"
                                    className="w-full p-2 border rounded"
                                    value={formData.previousFlooding}
                                    onChange={handleInputChange}
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Annual Rainfall (mm)
                                </label>
                                <input
                                    type="number"
                                    name="annualRainfall"
                                    className="w-full p-2 border rounded"
                                    value={formData.annualRainfall}
                                    onChange={handleInputChange}
                                    placeholder="Enter annual rainfall"
                                />
                            </div>

                            <div className="border-t pt-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={showVegetation}
                                        onChange={(e) => setShowVegetation(e.target.checked)}
                                        className="form-checkbox"
                                    />
                                    <span>Include Vegetation Analysis</span>
                                </label>
                            </div>

                            {showVegetation && (
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tree Coverage (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="treeCoverage"
                                            className="w-full p-2 border rounded"
                                            value={formData.treeCoverage}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Shrub Coverage (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="shrubCoverage"
                                            className="w-full p-2 border rounded"
                                            value={formData.shrubCoverage}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Grass Coverage (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="grassCoverage"
                                            className="w-full p-2 border rounded"
                                            value={formData.grassCoverage}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={calculateRisk}
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                            >
                                Calculate Risk
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                            Risk Assessment Results
                        </h3>

                        {riskDetails ? (
                            <>
                                <div
                                    className={`mb-6 p-4 rounded text-center font-bold ${
                                        riskDetails.level === 'High' ? 'bg-red-100 text-red-700' :
                                            riskDetails.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                    }`}
                                >
                                    <div className="text-lg">Risk Level: {riskDetails.level}</div>
                                    <div className="text-sm">Score: {riskDetails.score.toFixed(1)}%</div>
                                </div>

                                <div className="h-64 mb-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={[
                                            { subject: 'Elevation', value: factors.elevation },
                                            { subject: 'Distance', value: factors.distance },
                                            { subject: 'Soil', value: factors.soil },
                                            { subject: 'History', value: factors.history },
                                            { subject: 'Rainfall', value: factors.rainfall },
                                            { subject: 'Vegetation', value: factors.vegetation }
                                        ]}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <PolarRadiusAxis domain={[0, 3]} />
                                            <Radar
                                                dataKey="value"
                                                stroke="#8884d8"
                                                fill="#8884d8"
                                                fillOpacity={0.6}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Interpretation Section */}
                                <div className="bg-gray-50 p-6 rounded-md">
                                    <h3 className="font-semibold text-lg mb-2">How to Interpret Your Results</h3>
                                    <p className="text-sm text-gray-700">
                                        Your calculated risk score reflects the potential vulnerability of your location to flood risks:
                                    </p>
                                    <ul className="list-disc ml-5 text-sm mt-2">
                                        <li><b>Low Risk (0-34%)</b>: Indicates a minimal likelihood of significant flooding. Still, be vigilant during heavy rains. Consider exploring the <a href="https://www.ready.gov/floods" className="text-blue-600 underline" target="_blank">Federal Emergency Management Agency (FEMA) guidelines</a> for flood preparedness.</li>
                                        <li><b>Medium Risk (35-64%)</b>: Suggests a moderate chance of flooding. Implement protective measures like water barriers, proper drainage, and home floodproofing. Review <a href="https://www.floodsmart.gov/" className="text-blue-600 underline" target="_blank">FloodSmart.gov resources</a> for flood insurance information and safety tips.</li>
                                        <li><b>High Risk (65% and above)</b>: A strong possibility of flooding exists. Engage in active risk mitigation, including creating a flood action plan, elevating utilities, and considering evacuation routes. Visit the <a href="https://www.nhc.noaa.gov/" className="text-blue-600 underline" target="_blank">National Hurricane Center</a> for up-to-date weather information.</li>
                                    </ul>
                                    <p className="text-sm text-red-600 mt-4">
                                        <strong>Disclaimer:</strong> This simulation is an approximation and cannot determine the actual percentage reduction of flood risk. The term "100% reduction" refers to 100% out of the maximum possible reduction achievable through vegetation, not a complete elimination of all flood damage risks.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500">
                                Enter data and calculate risk to see results
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
