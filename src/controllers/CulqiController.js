const Culqi = require('culqi-node');
 
const culqi = new Culqi('pk_test_Ehvb92hRMoXeMpFR', 'sk_test_7TV0zC1OTqhdPkBQ');

module.exports = { 
  obtenerDatos:(req,res,next) => {
    console.log(req.user);
    
  },
}