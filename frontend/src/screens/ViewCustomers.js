import Table from "react-bootstrap/Table";
//import { Link } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import NavBarComp from "../componets/NavbarComp";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";
import { Store } from "../Store";
import { useContext, useState, useEffect } from "react";

export default function EmployeesScreen() {
  const { state } = useContext(Store);
  let { userInfo } = state;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/users/getUsers", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <NavBarComp />
        </Container>
      </Navbar>
      <Container>
        <h1 className="mt-4">Customers</h1>

        <Table className="table mb-0" responsive>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Address</th>
              <th>Number</th>
              <th>Email</th>
              <th>Subscription</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, userId) => (
              <tr key={userId}>
                <td>
                  {user.firstname} {user.lastname}
                </td>
                <td>
                  {user.address}
                  <br />
                  {user.city},{user.lstate}
                </td>
                <td>+1{user.number}</td>
                <td>{user.email}</td>
                <td>{user.subscribed ? "Paid" : "Not paid"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
