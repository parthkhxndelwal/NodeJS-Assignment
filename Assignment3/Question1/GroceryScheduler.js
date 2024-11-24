const EventEmitter = require('events');

class GroceryScheduler extends EventEmitter {
    constructor() {
        super();
        this.groceryList = new Map();
        this.activeOrders = new Set();
    }

    scheduleGrocery(itemName, delayTime, callback) {
        if (typeof itemName !== 'string' || typeof delayTime !== 'number' || typeof callback !== 'function') {
            throw new Error('Invalid parameters');
        }

        const groceryItem = {
            itemName,
            delayTime,
            callback,
            startTime: Date.now()
        };

        this.groceryList.set(itemName, groceryItem);
        this.activeOrders.add(itemName);

        setTimeout(() => {
            this.processGroceryOrder(itemName);
        }, delayTime);

        return this;
    }

    processGroceryOrder(itemName) {
        const groceryItem = this.groceryList.get(itemName);
        
        if (!groceryItem) {
            return;
        }

        try {
            groceryItem.callback(itemName);

            const timeTaken = Date.now() - groceryItem.startTime;

            this.emit('groceryCompleted', {
                itemName,
                timeTaken,
                completedAt: new Date().toISOString()
            });

            this.activeOrders.delete(itemName);
            this.groceryList.delete(itemName);

        } catch (error) {
            this.emit('error', {
                itemName,
                error: error.message
            });
        }
    }

    getActiveOrders() {
        return Array.from(this.activeOrders);
    }

    cancelGrocery(itemName) {
        if (this.groceryList.has(itemName)) {
            this.groceryList.delete(itemName);
            this.activeOrders.delete(itemName);
            this.emit('groceryCancelled', itemName);
            return true;
        }
        return false;
    }
}

module.exports = GroceryScheduler;