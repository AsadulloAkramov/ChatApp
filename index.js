if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cookieParser = require('cookie-parser');

// Routes
const indexRoute = require('./routes/index');
const userRoute = require('./routes/users');
const currentUser = require('./middlewares/currentUser');


// const authenticationRoute = require('./routes/auth');


// Connection to mongoose
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to mongoose"));


// General settings our apps
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

//Middleware
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(cookieParser());


app.use('*' , currentUser);
app.use('/', indexRoute);
app.use('/api/users' , userRoute);   
// app.use('/api/auth' , authenticationRoute);


// Socket
io.on("connection" ,(socket)=>{
    socket.on('newuser' , (username)=>{
        socket.broadcast.emit('update' , username +"joined the conversation");
    })
    socket.on('existuser' ,(username)=>{
        socket.broadcast.emit('update' , username +"left the conversation");
    })
    socket.on('chat' ,(message)=>[
        socket.broadcast.emit('chat' , message)
    ])
})

//Listen port
server.listen(process.env.PORT || 3000)