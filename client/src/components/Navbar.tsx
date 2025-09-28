import { useContext } from "react";
import { AuthContext } from "../context/AuthContext/AuthState";

import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import SearchDropdown from "./SearchDropdown";

export default function NavbarComponent() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("This component must be used within an AuthProvider");
  }
  const { logout } = authContext;

  return (
    <Navbar expand="lg" bg="light" variant="light" className="position-sticky top-0 w-100" style={{ zIndex: 1000 }}>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Instagram Clone</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

				<SearchDropdown />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-3">
            <Button variant="danger" type="button" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
