import "./main.css";
import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./search_bar";
import { useState, useEffect } from "react";
import { Buffer } from "buffer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import MaterialIcon from "material-icons-react";

const PREFIX = "http://localhost:5000";
const REFRESH_RATE = 30 * 1000; // 30 sec

// import { useNavigate } from 'react-router-dom';
// let navigate = useNavigate();

// class Debug extends React.Component{
//     render(){
// const suggest_type = [{remarks: "Just TAKE it"}, {remarks: "I'm loving IT"}, {remarks: "EASYer's Choice"}];
// const suggested = [
//     {filename: "/cuhk-2013.jpg", restaurantName: "Restaurant 1", address:    "address 1", phoneNum: "Restaurant Info1"},
//     {filename: "/cuhk-2017.jpg", restaurantName: "Restaurant 2", address:    "address 2", phoneNum: "Restaurant Info2"},
//     {filename: "/sci-2013.jpg", restaurantName: "Restaurant 3", address:    "address 3", phoneNum: "Restaurant Info3"},
// ];

// const restaurantData = [
// {filename: "/cuhk-2013.jpg", restaurantName: "adminDefault3AD", address:    "default", phoneNum: "00000000"}
// ];
//         return(<></>);
//     }
// }

class Suggestion extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <main className="container-fluid">
                <div className="row" >
                    <div className="col-1"></div>
                    <div className="col-10 ">
                        <h4>Recommended for you:</h4>
                        <div className='lowestZ slide-in-t'>
                            <Box sx={{ display: 'flex', pt:1, pb:1}}>
                                {this.props.suggestion.map((suggestion,i)=>
                                    <SuggestionCard suggestion={suggestion} i={i} key={i}  />
                                )}
                            </Box>
                        </div>
                    </div>
                    <div className="col-1"></div>
                </div>
            </main>
        );
    }
}

class SuggestionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: -1,
      ImgUrl: "",
      skip: false,
    };
  }

    render() {
        // let i = this.props.i;
        let suggestion = this.props.suggestion;
        if (suggestion.profilePic != undefined){
            if (!this.state.skip){
                let profilePic = suggestion.profilePic;
                // console.log(profilePic);
                let img = Buffer.from(profilePic.data).toString('base64');
                this.setState( ()=>
                    {   
                        return { 
                            ImgUrl: img,
                            skip: true
                        }
                    }
                );
            }
                
        }
        return (
            <Link to={"/restaurant/"+suggestion._id}>
                <Card sx={{ display: 'flex' , ml: 2}}>
                  <CardActionArea sx={{ display: 'flex' }}>
                      <CardMedia
                      component="img"
                      height="150px"
                      width="30%"
                      image = {`data:image/jpg; base64, ${this.state.ImgUrl}`}
                      alt={suggestion.restaurantName}
                      />
                      <CardContent >
                      <Typography gutterBottom variant="body" component="div">
                          <span style={{color: "#567ace"}}>
                              {this.props.i==0?<MaterialIcon icon="thumb_up"/>:this.props.i==1?<MaterialIcon icon="star"/>:<MaterialIcon icon="local_fire_department"/>}
                              {/* {suggest_type[i].remarks} */}
                          </span>
                          <br/>
                          {suggestion.restaurantName}
                      </Typography>
                      </CardContent>
                  </CardActionArea>
                </Card>
            </Link>
        );
    }

}

class Gallery extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let bufferFR = [];
    bufferFR = this.props.filteredRestaurants;
    // console.log(this.props.filteredRestaurants);
    return (
      <>
        <main className="container-fluid">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10 align-self-start">
              <h4>
                Restaurants:
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <i className="material-icons">sync</i>
                </span>
              </h4>

              {bufferFR.map((restaurant, i) => (
                <FileCard
                  restaurant={restaurant}
                  i={i}
                  key={i}
                  RErender={this.props.RErender}
                  setRErender={this.props.setRErender}
                />
              ))}
            </div>
            <div className="col-1"></div>
          </div>
        </main>
      </>
    );
  }
}

class FileCard extends React.Component {
  handleMOver(index, e) {
    // console.log(index);
    this.setState(() => {
      if (this.state.selected != index) return { selected: index };
      else return { selected: -1 };
    });
  }
  handleMOut(index, e) {
    // console.log(index);
    this.setState(() => {
      // if (this.state.selected = index)
      return { selected: -1 };
      // else
      //     return { selected: index }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: -1,
      ImgUrl: "",
      skip: false,
    };
  }
  render() {
    let index = this.props.i;
    let restaurant = this.props.restaurant;

    if (restaurant.profilePic != undefined) {
      // if (!this.state.skip){
      if (this.props.RErender == true) {
        let profilePic = restaurant.profilePic;
        let img = Buffer.from(profilePic.data).toString("base64");
        this.props.setRErender(false);
        this.setState(() => {
          return {
            ImgUrl: img,
            skip: true,
          };
        });
      }

      // }
    }

    //Render
    return (
      <Link to={"/restaurant/" + restaurant._id}>
        <Card
          sx={{
            width: "30%",
            display: "inline-block",
            ml: "2%",
            mt: "1%",
            height: "380px",
            transition: "transform 0.15s ease-in-out",
            "&:hover": { transform: "scale3d(1.05, 1.05, 1)" },
          }}
          onMouseOver={(e) => this.handleMOver(index, e)}
          onMouseOut={(e) => this.handleMOut(index, e)}
          onClick={(e) => this.handleCLick(index, e)}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="180px"
              image={
                restaurant.restaurantName == "adminDefault3AD"
                  ? process.env.PUBLIC_URL + restaurant.filename
                  : `data:image/jpg; base64, ${this.state.ImgUrl}`
              }
              alt={restaurant.restaurantName}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {restaurant.restaurantName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <MaterialIcon icon="place" color="#000000" />
                {restaurant.address}
                {this.state.selected === index && (
                  <>
                    <br></br>
                    <br></br>
                    <span className="card-text">
                      {/* <MaterialIcon icon="phone" color='#000000'/> */}
                      Telephone No.:{restaurant.phoneNum}
                    </span>
                  </>
                )}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    );
  }
}

// async function getAvailableRestaurants(url) {
//     const response = await fetch(
//         url, {
//         method: 'GET',
//         headers: {
//             'Authorization': 'Bearer '+sessionStorage.getItem("token")
//         }}
//     );
//     const restaurantDetails = await response.json();
//     console.log("Restaurants:")
//     console.log(restaurantDetails);

//     const availableR = restaurantDetails.filter((restaurants) => {
//         // const available = true;
//         const available = restaurants.approved && restaurants.online;
//         return available;
//     });

//     return availableR;
// }

// function FavoriteRestaurant() {
//     const PREFIX='http://localhost:5000';
//     const [REALrestaurantData, setREALRD] = useState([]);

//     useEffect(async () => {
//             const url = PREFIX+'/customer/fav';
//             console.log('in fav');
//             console.log('A');

//             let availableR;
//                 try {
//                     availableR = await getAvailableRestaurants(url);
//                     console.log(availableR);
//                     setREALRD(availableR);
//                 }
//                 catch (err) {
//                     console.log('error:', err);
//                 }
//             console.log("B");
//     },[]);

//     const [RErender, setRErender] = useState(true);

//     return (
//           <>
//             <div className='Main'>
//                 <Gallery filteredRestaurants={REALrestaurantData} RErender={RErender} setRErender={setRErender}/>
//             </div>
//           </>
//     );
// }

// function Main(props) {
//     console.log(props.action)
//     if (props.action == 'fav') {
//         return (
//             <FavoriteRestaurant/>
//         );
//     }
//     else {
//         return (
//             <Main2/>
//         )
//     }
// }

function Main() {
  // const PREFIX='http://localhost:5000';

  const [REALrestaurantData, setREALRD] = useState([]);
  useEffect(() => {
    const URL = PREFIX + "/restaurant/approved";
    async function fetchData() {
      try {
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        const restaurantDetails = await response.json();

        const availableR = restaurantDetails.filter((restaurants) => {
          // const available = true;
          const available = restaurants.approved && restaurants.online;
          return available;
        });

        setREALRD(availableR);
      } catch (error) {
        console.log("error", error);
      }
    }
    fetchData();
  }, []);

  const [searchQ, setSearchQ] = useState();
  const [RErender, setRErender] = useState(true);
  var filteredRestaurants = filterRestaurant(REALrestaurantData, searchQ);
  function filterRestaurant(restaurant_list, query) {
    if (!query) {
      return restaurant_list;
    }
    return restaurant_list.filter((restaurants) => {
      const restaurantname = restaurants.restaurantName.toLowerCase();
      return restaurantname.includes(query.toLowerCase());
    });
  }

  const REALsuggested = makeSuggestion(REALrestaurantData);
  function makeSuggestion(restaurant_list) {
    if (restaurant_list.length < 3) {
      return restaurant_list;
    } else {
      return restaurant_list.slice(-3, restaurant_list.length);
    }
  }

  // console.log("Realthingy:");
  // console.log(REALrestaurantData);

  return (
    <>
      <div className="Main">
        {/* <Debug filteredRestaurants={filteredRestaurants}/> */}
        <Suggestion suggestion={REALsuggested} />
        <div style={{ paddingTop: "10px" }}>
          <SearchBar
            searchQ={searchQ}
            setSearchQ={setSearchQ}
            setRErender={setRErender}
          />
        </div>
        <Gallery
          filteredRestaurants={filteredRestaurants}
          RErender={RErender}
          setRErender={setRErender}
        />
      </div>
    </>
  );
}

export default Main;
