const MatrimonyChat = require('./MatrimonyChat');

// Create a new chat room
const matrimonyRoom = new MatrimonyChat();

matrimonyRoom.on('userJoined', ({ userId, userDetails, timestamp, currentUsers }) => {
    console.log(`New user joined: ${userId}`);
    console.log(`Total users: ${currentUsers}`);
});

matrimonyRoom.on('message', ({ userId, message, timestamp }) => {
    console.log(`${userId}: ${message}`);
});

matrimonyRoom.on('userLeft', ({ userId, timestamp, currentUsers }) => {
    console.log(`User left: ${userId}`);
    console.log(`Remaining users: ${currentUsers}`);
});

matrimonyRoom.on('privateMessage', ({ fromUserId, toUserId, message }) => {
    console.log(`Private message from ${fromUserId} to ${toUserId}: ${message}`);
});

// Example usage
try {
    matrimonyRoom.joinRoom('user1', {
        name: 'John',
        age: 28,
        gender: 'Male'
    });

    matrimonyRoom.joinRoom('user2', {
        name: 'Sarah',
        age: 26,
        gender: 'Female'
    });

    matrimonyRoom.sendMessage('user1', 'Hello everyone!');
    
    matrimonyRoom.sendPrivateMessage('user1', 'user2', 'Hi Sarah!');

    matrimonyRoom.leaveRoom('user1');

} catch (error) {
    console.error('Error:', error.message);
}