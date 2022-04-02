import './main.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import { Search } from 'react-router-dom';
import SearchBar from './search_bar'
import { useState } from 'react';

// import { useNavigate } from 'react-router-dom';
// let navigate = useNavigate();

const suggest_type = [{remarks: "Just TAKE it"}, {remarks: "I'm loving IT"}, {remarks: "EASYer's Choice"}];
const suggested = [
    {filename: "/cuhk-2013.jpg", name: "Restaurant 1", location:    "Location 1", remarks: "Restaurant Info1"},
    {filename: "/cuhk-2017.jpg", name: "Restaurant 2", location:    "Location 2", remarks: "Restaurant Info2"},
    {filename: "/sci-2013.jpg", name: "Restaurant 3", location:    "Location 3", remarks: "Restaurant Info3"},
];

const restaurantData = [
  {filename: "/cuhk-2013.jpg", name: "Restaurant 1", location:    "Location 1", remarks: "Restaurant Info1"},
  {filename: "/cuhk-2017.jpg", name: "Restaurant 2", location:    "Location 2", remarks: "Restaurant Info2"},
  {filename: "/sci-2013.jpg", name: "Restaurant 3", location:    "Location 3", remarks: "Restaurant Info3"},
  {filename: "/shb-2013.jpg", name: "Restaurant 4", location:    "Location 4", remarks: "Restaurant Info4"},
  {filename: "/stream-2009.jpg", name: "Restaurant 5", location:    "Location 5", remarks: "Restaurant Info5"},
];

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
                                        <div className="e-card-header-title">{suggested[index].name}</div>
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
                    {this.props.filteredRestaurants.map((restaurant,i) => <FileCard restaurant={restaurant} i={i} key={i} />)}
                    
                </div>
                <div className="col-1"></div>
            </div>
          </main>
        );
    }
}

class FileCard extends React.Component{
    handleMOver(index, e) {
        console.log(index);
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
        console.log(index);
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
        console.log(index);
        
        // navigate('/restaurant/' + index);
    }
    constructor(props) {
        super(props);
        this.state = { selected: -1 };
    }
    render() {
        let index = this.props.i;
        let restaurant = this.props.restaurant;
        console.log(restaurant);
        return (
            <Link to={"/restaurant/"+index}>
                <div className="card d-inline-block m-1" style={{width: this.state.selected==index ? '33%' : '31%'}}  
                    onMouseOver={(e) => this.handleMOver(index,e)} onMouseOut={(e) => this.handleMOut(index,e)} 
                    onClick={(e) => this.handleCLick(index,e)}>
                    <img src={process.env.PUBLIC_URL+restaurant.filename} className="w-100" />
                    <div className="card-body">
                        <h6 className="card-title"> {restaurant.name}</h6>
                        <p className="card-text"> {restaurant.location}</p>
                        { this.state.selected===index && <p className="card-text">{restaurant.remarks}</p> }
                    </div>
                </div>
            </Link>
                
        );
    }

}


function Main(){
    
    // const { search } = window.location;
    // const query = new URLSearchParams(search).get('s');
    const [searchQ, setSearchQ] = useState();
    const filteredRestaurants = filterRestaurant(restaurantData, searchQ);
    function filterRestaurant(restaurant_list, query){
        console.log("in filterRestaurant");
        if (!query) {
            return restaurant_list;
        }
    
        return restaurant_list.filter((restaurants) => {
            const restaurantame = restaurants.name.toLowerCase();
            return restaurantame.includes(query);
        });
    };
    // const filteredRestaurants = restaurantData;
    return (
          <>

            <div className='Main'>
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
