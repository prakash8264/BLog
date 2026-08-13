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

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views")); 

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
    const allBlogs = (await Blog.find({}));
    return res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));