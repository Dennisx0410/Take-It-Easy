import './main.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import { Search } from 'react-router-dom';
import SearchBar from './search_bar'
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {Buffer} from 'buffer';

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
                        {suggested.map((file,index) => <SuggestionCard i={index} key={index}/>)}
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
        let index = this.props.i;
        return (
            <Link to={"/restaurant/"+index}>
                    {/* {index} */}
                    <div className="" style={{ margin: '5px 3vw', display: 'inline-block', 
                        justifyContent: 'center', textAlign: 'center', backgroundColor: "white"}}>
                        <div className="e-card e-card-horizontal" style={{ width: '100%' }}>
                            <img src={process.env.PUBLIC_URL+suggested[index].filename} className="w-100" style={{ height: '150px' }}/>
                            <div className="e-card-stacked">
                                <div className="e-card-header">
                                    <div className="e-card-header-caption">
                                        <div className="e-card-header-title">{suggested[index].restaurantName}</div>
                                    </div>
                                </div>
                                <div className="e-card-content">
                                    {suggest_type[index].remarks}
                                </div>
                            </div>
                        </div>
                    </div>   
            </Link>
                
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
    handleCLick(index, e) {
        // console.log(index);
        
        // navigate('/restaurant/' + index);
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
            // console.log(img);
        //     this.setState(()=>{ return {ImgUrl: imglink} });
        }
        else{
        //     console.log("default");
        //     // this.setState(()=>{ return {ImgUrl: process.env.PUBLIC_URL+restaurant.filename }})
        }
        //Render
        return (
            <Link to={"/restaurant/"+restaurant._id}>
                <div className="card d-inline-block m-1" style={{width: this.state.selected==index ? '33%' : '31%'}}  
                    onMouseOver={(e) => this.handleMOver(index,e)} onMouseOut={(e) => this.handleMOut(index,e)} 
                    onClick={(e) => this.handleCLick(index,e)}>
                    <img src={ restaurant.restaurantName == "adminDefault3AD"? process.env.PUBLIC_URL+restaurant.filename : `data:image/jpg; base64, ${this.state.ImgUrl}`} className="w-100" />
                    <div className="card-body">
                        <h6 className="card-title"> {restaurant.restaurantName}</h6>
                        <p className="card-text"> {restaurant.address}</p>
                        { this.state.selected===index && <p className="card-text">{restaurant.phoneNum}</p> }
                    </div>
                </div>
            </Link>
                
        );
    }

}


function Main(){
    const PREFIX='http://localhost:5000';
    

    const [REALrestaurantData, setREALRD] = useState(restaurantData);
    useEffect(() => {
            const url = PREFIX+'/restaurant/getAll';
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
