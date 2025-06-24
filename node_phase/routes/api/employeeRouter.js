const express = require('express');
const employeeRouter = express.Router(); // Fixed typo and spacing

const verifyJWT = require('../../middleware/verifyJWT'); // Fixed path
const {
  getAllEmployees,
  getEmployee,
  updateEmployee,
  createEmployee,
  deleteEmployee
} = require('../../controllers/empController'); // Fixed path

// Protect routes using verifyJWT
employeeRouter.route('/')
  .get(verifyJWT, getAllEmployees)
  .put(updateEmployee)
  .post(createEmployee)
  .delete(deleteEmployee);

employeeRouter.route('/:id')
  .get(getEmployee);

module.exports = employeeRouter;
