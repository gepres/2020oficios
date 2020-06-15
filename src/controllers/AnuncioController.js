const Categorias = require('../models/Categorias')
const Anuncios = require('../models/Anuncios')
const SubCategorias = require('../models/SubCategorias')
const Usuarios = require('../models/Usuarios')
const { check,body, validationResult } = require('express-validator')
const  configuracionMulter = require('../middlewares/multer')
const  multer = require('multer')
const cloudinary = require('cloudinary')
const fs = require('fs-extra');
const Culqi = require('culqi-node');
const culqi = new Culqi(process.env.CODIGO_COMERCIO_CULQI, process.env.LLAVE_COMERCIO_CULQI);


const upload = multer(configuracionMulter).single('imagen');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = { 
  subirImagen:(req,res,next) => {
    upload(req,res, function(error){
      if(req.file){
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
      }else{
        req.flash('error', 'La imagen es obligatoria')
        res.redirect('back')
        return;
      }
    })
  },
  subirImagenUpdate:(req,res,next) => {
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
  formAnuncio:async(req,res) => {
    // console.log(req.user);
    const datosUser = {
      id : req.user.id,
      nombres : req.user.nombres,
      apellidos  : req.user.apellidos,
      num_documento : req.user.num_documento,
      email : req.user.email,
      currency : "PEN",
      codigo_culqi : process.env.CODIGO_COMERCIO_CULQI
    }

    const categorias = await Categorias.findAll()
    const subcategorias = await SubCategorias.findAll()
    // console.log(meetis)
    res.render('publicar-anuncio',{
      nombrePagina:'Anuncio',
      categorias,
      subcategorias,
      datosUser
    })
  },
  addAnuncio:async (req,res) => {
    const anuncio = req.body;
    const erroresExpress = validationResult(req)
    if (!erroresExpress.isEmpty()) {
      // si hay errores
      var errExp = erroresExpress.errors.map(err => err.msg);
      req.flash('error', errExp);
      // res.redirect('back');
      return;
    }
      try {
        anuncio.usuarioId = req.user.id
        anuncio.likes = '0' 
        // anuncio.likes = '[]' 
        const resultado = await cloudinary.v2.uploader.upload(req.file.path,{
          folder: '2020oficios/anuncios'
        });
        // leer la imagen
        if(req.file){
          anuncio.foto = resultado.url;
          anuncio.foto_id = resultado.public_id
        }
        // almacenar en la base de datos
        await fs.unlink(req.file.path)
        await Anuncios.create(anuncio)
        req.flash('exito','Se ha anuncio  Correctamente')
        res.redirect('/panel')
      } catch (error) {
        console.log(error);
        
      }
  },
  queryAnuncio:async(req,res) => {
    const anuncio = await Anuncios.findOne({
      where:{
        id:req.params.id
      }
    })
    res.status(200).json(anuncio)
  },
  addLikes:async(req,res) => {
    const anuncio = await Anuncios.findOne({where:{id:req.params.id}})
    try {
      const {likes} = req.body 
      anuncio.likes= likes;
      await anuncio.save()
      req.flash('exito','Anuncio guardado')
      res.redirect('back')
    } catch (error) {
      console.log(error);
      
    }
  },
  vistaAnuncio:async(req,res) => {

    const anuncio = await Anuncios.findOne({
      where:{
        id:req.params.id
      },
      include:[
        {
          model:SubCategorias,
          attributes:['id','nombre']
        },
        {
          model:Usuarios,
          attributes:['id','nombres', 'apellidos','foto']
        }
      ]
    })

    res.render('mostrar-oficio',{
      nombrePagina:anuncio.titulo,
      anuncio
    })
  },
  vistaEditarAnuncio:async(req,res) => {
    const categorias = await Categorias.findAll()
    const subcategorias = await SubCategorias.findAll()
    const anuncio = await Anuncios.findOne({
      where:{
        id:req.params.id,
        usuarioId:req.user.id
      },
      include:[
        {
          model:SubCategorias,
          attributes:['id','nombre']
        },
        {
          model:Usuarios,
          attributes:['id','nombres', 'apellidos','foto']
        }
      ]
    })
    if(!anuncio){
      req.flash('error','Operación no válida')
      res.redirect('/panel')
      return next()
    }

    res.render('editar-anuncio',{
      nombrePagina:'Editar Anuncio',
      anuncio,
      categorias,
      subcategorias
    })
  },
  actualizarAnuncio:async(req,res) => {
    // console.log(req.body);
    const anuncio = await Anuncios.findOne({where:{id:req.params.id,usuarioId:req.user.id}})
    const erroresExpress = validationResult(req)
    if (!erroresExpress.isEmpty()) {
      // si hay errores
      var errExp = erroresExpress.errors.map(err => err.msg);
      req.flash('error', errExp);
      res.redirect('back');
      return;
    }
    if(!anuncio){
      req.flash('error','Operación no válida')
      res.redirect('/panel')
      return next()
    }
    try {
      const {categoriaId,subcategoriaId,departamento,provincia,distrito,titulo,experiencia,telefono,email,descripcion} = req.body;
      anuncio.categoriaId= categoriaId;
      anuncio.subcategoriaId = subcategoriaId;
      anuncio.departamento =departamento;
      anuncio.provincia = provincia;
      anuncio.distrito= distrito;
      anuncio.titulo= titulo;
      anuncio.experiencia= experiencia;
      anuncio.telefono= telefono;
      anuncio.email= email;
      anuncio.descripcion= descripcion;

      // si hay imagen anterior y nueva
      if(req.file){
        await cloudinary.v2.uploader.destroy(anuncio.foto_id)
        const resultado = await cloudinary.v2.uploader.upload(req.file.path,{
          folder: '2020oficios/anuncios'
        });
        anuncio.foto = resultado.url;
        anuncio.foto_id = resultado.public_id
        await fs.unlink(req.file.path)
      }
      // guardar en la DB
      await anuncio.save()
      req.flash('exito','Cambios almacenados Correctamente')
      res.redirect('/panel')
    } catch (error) {
      console.log(error);
      
    }
    
  },
  validarAnuncio:[
    body('titulo').escape(),
    body('experiencia').escape(),
    body('telefono').escape(),
    check('categoriaId', 'La categoria es obligatoria').not().isEmpty(),
    check('subcategoriaId', 'La sub categoria es obligatoria').not().isEmpty(),
    check('titulo', 'El titulo son obligatorio').not().isEmpty(),
    check('experiencia', 'La experiencia es obligatoria').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('departamento', 'El departamento es obligatorio').not().isEmpty(),
    check('provincia', 'La provincia es obligatoria').not().isEmpty(),
    check('distrito', 'El distrito es obligatorio').not().isEmpty(),
  ],
  validarEditarAnuncio:[
    body('titulo').escape(),
    body('experiencia').escape(),
    body('telefono').escape(),
    check('categoriaId', 'La categoria es obligatoria').not().isEmpty(),
    check('subcategoriaId', 'La sub categoria es obligatoria').not().isEmpty(),
    check('titulo', 'El titulo son obligatorio').not().isEmpty(),
    check('experiencia', 'La experiencia es obligatoria').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty()
  ]
}