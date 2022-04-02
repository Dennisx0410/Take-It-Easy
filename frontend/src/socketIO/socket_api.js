//Socket.IO Testing
import { io} from 'socket.io-client'

const api = {
    connect: () => {
        const jwt = sessionStorage.getItem("token") // assume it returns undefined if user is not logged in
        if (jwt) {
            const socket = io("http://localhost:8080", {
                query: {
                    token: jwt
                }})
                
            socket.on('connect', () =>{
                console.log(`Client Connect to the Server with ID ${socket.id}`)
            })

            socket.on('notification', () =>{
                console.log("Test Noti recieved")
            })
        };
      }
}

export default api;


