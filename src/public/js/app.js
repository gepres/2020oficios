require('../scss/main.scss')
import axios from 'axios'
//import './culqi'

// menu 
const menuToggle = document.getElementById('menu-toggle');
const menuBtnToggle = document.getElementById('menu-btn-toggle');
const smMenu = document.getElementById('smSider');
const overlay  = document.getElementById('overlay');
const wrapper = document.getElementById('wrapper');

if(menuToggle){
  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.toggle('toggled');
    overlay.classList.toggle('overlay')
  })
}
menuBtnToggle.addEventListener('click', (e) => {
  e.preventDefault();
  wrapper.classList.toggle('toggled');
  overlay.classList.toggle('overlay')
})
smMenu.addEventListener('click', (e) => {
  e.preventDefault();
  wrapper.classList.toggle('toggled');
  overlay.classList.toggle('overlay')
})



// editar perfil
const imageProfile = document.getElementById('imageProfile')
if(imageProfile){
  imageProfile.addEventListener('change', e => {
    if(imageProfile.files[0].name !== ''){
      document.forms["formphotoperfil"].submit();
    }
  })
}

// busqueda home
const inputBH = document.getElementById('inputBH')
const btniInputBH = document.getElementById('btniInputBH')
if(btniInputBH){
  btniInputBH.addEventListener('click',e => {
    location.href = `/busqueda/1?consulta=${inputBH.value}`
  })
}

// busqueda en la vista busqueda
const inputVbLugar = document.getElementById('inputVbLugar')
const inputVbExperiencia = document.getElementById('inputVbExperiencia')
const btnVb = document.getElementById('btnVb')
if(btnVb){
  btnVb.addEventListener('click',e => {
    location.href = `/busqueda/1?consulta=&lugar=${inputVbLugar.value}&exp=${inputVbExperiencia.value}`
  })
}


// categoria anuncio
const categoriaAnuncio = document.getElementById('categoriaAnuncio')
const subcategoriaAnuncio = document.getElementById('subcategoriaAnuncio')

if(categoriaAnuncio){
  categoriaAnuncio.addEventListener('change', () => {
  axios.get(`/api/subcategoria/${categoriaAnuncio.value}`)
    .then(res => {
      const datos = res.data
      subcategoriaAnuncio.innerHTML = ''
      datos.forEach(e => {
        const el = document.createElement("option");
        el.textContent = e.nombre;
        el.value = e.id;
        subcategoriaAnuncio.appendChild(el)
      })
    })
})
}


//ubigeo
const departamento = document.getElementById('departamento')
const provincia = document.getElementById('provincia')
const distrito = document.getElementById('distrito')

if(departamento){
axios.get(`/api/ubigeo`).then( res => {
  const ubigeos = res.data 
  // console.log(ubigeos);
    const departamentoArray = []
    ubigeos.forEach(e => {
       departamentoArray.push(e.departamento)
    })
    // console.log(departamentoArray);
    let unique = [...new Set(departamentoArray)];
    unique.forEach(e => {
      const el = document.createElement("option");
      el.textContent = e;
      el.value = e;
      departamento.appendChild(el)
    })
    departamento.addEventListener('change', e => {
      e.target.value
      var provinciaArray = ubigeos.filter(function (el) {
        return el.departamento === e.target.value
      });
      
      const provinciaArray2 = []
      provinciaArray.forEach(e => {
        provinciaArray2.push(e.provincia)
      })
      let uniqueProv = [...new Set(provinciaArray2)];
      provincia.innerHTML = '<option selected value="">Seleccione</option>'
      uniqueProv.forEach(e => {
        const el = document.createElement("option");
        el.textContent = e;
        el.value = e;
        provincia.appendChild(el)
      })

    })
    provincia.addEventListener('change', e => {
      e.target.value
      // console.log(e.target.value);
      var distritoArray = ubigeos.filter(function (el) {
        return el.provincia === e.target.value
      });
      const distritoArray2 = []
      distritoArray.forEach(e => {
        distritoArray2.push(e.distrito)
      })
      let uniqueDis = [...new Set(distritoArray2)];
      distrito.innerHTML = '<option selected disabled value="">Seleccione</option>'
      uniqueDis.forEach(e => {
        const el = document.createElement("option");
        el.textContent = e;
        el.value = e;
        distrito.appendChild(el)
      })
    })
    
})

}


// imagen publicar anuncio
function showImage(src, target) {
  const fr = new FileReader();
  fr.onload = function(){
      target.src = fr.result;
  }
  fr.readAsDataURL(src.files[0]);
}
const imagespublicar = document.getElementById('imagespublicar')
const imageAnuncio = document.getElementById('imageAnuncio')

if(imagespublicar){
  imagespublicar.addEventListener('change', e => {
    showImage(imagespublicar,imageAnuncio)
  })
}


// culqui pago

import MaskInput from 'mask-input';

const ccNumber = document.querySelector('.cc-number')
if(ccNumber){
  const maskInput = new MaskInput(document.querySelector('.cc-number'), {
  mask: '0000-0000-0000-0000',
  alwaysShowMask: true,
  maskChar: '_',
  });
  const expiredInput = new MaskInput(document.querySelector('.cc-exp'), {
    mask: '00/0000',
    alwaysShowMask: true,
    maskChar: '_',
  });
}

// maskInput.setProps({ mask: '0000-0000' });
// expiredInput.setProps({ mask: '0000-0000' });


// like Anuncio

const moLike = document.getElementById('moLike')
const moUnlike = document.getElementById('moUnlike')
const moSpinner = document.getElementById('moSpinner')
if(moLike){
  const idpost = document.getElementById('idpost').value
  const iduser = document.getElementById('iduser').value
  moLike.addEventListener('click',  () => {
    moLike.classList.add('display-mo-none')
    moSpinner.classList.remove('display-mo-none')

     axios.get(`/api/anuncios/${idpost}`).then( res => {
      const likes = res.data.likes
      console.log('cangando');
      const likesArray = likes.split(',')
      // console.log(likesArray);
      likesArray.push(iduser)
      console.log(likesArray);
      const addLikesString = likesArray.toString()
      const datos = {
        likes:addLikesString
      }
      axios.post(`/api/anunciosLikes/${idpost}`,datos).then(res => {
        // moLike.classList.remove('display-mo-none')
        // moSpinner.classList.add('display-mo-none')
        console.log('listo');
        location.reload();
      })
    })
  })
}


if(moUnlike){
  const idpost = document.getElementById('idpost').value
  const iduser = document.getElementById('iduser').value
  moUnlike.addEventListener('click',  () => {
    moUnlike.classList.add('display-mo-none')
    moSpinner.classList.remove('display-mo-none')

    axios.get(`/api/anuncios/${idpost}`).then( res => {
      const likes = res.data.likes
      console.log('cangando');
      const likesArray = likes.split(',')
      // console.log(likesArray);
      const index = likesArray.indexOf(iduser);
      if (index > -1) {
        likesArray.splice(index, 1);
      }
      // console.log(likesArray);
      const addLikesString = likesArray.toString()
      // console.log(addLikesString);
      const datos = {
        likes:addLikesString
      }
      axios.post(`/api/anunciosLikes/${idpost}`,datos).then(res => {
        // moUnlike.classList.remove('display-mo-none')
        // moSpinner.classList.add('display-mo-none')
        console.log('listo');
        location.reload();
      })
    })   
  })
}


//  plan publicar 
const planSelect = document.getElementById('planSelect')
if(planSelect){
  const cpp = document.querySelector('.contentPublicar-plan').children
  planSelect.addEventListener('change', e => {
    const elem = e.target.value
    for (let i = 0; i < cpp.length; i++) {
      cpp[i].classList.remove("active-plan");
      const fc = cpp[i].classList
      for (let i = 0; i < fc.length; i++) {
        if(fc[i] === elem){
          const tab = document.querySelector(`.${elem}`)
          tab.classList.add('active-plan')
        }
      }
    }
  })
}


// validar publicar 
const btnpublicar = document.getElementById('btnpublicar')
if(btnpublicar){
  var forms = document.getElementsByClassName('needs-validation');
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}