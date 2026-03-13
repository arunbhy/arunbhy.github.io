import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import "./Navigation.css";

const sections = ['home', 'about', 'timeline', 'professional', 'skills', 'projects', 'education', 'achievements', 'contact'];

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar-fixed" fixed="top" expanded={expanded} onToggle={setExpanded}>
      <Container fluid>
        <div className="d-flex align-items-center">
          <Navbar.Brand href="#home"><img src="images/logo.webp" alt="Logo" className="navbar-logo" /></Navbar.Brand>
          <ThemeToggle />
        </div>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className='navigation-contents'>
          <Nav className="ms-auto" navbarScroll>
            {sections.map((section) => (
              <Nav.Link
                key={section}
                href={`#${section}`}
                onClick={handleNavClick}
                className={activeSection === section ? 'nav-active' : ''}
              >
                {section === 'professional' ? 'Career' : section === 'timeline' ? 'Journey' : section.charAt(0).toUpperCase() + section.slice(1)}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
