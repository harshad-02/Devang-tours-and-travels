import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import LightRays from "./assets/background/LightRays.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Driver from "./components/Driver/Driver.jsx";
import Gallery from "./components/Gallary/Gallery.jsx";
import Reviews from "./components/Reviews/Reviews.jsx";
import Booking from "./components/Booking/Booking.jsx";
import PlannedTrips from "./components/PlannedTrips/PlannedTrips.jsx";
import TripRequestPopup from "./components/TripRequestPopup/TripRequestPopup.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import "./index.css";

function HomePage() {
  return (
    <>
      <main className="content">
        <Hero />
        <Driver />
        <Gallery />
        <Reviews />
        <Booking />
        <PlannedTrips />
      </main>

      <TripRequestPopup />
    </>
  );
}

function App() {
  return (
    <div className="app">
      <div className="background">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
