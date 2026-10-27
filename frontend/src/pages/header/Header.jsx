import React, { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signOut, selectUser } from '../../store/authSlice';
import { CATEGORIES } from '../items/categories';
import './Header.css';

export default function Header() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // Collapse the mobile menu after picking a link
  const close = () => setExpanded(false);

  const handleLogout = () => {
    dispatch(signOut());
    close();
    navigate("/login");
  }

  return (
    <Navbar
      bg="primary"
      data-bs-theme="dark"
      expand="lg"
      sticky="top"
      expanded={expanded}
      onToggle={setExpanded}
      className="shadow-sm"
      >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={close}>
          Kitchen Essentials
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/dashboard" end onClick={close}>
                  Item List
                </Nav.Link>
                <Nav.Link as={NavLink} to="/items/new" onClick={close}>
                  Add Item
                </Nav.Link>
                <NavDropdown title="Categories" id="categories-dropdown">
                  <NavDropdown.Item as={Link} to="/dashboard" onClick={close}>
                    All items
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  {CATEGORIES.map((category)=>(
                    <NavDropdown.Item
                      key={category}
                      as={Link}
                      to={`/dashboard?category=${encodeURIComponent(category)}`}
                      onClick={close}
                      >
                      {category}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              </Nav>
              <Nav>
                <NavDropdown title={`Hi, ${user.name}`} id="user-dropdown" align="end">
                  <NavDropdown.ItemText className="small text-muted">
                    {user.email}
                  </NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/items/new" onClick={close}>
                    + Add new item
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/sessions" onClick={close}>
                    Active sessions
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/login" onClick={close}>
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register" onClick={close}>
                Signup
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
