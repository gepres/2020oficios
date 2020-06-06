const Sequelize = require('sequelize');
const Categorias = require('./Categorias')
const db = require('../database');

const SubCategorias = db.define('subcategorias', {
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
SubCategorias.belongsTo(Categorias);

module.exports = SubCategorias;