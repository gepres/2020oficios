const Usuarios = require('../models/Usuarios')
const Anuncios = require('../models/Anuncios')
const SubCategorias = require('../models/SubCategorias')
const { check,body, validationResult } = require('express-validator')
const  configuracionMulter = require('../middlewares/multer')
const  multer = require('multer')
const cloudinary = require('cloudinary')
const fs = require('fs-extra');

const upload = multer(configuracionMulter).single('imagen');

cloudinary.config({
  cloud_name: 'consurec',
  api_key: '879218859671595',
  api_secret: 'EG8Q32Fsrw8o5v1H1rknJNsDWCA'
})


module.exports = { 
  subirImagen:(req,res,next) => {
    upload(req,res, function(error){
      if(error){
        // console.log(error);
        if(error instanceof multer.MulterError){
          if(error.code === 'LIMIT_FILE_SIZE'){
            req.flash('error','El archivo es muy grande')
          }else{
            req.flash('error', error.message)
          }
        }else if(error.hasOwnProperty('message')){
         req.flash('error', error.message)
        }
        res.redirect('back')
        return;
      }else{
        next()
      }
    })
  },
  vistaPerfil:async(req,res) => {
    const usuario = await Usuarios.findOne({
      where:{
        id:req.params.id
      }
    })
    const anuncios = await Anuncios.findAll({
      where:{
        usuarioId:req.params.id
      },
      include:[
        {
          model:SubCategorias,
          attributes:['id','nombre']
        },
        {
          model:Usuarios,
          attributes:['id','nombres','apellidos']
        }
      ]
    })
    
    // console.log(usuario)
    res.render('perfil/perfil',{
      nombrePagina:'Perfil',
      user:usuario,
      anuncios
    })
  },
  vistaEditar:async(req,res) => {
    // console.log(meetis)
    const usuario = await Usuarios.findOne({
      where:{
        id:req.user.id
      }
    })


    res.render('perfil/perfil-editar',{
      nombrePagina:'Editar',
      user:usuario
    })
  },
  //post
  editar:async (req,res) => {
    const erroresExpress = validationResult(req)
    if (!erroresExpress.isEmpty()) {
      // si hay errores
      var errExp = erroresExpress.errors.map(err => err.msg);
      req.flash('error', errExp);
      res.redirect('back');
      return;
    }
    try {
      const usuario = await Usuarios.findByPk(req.user.id);
      const {nombres,apellidos,genero,fecha_nacimiento, tipo_documento, num_documento, telefono, celular} = req.body;
      // asignar los valores
      usuario.nombres = nombres
      usuario.apellidos = apellidos
      usuario.sexo = genero
      usuario.fecha_nacimiento = fecha_nacimiento
      usuario.tipo_documento = tipo_documento
      usuario.num_documento = num_documento
      usuario.telefono = telefono
      usuario.celular = celular
      
      await usuario.save(req.body)
      req.flash('exito','Cambios Guardados Correctamente')
      res.redirect('back')
    } catch (error) {
      console.log(error);
      
    }
    
  },
  editarDesc:async (req,res) => {
    const usuario = await Usuarios.findByPk(req.user.id);
    const {descripcion} = req.body;
    usuario.descripcion = descripcion
    await usuario.save(req.body)
    req.flash('exito','Cambios Guardados Correctamente')
    res.redirect('back')
  },
  editarphoto:async (req,res) => {
    const usuario = await Usuarios.findByPk(req.user.id);
    const result = await cloudinary.v2.uploader.upload(req.file.path,{
      folder: '2020oficios/perfiles'
    });  
    if(req.file && usuario.foto){
      await cloudinary.v2.uploader.destroy(usuario.foto_id)
    }
    if(req.file){
      usuario.foto = result.url;
      usuario.foto_id = result.public_id
    }
    await usuario.save()
    await fs.unlink(req.file.path)
    req.flash('exito','Cambios almacenados Correctamente')
    res.redirect('back')
    //     console.log(req.file.path);
    // console.log(req.file.filename);
  },
  validarPerfil:[
    body('nombres').escape(),
    body('apellidos').escape(),
    check('nombres', 'Los nombres son obligatorios').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
  ]
}