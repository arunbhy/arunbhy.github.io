import React from "react";

import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import BackgroundEffects from "./components/BackgroundEffects/BackgroundEffects";
import Achievements from "./components/Achievements/Achievements";
import Timeline from "./components/Timeline/Timeline";
import SectionDivider from "./components/SectionDivider/SectionDivider";

import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";

const App = () => {
  return (
    <div>
      <BackgroundEffects />
      <Navigation />
      <Home />
      <About />
      <SectionDivider type="scatter" />
      <Timeline />
      <SectionDivider type="loss" />
      <Skills />
      <SectionDivider type="grid" />
      <Projects />
      <SectionDivider type="scatter" />
      <Achievements />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
