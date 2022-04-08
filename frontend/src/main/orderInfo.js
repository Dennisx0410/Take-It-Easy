import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import './orderInfo.css'

function OrderInfo(props){
    let {id} = useParams();
    const [orderInfo, setOrderInfo] = useState({})
    const [orderDisplay, setOrderDisplay] = useState()
    const [total, setTotal] = useState(0)
    const PREFIX = `http://localhost:5000`
    const [loading,setLoading] = useState(true)

    const fetchInfo = async () =>{
        const response = await fetch(PREFIX + `/order/${id}`,{
            headers:{
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjRiMmJhMDU1M2QyYzAzYmYzZjI1NTAiLCJ1c2VydHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNjQ5NDMwNDk1LCJleHAiOjE2NTIwMjI0OTV9.6JZC672mt6W6NwDxvZwBwMQ4ok1L8ezC6_q71U21r20"
            }
        })
        const data = await response.json();
        console.log(data)
        let sum = 0;
        data.items.map(item=> sum += item.price)
        setTotal(sum)
        setOrderInfo(data)
        setLoading(false)
    }

    useEffect(()=>{
        fetchInfo();
    },[])


    if (!loading){
        return (
            <div className="orderBk">
                <div className="Infocard">
                    <div className="listItem">
                    <div className="refNo">
                        ref No.#{orderInfo._id}
                    </div>
                    <div className="orderNo"><u>OrderNo.</u><br></br>{orderInfo.orderNo}
                    </div>
                    <div className="restaurantName">
                        PickUp location:<br></br>
                        <b>{orderInfo.restaurantID.restaurantName}</b>
                    </div>
                    <div className="orderStatus">
                    Order Status:<br></br>
                        <b>{orderInfo.status?"Done":"Preparing"}</b>
                    </div>
                    <div className="foodTitle">List of Food:</div>
                    <div className="foodItem">
                        {orderInfo.items.map(item=>(
                            <div className="morePadding">
                                <span style={{"float":"left"}}>1x</span>
                                <span key={item._id}>
                                {item.name}
                                </span>
                                <span className="price" style={{"float":"right"}}>${item.price}</span>
                            </div>
                        ))}
                    </div>
                    <div className="total"><span style={{"float":"left"}}>Total:</span> ${total}</div>
                    <div className="timeStamp">{new Date(orderInfo.createdAt).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        )
    }else{
        return (<div>loading</div>)
    }

}

export default OrderInfo;