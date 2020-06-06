const Sequelize = require('sequelize');

const db = new Sequelize('heroku_5fe155c1a40b2c2','b8802bbb5204a5', 'ba8f3b87', {
  host:'us-cdbr-iron-east-01.cleardb.net',
  dialect: 'mysql',
  pool:{
    max:5,
    min:0,
    acquire:3000,
    idle:10000
  },
  logging:false
  // define:{
  //   timestamps:false
  // }
});

db.sync().then(() => console.log('La conexión de la DB se ha establecido con éxito.')).catch(err => {console.error('No se puede conectar a la DB:', err)})


module.exports = db;