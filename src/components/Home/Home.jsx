import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import ButtonLight from '../ButtonLight/ButtonLight';
import "./Home.css";

const Home = () => {
  return (
    <div id="home" className='home'>
      <h1 className="slideIn">Hello Everyone! My name is <span>Arunbh Yashaswi.</span></h1>
      <div className='type-animation slideIn'>
        <TypeAnimation
          sequence={[
            'I am a Data Enthusiast.',
            1000,
            
            'I am a Data Scientist.',
            1000,
            'I am a Agentic AI Developer.',
            1000,
            'I am a Nerd.',
            1000,
            'I am a Student.',
            1000
          ]}
          wrapper="div"
          speed={10}
          style={{ fontSize: '4rem', display: 'inline-block' }}
          repeat={Infinity}
        />
      </div>
      <div className='know-more slideInDelayed'>
        <a href="#about"><ButtonLight text="Know More" /></a>
      </div>
    </div>
  );
};

export default Home;
