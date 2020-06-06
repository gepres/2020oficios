const Usuarios = require('../models/Usuarios')
const { check,body, validationResult } = require('express-validator');
module.exports = { 
  iniciarSeccion:async(req,res) => {
    // console.log(meetis)
    res.render('ingresar',{
      nombrePagina:'Ingresar',
    })
  },
  nuevaCuenta:async(req,res) => {
    // console.log(meetis)
    res.render('registro',{
      nombrePagina:'Registrate',
    })
  },
  registro:async(req,res) => {
    const usuario = req.body;
    // leer los errores de express
    const erroresExpress = validationResult(req)
    if (!erroresExpress.isEmpty()) {
      // si hay errores
      var errExp = erroresExpress.errors.map(err => err.msg);
      req.flash('error', errExp);
      res.redirect('/registro');
      return;
    }
    try {
      await Usuarios.create(usuario)

      req.flash('exito','Cuenta creada exitosamente.')
      res.redirect('/ingresar');
    } catch (error) {
      // hago este mensaje directo porque no me capta el mensaje de email unique
      req.flash('error', 'El correo ya existe');
      res.redirect('/registro');
    }
  },
  validarCuenta:[
    body('nombres').escape(),
    body('apellidos').escape(),
    body('password').escape(),
    body('confirmar').escape(),
    body('email').escape(),
    check('nombres', 'El nombre es obligatorio').notEmpty(),
    check('apellidos', 'El apellido es obligatorio').notEmpty(),
    check('email', 'El email es olbigatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('confirmar', 'La contraseña confirmada no puede ir vacio').notEmpty(),
    check('confirmar', 'La contraseña es diferente').custom((value, { req }) => value == req.body.password)
  ],
}