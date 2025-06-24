const path = require("path");

const data = {
  employees: require("../models/employees.json"),
  setEmployees: function (newData) {
    this.employees = newData;
  }
};

const createEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees.length ? data.employees[data.employees.length - 1].id + 1 : 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({ message: "First name and last name are required" });
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
  }

  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;

  const updatedEmployees = data.employees.map(emp =>
    emp.id === parseInt(req.body.id) ? employee : emp
  );

  data.setEmployees(updatedEmployees);
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
  }

  const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  data.setEmployees(filteredEmployees);
  res.json(data.employees);
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
