const express = require('express')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./middlewares/passport')

// Initializations
const app = express()
require('./database');

// modelos
require('./models/Usuarios')
require('./models/Anuncios')
require('./models/Categorias')
require('./models/SubCategorias')
require('./models/Ubigeo')

// settings
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '0.0.0.0');

// static files & views engine || en handlebars se puede poner al ultimo pero  ejs antes de routes
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'))




// MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(session({
  secret: 'clavesecreta',
  key:'clavesecreta',
  resave:false,
  saveUninitialized:false
}))
// agregar flash messages
app.use(flash())
// middleware (usuario logueo,flash messages,fecha actual)
app.use((req,res,next) => {
  res.locals.usuario = {...req.session.passport} || null;
  res.locals.mensajes = req.flash()
  const fecha = new Date();
  res.locals.year = fecha.getFullYear()
  next()
})
app.use(passport.initialize());
app.use(passport.session());
 

// routes
app.use('/',require('./routes'));


module.exports = app;
