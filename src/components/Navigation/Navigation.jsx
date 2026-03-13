import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import "./Navigation.css";

const sections = ['home', 'about', 'timeline', 'skills', 'projects', 'achievements', 'contact'];

const sectionLabels = {
    timeline: 'Journey',
};

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isBlog = location.pathname.startsWith('/blog');

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleSectionClick = (e, section) => {
    e.preventDefault();
    setExpanded(false);

    if (isHome) {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: section } });
    }
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar expand="lg" className="navbar-fixed" fixed="top" expanded={expanded} onToggle={setExpanded}>
      <Container fluid>
        <div className="d-flex align-items-center">
          <Navbar.Brand href="#/"><img src="/images/logo.webp" alt="Logo" className="navbar-logo" /></Navbar.Brand>
          <ThemeToggle />
        </div>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className='navigation-contents'>
          <Nav className="ms-auto" navbarScroll>
            {sections.map((section) => (
              <Nav.Link
                key={section}
                href={`#${section}`}
                onClick={(e) => handleSectionClick(e, section)}
                className={isHome && activeSection === section ? 'nav-active' : ''}
              >
                {sectionLabels[section] || section.charAt(0).toUpperCase() + section.slice(1)}
              </Nav.Link>
            ))}
            <Nav.Link
              href="#/blog"
              onClick={handleNavClick}
              className={isBlog ? 'nav-active' : ''}
            >
              Writing
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
