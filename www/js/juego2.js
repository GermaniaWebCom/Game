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

      game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/bola.png');
	  //En esta versión más acabada del juego hemos agregado un objetivo. El cual cargamos como
	  //hicimos con bola en la clase anterior. Luego en create lo convertimos en un sprite.
      game.load.image('objetivo', 'assets/objetivo.png')
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
	//Aquí convertimos nuestras dos imagenes en sprites. Y como cimos en la clase anterior,
	//las insertamos de forma aleatoria en el tablero con las funciones app.inicioX() y 
	// app.inicioY. Algo importante a tener en cuenta es es que el objetivo tiene el mismo tamaño
	//que la bola por lo cual podemos usar el mismo algoritmo de posicionamiento para ambos.
     objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
	//Aquí es donde declamramos, como hicimos con bola en la clase anterior, que también sobre
	//objetivo se deben aplicar loas leyes de la física ARCADE.
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

	//Aquí hemos añadido el factor de dificultad.
    function update() {
	//Este factor de dificultad lo calculamos sobra la base de velocidad 300 que habíamos visto en 
	//la clase anterior. Lo que haremos será que de acuerdo al nivel de puntuación en que estemos,
	//iremos aumentando la velocidad de la bola para hacerla más dificil de controlar.
      var factorDificultad = (300 + (dificultad * 100));
	 //Y lo visto en la línea anterior lo aplicamos aquí, simplemente hemos tenido que racionalizar
	 //la fórmula.
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
//Aquí es donde se da la magia. En el overlap del game.physics.arcade. Ahora, qué es un overlap? Overlap
//es cuando un elemento se monta sobre otro. Lo que le estamos diciendo aquí es que detecte 
//el overlap de bola con objetivo y cuando ocurra que lance el callback incrementaPuntuacion. Rl
//parámetro null es para hacer un chequeo previo cuando no solo queremos aplicar el overlap sino
//además alguna otra condición. Está en null puesto que nosotros solo estamos verificando el overlap.
//Y luego el this es como ya sabemos el entorno en el que esto se ejecuta o envía.
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
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
  incrementaPuntuacion: function() {
	//En  primera instancia incrementamos la puntuación y la representamos.(Modifiqué el código original
	//y en lugar de incrementar en 1 le aumenté a 10). Hay que probar mejor la jugabilidad.
    puntuacion = puntuacion + 10;
    scoreText.text = puntuacion;
//Seguidamente lo que hacemos es reposicionar el objetivo llamando a las funciones que calculan
//el punto en x y en y.
    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();
	
	//Y con este condicional l oque haremos será monitorear si estamos en puntuación positiva,
	//de ser así lo que haremos será aumentar la dificultad.
    if (puntuacion > 0) {
      dificultad = dificultad + 1;
    }
  },

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
//Esta es una de las funciones que se modificó para darle más jugabilidad al juego.
  detectaAgitacion: function(datosAceleracion) {
    agitacionX = datosAceleracion.x > 10;
    agitacionY = datosAceleracion.y > 10;
    if (agitacionX || agitacionY) {
	//En lugar de cambiarle el background al tablero, lo que hacemos es setear un Timeout
	//y recomenzar el juego con la función recomienza.
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
