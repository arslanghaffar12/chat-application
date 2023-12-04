import React from 'react'
import io from 'socket.io-client';

const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {

    const endPoint = "http://localhost:4200";
    const socket = io(endPoint, { transports: ['websocket', 'polling'] })
    console.log('socket in app.js',socket);
    return (

        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider }
