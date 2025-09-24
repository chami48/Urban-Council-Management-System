const express = require('express');
const router = express.Router();
const salaryController = require('../controller/salaryController');

router.post('/', salaryController.createSalary);
router.get('/', salaryController.getSalaries);
router.get('/:id', salaryController.getSalaryById);
router.put('/:id', salaryController.updateSalary);
router.delete('/:id', salaryController.deleteSalary);

module.exports = router;
