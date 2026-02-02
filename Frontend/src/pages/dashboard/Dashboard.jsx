import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    IconButton,
    Grid,
    AppBar,
    Toolbar,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { Add, Logout, Chat } from '@mui/icons-material';
import { getRooms, createRoom, addParticipant, getUserIdFromToken as getUserId } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [newRoom, setNewRoom] = useState({
        room_name: '',
        room_type: 'group'
    });
    const [creating, setCreating] = useState(false);

    // useEffect to fetch the rooms
    useEffect(() => {
        fetchRooms();
    }, []);
    // function to fetch the rooms
    const fetchRooms = async () => {
        try {
            setLoading(true);
            const res = await getRooms();
            const roomsArray = res.data || [];
            setRooms(roomsArray);
            setError('');
        } catch (err) {
            console.error('Error fetching rooms:', err);
            setError(err.response?.data?.message || 'Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };
    // function to create a new room
    const handleCreateRoom = async () => {
        if (!newRoom.room_name.trim()) {
            setError('Room name is required');
            return;
        }
        try {
            setCreating(true);
            setError('');
            const userId = getUserId();
            const roomData = await createRoom(newRoom.room_name, userId, newRoom.room_type);
            if (userId && roomData.room?.id) {
                try {
                    await addParticipant(roomData.room.id, userId);
                } catch (err) {
                    console.error('Error adding participant:', err);
                }
            }
            await fetchRooms();
            setOpenDialog(false);
            setNewRoom({ room_name: '', room_type: 'group' });
        } catch (err) {
            console.error('Error creating room:', err);
            setError(err.response?.data?.message || 'Failed to create room');
        } finally {
            setCreating(false);
        }
    };
    // function to navigate to the chat room
    const handleRoomClick = (roomId) => {
        navigate(`/chat/${roomId}`);
    };
    // function to handle the logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#121212' }}>
            <AppBar position="static" sx={{ backgroundColor: '#1E1E2F' }}>
                <Toolbar>
                    <Chat sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Chat Rooms
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                        Your Rooms
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenDialog(true)}
                        sx={{
                            backgroundColor: '#0078FF',
                            '&:hover': { backgroundColor: '#0056B3' },
                            padding: '0.8rem 2rem',
                            borderRadius: '8px'
                        }}
                    >
                        Create Room
                    </Button>
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {rooms.length === 0 ? (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 8,
                                    color: '#AAAAAA'
                                }}
                            >
                                <Chat sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
                                <Typography variant="h6">No rooms yet</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Create your first room to start chatting!
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {rooms.map((room) => (
                                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                                        <Card
                                            sx={{
                                                backgroundColor: '#1E1E2F',
                                                color: '#FFFFFF',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 24px rgba(0, 120, 255, 0.3)'
                                                }
                                            }}
                                        >
                                            <CardActionArea onClick={() => handleRoomClick(room.id)}>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                        {room.room_name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                                                        Type: {room.room_type || 'group'}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}
            </Container>
            <Dialog
                open={openDialog}
                onClose={() => !creating && setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#1E1E2F',
                        color: '#FFFFFF'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                    Create New Room
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Room Name"
                        fullWidth
                        variant="outlined"
                        value={newRoom.room_name}
                        onChange={(e) => setNewRoom({ ...newRoom, room_name: e.target.value })}
                        InputLabelProps={{ style: { color: '#FFFFFF' } }}
                        InputProps={{
                            style: { color: '#FFFFFF', backgroundColor: '#292942', borderRadius: '5px' }
                        }}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth variant="outlined">
                        <InputLabel sx={{ color: '#FFFFFF' }}>Room Type</InputLabel>
                        <Select
                            value={newRoom.room_type}
                            onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
                            label="Room Type"
                            sx={{
                                color: '#FFFFFF',
                                backgroundColor: '#292942',
                                borderRadius: '5px',
                                '.MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0078FF' }
                            }}
                        >
                            <MenuItem value="group">Group</MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        disabled={creating}
                        sx={{ color: '#AAAAAA' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateRoom}
                        variant="contained"
                        disabled={creating}
                        sx={{
                            backgroundColor: '#0078FF',
                            '&:hover': { backgroundColor: '#0056B3' }
                        }}
                    >
                        {creating ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
