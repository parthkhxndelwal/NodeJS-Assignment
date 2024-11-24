const GroceryScheduler = require('./GroceryScheduler');

// Create a new instance
const scheduler = new GroceryScheduler();

// Listen for completed grocery orders
scheduler.on('groceryCompleted', ({ itemName, timeTaken, completedAt }) => {
    console.log(`Grocery order completed: ${itemName}`);
    console.log(`Time taken: ${timeTaken}ms`);
    console.log(`Completed at: ${completedAt}`);
});

// Schedule some grocery items
scheduler.scheduleGrocery('Milk', 2000, (item) => {
    console.log(`Time to order ${item}!`);
});

scheduler.scheduleGrocery('Bread', 3000, (item) => {
    console.log(`Time to order ${item}!`);
});

scheduler.scheduleGrocery('Eggs', 4000, (item) => {
    console.log(`Time to order ${item}!`);
});

// Check active orders
console.log('Active orders:', scheduler.getActiveOrders());