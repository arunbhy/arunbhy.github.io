import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import "./Navigation.css";

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);

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
            <Nav.Link href="#home" onClick={handleNavClick}>Home</Nav.Link>
            <Nav.Link href="#about" onClick={handleNavClick}>About</Nav.Link>
            <Nav.Link href="#professional" onClick={handleNavClick}>Career</Nav.Link>
            <Nav.Link href="#skills" onClick={handleNavClick}>Skills</Nav.Link>
            <Nav.Link href="#projects" onClick={handleNavClick}>Projects</Nav.Link>
            <Nav.Link href="#education" onClick={handleNavClick}>Education</Nav.Link>
            <Nav.Link href="#achievements" onClick={handleNavClick}>Achievements</Nav.Link>
            <Nav.Link href="#contact" onClick={handleNavClick}>Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
