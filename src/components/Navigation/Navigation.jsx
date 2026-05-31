import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import "./Navigation.css";

const sections = [
  { id: 'about', label: 'About' },
  { id: 'timeline', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Recognition' },
  { id: 'contact', label: 'Contact' },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isBlog = location.pathname.startsWith('/blog');

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleSectionClick = (e, id) => {
    e.preventDefault();
    setOpen(false);
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  const goHome = (e) => {
    e.preventDefault();
    setOpen(false);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: 'home' } });
    }
  };

  return (
    <nav className="ed-nav">
      <div className="wrap">
        <a href="#/" className="brand" onClick={goHome} aria-label="Home">
          <span className="monogram">AY</span>
          <b>ARUNBH&nbsp;YASHASWI</b>
        </a>

        <div className="nav-right">
          <div className={`navlinks ${open ? 'open' : ''}`}>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => handleSectionClick(e, s.id)}
                className={isHome && activeSection === s.id ? 'nav-active' : ''}
              >
                {s.label}
              </a>
            ))}
            <a
              href="#/blog"
              onClick={() => setOpen(false)}
              className={isBlog ? 'nav-active' : ''}
            >
              Writing
            </a>
          </div>
          <ThemeToggle />
          <button
            className="nav-burger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
