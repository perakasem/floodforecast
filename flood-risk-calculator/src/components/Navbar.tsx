// src/components/Navbar.tsx
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <div className="bg-gray-800 text-white p-4 mb-6 rounded-lg shadow-md flex justify-between">
            <h1 className="text-xl font-bold">FloodForecast</h1>
            <nav className="flex space-x-4">
                <Link
                    to="/"
                    className="hover:underline hover:text-blue-300"
                >
                    Home
                </Link>
                <Link
                    to="/flood-risk-calculator"
                    className="hover:underline hover:text-blue-300"
                >
                    Flood Risk Calculator
                </Link>
                <Link
                    to="/vegetation-simulation"
                    className="hover:underline hover:text-blue-300"
                >
                    Vegetation Impact Simulator
                </Link>
            </nav>
        </div>
    );
}
