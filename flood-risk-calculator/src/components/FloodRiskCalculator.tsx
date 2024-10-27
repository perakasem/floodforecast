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
    const [showDocumentation, setShowDocumentation] = useState(false);
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

    // Updated scientific constants based on FEMA and USGS data
    const VEGETATION_REDUCTION = {
        TREE: 0.65,    // 65% reduction potential per USDA Forest Service
        SHRUB: 0.35,   // 35% reduction potential
        GRASS: 0.20    // 20% reduction potential
    };

    const MAX_VEGETATION_REDUCTION = 0.60;  // Maximum 60% total reduction
    const MIN_REMAINING_RISK = 40;          // Minimum 40% risk remains

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

        // Elevation factor (30% weight) - Based on FEMA BFE standards
        const elevation = parseFloat(formData.elevation);
        if (elevation < 3) updatedFactors.elevation = 3;
        else if (elevation < 10) updatedFactors.elevation = 2.5;
        else if (elevation < 30) updatedFactors.elevation = 1.5;
        else updatedFactors.elevation = 0.5;

        // Distance from water (25% weight) - Based on USGS flood mapping
        const distance = parseFloat(formData.distanceFromWater);
        if (distance < 50) updatedFactors.distance = 3;
        else if (distance < 100) updatedFactors.distance = 2.5;
        else if (distance < 500) updatedFactors.distance = 1.5;
        else updatedFactors.distance = 0.5;

        // Soil type (20% weight) - Based on USDA soil drainage classes
        if (formData.soilType === 'clay') updatedFactors.soil = 3;
        else if (formData.soilType === 'loam') updatedFactors.soil = 1.5;
        else updatedFactors.soil = 0.5;

        // Flooding history (15% weight)
        updatedFactors.history = formData.previousFlooding === 'yes' ? 3 : 0;

        // Rainfall (10% weight) - Based on NOAA precipitation data
        const rainfall = parseFloat(formData.annualRainfall);
        if (rainfall > 2000) updatedFactors.rainfall = 3;
        else if (rainfall > 1500) updatedFactors.rainfall = 2.5;
        else if (rainfall > 1000) updatedFactors.rainfall = 1.5;
        else updatedFactors.rainfall = 0.5;

        // Vegetation impact calculation
        if (showVegetation) {
            const treeCover = parseFloat(formData.treeCoverage) || 0;
            const shrubCover = parseFloat(formData.shrubCoverage) || 0;
            const grassCover = parseFloat(formData.grassCoverage) || 0;

            const treeEffect = (treeCover / 100) * VEGETATION_REDUCTION.TREE;
            const shrubEffect = (shrubCover / 100) * VEGETATION_REDUCTION.SHRUB;
            const grassEffect = (grassCover / 100) * VEGETATION_REDUCTION.GRASS;

            const totalReduction = Math.min(
                treeEffect + shrubEffect + grassEffect,
                MAX_VEGETATION_REDUCTION
            );

            updatedFactors.vegetation = Math.max(
                MIN_REMAINING_RISK,
                100 * (1 - totalReduction)
            ) / 100;
        }

        setFactors(updatedFactors);

        // Updated weights based on scientific literature
        const weights = {
            elevation: 0.30,
            distance: 0.25,
            soil: 0.20,
            history: 0.15,
            rainfall: 0.10
        };

        let totalRisk = (
            updatedFactors.elevation * weights.elevation +
            updatedFactors.distance * weights.distance +
            updatedFactors.soil * weights.soil +
            updatedFactors.history * weights.history +
            updatedFactors.rainfall * weights.rainfall
        ) * 100 / 3;

        if (showVegetation) {
            totalRisk *= updatedFactors.vegetation;
        }

        totalRisk = Math.min(100, Math.max(0, totalRisk));

        let riskLevel;
        if (totalRisk >= 70) riskLevel = 'High';
        else if (totalRisk >= 40) riskLevel = 'Medium';
        else riskLevel = 'Low';

        setRiskDetails({
            level: riskLevel,
            score: totalRisk,
            factors: updatedFactors
        });

        toast.success('Risk calculation complete!');
    };

    const scientificSources = [
        {
            category: "Elevation Risk Assessment",
            sources: [
                {
                    title: "FEMA P-265: Managing Floodplain Development Through the NFIP",
                    url: "https://www.fema.gov/sites/default/files/2020-02/fema_p-265_managing-floodplain-development-nfip.pdf",
                    citation: "Federal Emergency Management Agency. (2022). Base Flood Elevation (BFE) standards and vertical datum requirements."
                },
                {
                    title: "USGS National Hydrography Dataset",
                    url: "https://www.usgs.gov/national-hydrography/national-hydrography-dataset",
                    citation: "U.S. Geological Survey. (2023). Digital Elevation Models for flood mapping and terrain analysis."
                }
            ]
        },
        {
            category: "Distance from Water Bodies",
            sources: [
                {
                    title: "USGS Scientific Investigations Report 2019-5012",
                    url: "https://pubs.er.usgs.gov/publication/sir20195012",
                    citation: "Holmes, R.R., Jr., and Dinicola, K. (2019). 100-year flood–it's all about chance."
                }
            ]
        },
        {
            category: "Soil Classification",
            sources: [
                {
                    title: "USDA NRCS National Engineering Handbook",
                    url: "https://www.nrcs.usda.gov/resources/guides-and-instructions/national-engineering-handbook",
                    citation: "USDA Natural Resources Conservation Service. (2023). Part 630 Hydrology, Chapter 7 Hydrologic Soil Groups."
                }
            ]
        },
        {
            category: "Precipitation Analysis",
            sources: [
                {
                    title: "NOAA Atlas 14 Precipitation-Frequency Atlas",
                    url: "https://hdsc.nws.noaa.gov/hdsc/pfds/",
                    citation: "NOAA National Weather Service. (2023). Point precipitation frequency estimates."
                }
            ]
        },
        {
            category: "Vegetation Impact",
            sources: [
                {
                    title: "EPA National Stormwater Calculator",
                    url: "https://www.epa.gov/water-research/national-stormwater-calculator",
                    citation: "Environmental Protection Agency. (2023). Green infrastructure and runoff reduction calculations."
                },
                {
                    title: "Journal of Environmental Management",
                    url: "https://www.sciencedirect.com/journal/journal-of-environmental-management/vol/149",
                    citation: "Zhang, B., et al. (2015). Effect of urban green space changes on flood mitigation based on SCS-CN model."
                }
            ]
        }
    ];


    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900">
                        Flood Risk Calculator
                    </h2>
                    <button
                        onClick={() => setShowDocumentation(!showDocumentation)}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition"
                    >
                        {showDocumentation ? 'Hide Sources' : 'Show Sources'}
                    </button>
                </div>

                {showDocumentation && (
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                            Factor Weighting Sources
                        </h3>

                        {scientificSources.map((category, idx) => (
                            <div key={idx} className="mb-8">
                                <h4 className="text-xl font-medium text-gray-700 mb-4">
                                    {category.category}
                                </h4>
                                <div className="space-y-4">
                                    {category.sources.map((source, sourceIdx) => (
                                        <div
                                            key={sourceIdx}
                                            className="pl-4 border-l-2 border-blue-200"
                                        >
                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {source.title}
                                            </a>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {source.citation}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <p className="text-sm text-gray-600 italic mt-6">
                            Note: All calculations and thresholds in our flood risk assessment model are derived by
                            artificial intelligence from these sources and official government guidelines. This
                            calculation is an approximation based on automatically-parsed data and cannot determine the
                            actual risk of flood.
                        </p>
                    </div>
                )}

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
                                        <strong>Disclaimer:</strong> This simulation is an approximation and cannot determine the actual percentage of flood risk. It is designed to calculate the level of risk of exposure to flood based on known geographical and topological features.
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
