// src/components/LandingPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-screen bg-gray-50 text-gray-800"
        >
            {/* Hero Section */}
            <section className="bg-white min-h-[60vh] py-20 flex items-center justify-center shadow-sm"> {/* Adjusted to min-h-[60vh] and py-20 */}
                <div className="max-w-4xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
                    {/* Centered Tagline and CTA */}
                    <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                        Elevating <span className="text-indigo-600">Flood Risk Analysis</span> with Cutting-Edge Tools
                    </h1>
                    <p className="mt-6 text-lg text-gray-600">
                        Empowering cities, developers, and environmental planners with advanced insights and simulations.
                    </p>
                    <div className="mt-8">
                        <Link
                            to="/flood-risk-calculator"
                            className="px-8 py-4 rounded-full bg-indigo-600 text-white text-lg font-medium hover:bg-indigo-500 transition duration-300"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900">Explore Our Tools</h2>
                        <p className="mt-4 text-gray-600">
                            Discover powerful features that make flood risk assessment seamless and effective.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Flood Risk Calculator */}
                        <Link
                            to="/flood-risk-calculator"
                            className="block p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-300"
                        >
                            <h3 className="text-3xl font-semibold mb-2 text-gray-800">Flood Risk Calculator</h3>
                            <p className="text-gray-600">Analyze flood risks based on diverse environmental factors.</p>
                            <div className="mt-4 text-indigo-600 font-medium hover:underline">Learn More →</div>
                        </Link>
                        {/* Vegetation Impact Simulator */}
                        <Link
                            to="/vegetation-simulation"
                            className="block p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-300"
                        >
                            <h3 className="text-3xl font-semibold mb-2 text-gray-800">Vegetation Impact Simulator</h3>
                            <p className="text-gray-600">Simulate how vegetation influences flood risk in real time.</p>
                            <div className="mt-4 text-green-600 font-medium hover:underline">Learn More →</div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-gray-400">
                    <p>© 2024 FloodForecast. All rights reserved.</p>
                </div>
            </footer>
        </motion.div>
    );
}
