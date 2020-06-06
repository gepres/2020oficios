const passport = require('passport')

module.exports = { 
  autenticarUsuario:passport.authenticate('local',{
    successRedirect:'/panel',
    failureRedirect:'/ingresar',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios'
  }),
  // revisa si el usuario esta autenticado
  UsuarioAutenticado:(req,res,next) => {
    // si eL usuario esta autenticado
    if(req.isAuthenticated()){
      return next();
    }
    // sino esta autenticado
    return res.redirect('/ingresar')
  },
  cerrarSesion:(req,res,next)=>{
    req.logout()
    req.flash('exito','Cerraste Sesión Correctamente')
    res.redirect('ingresar')
    next()
  }
}