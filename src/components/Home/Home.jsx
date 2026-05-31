import React, { useEffect, useRef, useState } from 'react';
import "./Home.css";

const words = ['ML systems', 'document-AI', 'agentic tools', 'CV pipelines'];

const Home = () => {
  const [wi, setWi] = useState(0);
  const wRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      const el = wRef.current;
      if (!el) return;
      el.style.transform = 'translateY(-105%)';
      el.style.opacity = '0';
      setTimeout(() => {
        setWi((p) => (p + 1) % words.length);
        el.style.transition = 'none';
        el.style.transform = 'translateY(105%)';
        requestAnimationFrame(() => {
          el.style.transition = '';
          el.style.transform = 'none';
          el.style.opacity = '1';
        });
      }, 500);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="ed-hero">
      <div className="wrap">
        <div className="kicker">Data Scientist · ML Engineer · College Park, MD</div>

        <h1>
          <span className="line"><span>Arunbh</span></span>
          <span className="line"><span>Yashaswi<span className="em">.</span></span></span>
        </h1>

        <p className="tagline">
          I build <b>production</b>{' '}
          <span className="rot"><span className="w" ref={wRef}>{words[wi]}</span></span>{' '}
          <b>that ship where it counts.</b>
        </p>

        <div className="cta">
          <a className="btn solid mag" href="Resume_Arunbh.pdf" target="_blank" rel="noopener noreferrer">
            Résumé <span className="arr">→</span>
          </a>
          <a className="btn ghost mag" href="#projects">View Projects</a>
          <a className="btn ghost mag" href="#contact">Get in touch</a>
        </div>

        <div className="status">
          <span className="dot"></span>
          <span>Currently building <b>ThirdEye</b>, visual geolocation via MegaLoc and MASt3R</span>
        </div>
      </div>
    </section>
  );
};

export default Home;
