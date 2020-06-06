const Sequelize = require('sequelize');
const Categorias = require('./Categorias')
const SubCategorias = require('./SubCategorias')
const Usuarios = require('./Usuarios')
const shortid = require('shortid')
const db = require('../database');


const Anuncios = db.define('anuncios', {
  id: {
      type: Sequelize.INTEGER, 
      primaryKey: true,
      autoIncrement: true
  },
  titulo: Sequelize.STRING(60),
  foto : Sequelize.STRING,
  foto_id:{
    type:Sequelize.STRING,
    unique:true
  },
  codigo:Sequelize.STRING,
  departamento:Sequelize.STRING,
  provincia:Sequelize.STRING,
  distrito:Sequelize.STRING,
  experiencia:Sequelize.STRING,
  telefono:Sequelize.STRING,
  email:Sequelize.STRING,
  descripcion:Sequelize.TEXT,
  likes: {
    type: Sequelize.STRING
  },
  idpago : {
    type: Sequelize.INTEGER,
  },
  id_estado : {
      type: Sequelize.INTEGER,
      defaultValue: 1
  },
}
);
Anuncios.addHook('afterCreate', async (anuncio, options) => {
  const fecha = new Date();
  const year = String(fecha.getFullYear());
  const mes = String(fecha.getMonth() + 1 );
  const dia = String(fecha.getDate()).padStart(2, '0')
  const codigo = String(year + mes + dia + anuncio.id)
  await Anuncios.update({ codigo}, {
    where: {
      id: anuncio.id
    },
    transaction: options.transaction
  });
});

Anuncios.belongsTo(Usuarios);
Anuncios.belongsTo(Categorias);
Anuncios.belongsTo(SubCategorias);

module.exports = Anuncios;