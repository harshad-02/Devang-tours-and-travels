import AboutUs from "./AboutUs";
import CarModel from "../../assets/ModelViewer/CarModel";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      {/* Left Side */}
      <div className="hero-left">
        <AboutUs />
        <button className="hero-btn">Book Your Trip</button>
      </div>

      {/* Right Side */}
      <div className="hero-right">
        <CarModel />
      </div>
    
    </section>
  );
}
