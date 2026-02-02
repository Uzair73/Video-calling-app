import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const { token, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn && token) {
            const backendHost = import.meta.env.VITE_BACKEND_HOST;
            // Create socket connection with JWT auth
            const newSocket = io(backendHost, {
                auth: {
                    token: token
                },
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });
            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                setConnected(true);
            });
            newSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setConnected(false);
            });
            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setConnected(false);
            });
            setSocket(newSocket);
            // Cleanup on unmount
            return () => {
                newSocket.close();
            };
        } else {
            // If not logged in, close any existing socket
            if (socket) {
                socket.close();
                setSocket(null);
                setConnected(false);
            }
        }
    }, [isLoggedIn, token]);

    const value = { socket, connected };
    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketContext;
