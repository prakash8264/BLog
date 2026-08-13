require("dotenv").config();

const path = require("path");   
const express = require("express")
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')


const Blog = require('./models/blog.model.js')

const userRoute = require('./routes/user.route.js')
const blogRoute = require('./routes/blog.js')
const { checkForAuthenticationCookie } = require("./middlewares/authentication.js")

const app = express();
const PORT = process.env.PORT || 8000;

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/blogify';

mongoose.connect(MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views")); 

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        return res.render('home', {
            user: req.user,
            blogs: allBlogs,
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.render('home', {
            user: req.user,
            blogs: [],
            error: "Database connection error",
        });
    }
});

app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));