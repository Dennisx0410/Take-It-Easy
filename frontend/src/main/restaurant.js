import './restaurant.css';
import React from 'react';
import { useState, useEffect  } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import SlidingPane from "react-sliding-pane";
//import "react-sliding-pane/dist/react-sliding-pane.css";

function Restaurant() {
    let { rid } = useParams();
    const [foodFilter, setFoodFilter] = useState("Chinese");
    const [restaurants, setRestaurants] = useState("");
    const PREFIX='http://localhost:5000';
    
  const [state, setState] = useState({
    isPaneOpen: false,
  });
    
    document.body.style.backgroundColor = "rgb(250, 240, 229)"
    document.body.style.color = "rgb(138, 5, 94)"
    
    function findRestaurant(restaurant_list,rid){
      let res;
      restaurant_list.forEach((item,index)=>{
        if (item._id == rid){
          res = item;
        }
      });
      return res;
    };
    
    useEffect(() => {
        const url = PREFIX+'/restaurant/all';

        const fetchData = async () => {
          try {
            const response = await fetch(
                url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '+sessionStorage.token
                }}
            );
            const json = await response.json();
            let target_restaurant = findRestaurant(json, rid);
            console.log(target_restaurant);
            setRestaurants(JSON.stringify(target_restaurant));
          } catch (error) {
            console.log("error", error);
          }
        };

        fetchData();
    }, []);
    
    return (
        <>
          <SlidingPane
            className="slide-pane"
            isOpen={state.isPaneOpen}
            onRequestClose={() => {
              // triggered on "<" on left top click or on outside click
              setState({ isPaneOpen: false });
            }}
            hideHeader
            width={window.innerWidth < 600 ? "100%" : "650px"}
          ><Box sx={{mt:"7%"}}>
            abc
          </Box></SlidingPane>
          
            <Box sx={{ mt:"1%", ml:"1%" }}>
                  <Fab color="primary" style={{ position: 'fixed', bottom: "3%", left: "2%"}} onClick={()=>{
                      setState({ isPaneOpen: true })
                  }}>
                  </Fab>
                <Box sx={{ display: 'flex' }}>
                    {["Chinese","CUHK","Thai","HKU","Western"].map(x=>
                        <Card sx={{ display: 'flex', width: 1/6, mr:"1%"  }}>
                          <CardActionArea sx={{ display: 'flex' }} onClick={()=>{setFoodFilter(x)}}>
                            <CardMedia
                              component="img"
                              height="100%"
                              image="/def.jpg"
                              alt={x}
                            />
                            <CardContent>
                              <Typography gutterBottom variant="body" component="div">
                                {x+" Food"}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                    )}
                </Box>
                <div>{"rid: "+rid}</div>
                <div>{"foodFilter: "+foodFilter}</div>
                <div>{"/restaurant/getAll: "+( restaurants ? restaurants : "restaurant "+rid+" not found" )}</div>
            </Box>
        </>
    );
}  
  


export default Restaurant;