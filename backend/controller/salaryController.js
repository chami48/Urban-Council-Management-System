// Salary controller (CRUD + calculation)
const Salary = require('../Model/Salary');

// Helper for OT and EPF/ETF calculation
function calculateSalaryComponents(salaryData) {
  const bs = salaryData.basicSalary;
  const perDay = bs / 28;
  const hourlyRate = perDay / 8;
  const normalOTRate = hourlyRate * 1;
  const holidayOTRate = hourlyRate * 1.5;

  // Overtime
  const normalOT = (salaryData.overtime?.normalDayHours || 0) * normalOTRate;
  const holidayOT = (salaryData.overtime?.holidayHours || 0) * holidayOTRate;
  const totalOT = normalOT + holidayOT;

  // EPF/ETF
  const epfCompany = bs * 0.12;
  const epfEmployee = bs * 0.08;
  const etfCompany = bs * 0.03;

  // Net salary
  const totalAllowances = Object.values(salaryData.allowances || {}).reduce((a, b) => a + b, 0);
  const totalDeductions = (salaryData.deductions?.loan || 0) + epfEmployee + (salaryData.deductions?.insurance || 0) + (salaryData.deductions?.other || 0);
  const netSalary = bs + totalAllowances + totalOT - totalDeductions;

  return {
    basicSalary: bs,
    allowances: salaryData.allowances,
    overtime: {
      ...salaryData.overtime,
      normalDayRate: normalOTRate,
      holidayRate: holidayOTRate,
      total: totalOT
    },
    deductions: {
      ...salaryData.deductions,
      epf: epfEmployee,
      etf: etfCompany
    },
    netSalary,
    epfCompany,
    etfCompany
  };
}

exports.createSalary = async (req, res) => {
  try {
    const components = calculateSalaryComponents(req.body);
    const salary = new Salary({
      employeeId: req.body.employeeId,
      month: req.body.month,
      year: req.body.year,
      ...components
    });
    await salary.save();
    res.status(201).json(salary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) return res.status(404).json({ error: 'Not found' });
    res.json(salary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const components = calculateSalaryComponents(req.body);
    const salary = await Salary.findByIdAndUpdate(req.params.id, {
      employeeId: req.body.employeeId,
      month: req.body.month,
      year: req.body.year,
      ...components
    }, { new: true });
    res.json(salary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    await Salary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
