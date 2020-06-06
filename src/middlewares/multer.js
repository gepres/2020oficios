const  multer = require('multer')
const shortid = require('shortid')

const configuracionMulter = {
  limits:{fileSize:2000000},
  storage: multer.diskStorage({
    destination:'uploads',
    filename: (req,file,next) => {
      const extension = file.mimetype.split('/')[1];
      next(null,`${shortid.generate()}.${extension}`)
    }
  }),
  fileFilter(req,file,cb){
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      // el callback se ejecuta como true o false | true cuando la imagen se acepta
      cb(null,true)
    }else{
      cb(new Error('Ese formato no es valido'),false)
    }
  }
}

module.exports = configuracionMulter;