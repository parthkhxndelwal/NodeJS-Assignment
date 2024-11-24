const express = require('express');
const router = express.Router();
const session = require('express-session');

// Initialize express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

/*
NOTE: Ideally we would prefer integrating a database in here, but since it isn't specifically
mentioned in the question, the memory has been used to store the employees, which will naturally
reset everytime the server is re-run.
*/

let employees = [];
let nextEmpId = 1;

// Authentication middleware
const authenticateUser = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized. Please login first.' });
    }
};

// Auth Routes
const authRouter = express.Router();

// Login route
authRouter.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password123') {
        req.session.isAuthenticated = true;
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// Logout route
authRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Error during logout' });
        } else {
            res.json({ message: 'Logout successful!' });
        }
    });
});

// Employee Routes
const employeeRouter = express.Router();

// Validate employee data middleware
const validateEmployee = (req, res, next) => {
    const { emp_name, project_details, employed_status } = req.body;
    
    if (!emp_name || !project_details || !employed_status) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['permanent', 'contractual'].includes(employed_status.toLowerCase())) {
        return res.status(400).json({ error: 'Employed status must be either "permanent" or "contractual"' });
    }

    next();
};

// Create new employee
employeeRouter.post('/', authenticateUser, validateEmployee, (req, res) => {
    const { emp_name, project_details, employed_status } = req.body;
    
    const newEmployee = {
        emp_id: nextEmpId++,
        emp_name,
        project_details,
        employed_status: employed_status.toLowerCase(),
        created_at: new Date().toISOString()
    };

    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});

// Get all employees
employeeRouter.get('/', authenticateUser, (req, res) => {
    res.json(employees);
});

// Get employee by ID
employeeRouter.get('/:id', authenticateUser, (req, res) => {
    const empId = parseInt(req.params.id);
    const employee = employees.find(emp => emp.emp_id === empId);

    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

// Update employee
employeeRouter.put('/:id', authenticateUser, validateEmployee, (req, res) => {
    const empId = parseInt(req.params.id);
    const employeeIndex = employees.findIndex(emp => emp.emp_id === empId);

    if (employeeIndex === -1) {
        return res.status(404).json({ error: 'Employee not found' });
    }

    const { emp_name, project_details, employed_status } = req.body;
    
    employees[employeeIndex] = {
        ...employees[employeeIndex],
        emp_name,
        project_details,
        employed_status: employed_status.toLowerCase(),
        updated_at: new Date().toISOString()
    };

    res.json(employees[employeeIndex]);
});

// Delete employee
employeeRouter.delete('/:id', authenticateUser, (req, res) => {
    const empId = parseInt(req.params.id);
    const employeeIndex = employees.findIndex(emp => emp.emp_id === empId);

    if (employeeIndex === -1) {
        return res.status(404).json({ error: 'Employee not found' });
    }

    const deletedEmployee = employees.splice(employeeIndex, 1)[0];
    res.json({ message: 'Employee deleted successfully', employee: deletedEmployee });
});

// Register routes
app.use('/auth', authRouter);
app.use('/api/employees', employeeRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

