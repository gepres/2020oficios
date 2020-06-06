const Categorias = require('../models/Categorias')
const SubCategorias = require('../models/SubCategorias')

module.exports = { 
  add:async(req,res) => {
    try {
      const categoria = req.body
      await Categorias.create(categoria)
      res.json('Categoria creada')
    } catch (error) {
      console.log(error)
    }
  },
  list:async(req,res) => {
    const categorias = await Categorias.findAll()
    res.json(categorias)
  },
  addSubCategoria:async(req,res) => {
    try {
      const subcategoria = req.body
      await SubCategorias.create(subcategoria)
      res.json('sub categoria creada')
    } catch (error) {
      console.log(error)
    }
  },
  listSubCategoria:async(req,res) => {
    const subcategorias = await SubCategorias.findAll()
    res.json(subcategorias)
  },
  querySubCategoria:async(req,res) => {
    const subcategorias = await SubCategorias.findAll({
      where: {
        categoriaId : req.params.id,
      }
    })
    res.json(subcategorias)
  },
}