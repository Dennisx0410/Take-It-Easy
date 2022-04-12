import "./HeaderBar.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MaterialIcon from "material-icons-react";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { Badge, IconButton, Snackbar, Alert, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";

const PREFIX = "http://localhost:5000";

function HeaderBar(props) {
  let navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationList, setList] = useState();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMsg] = useState("");
  const horizontal = "left";
  const vertical = "bottom";

  const handleSnackOpen = () => {
    setSnackOpen(true);
    setSnackMsg("Helllo World");
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const handleDeleteNoti = useEffect(() => {
    fetchNotification();
    //window.addEventListener("beforeunload", closeHandler)
  }, []);

  const fetchNotification = async () => {
    if (props.usertype == "customer") {
      const data = await fetch(
        PREFIX + `/notification/fetchIndividual`,
        {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        }
      );
      const notis = await data.json(); //Converting data to jason
      setNotifications(notis); //Set State with fetched result
    }
  };
  useEffect(() => {
    //Listen to notificaition update
    props.socket?.on("notification", (doc) => {
      setNotifications((prev) => [doc, ...prev]);
      setSnackOpen(true);
      setSnackMsg(doc.message);
    });

    return () => {
      //Off listener when dismount component
      props.socket?.off("notification");
    };
  }, [props.socket]);

  useEffect(() => {
    if (notifications.length > 0) {
      let notificationList = notifications.map((notification) => (
        //Add React Element Here
        <div id={notification._id} key={notification._id} className="NotiItem">
          <Dropdown.Item id={notification._id + "Main"}>
            {notification.message}
            <div
              id={notification._id + "TimeStamp"}
              className="notiTime"
              align="right"
            >
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </Dropdown.Item>
          <IconButton
            id={notification._id + "DeleteButton"}
            aria-label="delete"
            style={{ borderRadius: 0 }}
            className="Noti-Delete"
            onClick={async () => {
              let newNoti = notifications.filter(
                (noti) => noti._id !== notification._id
              );
              setNotifications(newNoti);
              await fetch(
                PREFIX + "/notification/dismiss/" +
                  notification._id,
                { method: "POST" }
              );
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ));
      setList(notificationList);
    } else {
      let notificationList = (
        <Dropdown.Item disabled={true}>
          There is no notification yet!
        </Dropdown.Item>
      );
      setList(notificationList);
    }
  }, [notifications]);

  // Broswer Closing Logout Handler
  const closeHandler = async (e) => {
    e.preventDefault();
    console.log(props.token);
    console.log(props.usertype);
    if (props.usertype === "restaurant") {
      await fetch(PREFIX + `/restaurant/logout`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.token,
        },
      });
    } else if (props.usertype === "customer") {
      await fetch(PREFIX + `/customer/logout`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.token,
        },
      });
    }
  };

  const [customerInfo, setCustomerInfo] = useState({});
  const [skip, setSkip] = useState(false);
  const fetchData = async () => {
    if (props.usertype == "customer") {
      try {
        const URL = PREFIX + "/customer/data";
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        const customer_info = await response.json();
        setCustomerInfo(customer_info);
        setSkip(true);
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  });

  const noti_html = (
    <>
      <Dropdown className="btn-block" autoClose="outside" align={"end"}>
        <DropdownToggle
          id="noti"
          className="bg-transparent btn-transparent"
        >
          <Badge
            badgeContent={
              !notificationList ? 0 : notificationList.length
            }
            color="secondary"
          >
            <MaterialIcon icon="notifications" color="#FFFFFF" />
          </Badge>
        </DropdownToggle>
        <Dropdown.Menu id="NotiContainer">
          <Dropdown.ItemText>
            <div className="noti-Title">Notifications</div>
          </Dropdown.ItemText>
          {notificationList}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );

  const points_html = (
    <>
      Points
      <br></br>
      <div className="d-none d-md-inline">

      <MaterialIcon icon="savings" color="#FFFFFF" />
      </div>
      
      {customerInfo.points >= 0 ? customerInfo.points : -1}
    </>
  )

  const dropdown_customer = (
    <>
      <Dropdown.Item
        onClick={() => navigate("/", { replace: true })}
      >
        Restaurant
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() =>
          navigate("/customer/profile", { replace: true })
        }
      >
        Profile
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() =>
          navigate("/customer/history", { replace: true })
        }
      >
        Order History
      </Dropdown.Item>
    </>
  );

  const dropdown_restaurant = (
    <>
      <Dropdown.Item
        onClick={() => navigate("/", { replace: true })}
      >
        Menu
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => navigate("/r/profile", { replace: true })}
      >
        Profile
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => navigate("/r/history", { replace: true })}
      >
        Order History
      </Dropdown.Item>
    </>
  );

  const dropdown_admin = (
    <>
      <Dropdown.Item
        onClick={() => navigate("/", { replace: true })}
      >
        Orders
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() =>
          navigate("/userlist/customers", { replace: true })
        }
      >
        Customers' List
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() =>
          navigate("/userlist/restaurants", { replace: true })
        }
      >
        Restaurants' List
      </Dropdown.Item>
    </>
  );

  return (
    <>
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={handleSnackClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
      <div className="header stickyBar">
        <div className="container-fluid text-center" style={{height: "100%"}}>
          <Grid container
            justifyContent="center"
            alignItems="center"
            style={{ height: "100%" }}
          >
            <Grid item xs={2} sm={1}>
              { props.usertype === "customer" ? noti_html : <></>}
            </Grid>
            <Grid item xs={0} sm={1}></Grid>
            <Grid item xs={7} sm={8}>
              <Link
                to="/"
                className="header-title "
                style={{ textAlign: "center" }}
              >
                <div className="d-none d-sm-inline-block">
                  <MaterialIcon icon="takeout_dining" color="#FFFFFF" />
                </div>
                <b>TAKE IT EASY</b>
                <div className="d-none d-sm-inline-block">
                  <MaterialIcon icon="takeout_dining" color="#FFFFFF" />
                </div>
              </Link>
            </Grid>

            <Grid item xs={1} className="points">
              { props.usertype === "customer" ? points_html : <></> }
            </Grid>
            <Grid item xs={2} sm={1}>
              <Dropdown
                className="bg-transparent btn-transparent"
                autoClose="outside"
                align="end"
              >
                <Dropdown.Toggle
                  id="dropdown-autoclose-outside"
                  className="bg-transparent btn-transparent"
                  size="sm"
                >
                  <MaterialIcon icon="account_circle" color="#FFFFFF" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {
                    props.usertype === "customer" ? dropdown_customer :
                      props.usertype == "restaurant" ? dropdown_restaurant :
                        dropdown_admin
                  }
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={async (e) => {
                      navigate("/", { replace: true });
                      await closeHandler(e);
                      props.socket.disconnect();
                      props.setToken(undefined);
                      sessionStorage.clear();
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default HeaderBar;
