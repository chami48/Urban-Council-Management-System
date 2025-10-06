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

    // 2) Annual tax with minimum rule
    let annualTax = (assessment.appraisedValue * assessment.taxRate) / 100;
    if (annualTax < 1200) annualTax = 1200;

    // 3) Quarterly installment
    const quarterlyAmount = Number((annualTax / 4).toFixed(2));

    // 4) Correct due dates (Jan/Apr/Jul/Oct)
    const dueDates = [
      new Date(year, 0, 31),  // 31 Jan
      new Date(year, 3, 30),  // 30 Apr
      new Date(year, 6, 31),  // 31 Jul
      new Date(year, 9, 31),  // 31 Oct
    ];

    // 5) Get payments for this year
    const paymentsThisYear = await Payment.find({ propertyNo, year }).sort({ paymentDate: 1 });
    const totalPaid = paymentsThisYear.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const lastPaidDate = paymentsThisYear.length
      ? paymentsThisYear[paymentsThisYear.length - 1].paymentDate
      : null;

    // Group payments by quarter
    const paidByQuarter = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let unallocatedPaid = 0;
    for (const p of paymentsThisYear) {
      if (p.quarter && paidByQuarter[p.quarter] !== undefined) {
        paidByQuarter[p.quarter] += p.amountPaid || 0;
      } else {
        unallocatedPaid += p.amountPaid || 0;
      }
    }

    // 6) Quarters with fines and possible discounts
    let totalQuarterFines = 0;
    let quarterlyDiscount = 0;

    const quarters = [1, 2, 3, 4].map((q, idx) => {
      const dueDate = dueDates[idx];
      let dueForQuarter = Math.max(quarterlyAmount - paidByQuarter[q], 0);

      // Apply unallocated payments
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

      // Quarterly discount (if installment fully paid on or before due date)
      if (paidByQuarter[q] >= quarterlyAmount) {
        const lastPaymentForQuarter = paymentsThisYear.find(p => p.quarter === q);
        if (lastPaymentForQuarter && lastPaymentForQuarter.paymentDate <= dueDate) {
          quarterlyDiscount += quarterlyAmount * 0.05;
        }
      }

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

    // 8) Yearly discount (if full paid by Jan 31)
    let yearlyDiscount = 0;
    if (arrears === 0 && lastPaidDate && lastPaidDate <= new Date(year, 0, 31)) {
      yearlyDiscount = annualTax * 0.10;
    }

    // 9) Final totals
    const discount = Number((yearlyDiscount + quarterlyDiscount).toFixed(2));
    const fine = Number(totalQuarterFines.toFixed(2));
    const payableAmount = Number(Math.max(arrears - discount + fine, 0).toFixed(2));

    // 10) Next due date
    const nextQuarter = quarters.find(q => q.remainingDue > 0);
    const nextDueDate = nextQuarter ? nextQuarter.dueDate : null;

    // Response
    res.status(200).json({
      propertyNo,
      year,
      annualTax: Number(annualTax.toFixed(2)),
      quarterlyAmount,
      totalPaid: Number(totalPaid.toFixed(2)),
      arrears: Number(arrears.toFixed(2)),
      discount,
      fine,
      payableAmount,
      lastPaidDate,
      nextDueDate,
      quarters,
      ownerName: assessment.ownerName,
      ownerNIC: assessment.ownerNIC,
      contactNo: assessment.contactNo,
    });
  } catch (err) {
    console.error("❌ Error calculating tax:", err);
    res.status(500).json({ message: "Server error while calculating tax" });
  }
};

module.exports = { calculateTax };
