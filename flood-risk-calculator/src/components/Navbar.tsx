import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-white/90 backdrop-blur-md text-gray-800 py-4 px-6 shadow-md rounded-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">
                    <a href={"/"}>FloodForecast</a>
                </h1>

                {/* Hamburger menu for mobile */}
                <button
                    className="md:hidden text-gray-800 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        )}
                    </svg>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <Link
                        to="/flood-risk-calculator"
                        className="text-gray-700 hover:text-indigo-500 font-medium transition duration-300"
                    >
                        Flood Risk Calculator
                    </Link>
                    <Link
                        to="/vegetation-simulation"
                        className="text-gray-700 hover:text-indigo-500 font-medium transition duration-300"
                    >
                        Vegetation Impact Simulator
                    </Link>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 space-y-2">
                    <Link
                        to="/flood-risk-calculator"
                        className="block text-gray-700 hover:text-indigo-500 font-medium transition duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Flood Risk Calculator
                    </Link>
                    <Link
                        to="/vegetation-simulation"
                        className="block text-gray-700 hover:text-indigo-500 font-medium transition duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Vegetation Impact Simulator
                    </Link>
                </div>
            )}
        </div>
    );
}
