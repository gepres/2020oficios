const Anuncios = require('../models/Anuncios')
const Usuarios = require('../models/Usuarios')
const Categorias = require('../models/Categorias')
const SubCategorias = require('../models/SubCategorias')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = { 
  vistaBusqueda:async(req,res) => {
    let perPage = 6;
    let page = req.params.page || 1;
    // console.log(meetis)
    const {consulta,lugar,exp} = req.query

    const anunciosfiltro = await Anuncios.findAll({
      where: {
        departamento : { [Op.like] :  '%' + lugar + '%' },
        experiencia : { [Op.like] :  '%' + exp + '%' },
      },
      include: [{
          model: SubCategorias,
          attributes: ['id', 'nombre']
        },
        {
          model: Usuarios,
          attributes: ['id', 'nombres','apellidos' ,'foto']
        }
      ],
      limit: perPage,
      offset: (perPage * page) - perPage 
    });

    const anunciostitulo = await Anuncios.findAll({
      where: {
        titulo : { [Op.like] :  '%' + consulta + '%' }
      },
      include: [{
          model: SubCategorias,
          attributes: ['id', 'nombre']
        },
        {
          model: Usuarios,
          attributes: ['id', 'nombres','apellidos' ,'foto']
        }
      ],
      limit: perPage,
      offset: (perPage * page) - perPage 
    });
    const anunciosCategoria = await Anuncios.findAll({
      include: [{
          model: Categorias,
          where: {
            nombre : { [Op.like] :  '%' + consulta + '%' },
          },
          attributes: ['id', 'nombre']
        },
        {
          model: SubCategorias,
          attributes: ['id', 'nombre']
        },
        {
          model: Usuarios,
          attributes: ['id', 'nombres','apellidos' ,'foto']
        }
      ],
      limit: perPage,
      offset: (perPage * page) - perPage 
    });
    const anunciosSubCategoria = await Anuncios.findAll({
      include: [
        {
          model: SubCategorias,
          where: {
            nombre : { [Op.like] :  '%' + consulta + '%' },
          },
          attributes: ['id', 'nombre']
        },
        {
          model: Usuarios,
          attributes: ['id', 'nombres','apellidos' ,'foto']
        }
      ],
      limit: perPage,
      offset: (perPage * page) - perPage 
    });
    
    if(consulta !== ''){
      if(anunciostitulo.length < 1 ){
        if(anunciosCategoria.length < 1){
          return res.render('busqueda',{
            nombrePagina:'Busqueda',
            anuncios:anunciosSubCategoria,
            consulta,
            current:page,
            pages: Math.ceil(anunciosSubCategoria.length / perPage),
          })
        }else{
          return res.render('busqueda',{
            nombrePagina:'Busqueda',
            anuncios:anunciosCategoria,
            consulta,
            current:page,
            pages: Math.ceil(anunciosCategoria.length / perPage),
          })
        }
      }else{
        return res.render('busqueda',{
          nombrePagina:'Busqueda',
          anuncios:anunciostitulo,
          consulta,
          current:page,
      pages: Math.ceil(anunciostitulo.length / perPage),
        })
      }
    }else{
      return res.render('busqueda',{
        nombrePagina:'Busqueda',
        anuncios:anunciosfiltro,
        consulta:'filtro',
        current:page,
        pages: Math.ceil(anunciosfiltro.length / perPage),
      })
    }

  },
  vistaBusquedaAll:async(req,res) => {
    let perPage = 6;
    let page = req.params.page || 1;
    const anunciosall = await Anuncios.findAll({})
    const anuncios = await Anuncios.findAll({
      include: [{
          model: SubCategorias,
          attributes: ['id', 'nombre']
        },
        {
          model: Usuarios,
          attributes: ['id', 'nombres','apellidos' ,'foto']
        }
      ],
      limit: perPage,
      offset: (perPage * page) - perPage 
    });


    return res.render('busqueda',{
      nombrePagina:'Busqueda',
      anuncios,
      current:page,
      pages: Math.ceil(anunciosall.length / perPage),
      consulta:'todos'
    })
  },
  BusquedaAll:async(req,res) => {
    const anuncios = await Anuncios.findAll({
      include: [{
          model: SubCategorias,
          attributes: ['id', 'nombre']
        },
        {
          model: Usuarios,
          attributes: ['id', 'nombres','apellidos' ,'foto']
        }
      ]
    });
    return res.json(anuncios)
  }
}