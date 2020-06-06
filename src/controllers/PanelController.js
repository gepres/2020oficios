const Usuarios = require('../models/Usuarios')
const Anuncios = require('../models/Anuncios')
const SubCategorias = require('../models/SubCategorias')
const moment = require('moment')
module.exports = { 
  vistaPanel:async(req,res) => {
    const usuario = await Usuarios.findOne({
      where:{
        id:req.user.id
      }
    })
    const anuncios = await Anuncios.findAll({
      where:{
        usuarioId:req.user.id
      },
      include:[
        {
          model:SubCategorias,
          attributes:['id','nombre']
        }
      ]
    })

    const anunciosLike = await Anuncios.findAll({
      include:[
        {
          model:SubCategorias,
          attributes:['id','nombre']
        }
      ]
    })
    // console.log(anuncios);
    
    res.render('panel/index',{
      nombrePagina:'Panel',
      user:usuario,
      anuncios,
      moment,
      anunciosLike
    })
  }
}