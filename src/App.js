import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ViewCustomers from "./screens/ViewCustomers";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import "./App.css";

function App() {
  return (
    <div>
      <BrowserRouter>
        <ToastContainer position="bottom-center" autoClose={1000} />
        <div>
          <main>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/viewCustomers" element={<ViewCustomers />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/session_id={CHECKOUT_SESSION_ID}" element={<successScreen />} />

              <Route
                path="/forgotPassword"
                element={<ForgotPasswordScreen />}
              />
              <Route
                path="/resetPassword/:token"
                element={<ResetPasswordScreen />}
              />
              <Route path="/profile" element={<ProfileScreen />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*
<Container className="mt-5" style={{ marginBottom: "100px"}}>
        <div className="text-center mb-5 pt-5">
          <h1>Choose Your Right Plan</h1>
          <p>Upgrade to Premium & Get more Services!</p>
        </div>
        <div className=" d-flex align-items-center justify-content-center">
          <Card className="shadow" style={{ width: "18rem", height: "330px" }}>
            <Card.Body>
              <div className="d-flex justify-content-between border-bottom ">
                <div className="mb-3 mt-2">
                  <Card.Title>Basic</Card.Title>
                </div>
                <div className="mb-3 mt-2">
                  <Card.Title>$100/m</Card.Title>
                </div>
              </div>
              <Card.Text>
                <ul className="mt-3" style={{ lineHeight: "200%" }}>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                </ul>
              </Card.Text>
              <div className="d-flex justify-content-center">
                <Button>Get Started</Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="ms-3 me-3 shadow" style={{ width: "18rem" }}>
            <Card.Body>
              <div className="d-flex justify-content-between border-bottom">
                <div className="mb-3 mt-3">
                  <Card.Title>StartUp</Card.Title>
                </div>
                <div className="mb-3 mt-3">
                  <Card.Title>$200/m</Card.Title>
                </div>
              </div>
              <Card.Text>
                <ul className="mt-3" style={{ lineHeight: "250%" }}>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                </ul>
              </Card.Text>
              <div className="d-flex justify-content-center">
                <Button>Get Started</Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow" style={{ width: "18rem", height: "330px" }}>
            <Card.Body>
              <div className="d-flex justify-content-between border-bottom">
                <div className="mb-3 mt-2">
                  <Card.Title>Enterprise</Card.Title>
                </div>
                <div className="mb-3 mt-2">
                  <Card.Title>$300/m</Card.Title>
                </div>
              </div>
              <Card.Text>
                <ul className="mt-3" style={{ lineHeight: "200%" }}>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                  <li>Lorem Ipsum is dummy text</li>
                </ul>
              </Card.Text>
              <div className="d-flex justify-content-center">
                <Button>Get Started</Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>

*/
