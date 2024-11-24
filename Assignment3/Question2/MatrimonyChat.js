const EventEmitter = require('events');

class MatrimonyChat extends EventEmitter {
    constructor() {
        super();
        this.users = new Map(); // Store user details
        this.chatHistory = []; // Store recent messages
        this.maxHistoryLength = 50; // Maximum number of messages to keep
    }

    // Method to join the chat room
    joinRoom(userId, userDetails) {
        if (!userId || typeof userId !== 'string') {
            throw new Error('Valid user ID is required');
        }

        if (this.users.has(userId)) {
            throw new Error('User already exists in the room');
        }

        const user = {
            id: userId,
            details: userDetails || {},
            joinedAt: new Date().toISOString()
        };

        // Add user to the room
        this.users.set(userId, user);

        // Emit join event
        this.emit('userJoined', {
            userId,
            userDetails: user.details,
            timestamp: user.joinedAt,
            currentUsers: this.getUserCount()
        });

        // Send chat history to new user
        if (this.chatHistory.length > 0) {
            this.emit('chatHistory', {
                userId,
                history: this.chatHistory
            });
        }

        return true;
    }

    // Method to send message in the chat room
    sendMessage(userId, message) {
        if (!this.users.has(userId)) {
            throw new Error('User not found in the room');
        }

        if (!message || typeof message !== 'string') {
            throw new Error('Valid message is required');
        }

        const messageObject = {
            userId,
            message,
            userDetails: this.users.get(userId).details,
            timestamp: new Date().toISOString()
        };

        // Add message to chat history
        this.chatHistory.push(messageObject);
        
        // Keep only recent messages
        if (this.chatHistory.length > this.maxHistoryLength) {
            this.chatHistory.shift();
        }

        // Emit message event
        this.emit('message', messageObject);

        return messageObject;
    }

    // Method to leave the chat room
    leaveRoom(userId) {
        if (!this.users.has(userId)) {
            throw new Error('User not found in the room');
        }

        const user = this.users.get(userId);
        this.users.delete(userId);

        // Emit leave event
        this.emit('userLeft', {
            userId,
            userDetails: user.details,
            timestamp: new Date().toISOString(),
            currentUsers: this.getUserCount()
        });

        return true;
    }

    // Utility methods
    getUserCount() {
        return this.users.size;
    }

    getActiveUsers() {
        return Array.from(this.users.values());
    }

    isUserInRoom(userId) {
        return this.users.has(userId);
    }

    getChatHistory() {
        return [...this.chatHistory];
    }

    // Method to send private message
    sendPrivateMessage(fromUserId, toUserId, message) {
        if (!this.users.has(fromUserId) || !this.users.has(toUserId)) {
            throw new Error('One or both users not found in the room');
        }

        const messageObject = {
            fromUserId,
            toUserId,
            message,
            timestamp: new Date().toISOString(),
            isPrivate: true
        };

        // Emit private message event
        this.emit('privateMessage', messageObject);

        return messageObject;
    }
}

module.exports = MatrimonyChat;