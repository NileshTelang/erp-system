const express = require("express");
const Web3 = require("web3");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const web3 = new Web3(process.env.ETHEREUM_NODE_URL);

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = JSON.parse(process.env.CONTRACT_ABI);

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.json());

app.get("/api/employees", async (req, res) => {
  try {
    const employees = await contract.methods.getAllEmployees().call();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/employees", async (req, res) => {
  try {
    const { name, position, salary } = req.body;
    await contract.methods
      .addEmployee(name, position, salary)
      .send({ from: process.env.ACCOUNT_ADDRESS });
    res.json({ message: "Employee added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await contract.methods.getEmployee(employeeId).call();
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { name, position, salary } = req.body;
    await contract.methods
      .updateEmployee(employeeId, name, position, salary)
      .send({ from: process.env.ACCOUNT_ADDRESS });
    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    await contract.methods
      .deleteEmployee(employeeId)
      .send({ from: process.env.ACCOUNT_ADDRESS });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
