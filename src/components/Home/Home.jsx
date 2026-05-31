import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import ButtonLight from '../ButtonLight/ButtonLight';
import DataFlow from '../DataFlow/DataFlow';
import "./Home.css";

const Home = () => {
  return (
    <section id="home" className='home'>
      <DataFlow />
      <h1 className="slideIn">Hello Everyone! My name is <span>Arunbh Yashaswi.</span></h1>
      <div className='type-animation slideIn'>
        <TypeAnimation
          sequence={[
            'I am a Data Enthusiast.',
            1000,
            'I am a Data Scientist.',
            1000,
            'I am an Agentic AI Developer.',
            1000,
            'I am a Developer.',
            1000,
            'I am a Problem Solver.',
            1000,
            'I am a Learner.',
            1000,
            'I am a Dreamer.',
            1000,
            
          ]}
          wrapper="div"
          speed={10}
          className="type-animation-text"
          repeat={Infinity}
        />
      </div>
      <div className='know-more slideInDelayed'>
        <a href="#about"><ButtonLight text="Know More" /></a>
      </div>
    </section>
  );
};

export default Home;
