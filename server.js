const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const cors = require("cors");
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());


app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('============== Prueba variables de entorno =============')
console.log(process.env.MONGO_URL, process.env.FRONT_END_URL)
console.log('======================================================')