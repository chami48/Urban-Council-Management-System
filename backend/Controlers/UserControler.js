const User = require("../Model/UserModel");
const sendEmail = require("../sendEmail");

// GET all users
const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
};

// POST create user
const addUsers = async (req, res, next) => {
    const {
        eventName,
        eventType,
        description,
        organizerName,
        email,
        phone,
        playgroundType,
        expectedAttendees,
        eventDate,
        startTime,
        endTime,
        specialRequirement
    } = req.body;

    let user;

    try {
        user = new User({
            eventName,
            eventType,
            description,
            organizerName,
            email,
            phone,
            playgroundType,
            expectedAttendees,
            eventDate,
            startTime,
            endTime,
            specialRequirement
        });
        await user.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to add user" });
    }

    return res.status(201).json({ user });
};

// GET user by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let user;

    try {
        user = await User.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
};

// PUT update user by ID
const updateUser = async (req, res, next) => {
    const id = req.params.id;

    const {
        eventName,
        eventType,
        description,
        organizerName,
        email,
        phone,
        playgroundType,
        expectedAttendees,
        eventDate,
        startTime,
        endTime,
        specialRequirement
    } = req.body;

    let user;

    try {
        user = await User.findByIdAndUpdate(
            id,
            {
                eventName,
                eventType,
                description,
                organizerName,
                email,
                phone,
                playgroundType,
                expectedAttendees,
                eventDate,
                startTime,
                endTime,
                specialRequirement
            },
            { new: true } // return updated doc
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Update failed" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
};

// DELETE user by ID
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    let user;

    try {
        user = await User.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Delete failed" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted", user });
};

// PATCH update booking status + send email
const updateBookingStatus = async (req, res, next) => {
    const id = req.params.id;
    const { approve, reject, comment } = req.body;

    let user;
    try {
        user = await User.findByIdAndUpdate(
            id,
            {
                approve,
                reject,
                comment,
                statusUpdatedAt: new Date()
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Determine booking status
        let status = null;
        if (approve === true) status = "Approved";
        else if (reject === true) status = "Rejected";

        if (status) {
            const subject = `Your booking is ${status}`;
            const message = `Hello ${user.organizerName},\n\nYour booking for "${user.eventName}" has been ${status}.\n\nThank you.`;

            try {
                await sendEmail(user.email, subject, message);
                console.log("✅ Email sent to user.");
            } catch (emailErr) {
                console.error("❌ Failed to send email:", emailErr);
            }
        }

        return res.status(200).json({
            message: "Booking status updated successfully",
            data: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update booking status",
            error: error.message
        });
    }
};

// Exporting all controllers
exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.updateBookingStatus = updateBookingStatus;
