const Assessment = require("../Model/assessmentModel");
const Payment = require("../Model/Payment");

const monthDiff = (from, to) =>
  (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());

const calculateTax = async (req, res) => {
  try {
    const { propertyNo } = req.params;
    const today = new Date();
    const year = today.getFullYear();

    // 1) Get assessment
    const assessment = await Assessment.findOne({ propertyNo });
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    // 2) Calculate annual tax (base)
    let annualTax = (assessment.appraisedValue * assessment.taxRate) / 100;

    // Apply MINIMUM rule (>= 1200)
    if (annualTax < 1200) annualTax = 1200;

    // 3) Quarterly installment
    const quarterlyAmount = Number((annualTax / 4).toFixed(2));

    // 4) Due dates (council standard)
    const dueDates = [
      new Date(year, 2, 31),  // 31 Mar
      new Date(year, 5, 30),  // 30 Jun
      new Date(year, 8, 30),  // 30 Sep
      new Date(year, 11, 31), // 31 Dec
    ];

    // 5) Pull payments
    const paymentsThisYear = await Payment.find({ propertyNo, year }).sort({ paymentDate: 1 });
    const totalPaid = paymentsThisYear.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const lastPaidDate = paymentsThisYear.length
      ? paymentsThisYear[paymentsThisYear.length - 1].paymentDate
      : null;

    // Group by quarter
    const paidByQuarter = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let unallocatedPaid = 0;
    for (const p of paymentsThisYear) {
      if (p.quarter && paidByQuarter[p.quarter] !== undefined) {
        paidByQuarter[p.quarter] += p.amountPaid || 0;
      } else {
        unallocatedPaid += p.amountPaid || 0;
      }
    }

    // 6) Build quarters with fines
    let totalQuarterFines = 0;
    const quarters = [1, 2, 3, 4].map((q, idx) => {
      const dueDate = dueDates[idx];
      let dueForQuarter = Math.max(quarterlyAmount - paidByQuarter[q], 0);

      // Apply bulk unallocated to oldest
      if (unallocatedPaid > 0 && dueForQuarter > 0) {
        const use = Math.min(unallocatedPaid, dueForQuarter);
        dueForQuarter -= use;
        unallocatedPaid -= use;
      }

      // Fine
      let qFine = 0;
      if (dueForQuarter > 0 && today > dueDate) {
        const monthsLate = Math.max(monthDiff(dueDate, today), 0);
        qFine = Math.max(dueForQuarter * 0.015 * monthsLate, 5 * monthsLate);
      }

      totalQuarterFines += qFine;

      return {
        quarter: q,
        dueDate,
        baseAmount: quarterlyAmount,
        paidAmount: Number(paidByQuarter[q].toFixed(2)),
        remainingDue: Number(dueForQuarter.toFixed(2)),
        fine: Number(qFine.toFixed(2)),
        status:
          dueForQuarter <= 0
            ? "Paid"
            : today <= dueDate
            ? "Upcoming"
            : "Overdue",
      };
    });

    // 7) Arrears
    const arrears = Math.max(annualTax - totalPaid, 0);

    // 8) Discounts (only if FULL YEAR paid, no partials)
    let discount = 0;
    if (arrears === 0 && lastPaidDate) {
      if (lastPaidDate <= new Date(year, 0, 31)) discount = annualTax * 0.10;
      else if (lastPaidDate <= new Date(year, 5, 30)) discount = annualTax * 0.05;
    }

    // 9) Final payable
    const fine = Number(totalQuarterFines.toFixed(2));
    const payableAmount = Number(Math.max(arrears - discount + fine, 0).toFixed(2));

    // 10) Next due date
    const nextQuarter = quarters.find(q => q.remainingDue > 0);
    const nextDueDate = nextQuarter ? nextQuarter.dueDate : null;

    res.status(200).json({
      propertyNo,
      year,
      annualTax: Number(annualTax.toFixed(2)),
      quarterlyAmount,
      totalPaid: Number(totalPaid.toFixed(2)),
      arrears: Number(arrears.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      fine,
      payableAmount,
      lastPaidDate,
      nextDueDate,
      quarters,

      ownerName: assessment.ownerName,
      ownerNIC: assessment.ownerNIC,
      contactNo: assessment.contactNo
    });
  } catch (err) {
    console.error("❌ Error calculating tax:", err);
    res.status(500).json({ message: "Server error while calculating tax" });
  }
};

module.exports = { calculateTax };
