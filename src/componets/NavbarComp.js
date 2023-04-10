import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Store } from "../Store";
import { useContext } from "react";

export default function NavBarComp() {
  const { state, dispatch: ctxDispatch} = useContext(Store);
  let { userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const AdminCheck = () => {
    if (userInfo.isUser === "user") {
      return (
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <NavDropdown title={userInfo.firstname} id="navbarScrollingDropdown">
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={signoutHandler}>Signout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      );
    } else if (userInfo.isUser === "admin") {
      return (
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <NavDropdown title={userInfo.firstname} id="navbarScrollingDropdown">
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="viewCustomers">
              View Customers
            </NavDropdown.Item>
            <NavDropdown.Item onClick={signoutHandler}>Signout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      );
    }
  };

  return (
    <div>
      {userInfo ? (
        <AdminCheck />
      ) : (
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/signup">Signup</Nav.Link>
          <Nav.Link href="/signin">Signin</Nav.Link>
        </Nav>
      )}
    </div>
  );
}
