const express = require('express');
const router = express.Router();
// controladores
const homeController = require('../controllers/HomeController')
const BusquedaController = require('../controllers/BusquedaController')
const perfilController = require('../controllers/PerfilController')
const panelController = require('../controllers/PanelController')
const usuarioController = require('../controllers/UsuarioController')
const anuncioController = require('../controllers/AnuncioController')
const categoriaController = require('../controllers/CategoriaController')
const ubigeoController = require('../controllers/UbigeoController')
const authController = require('../controllers/AuthController')

/* AREA PUBLICA */

// home
router.get('/',homeController.home)


//busqueda
router.get('/busqueda/:page',BusquedaController.vistaBusqueda)
router.get('/busquedaAll/:page',BusquedaController.vistaBusquedaAll)
router.get('/api/busquedaAll',BusquedaController.BusquedaAll)


// auth
router.get('/ingresar',usuarioController.iniciarSeccion)
router.post('/ingresar',authController.autenticarUsuario)
router.get('/registro',usuarioController.nuevaCuenta)

// cerrar sesion
router.get('/cerrar-sesion',authController.UsuarioAutenticado, authController.cerrarSesion)
router.post('/api/usuario/registro',usuarioController.validarCuenta,usuarioController.registro)

// perfil
router.get('/perfil/:id',perfilController.vistaPerfil)

router.get('/perfil-editar',
  authController.UsuarioAutenticado,
  perfilController.vistaEditar)

router.post('/perfil-editar',
  authController.UsuarioAutenticado,
  perfilController.validarPerfil,
  perfilController.editar)

router.post('/perfil-editardescr',
  authController.UsuarioAutenticado,
  perfilController.editarDesc)

router.post('/perfil-imagen',authController.UsuarioAutenticado,perfilController.subirImagen, perfilController.editarphoto)

// panel
router.get('/panel',authController.UsuarioAutenticado,panelController.vistaPanel)

// anuncios
router.get('/publicar',authController.UsuarioAutenticado,anuncioController.formAnuncio)
router.post('/publicar-anuncio',
authController.UsuarioAutenticado,
anuncioController.subirImagen,
anuncioController.validarAnuncio ,
anuncioController.addAnuncio)
router.get('/anuncios/:id',anuncioController.vistaAnuncio)
router.get('/api/anuncios/:id',anuncioController.queryAnuncio)
router.post('/api/anunciosLikes/:id',anuncioController.addLikes)


router.get('/editar-anuncio/:id',authController.UsuarioAutenticado,anuncioController.vistaEditarAnuncio)
router.post('/editar-anuncio/:id',authController.UsuarioAutenticado,
anuncioController.subirImagenUpdate,
anuncioController.validarEditarAnuncio,
anuncioController.actualizarAnuncio)

// categoria api
router.post('/api/categoria',categoriaController.add)
router.get('/api/categoria',categoriaController.list)
router.post('/api/subcategoria',categoriaController.addSubCategoria)
router.get('/api/subcategoria',categoriaController.listSubCategoria)
router.get('/api/subcategoria/:id',categoriaController.querySubCategoria)

// ubigeo
router.get('/api/ubigeo',ubigeoController.list)

module.exports = router; 