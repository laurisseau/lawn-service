import { useContext, useReducer, useState, useEffect } from "react";
import Navbar from "../componets/Navbar";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [firstname, setFirstname] = useState(userInfo.firstname);
  const [lastname, setLastname] = useState(userInfo.lastname);
  const [email, setEmail] = useState(userInfo.email);
  const [number, setNumber] = useState(userInfo.number);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscribed, setSubscribed] = useState("");
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `/api/users/getUserById/${userInfo._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        if (result) {
          setSubscriptionPrice(result.data.subscriptionPrice);
          setSubscriptionId(result.data.subscriptionId);
          setSubscribed(result.data.subscribed);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [userInfo._id, userInfo.token]);

  const cancelSubscription = async () => {
    try {
      const data = await axios.delete(`/v1/subscriptions/${subscriptionId}`);
      console.log(data);
      if (data) {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const reactivateSubscription = async () => {
    console.log("hi");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        {
          firstname,
          lastname,
          email,
          number,
          password,
          confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
      });
      toast.error(getError(err));
    }
  };

  function SubscriptionButtons(props) {
    const propsSubscribed = props.subscribed;
    const propsSubscriptionPrice = props.subscriptionPrice;
    const propsSubscriptionId = props.subscriptionId;

    if (propsSubscribed && propsSubscriptionPrice) {
      return (
        <div className="mb-3">
          <Button type="submit">Update</Button>
          <Button variant="danger" onClick={cancelSubscription} className="ms-3">
            Cancel Subscription
          </Button>
        </div>
      );
    } else if (!propsSubscribed && propsSubscriptionPrice === "" && propsSubscriptionId === "") {
      return (
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      );
    } else if (!propsSubscribed && propsSubscriptionPrice === "" && propsSubscriptionId) {
      return (
        <div className="mb-3">
          <Button type="submit">Update</Button>
          <Button onClick={reactivateSubscription} className="ms-3">
            Reactivate Subscription
          </Button>
        </div>
      );
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container small-container">
        <Helmet>
          <title>User Profile</title>
        </Helmet>
        <h1 className="my-3">User Profile</h1>
        <form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="firstname">
            <Form.Label>Firstname</Form.Label>
            <Form.Control
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="lastname">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="number">
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          {loadingUpdate ? (
            <div className="mb-3" disabled>
              <Button type="submit">Update...</Button>
            </div>
          ) : (
            <SubscriptionButtons
              subscribed={subscribed}
              subscriptionId={subscriptionId}
              subscriptionPrice={subscriptionPrice}
            />
          )}
        </form>
      </div>
    </div>
  );
}
