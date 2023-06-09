import Swal from "sweetalert2";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavBarComp from "../componets/NavbarComp";
import axios from "axios";
import { Store } from "../Store";
import { useContext, useEffect, useState } from "react";
import "../App.css";

export default function HomeScreen() {
  const optionObject = [
    {
      price: "price_1Ms4r9K7StTt0PrsZLnxFcfd",
      priceAmount: "$200",
      packageName: "Starter",
      optionList: [
        "daily",
        "Lorem Ipsum is dummy text",
        "Lorem Ipsum is dummy text",
        "Lorem Ipsum is dummy text",
        "Lorem Ipsum is dummy text",
      ],
      main: true,
      order: 2,
    },
    {
      price: "price_1Mp2jqK7StTt0Prs0jfLd0R5",
      priceAmount: "$100",
      packageName: "Basic",
      optionList: [
        "biweekly",
        "Lorem Ipsum is dummy text",
        "Lorem Ipsum is dummy text",
        "Lorem Ipsum is dummy text",
      ],
      main: false,
      order: 1,
    },
    {
      price: "price_1Ms4s1K7StTt0PrsNlMkApMv",
      priceAmount: "$300",
      packageName: "Advanced",
      optionList: [
        "monthly",
        "Lorem Ipsum is dummy text",
        "Lorem Ipsum is dummy text",
        "Lorem Ipsum is dummy text",
      ],
      main: false,
      order: 3,
    },
  ];

  const [userData, setUserData] = useState("");
  const { state } = useContext(Store);
  let { userInfo } = state;

  let userId = "";
  let userToken = "";

  if (userInfo) {
    userId = userInfo._id;
    userToken = userInfo.token;
  } else {
    userInfo = "";
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users/getUserById/${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setUserData(data);
      } catch (err) {
        console.log(err);
      }
    };
    if (userInfo) {
      fetchData();
    }
  }, [userInfo, userId, userToken]);

  const userSubscriptionId = userData.subscriptionId;

  const changeSubscription = async (pickedPrice) => {
    try {
      const { data } = await axios.put("/changeSubscription", {
        pickedPrice,
        userSubscriptionId,
      });

      if (data) {
       window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const SubscriptionButton = (props) => {
    const openModal = () => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: " me-3 btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You want to change your subscription plan.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, change it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
              title:"Switched Subscription!",
              text:"Your subscription has been changed!",
              icon: "success"
          })
          changeSubscription(props.price);
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "Your subscription did not change.",
              "error"
            );
          }
        });
    };

    if (
      userData &&
      userData.subscriptionPrice &&
      props.disabled !== "disabled"
    ) {
      return (
        <Button onClick={openModal} className={props.disabled}>
          Get Started
        </Button>
      );
    }

    if (userData) {
      return (
        <Button type="submit" className={props.disabled}>
          Get Started
        </Button>
      );
    } else if (!userData) {
      return <Button href="/signup">Get Started</Button>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const priceId = e.target[0].value;

      const data = await axios.post("/create-checkout-session", {
        priceId,
      });

      if (data) {
        const sessionId = data.data.id;

        const sessionUpdate = await axios.put("/updateSessionId", {
          userId,
          sessionId,
        });

        if (sessionUpdate) {
          window.location = data.data.url;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <header
        style={{
          height: "90vh",
          backgroundColor: "#1F1F1E",
          color: "white",
        }}
      >
        <Navbar
          bg="dark"
          variant="dark"
          style={{
            position: "absolute",
            width: "100%",
            zIndex: "1",
            height: "55px",
          }}
        >
          <Container className="d-flex ">
            <NavBarComp />
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

      <div className="text-center mb-5 pt-5">
        <h1>Choose Your Right Plan</h1>
        <p>Upgrade to Premium & Get more Services!</p>
      </div>
      <Container
        className="mt-5 d-flex justify-content-center"
        style={{ marginBottom: "100px" }}
      >
        <Row>
          {optionObject.map((option, optionId) => (
            <Col
              key={optionId}
              className={`order-${option.order} align-self-center`}
            >
              {option.main ? (
                <div className="order-2">
                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="priceId" value={option.price} />
                    <Card className="shadow" style={{ width: "18rem" }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between border-bottom">
                          <div className="mb-3 mt-3">
                            <Card.Title>{option.packageName}</Card.Title>
                          </div>
                          <div className="mb-3 mt-3">
                            <Card.Title>{option.priceAmount}/m</Card.Title>
                          </div>
                        </div>
                        <div>
                          <ul className="mt-3" style={{ lineHeight: "250%" }}>
                            {option.optionList.map((word, id) => (
                              <li key={id}>{word}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="d-flex justify-content-center">
                          {userData.subscriptionPrice === option.price ? (
                            <SubscriptionButton disabled="disabled" />
                          ) : (
                            <SubscriptionButton price={option.price} />
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </form>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="priceId" value={option.price} />
                    <Card
                      className="shadow"
                      style={{ width: "18rem", height: "330px" }}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between border-bottom ">
                          <div className="mb-3 mt-2">
                            <Card.Title>{option.packageName}</Card.Title>
                          </div>
                          <div className="mb-3 mt-2">
                            <Card.Title>{option.priceAmount}/m</Card.Title>
                          </div>
                        </div>
                        <div>
                          <ul className="mt-3" style={{ lineHeight: "250%" }}>
                            {option.optionList.map((word, id) => (
                              <li key={id}>{word}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="d-flex justify-content-center">
                          {userData.subscriptionPrice === option.price ? (
                            <SubscriptionButton disabled="disabled" />
                          ) : (
                            <SubscriptionButton price={option.price} />
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </form>
                </div>
              )}
            </Col>
          ))}
        </Row>
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
