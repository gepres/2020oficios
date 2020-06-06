const Sequelize = require('sequelize');
const db = require('../database');
const bcrypt = require('bcrypt');

const Usuarios = db.define('usuarios', {
  id: {
      type: Sequelize.INTEGER, 
      primaryKey: true,
      autoIncrement: true
  },
  nombres: Sequelize.STRING(60),
  apellidos:Sequelize.STRING(60),
  sexo:Sequelize.STRING(60),
  edad:Sequelize.INTEGER,
  fecha_nacimiento:Sequelize.DATEONLY,
  telefono:Sequelize.STRING,
  celular:Sequelize.STRING,
  tipo_documento:Sequelize.STRING,
  num_documento:Sequelize.STRING,
  departamento:Sequelize.STRING,
  provincia:Sequelize.STRING,
  distrito:Sequelize.STRING,
  foto : Sequelize.STRING,
  foto_id:{
    type:Sequelize.STRING,
    unique:true
  },
  descripcion:Sequelize.TEXT,
  usuario:Sequelize.STRING,
  email: {
      type: Sequelize.STRING(30),
      allowNull: false, 
      validate: {
          isEmail: { msg : 'Agrega un correo válido'}
      },
      unique:true
  },
  password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate : {
        notEmpty : {
          msg : 'La contraseña no puede ir vacia'
        }
      }
  }, 
  id_estado : {
      type: Sequelize.INTEGER,
      defaultValue: 1
  },
  estado_registro : {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  tokenPassword : Sequelize.STRING, 
  expiraToken : Sequelize.DATE
}, {
  hooks: {
      beforeCreate(usuario) { 
          usuario.password = Usuarios.prototype.hashPassword(usuario.password);
      }
  }
});

// Método para comparar los password
Usuarios.prototype.validarPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}
Usuarios.prototype.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null );
}

module.exports = Usuarios;