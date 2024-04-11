const express = require("express");
const { Web3 } = require('web3');

const app = express();
const port = process.env.PORT || 3000;

// Connecting to the local Ganache instance
const web3Provider = 'http://localhost:7545'; // Update with your provider URL
const web3Instance = new Web3(web3Provider);

// Loading contract ABI and address
const contractABI = require('./build/contracts/EmployeeContract.json').abi;
const contractAddress = "0x473f1Dd53b7cb26B41C178C443408b7813eDf4F3"; // Update with your contract address
const contract = new web3Instance.eth.Contract(contractABI, contractAddress);

app.use(express.json());

// Add a new employee
app.post("/api/employees", async (req, res) => {
  try {
    const { name, position, salary } = req.body;
    const result = await contract.methods.addEmployee(name, position, salary).send({ from: '0xBf5B79778413Da7574f83a9E44a669806b41ccd6', gas: 5000000 });
    res.json({ message: "Employee added successfully", transactionHash: result.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const employeeCount = await contract.methods.getEmployeeCount().call();
    const employees = [];
    for (let i = 1; i <= employeeCount; i++) {
      const emp = await contract.methods.getEmployee(i).call();
      employees.push({
        id: emp.id.toString(),
        name: emp.name,
        position: emp.position,
        salary: emp.salary.toString(),
        isActive: emp.isActive
      });
    }
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get an employee by ID
app.get("/api/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await contract.methods.getEmployee(employeeId).call();
    res.send({ name: employee.name, position: employee.position, salary: employee.salary.toString() })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { name, position, salary } = req.body;
    const result = await contract.methods.updateEmployee(employeeId, name, position, salary).send({ from: '0xBf5B79778413Da7574f83a9E44a669806b41ccd6', gas: 5000000 });
    res.json({ message: "Employee updated successfully", transactionHash: result.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const result = await contract.methods.deleteEmployee(employeeId).send({ from: '0xBf5B79778413Da7574f83a9E44a669806b41ccd6', gas: 5000000 });
    res.json({ message: "Employee deleted successfully", transactionHash: result.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
