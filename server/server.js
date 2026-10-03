const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require('./routes/PostRoutes');
const app = express();
const tagRoutes = require("./routes/TagRoutes");
const userRoutes = require("./routes/userRoutes");
const {
    notFound,
    errorHandler,
} = require("./middleware/errorMiddleware");
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);
app.get("/" , (req, res) => {
    res.json({
        message: "Hashnode Platform API is rumming"
    });
});
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});