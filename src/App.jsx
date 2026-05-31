import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navigation from "./components/Navigation/Navigation";
import MotionFX from "./components/MotionFX/MotionFX";
import Home from "./components/Home/Home";
import Marquee from "./components/Marquee/Marquee";
import About from "./components/About/About";
import Timeline from "./components/Timeline/Timeline";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Achievements from "./components/Achievements/Achievements";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

import "./App.css";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  return (
    <>
      <a href="#about" className="skip-to-content">Skip to content</a>
      <MotionFX />
      <span className="coord tl">Lat 38.99°N · Lon 76.94°W</span>
      <span className="coord br">© {new Date().getFullYear()} · College Park, MD</span>
      <Navigation />
      <main>
        <Home />
        <Marquee />
        <About />
        <Timeline />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
