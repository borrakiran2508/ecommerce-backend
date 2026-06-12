const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware 

app.use(express.json());
app.use(
  cors({
    origin: "shopify-ecommerce-d71c04.netlify.app",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


//server
const PORT = 5000;
app.listen(process.env.PORT, () => console.log(`Server running on port ${PORT}`));