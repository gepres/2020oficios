const Anuncios = require('../models/Anuncios')
const Usuarios = require('../models/Usuarios')
const SubCategorias = require('../models/SubCategorias')

module.exports = { 
  home:async(req,res) => {
    const anuncios = await Anuncios.findAll({
      order:[
        ['createdAt','DESC'],
      ],
      include:[
        {
          model:SubCategorias,
          attributes:['id','nombre']
        },
        {
          model:Usuarios,
          attributes:['id','nombres','apellidos']
        }
      ],
      limit: 4
    })

    res.render('home',{
      nombrePagina:'Inicio',
      anuncios
    })
  }
}