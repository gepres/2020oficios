const Sequelize = require('sequelize');
const db = require('../database');

const Categorias = db.define('categorias', {
  id: {
      type: Sequelize.INTEGER, 
      primaryKey: true,
      autoIncrement: true
  },
  nombre: Sequelize.STRING(60),
  foto : Sequelize.STRING,
  foto_id:{
    type:Sequelize.STRING,
    unique:true
  },
  descripcion:Sequelize.TEXT,
  id_estado : {
      type: Sequelize.INTEGER,
      defaultValue: 1
  },
});


module.exports = Categorias;