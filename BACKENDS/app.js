//Password=jHtyQn6AxpiFv1yo

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");
const announcementRouter = require("./Routes/announcementRoutes");


const app = express();
const cors = require("cors");

//Middlewarecd
app.use(express.json());
app.use(cors());
app.use("/users",router);
app.use("/announcements", announcementRouter);

mongoose.connect("mongodb+srv://pasi:jHtyQn6AxpiFv1yo@cluster1.j5rzoa4.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=> {
    app.listen(5000);
})
.catch((err)=> console.log((err)));

