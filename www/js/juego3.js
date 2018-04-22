var app = {
  inicio: function() {
    DIAMETRO_BOLA = 50;
	//Para aumentar la jugabilidad hemos creado un factor de dificultad que inicializamos en 0
	//Este factor de dificultad lo utilizaremos en la función update.
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;

    alto = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;

    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function() {

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);  

	  //Comenté el stage por defecto ya que lo redeclaro en la función update y ella se encarga del background.
     // game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/bola.png');	  
	  
      game.load.image('objetivo', 'assets/objetivo.png');
	  //Agregamos un nuevo objetivo.
	  game.load.image('newObjetivo', 'assets/nuevoObjetivo.png');
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
	
     objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
	 newObjetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'newObjetivo');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
	
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
	  game.physics.arcade.enable(newObjetivo);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

	//Aquí hemos añadido el factor de dificultad.
    function update() {
		
		var colores = [ "#f47c0b",  // Color por defecto.
                "#c36309",
                "#924a07",  // Paleta que va desde el anaranjado hasta el negro.
                "#613105",
                "#301903",
                "#000000" ]; 	
	   
        game.stage.backgroundColor = colores[ dificultad ];  // Varía de acuerdo a la dificultad
	
      var factorDificultad = (300 + (dificultad * 100));
	 
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));

      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
	  game.physics.arcade.overlap(bola, newObjetivo, app.incrementaPuntuacion, null, this);
	  
	  /* Si la bola está colisionando con los límites del mundo del juego. (Esto me había generado
	  problemas de lógica cuando intenté hacerlo asociándolo a la función decrementaPuntuacion). 
	  Utilizando el ejemplo de Edson todo corre perfecto.*/
	  if (bola.body.checkWorldBounds()) {
		game.stage.backgroundColor = "ff0000"; // pone un fondo rojo
	  } else {
		game.stage.backgroundColor = colores[ dificultad ]; // sino pone el fondo con el color de la dificultad
	  }
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function() {
    puntuacion = puntuacion - 1;
    scoreText.text = puntuacion;	
  },
//Esta es la nueva función que nos permite incrementar en uno la puntuacion cada vez que ocurra un
//overlap de bola con objetivo.
  incrementaPuntuacion: function(bola, objetivos) {
	 /* Enviamos dos parámentros, el primero (bola) es el que pasa sobre el segundo (objetivos),
	 y luego en los condicionales evaluamos cual de los dos objetivos recibe el overlap.  */
  if (objetivos === objetivo)  { puntuacion = puntuacion + 1; }
  if (objetivos === newObjetivo) { puntuacion = puntuacion + 10; }
    puntuacion = puntuacion + 1;
    scoreText.text = puntuacion;
//Seguidamente lo que hacemos es reposicionar el objetivo que recibió el overlap de la bola.
    objetivos.body.x = app.inicioX();
    objetivos.body.y = app.inicioY();
	
	//Y con este condicional l oque haremos será monitorear la puntuación, para aumentar o
	//disminuir la dificultad. NOTA: Intenté utilizar un switch, pero me daba error. ????
	
   if (puntuacion < 0) {
      dificultad = 0;
    }
	else if(puntuacion >= 0 && puntuacion <= 20){
		dificultad = 1;
	}
	else if(puntuacion >= 21 && puntuacion <= 40){
		dificultad = 2;
	}
	else if(puntuacion >= 41 && puntuacion <= 60){
		dificultad = 3;
	}
	else if(puntuacion >= 61 && puntuacion <= 80){
		dificultad = 4;
	}
	else{
		dificultad = 5;
	}		
  },
  
  //Esta sería otra alternativa para diferenciar los objetivos y su puntuación
  //Si lo desean pueden descomentarla y hacer la llamada en el overla del segundo objetivo.
  //Utilizando,claro, para el primero la función original.
 /* mayorPuntuacion: function() {
	
    puntuacion = puntuacion + 10;
    scoreText.text = puntuacion;

    newObjetivo.body.x = app.inicioX();
    newObjetivo.body.y = app.inicioY();
	
	if (puntuacion > 0) {
      dificultad = dificultad + 1;
    }
  }, */

  inicioX: function() {
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
  },

  inicioY: function() {
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
  },

  numeroAleatorioHasta: function(limite) {
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function() {
    function onError() {
      console.log('onError!');
    }
    function onSuccess(datosAceleracion) {
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }
    navigator.accelerometer.watchAcceleration(onSuccess, onError, {
      frequency: 10
    });
  },
//Detectamos la agitacion a partir de determinada lectura (10).
  detectaAgitacion: function(datosAceleracion) {
    agitacionX = datosAceleracion.x > 10;
    agitacionY = datosAceleracion.y > 10;
    if (agitacionX || agitacionY) {
	//Seteamos un Timeout y recomenzamos el juego con la función recomienza si hay agitación.
      setTimeout(app.recomienza, 1000);
    }
  },

  //Esta es la función que recomienza el juego.
  recomienza: function() {
	 //En definitiva esta es una aplicación web, ya que trabaja dentro de un webWiew, por lo
	 //tanto hemos usado la instrucción de recarga de página de JS para que recargue la aplicación
	 //y por lo tanto recomienza el juego.
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion) {
    velocidadX = datosAceleracion.x;
    velocidadY = datosAceleracion.y;
  }
};

if ('addEventListener'in document) {
  document.addEventListener('deviceready', function() {
    app.inicio();
  }, false);
}
