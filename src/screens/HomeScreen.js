import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Store } from "../Store";
import { useContext } from "react";
import "../App.css";

export default function HomeScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  return (
    <div>
      <header
        style={{
          height: "90vh",
          backgroundColor: "#1F1F1E",
          color: "white",
        }}
      >
        <Navbar style={{ position: "absolute", width: "100%", zIndex: "1" }}>
          <Container className="d-flex justify-content-end">
            <div>
              {userInfo ? (
                <Nav className="me-auto">
                  <Nav.Link href="/profile">Profile</Nav.Link>
                </Nav>
              ) : (
                <Nav className="me-auto">
                  <Nav.Link href="/signup">Signup</Nav.Link>
                  <Nav.Link href="/signin">Signin</Nav.Link>
                </Nav>
              )}
            </div>
          </Container>
        </Navbar>
        <div className="img-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1458245201577-fc8a130b8829?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80"
          className="img"
          alt="Cutting Grass"
        ></img>

        <div className="strip"></div>
        <div className="header-box">
          <h1> Tony Lawn Care Services</h1>
          <button className="header-button">Call Us Now</button>
          <button
            className="header-button"
            style={{ backgroundColor: "white" }}
          >
            Contact Us
          </button>
        </div>
      </header>

      <Container className="mt-5" style={{ marginBottom: "100px" }}>
        <div className="text-center mb-5 pt-5">
          <h1>Choose Your Right Plan</h1>
          <p>Upgrade to Premium & Get more Services!</p>
        </div>
        <div className=" d-flex align-items-center justify-content-center">
          <Card className="ms-3 me-3 shadow" style={{ width: "18rem" }}>
            <Card.Body>
              <div className="d-flex justify-content-between border-bottom">
                <div className="mb-3 mt-3">
                  <Card.Title>StartUp</Card.Title>
                </div>
                <div className="mb-3 mt-3">
                  <Card.Title>$100/m</Card.Title>
                </div>
              </div>
              <div>
                <ul className="mt-3" style={{ lineHeight: "250%" }}>
                  <li>Kill Weed Spray</li>
                  <li>Trimming / Bush Trim</li>
                  <li>Edging</li>
                  <li>Maintaining Yard</li>
                  <li>Grass Lining</li>
                  <li>2-3 times a Month</li>
                </ul>
              </div>
              <div className="d-flex justify-content-center">
                <Button>Get Started</Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>

      <footer
        style={{ backgroundColor: "#252525", height: "170px", color: "white" }}
      >
        <Container
          className="d-flex justify-content-md-between align-items-center flex-wrap justify-content-center"
          style={{ height: "100%" }}
        >
          <div>
            <h1 style={{ fontSize: "18px" }}>© 2023 Lawn Service</h1>
            <p>Icon by www.wishforge.games on freeicons.io</p>
            <a
              style={{ color: "white" }}
              href="https://www.instagram.com/yardi_kitchen/"
            >
              <i
                className="fa-brands fa-instagram"
                style={{ fontSize: "30px" }}
              ></i>
            </a>
          </div>

          <div>
            <h1 style={{ fontSize: "18px" }}>
              WEB DESIGN BY LAURISSEAU JOSEPH
            </h1>
          </div>
        </Container>
      </footer>
    </div>
  );
}
