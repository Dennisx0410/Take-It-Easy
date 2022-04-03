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

function Restaurant() {
    let { rid } = useParams();
    const [foodFilter, setFoodFilter] = useState("Chinese");
    const [restaurants, setRestaurants] = useState("");
    const PREFIX='http://localhost:5000';
    
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
            setRestaurants(JSON.stringify(json[rid]));
            console.log(json);
          } catch (error) {
            console.log("error", error);
          }
        };

        fetchData();
    }, []);
    console.log(restaurants);
    // function findRestaurant(restaurant_list,rid){
    //   restaurant_list.forEach((item,index)=>{
    //     if (item._id == rid){
    //       return item;
    //     }
    //   });
    //   return null;
    // };
    // let target_restaurant = findRestaurant(restaurants, rid);
    // console.log(target_restaurant);
    return (
        <>
            <Box sx={{ mt:"1%", ml:"1%" }}>
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