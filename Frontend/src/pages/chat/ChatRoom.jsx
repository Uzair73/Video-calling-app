import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    AppBar,
    Toolbar,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
} from '@mui/material';
import { Send, ArrowBack, PersonAdd } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { fetchRoom, getUsers, addParticipant, getUserIdFromToken } from '../../api/api';

const ChatRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { socket, connected } = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Get current user ID from localStorage or JWT
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const currentUserId = currentUser?.id ?? currentUser?.user_id ?? getUserIdFromToken();

    // Add participant dialog state
    const [addParticipantOpen, setAddParticipantOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [addSuccess, setAddSuccess] = useState('');
    const [addError, setAddError] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch room details
    useEffect(() => {
        const loadRoom = async () => {
            try {
                setLoading(true);
                const roomData = await fetchRoom(roomId);
                setRoom(roomData.room || roomData);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load room');
            } finally {
                setLoading(false);
            }
        };
        loadRoom();
    }, [roomId]);

    // Socket.IO event handlers
    useEffect(() => {
        if (!socket || !connected) {
            console.log('Socket not connected yet');
            return;
        }
        console.log('Setting up socket listeners for room:', roomId);
        // Join the room
        socket.emit('join-room', { roomId }, (response) => {
            console.log('Join room response:', response);
            if (response?.error) {
                setError(response.error);
            }
        });

        // Listen for room history
        const handleRoomHistory = (data) => {
            setMessages(data.messages || []);
        };

        // Listen for new messages
        const handleMessageReceived = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        // Listen for errors
        const handleError = (error) => {
            console.error('Socket error:', error);
            setError(error.message || 'Connection error');
        };
        socket.on('room-history', handleRoomHistory);
        socket.on('message-received', handleMessageReceived);
        socket.on('error', handleError);

        // Cleanup on unmount
        return () => {
            console.log('Leaving room:', roomId);
            socket.emit('leave-room', { roomId });
            socket.off('room-history', handleRoomHistory);
            socket.off('message-received', handleMessageReceived);
            socket.off('error', handleError);
        };
    }, [socket, connected, roomId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !connected) {
            return;
        }
        setSending(true);
        socket.emit('send-message', { roomId, content: newMessage.trim() }, (response) => {
            if (response?.error) {
                setError(response.error);
            } else {
                setNewMessage('');
            }
            setSending(false);
        });
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleOpenAddParticipant = async () => {
        setAddParticipantOpen(true);
        setAddSuccess('');
        setAddError('');
        try {
            setUsersLoading(true);
            const res = await getUsers();
            setUsers(res.data || []);
        } catch (err) {
            setAddError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setUsersLoading(false);
        }
    };

    const handleAddParticipant = async (userId) => {
        try {
            setAddError('');
            await addParticipant(roomId, userId);
            setAddSuccess('Participant added successfully');
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            setAddError(err.response?.data?.message || 'Failed to add participant');
        }
    };
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#121212'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212' }}>
            <AppBar position="static" sx={{ backgroundColor: '#1E1E2F' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate('/dashboard')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                            {room?.room_name || 'Chat Room'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                            {connected ? 'Connected' : 'Disconnected'}
                        </Typography>
                    </Box>
                    <IconButton
                        color="inherit"
                        onClick={handleOpenAddParticipant}
                        title="Add participant"
                    >
                        <PersonAdd />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {error && (
                <Alert severity="error" onClose={() => setError('')} sx={{ m: 2 }}>
                    {error}
                </Alert>
            )}
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {messages.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            color: '#AAAAAA'
                        }}
                    >
                        <Typography variant="h6">No messages yet</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Be the first to send a message!
                        </Typography>
                    </Box>
                ) : (
                    messages.map((message, index) => {
                        const isOwnMessage = message.sender_id === currentUserId;
                        return (
                            <Box
                                key={message.id || index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                    mb: 1
                                }}
                            >
                                <Paper
                                    sx={{
                                        maxWidth: '70%',
                                        p: 1.5,
                                        backgroundColor: isOwnMessage ? '#0078FF' : '#1E1E2F',
                                        color: '#FFFFFF',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    {!isOwnMessage && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#AAAAAA',
                                                fontWeight: 'bold',
                                                display: 'block',
                                                mb: 0.5
                                            }}
                                        >
                                            {message.username}
                                        </Typography>
                                    )}
                                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                        {message.content}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: isOwnMessage ? '#E0E0E0' : '#AAAAAA',
                                            display: 'block',
                                            mt: 0.5,
                                            textAlign: 'right'
                                        }}
                                    >
                                        {formatTime(message.send_at || message.created_at)}
                                    </Typography>
                                </Paper>
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>
            <Paper
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                    p: 2,
                    backgroundColor: '#1E1E2F',
                    borderTop: '1px solid #333',
                    display: 'flex',
                    gap: 1
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={!connected || sending}
                    InputProps={{
                        style: {
                            color: '#FFFFFF',
                            backgroundColor: '#292942',
                            borderRadius: '24px'
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' }
                        }
                    }}
                />
                <IconButton
                    type="submit"
                    disabled={!connected || sending || !newMessage.trim()}
                    sx={{
                        backgroundColor: '#0078FF',
                        color: '#FFFFFF',
                        '&:hover': { backgroundColor: '#0056B3' },
                        '&.Mui-disabled': { backgroundColor: '#333', color: '#666' }
                    }}
                >
                    {sending ? <CircularProgress size={24} /> : <Send />}
                </IconButton>
            </Paper>

            {/* Add Participant Dialog */}
            <Dialog
                open={addParticipantOpen}
                onClose={() => setAddParticipantOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { backgroundColor: '#1E1E2F', color: '#FFFFFF' } }}
            >
                <DialogTitle>Add Participant</DialogTitle>
                <DialogContent>
                    {addError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAddError('')}>
                            {addError}
                        </Alert>
                    )}
                    {addSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setAddSuccess('')}>
                            {addSuccess}
                        </Alert>
                    )}
                    {usersLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List>
                            {users
                                .filter((u) => u.id !== currentUserId && String(u.id) !== String(currentUserId))
                                .map((user) => (
                                    <ListItem key={user.id} disablePadding>
                                        <ListItemButton onClick={() => handleAddParticipant(user.id)}>
                                            <ListItemText
                                                primary={user.username || user.email}
                                                secondary={user.email}
                                                primaryTypographyProps={{ sx: { color: '#FFFFFF' } }}
                                                secondaryTypographyProps={{ sx: { color: '#AAAAAA' } }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            {users.filter((u) => u.id !== currentUserId && String(u.id) !== String(currentUserId)).length === 0 && (
                                <Typography sx={{ color: '#AAAAAA', py: 2 }}>No other users to add</Typography>
                            )}
                        </List>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setAddParticipantOpen(false)} sx={{ color: '#AAAAAA' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ChatRoom;
