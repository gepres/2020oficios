$(function() {
  crear_cargo();
});

var varglobal;

function crear_cargo() {
  var iduser = $("#iduser").val();
  var codigo_culqi = $("#codigo_culqi").val();
  
  $.ajax({
            url: 'https://programadoreshuacho1.000webhostapp.com/culqi/api/create',
            type: 'POST',
            data: {
              iduser: iduser,
              codigo_culqi:codigo_culqi,
            },
            dataType: "json",
            beforeSend: function () {
                    $('#loadingbtnProcesoPago').show();
                    $("#tipoPago").attr("disabled", true);
                },
            success: function (resp) {
              varglobal=resp; 
              $("#tipoPago").attr("disabled", false);
              $('#loadingbtnProcesoPago').css('display','none');            
            }
        })
}

$('#pagoAnuncio').on('submit', function(e) {

  
  Culqi.publicKey = 'pk_test_Ehvb92hRMoXeMpFR';
  //Culqi.open();
  Culqi.init(); 
      // Crea el objeto Token con Culqi JS
    e.preventDefault();
    Culqi.createToken();
      
});

function culqi(){ 
  
  c_nt=$('#cc-number').val().replace(/[#_-]/g,'');
  c_ma=$("#cc-exp").val();
  c_c=$("#x_card_code").val();
  c_ce=$("#x_zip").val();
  monto = $("#amount").val();
  iduser = $("#iduser").val();
  if (Culqi.token) {
    var token=Culqi.token.id;
    var email=c_ce;
    //Culqi.close();
    $.ajax({
            url: 'https://programadoreshuacho1.000webhostapp.com/culqi/api/process',
            type: 'POST',
            data: {
              producto: $("#plan").val(),
              precio:monto*100,
              token:token,
              currency:varglobal.currency,
              cce:email,
              nt:c_nt,
              ma:c_ma,
              c:c_c,
              tipopago:'Anuncio',
              tiempomes:$("#tiempo_mes").val(),
              iduser:iduser,
            },
            dataType: "json",
            success: function (resp) {  
             
              if(resp.object!="error"){
                /*PLAN ELEGIDO*/
                var plan='<span href="#" class=""> '+
                            '<div class="content-plan">'+
                              '<span>'+$("#plan").val()+'</span>'+
                              '<span><sup>S/.</sup>'+monto+'.00</span>'+
                              '<span>Mensual</span>'+
                              '<span> '+$("#tiempo_mes").val()+' meses</span>'+
                            '</div>'+
                          '</span>';
                $("#planPagado").html(plan);
                $("#idpago").val(resp.idpago);
                document.getElementById('planPagado').style.display = '';
                document.getElementById('tipoPago').style.display = 'none';
                document.getElementById('btnpublicar').style.display = '';
                
                /*DATOS PARA MODAL*/
                $('#payment-button-amount').show();
                $("#payment-button").attr("disabled", true);
                document.getElementById('loadingbtnPagar').style.display = 'none';
                document.getElementById('msgAlerta').style.display = 'none';
                var mensaje='<div class="alert alert-success" role="alert"><strong>'+resp.user_message+'</strong></div>';
                $("#msgAlerta").html(mensaje);
                document.getElementById('msgAlerta').style.display = '';

                setTimeout(() =>{
                  $('#culqiModal').modal('hide')
                  $('#publicarModal').modal('show')
                },1500)
               
                 
              }else{
                var mensaje='<div class="alert alert-danger" role="alert"><strong>'+resp.user_message+'</strong></div>';
                $("#msgAlerta").html(mensaje);
                document.getElementById('msgAlerta').style.display = '';
                $('#payment-button-amount').show(); 
                $("#payment-button").attr("disabled", false);
                document.getElementById('loadingbtnPagar').style.display = 'none';
              }             
            }
        })


  }else{
    alerta("TOKEN NO GENERADO");
  }
}

//VALIDACION DE CAMPOS DE CULQI
$("#payment-button").click(function(e) {  
      var form = $(this).parents('form');
      
      var plan =$("#planSelect").val();
      var x_zip = $('#x_zip').val();
      var cvv = $('#x_card_code').val();
      var montoplan=$("#amount").val();
      var regCVV = /^[0-9]{3,4}$/;
      var CardNo = $('#cc-number').val().replace(/[#_-]/g,'');
      var regCardNo = /^[0-9]{12,20}$/;
      var date = $('#cc-exp').val().split('/');
      var regMonth = /^01|02|03|04|05|06|07|08|09|10|11|12$/;
      var regYear = /^20|21|22|23|24|25|26|27|28|29|30|31$/;
      var email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      
      if (form[0].checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
      }
      else {
        e.preventDefault();
         if (!regCardNo.test(CardNo) || CardNo =="") {
          $("#cc-number").addClass('required');
          $("#cc-number").focus();
          alert(" Enter a valid 12 to 16 card number")
          return false;    
        }
        else if (!regCVV.test(cvv)) {
         
          $("#x_card_code").addClass('required');
          $("#x_card_code").focus();
          alert(" Enter a valid CVV");
          return false;
        }
        else if (!regMonth.test(date[0]) && !regMonth.test(date[1]) ) {
         
          $("#cc_exp").addClass('required');
          $("#cc_exp").focus();
          alert(" Enter a valid exp date");
          return false;
        }  
        else if (!email.test(x_zip)){
          $("#x_zip").addClass('required');
            $("#x_zip").focus();
            alert(" Enter a valid Email");
            return false;
        }else if (plan=="" || plan==null){
          $("#planSelect").addClass('required');
            alert("Seleccione un Plan");
            return false;
        }else if (montoplan==0 || montoplan==null){
            var factplan='<div class="alert alert-warning" role="alert"><strong>Seleccione un Plan</strong></div>';
            $("#msgAlerta").html(factplan);
            return false;
        }else{
          $('#payment-button-amount').hide();
      $("#payment-button").attr("disabled", true);
        document.getElementById('loadingbtnPagar').style.display = '';

          var formulario = document.getElementById("pagoAnuncio");
          var emailculqui='<input type="hidden" size="50" data-culqi="card[email]" id="card[email]" value="'+x_zip+'">';
          var cardculqui='<input type="hidden" size="20" data-culqi="card[number]" id="card[number]" value="'+CardNo+'">';
          var cvvculqui='<input type="hidden" size="4" data-culqi="card[cvv]" id="card[cvv]" value="'+cvv+'">';
          var montculqui='<input type="hidden" size="2" data-culqi="card[exp_month]" id="card[exp_month]" value="'+(date[0]*1)+'">';
          var yearculqui='<input type="hidden" size="4" data-culqi="card[exp_year]" id="card[exp_year]" value="'+date[1].trim()+'">';
          $("#formCulqui").html(emailculqui+cardculqui+cvvculqui+montculqui+yearculqui);
          //formulario.submit();
          $("#btn_pagar").click();
        }
        // form.submit();
      }
      
      form.addClass('was-validated');
});

//CAPTURA PLAN
$('#planSelect').on('change', function(){
  var plan = $("#planSelect").val();
  var soles, mes;
  
  switch(plan) {
    case 'plan-1':
      soles = 7;
      mes = 3;
      break;
    case 'plan-2':
      soles = 6;
      mes = 6;
      break;
    case 'plan-3':
      soles = 5;
      mes = 9;
      break;
    case 'plan-4':
      soles = 4;
      mes = 12;
      break;
    default:
    }
    $("#amount").val(soles);
    $("#plan").val(plan);
    $("#tiempo_mes").val(mes);

});

