const GroceryScheduler = require('./GroceryScheduler');

const scheduler = new GroceryScheduler();

scheduler.on('groceryCompleted', ({ itemName, timeTaken, completedAt }) => {
    console.log(`Grocery order completed: ${itemName}`);
    console.log(`Time taken: ${timeTaken}ms`);
    console.log(`Completed at: ${completedAt}`);
});

scheduler.scheduleGrocery('Milk', 2000, (item) => {
    console.log(`Time to order ${item}!`);
});

scheduler.scheduleGrocery('Bread', 3000, (item) => {
    console.log(`Time to order ${item}!`);
});

scheduler.scheduleGrocery('Eggs', 4000, (item) => {
    console.log(`Time to order ${item}!`);
});

console.log('Active orders:', scheduler.getActiveOrders());