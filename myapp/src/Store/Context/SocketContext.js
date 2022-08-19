
import io from 'socket.io-client'
import React from "react";

const socket = io(process.env.REACT_APP_SERVER_URL)

const SocketContext = React.createContext(socket)

const SocketContextWrapper = (props) =>{

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )


}


export const MySocketContext=SocketContext
export default SocketContextWrapper
