import './restaurant.css';
import React from 'react';
import { useState, useEffect  } from 'react';
import {Link} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import SlidingPane from "react-sliding-pane";
import {Buffer} from 'buffer';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import MaterialIcon from 'material-icons-react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Restaurant() {
    const theme = createTheme({
      palette: {
        pur: {
          main: 'rgb(138, 5, 94)',
          dark: `rgb(${138*0.7}, ${5*0.7}, ${94*0.7})`,
        },
      },
    });
    
    let { rid } = useParams();
    const [foodFilter, setFoodFilter] = useState("Chinese");
    const [restaurants, setRestaurants] = useState(null);
    const PREFIX='http://localhost:5000';
    
  const [state, setState] = useState({
    isPaneOpen: false,
  });
  
  const [pic,setPic] = useState(null);
  const [loading,setLoading]=useState(true);
    
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
        const url = PREFIX+'/restaurant/approved';

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
            let img = Buffer.from(target_restaurant.profilePic.data).toString('base64');
            setPic(img);
            setRestaurants(target_restaurant);
            setLoading(false);
          } catch (error) {
            console.log("error", error);
          }
        };

        fetchData();
    }, []);
    
    return (
        loading?
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        :<>
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
          
          <Box sx={{width:"100vw",height:"40vh",
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center",
            backgroundSize:"cover",
            backgroundImage:`linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,1)), url("data:image/jpg; base64, ${pic}")`}}>
            <Typography ml="3%" pt="22vh" variant="h3" color={document.body.style.backgroundColor}>
                {restaurants.restaurantName}
            </Typography>
            
            <Typography ml="3%" pt="5pt" variant="h5" color={document.body.style.backgroundColor}>
                <MaterialIcon icon="place" color={document.body.style.backgroundColor}/>
                {restaurants.address}
                <span>&nbsp;&nbsp;</span>
                <MaterialIcon icon="phone" color={document.body.style.backgroundColor}/>
                {restaurants.phoneNum}
            </Typography>
          </Box>
          
          
            <Box sx={{ mt:"1%", ml:"3%" }}>
                  <ThemeProvider theme={theme}>
                  <Fab color="pur" style={{ position: 'fixed', bottom: "3%", left: "2%"}} onClick={()=>{
                      setState({ isPaneOpen: true })
                  }}>
                    <ShoppingCartIcon sx={{color: document.body.style.backgroundColor}}/>
                  </Fab>
                  </ThemeProvider>
                  
                  
                <Box sx={{ display: 'flex',mb:"1%" }}>
                    {["Chinese","CUHK","Thai","HKU","Western"].map(x=>
                        <Card sx={{ display: 'flex', width: 1/6, mr:"1%"  }}>
                          <CardActionArea sx={{ display: 'flex'}} onClick={()=>{setFoodFilter(x)}}>
                            <CardMedia
                              component="img"
                              height="100%"
                              image="/def.jpg"
                              alt={x}
                              sx={{ display: 'flex', width:1/2 }}
                            />
                            <CardContent sx={{display:'flex',width:1/2}}>
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
                {/*<div>{"/restaurant/getAll: "+( restaurants ? restaurants : "restaurant "+rid+" not found" )}</div>*/}
            </Box>
        </>
    );
}  
  


export default Restaurant;