import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FloodRiskCalculator from './components/FloodRiskCalculator';
import VegetationSimulation from './components/VegetationSimulation';
import LandingPage from './components/LandingPage'; // Import the LandingPage

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/flood-risk-calculator" element={<FloodRiskCalculator />} />
                    <Route path="/vegetation-simulation" element={<VegetationSimulation />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
