var app = {
  inicio: function() {

  //Esta función es la que utilizaremos si no podemos leer el acelerómetro, para que nos
  //notifique de que ha habido un error.
    function onError() {
        console.log('onError');
    }
 //Ests es la línea que más nos interesa, ya que es donde accedemos al acelerómetro  que es la 
 //funcionalidad que nos provee el plugin device-motion de cordova. Hoy en día se recomienda usar 
 //las API de Html 5 para estas funciones, pero en el curso se sigue utilizando el plugin.
 //Luego vemos que accedemos a la propiedad watchAcceleration, que significa que vamos a leer el 
 //acelerómetro a intervalos, en este caso de 1000ms. Si ha habido éxito llamaremos a onSuccess y 
 // de lo contrario a onError.
    navigator.accelerometer.watchAcceleration(this.onSuccess, onError, { frequency: 1000});
  },
  
  //Una vez tomados los datos del acelerómetro, nos vamos a onSuccess y tomamos los datos en el 
  //parámetro datosAceleracion.

  onSuccess: function(datosAceleracion){	
// la primera función invocada detecta la agitación del dispositivo.  
    app.detectaAgitacion(datosAceleracion);
	//La segunda es la encargada de representar los valores en pantalla.
    app.representaValores(datosAceleracion);
  },

  detectaAgitacion: function(datosAceleracion){
	 //En estas variable les pasamos el umbral de valores en x e y a partir de los cuales se puede
	 //considerar que el dispositivo se está agitando.
    agitacionX = datosAceleracion.x > 10;
    agitacionY = datosAceleracion.y > 10;
	
	//Condicional simple donde evaluamos si agitacionX o agitacionY son true.
	//Si es verdad asignamos una nueva class al body. Caso contrario la quitamos.
    if (agitacionX || agitacionY){
      document.body.className = 'agitado';
    }else{
      document.body.className = '';
    }
  },
//Esta función es la encargada de representar los valores en pantalla. 
  representaValores: function(datosAceleracion){	
//Como vemos, antes de   representar los valores los pasamos por una Math.round, para quitarles
//la cola de decimales que tienen por default. Esto lo hacemos en la función "representa". Además
//en esta función le pasamos dos parámetros, uno es el dato y el otro el elmento Html donde lo 
//imprimiremos.
    app.representa(datosAceleracion.x, '#valorx');
    app.representa(datosAceleracion.y, '#valory');
    app.representa(datosAceleracion.z, '#valorz');
  },

  //Esta función se encarga de redondear los datos y seleccionar el elmento Html donde los imprimiremos.
  representa: function(dato, elementoHTML){
	  //Esta simple ecuación nos devuelve un número con solo dos decimales. Creo con toFixed();
	  //resultaría igual.
    redondeo = Math.round(dato * 100) / 100
	//Seleccionamos el span correspondiente en nuestro Html y le agregamos el valor.
    document.querySelector(elementoHTML).innerHTML= redondeo;
  }

};

//Colocamos un addEventListener sobre deviceready para saber que el dipositivo está listo y por
//tanto el acelerómetro está disponible.

if ('addEventListener'in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
  }, false);
}
