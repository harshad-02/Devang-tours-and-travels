import AboutUs from "./AboutUs";
import CarModel from "../../assets/ModelViewer/CarModel";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <AboutUs />
        <a href="#booking" className="hero-btn">Book Your Trip</a>
      </div>

      <div className="hero-right">
        <CarModel />
      </div>
    </section>
  );
}
