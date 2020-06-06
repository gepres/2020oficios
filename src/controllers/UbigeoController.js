const Ubigeo = require('../models/Ubigeo')

module.exports = { 
  list:async(req,res) => {
    const ubigeos = await Ubigeo.findAll()
    res.json(ubigeos)
  }
}