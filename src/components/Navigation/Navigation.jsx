import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import "./Navigation.css";

const Navigation = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <div className="d-flex align-items-center">
          <Navbar.Brand href="#home"><img src="images/logo.webp" alt="Logo" className="navbar-logo" /></Navbar.Brand>
          <ThemeToggle />
        </div>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className='navigation-contents'>
          <Nav
            className="ms-auto"
            navbarScroll
          >
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#professional">Career</Nav.Link>
            <Nav.Link href="#skills">Skills</Nav.Link>
            <Nav.Link href="#projects">Projects</Nav.Link>
            <Nav.Link href="#education">Education</Nav.Link>
            <Nav.Link href="#achievements">Achievements</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;



