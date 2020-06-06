const Sequelize = require('sequelize');
const db = require('../database');

const Ubigeo = db.define('ubigeo', {
  id: {
      type: Sequelize.INTEGER, 
      primaryKey: true,
      autoIncrement: true
  },
  ubigeo: Sequelize.STRING(60),
  id_departamento: Sequelize.STRING(60),
  departamento: Sequelize.STRING(60),
  id_provincia: Sequelize.STRING(60),
  provincia: Sequelize.STRING(60),
  id_distrito: Sequelize.STRING(60),
  distrito: Sequelize.STRING(60),
  poblacion: Sequelize.STRING(60),
  superficie: Sequelize.STRING(60),
  latitud: Sequelize.STRING(60),
  longitud: Sequelize.STRING(60)
});


module.exports = Ubigeo;