const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, and TXT files are allowed.'));
    }
  }
});

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Email send function
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: to,
      subject: subject,
      text: text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Horana Municipal Council</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Complaint Management System</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">${subject}</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="color: #666; line-height: 1.6; margin: 0; white-space: pre-line;">${text}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f2ff; border-left: 4px solid #667eea; border-radius: 4px;">
              <p style="margin: 0; color: #555; font-size: 14px;">
                <strong>Contact Information:</strong><br>
                Phone: +94 34 226 5632<br>
                Email: complaints@horana.lk<br>
                Address: Horana Municipal Council, Horana
              </p>
            </div>
          </div>
          
          <div style="background: #333; color: white; text-align: center; padding: 15px;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              © 2025 Horana Municipal Council. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

// Controller
const ComplaintController = require("../controller/ComplaintsController");

// Basic CRUD Routes
router.get("/", ComplaintController.getAllComplaints);

router.post(
  "/",
  upload.array("Attach_Files", 5), // up to 5 files
  ComplaintController.addComplaint
);

router.get("/:id", ComplaintController.getComplaintById);

router.put(
  "/:id", 
  upload.array("Attach_Files", 5), 
  ComplaintController.updateComplaint
);

router.delete("/:id", ComplaintController.deleteComplaint);

// Email Route
router.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    // Input validation
    if (!to || !subject || !text) {
      return res.status(400).json({
        success: false,
        message: 'Email address, subject, and message are required',
        error: 'Missing required fields'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format',
        error: 'Email validation failed'
      });
    }

    // Length validations
    if (subject.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Subject line too long (max 200 characters)',
        error: 'Subject validation failed'
      });
    }

    if (text.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message too long (max 2000 characters)',
        error: 'Message validation failed'
      });
    }

    // Send email
    const result = await sendEmail(to, subject, text);

    // Log email activity
    console.log(`Email sent to: ${to}, Subject: ${subject}, Time: ${new Date().toISOString()}`);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: {
        to: to,
        subject: subject,
        messageId: result.messageId,
        sentAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Send email API error:', error);
    
    // Handle different error types
    if (error.code === 'EAUTH') {
      return res.status(401).json({
        success: false,
        message: 'Email authentication failed. Please check email credentials.',
        error: 'Authentication error'
      });
    } else if (error.code === 'ENOTFOUND') {
      return res.status(503).json({
        success: false,
        message: 'Email service unavailable. Please try again later.',
        error: 'Network error'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send email. Please try again.',
        error: error.message
      });
    }
  }
});

// Statistics Route (Optional)
router.get("/stats/overview", async (req, res) => {
  try {
    const Complaint = require("../Model/ComplaintsModel");
    
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const rejectedComplaints = await Complaint.countDocuments({ status: 'rejected' });

    res.status(200).json({
      success: true,
      stats: {
        total: totalComplaints,
        pending: pendingComplaints,
        resolved: resolvedComplaints,
        rejected: rejectedComplaints,
        percentages: {
          pending: totalComplaints > 0 ? ((pendingComplaints / totalComplaints) * 100).toFixed(1) : 0,
          resolved: totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0,
          rejected: totalComplaints > 0 ? ((rejectedComplaints / totalComplaints) * 100).toFixed(1) : 0
        }
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message
    });
  }
});

// Error handling middleware for file uploads
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: error.message
  });
});

module.exports = router;