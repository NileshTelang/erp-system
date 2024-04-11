// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EmployeeContract {
    // Structure to store employee details
    struct Employee {
        uint id;
        string name;
        string position;
        uint salary;
        bool isActive;
    }

    // Mapping to store employees
    mapping(uint => Employee) public employees;
    uint public employeeCount;

    // Event to log new employee addition
    event EmployeeAdded(uint indexed id, string name, string position, uint salary);
    event EmployeeUpdated(uint indexed id, string name, string position, uint salary);
    event EmployeeDeleted(uint indexed id);

    // Function to add a new employee
    function addEmployee(string memory _name, string memory _position, uint _salary) public {
        employeeCount++;
        employees[employeeCount] = Employee(employeeCount, _name, _position, _salary, true);
        emit EmployeeAdded(employeeCount, _name, _position, _salary);
    }

    // Function to update employee details
    function updateEmployee(uint _id, string memory _name, string memory _position, uint _salary) public {
        require(_id <= employeeCount, "Employee does not exist");
        Employee storage employee = employees[_id];
        employee.name = _name;
        employee.position = _position;
        employee.salary = _salary;
        emit EmployeeUpdated(_id, _name, _position, _salary);
    }

    // Function to delete an employee
    function deleteEmployee(uint _id) public {
        require(_id <= employeeCount, "Employee does not exist");
        employees[_id].isActive = false;
        emit EmployeeDeleted(_id);
    }

    // Function to get all employees
    function getAllEmployees() public view returns (Employee[] memory) {
        Employee[] memory allEmployees = new Employee[](employeeCount);
        for (uint i = 1; i <= employeeCount; i++) {
            allEmployees[i - 1] = employees[i];
        }
        return allEmployees;
    }

    function getEmployeeCount() public view returns (uint) {
        return employeeCount;
    }


    // Function to get an employee by ID
    function getEmployee(uint _id) public view returns (Employee memory) {
        require(_id <= employeeCount, "Employee does not exist");
        return employees[_id];
    }
}
