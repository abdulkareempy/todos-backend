const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const UserModel = require("./models/user")
// this MongoDBsession is a functions which requires a browser session as argument
const mongoDBSession = require("connect-mongodb-session")(session);

const mongoURI =
    "mongodb+srv://abdulkareemjs:kareem123@cluster0.gnieo.mongodb.net/todoApp?retryWrites=true&w=majority";

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((data) => {
        console.log("CONNECTED TO MONGODB");
    })
    .catch((err) => {
        console.log("oh no error while connecting mongoose");
        console.log(err);
    });

const store = new mongoDBSession({
    uri : mongoURI,
    collection:"mySessions"
})

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store:store
    })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    req.session.isAuth = true;
    // console.log(req.session.id);

    res.send("<h1>Welcome to our homepagee</h1>");
});

app.post("/register", async (req, res) => {
    const { name,email,password} = req.body;
    let user = await UserModel.findOne({email});

    if(user){
        return res.send("User alredy exists")
    }
    user = new UserModel({
        name,email,password
    })

    user.save().then(data=>{
        console.log("saved successfully")
        console.log(data)
    })

    res.send("<h1>registration successfully</h1>");
});

app.listen(3000, () => {
    console.log("serving at port 3000");
});
