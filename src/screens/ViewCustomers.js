import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import NavBarComp from "../componets/NavbarComp";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";
import { Store } from "../Store";
import { useContext, useState, useEffect } from "react";

export default function EmployeesScreen() {

  const { state } = useContext(Store);
  let { userInfo } = state;
  const [users, setUsers] = useState('')

  
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

  //console.log(users)
/*

  function AlertDismissible() {
    return (
      <>
        <Alert show={alert[0]} variant="danger">
          <Alert.Heading>
            Are you sure you sant to delete this employee?
          </Alert.Heading>

          <Button
            className="mt-3"
            onClick={() => deleteEmployee(alert[1])}
            variant="outline-danger"
          >
            Yes
          </Button>
          <Button
            className="mt-3 ms-3"
            onClick={() => setAlert([false, ""])}
            variant="outline-danger"
          >
            No
          </Button>
        </Alert>
      </>
    );
  }
*/
  return (
    <div>
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
            <tr>
              <td>Devin Joseph</td>
              <td>601 wood dr.<br/>
                 kissimmee fl</td>
              <td>+14075765595</td>
              <td>devin@gmail.com</td>
              <td>Paid</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
