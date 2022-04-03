import './main.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import { Search } from 'react-router-dom';
import SearchBar from './search_bar'
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {Buffer} from 'buffer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import { display } from '@mui/system';


// import { useNavigate } from 'react-router-dom';
// let navigate = useNavigate();

const suggest_type = [{remarks: "Just TAKE it"}, {remarks: "I'm loving IT"}, {remarks: "EASYer's Choice"}];
const suggested = [
    {filename: "/cuhk-2013.jpg", restaurantName: "Restaurant 1", address:    "address 1", phoneNum: "Restaurant Info1"},
    {filename: "/cuhk-2017.jpg", restaurantName: "Restaurant 2", address:    "address 2", phoneNum: "Restaurant Info2"},
    {filename: "/sci-2013.jpg", restaurantName: "Restaurant 3", address:    "address 3", phoneNum: "Restaurant Info3"},
];

const restaurantData = [
  {filename: "/cuhk-2013.jpg", restaurantName: "adminDefault3AD", address:    "default", phoneNum: "00000000"}
  
];

class Debug extends React.Component{
    render(){
        return(<></>);
    }
}

class Suggestion extends React.Component {
  render() {
      return (
            <main>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10 align-self-start">
                        <h4 style={{padding: "5px 0 0 0"}}>Recommended For You</h4>
                        <SuggestionCard/>
                    </div>
                    <div className="col-1"></div>
                </div>
            </main>
      );
  }
}


class SuggestionCard extends React.Component{
    handleCLick(index, e) {
        console.log(index);
    }
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Box sx={{ display: 'flex', pt:1, pb:1 }}>
                {suggested.map((suggestion,i)=>
                    <Link to={"/restaurant/"+i}>
                        <Card sx={{ display: 'flex' , ml: 2}}>
                        <CardActionArea sx={{ display: 'flex' }}>
                            <CardMedia
                            component="img"
                            height="100px"
                            image = {process.env.PUBLIC_URL+suggestion.filename}
                            alt={i}
                            />
                            <CardContent>
                            <Typography gutterBottom variant="body" component="div">
                                {suggestion.restaurantName+'\n'+suggest_type[i].remarks}
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                        </Card>
                    </Link>
                )}
            </Box>
        );
    }

}


class Gallery extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        
        console.log(this.props.filteredRestaurants);
        return (

          <main className="container-fluid">
            <div className="row">
                <div className="col-1"></div>
                <div className="col-10 align-self-start">
                    <h4 style={{padding: "5px 0 0 0"}}>Restaurants:</h4>
                    {this.props.filteredRestaurants.map(
                        (restaurant,i) => <FileCard restaurant={restaurant} i={i} key={i} />
                    )}
                    
                </div>
                <div className="col-1"></div>
            </div>
          </main>
        );
    }
}

class FileCard extends React.Component{
    handleMOver(index, e) {
        // console.log(index);
        this.setState( ()=>
            {   
                if (this.state.selected != index)
                    return { selected: index }
                else
                    return { selected: -1 }
            }
        );
    }
    handleMOut(index, e) {
        // console.log(index);
        this.setState( ()=>
            {   
                // if (this.state.selected = index)
                    return { selected: -1 }
                // else
                //     return { selected: index }
            }
        );
    }
    loadImage(img) {
        this.setState( ()=>
            {   
                // if (this.state.selected = index)
                    return { ImgUrl: img }
                // else
                //     return { selected: index }
            }
        );
    }
    constructor(props) {
        super(props);
        this.state = { 
            selected: -1,
            ImgUrl: ''
        };
    }
    render() {

        let index = this.props.i;
        let restaurant = this.props.restaurant;
        console.log(restaurant);
        
        // console.log(this.state.ImgUrl);
        if (restaurant.restaurantName != "adminDefault3AD"){
        
            let profilePic = restaurant.profilePic;
            // console.log(profilePic);
            let img = Buffer.from(profilePic.data).toString('base64');
            // this.loadImage(img);
        }
        else{
        //     console.log("default");
        //     // this.setState(()=>{ return {ImgUrl: process.env.PUBLIC_URL+restaurant.filename }})
        }
        //Render
        return (
            <Link to={"/restaurant/"+restaurant._id}>
                <Card sx={{ width: "30%", display: "inline-block", ml:"2%",mt:"1%" , minHeight:"300px", 
                    transition: "transform 0.15s ease-in-out", "&:hover": { transform: "scale3d(1.05, 1.05, 1)"} }}
                    onMouseOver={(e) => this.handleMOver(index,e)} 
                    onMouseOut={(e) => this.handleMOut(index,e)} 
                    onClick={(e) => this.handleCLick(index,e)}>
                    <CardActionArea>
                        <CardMedia
                        component="img"
                        height="180px"
                        image={ restaurant.restaurantName == "adminDefault3AD"? process.env.PUBLIC_URL+restaurant.filename : process.env.PUBLIC_URL+"/food.jpeg"}
                        // `data:image/jpg; base64, ${this.state.ImgUrl}`}
                        alt={restaurant.restaurantName}
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {restaurant.restaurantName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <MaterialIcon icon="place" color='#000000'/>{restaurant.address}
                            { this.state.selected===index && 
                                <> 
                                <br></br>
                                <span className="card-text">
                                    <MaterialIcon icon="phone" color='#000000'/>
                                    {restaurant.phoneNum}
                                </span> 
                                </>
                            }
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                
            </Link>
                
        );
    }

}


function Main(){
    const PREFIX='http://localhost:5000';
    

    const [REALrestaurantData, setREALRD] = useState(restaurantData);
    useEffect(() => {
            // const url = PREFIX+'/restaurant/all';
            const url = PREFIX+'/restaurant/approved';
            console.log("A");
            async function fetchData () {
                try {
                    const response = await fetch(
                        url, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer '+sessionStorage.getItem("token")
                        }}
                    );
                    const restaurantDetails = await response.json();
                    console.log("Restaurants:")
                    console.log(restaurantDetails);

                    const availableR = restaurantDetails.filter((restaurants) => {
                        const available = true;
                        // const available = restaurants.approved && restaurants.online;
                        return available;
                    });
                    
                    setREALRD(availableR);
                    
                } catch (error) {
                    console.log("error", error);
                }
            };
            fetchData();
            console.log("B");
    },[]);
    
    
    const [searchQ, setSearchQ] = useState();
    const filteredRestaurants = filterRestaurant(REALrestaurantData, searchQ);
    function filterRestaurant(restaurant_list, query){
        console.log("in filterRestaurant");
        if (!query) {
            console.log("No query");
            return restaurant_list;
        }
        return restaurant_list.filter((restaurants) => {
            const restaurantname = restaurants.restaurantName.toLowerCase();
            return restaurantname.includes(query.toLowerCase());
        });
    };

    
    console.log("Realthingy:");
    console.log(REALrestaurantData);

    return (
          <>

            <div className='Main'>
                <Debug filteredRestaurants={filteredRestaurants}/>
                <Suggestion />
                <div style={{paddingTop: "10px"}}>
                    <SearchBar searchQ={searchQ} setSearchQ={setSearchQ}/>
                </div>
                <Gallery filteredRestaurants={filteredRestaurants}/>
            </div>
              
          </>
    );
}



export default Main;
