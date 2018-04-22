var app = {
  inicio: function() {
	//Este es el diámetro del sprite (imagen) que vamos a introducir en el juego.
	//Sus dimensiones serán de 50 x 50 y esto nos va a servir para ver donde la hacemos 
	//aparecer.
    DIAMETRO_BOLA = 50;
    
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
	
	//También vamos a medir nada más arrancar cuál es el tamaño del dispositivo. Para ser 
	//capaces de hacer un juego que ocupe el 100% del espacio disponible.
    alto = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
	
	//También hacemos la vigilancia de los sensores, que llama a la función onError u onSuccess
	//dependiendo de si obtuvimos lectura o no.
    app.vigilaSensores();
	//Esta es la parte donde iniciamos el juego. Aquí es donde entramos a algo llamado el "Ciclo
	// del Juego".
    app.iniciaJuego();
  },

  //Esta es la función encargada de arrancar el juego.
  iniciaJuego: function() {
//De momento usaremos dos estados. El primero es el preload que es el primero que sucede y es al que hacemos
//referencia en esta función.
    function preload() {
	//Aquí estamos arrancando el motor de físicas. Phaser nos provee de un motor de física
	//que nos permite mover cosas, hacer que tengan gravedad, etc. En este caso vamos a
	//utilizar el más sencillo que es el de ARCADE. Tiene otros más sofisticados que estaría bueno
	//explorar.
      game.physics.startSystem(Phaser.Physics.ARCADE);
//Aquí le decimos que el espacio (stage) donde se desarrolla el juego tenga un background determinado.
      game.stage.backgroundColor = '#f27d0c';
	  
	//Y luego cargamos la imagen que nos va a servir para hacer el sprite. El primer parámetro es un 
	//alias y el segundo es la url. A partir de ahora podemos referirnos al sprite por su alias.
      game.load.image('bola', 'assets/bola.png');
    }
	
	//El que ocurre inmediatamente a continuación es el create. Este es el que referenciamos en esta otra
	//función. Con preload preparamos cosas y con create las insertamos en la interfaz.
    function create() {
	//Creamos un scoreText que representa un texto que ponemos en la pantalla. Como parámetros le
	//pasamos la posicion en x e y donde parecerá (16,16), luego le decimos qué es lo que mostrará,
	//en este caso la puntuacion, y por último le pasamos unos atributos de estilo en JSON(tamaño y color).
    //Vemos que la bola pasa por encima del texto, eso es simplemente por el orden en que hemos
	//declarado las funciones, si pasamos esta línea debajo de la siguiente obtenemos el efecto inverso.
	 scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
     //Aquí añadimos el sprite creado en preload. Tenemos que indicarle en que posición en X y en Y
	 //debe aparecer y por último el sprite que mostraremos, en este caso 'bola'.
	 //Para que no aparezca siempre en el mismo lugar la posición en X y Y la calculamos con dos funciones
	 //que se encargan de generar un punto aleatorio dentro del tablero cada vez que inicia el juego.
	  bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
	 //Aquí les estamos diciendo que en el motor de físicas ARCADE, ponga en marcha (enable) a bola.
	 //En otras palabras le decimos que sobre el sprite bola actúen las leyes de la física.
      game.physics.arcade.enable(bola);
	 //Aquí le decimos que la bola haga la detección de la colisión con los bordes de nuestro mundo.
	  bola.body.collideWorldBounds = true;
	  //Cada vez que ocurre una colisión con los bordes de nuestro mundo, genera una señal
      bola.body.onWorldBounds = new Phaser.Signal();
	  //Lo anterior es lo que nos permite poner un manejador de la señal. En este caso hemos añadido
	  //a onWorldBounds el manejador de la señal que es la función decrementaPuntuacion y le pasamos
	  // el contexto que es this. Aunque no lo vamos a usar aca.
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }
	
	//En esta función update lo que estamos haciendo es mapear la velocidad. 
	//bola.body representa el cuerpo del sprite. Y velocity es su velocidad en x e y.
	//Lo que hacemos es relacionar la velocidad con las dos variables que declaramos al inicio
	//del código y que las inicializamos a 0. Luego las calculamos en la función onSuccess,
	//que es donde detectamos los datos de la aceleración.
	//Vemos también que se la multiplicap or un factor. En este caso es 300, eso es porque
	//en las pruebas se ha visto que esa velocidad hacía el juego interesante. Lo importasnte aquí
	//no es tanto el número para mi sino recordar que ese es un factor.
	//En el caso del eje X como es contraintuitivo, es decir que se vuelve negativo a la derecha y 
	//positivo a la izquierda, se le colocó el factor en negativo para compensar eso e invertir las
	// mediciones.
    function update() {
      bola.body.velocity.y = (velocidadY * 300);
      bola.body.velocity.x = (velocidadX * -300);

    }
	
	//Este hash indica que función se usara para cada evento que estamos utilizando. En este caso para
	//preload usaremos la función preload y para create usaremos la función create y para update usaremos
	//update. OJO: podríamos haber usado los nombres en castellano y luego referenciar la función de
	//Phaser que queremos asignarle. Sin embargo el standard de Phaser es usar esta nomenclatura.
    var estados = { preload: preload, create: create, update: update };
	
	//Esta es la línea donde creamos un nuevo juego de Phaser con las instancias que utilizaremos. Le
	//pasamos como parámetros el ancho y el alto que calculamos más arriba, luego viene la forma de renderizar
	//que en este caso es Phaser.CANVAS(tiene otras formas com USL, etc. Debemos averiguar), luego declaramos el id
	//del elemento Html donde se representará, y por último le pasamos los estados del juego que son 
	// preload y create.
	
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  //Esta es la función manejadora de eventos para la señal de onWorldBounds.
  decrementaPuntuacion: function() {
	//Es bastante simple. Le decimos que puntuacion decremente en uno cada vez que se detecte
	//una señal de colisión.
    puntuacion = puntuacion - 1;
	//Y luego simplemente lee pasamos a scoreText como texto la puntuación.
    scoreText.text = puntuacion;
  },

  //Esta función da una posición aleatoria en X tomando en cuenta el ancho del tablero menos 
  //el diámetro de la bola para que esta no se nos salga del tablero.
  inicioX: function() {
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
  },
//Esta es igual que en X. En cuanto a la función numeroAleatorioHasta es la que tenemos más abajo
// y la explicamos ahí.
  inicioY: function() {
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
  },

  //Esta es la función encargada de calcular un número aleatorio cada vez que la invocamos.
  //Usamos dos funciones predefinidas Math.floor para redondear el resultado de Math.random
  //por el límite o tamaño máximo que queremos que tenga el juego.
  numeroAleatorioHasta: function(limite) {
    return Math.floor(Math.random() * limite);
  },

  //Función encargada de detectar si pudimos acceder al acelerómetro y obtener una lectura o no.
  vigilaSensores: function() {

    function onError() {
      console.log('onError!');
    }
	
	//Esta función se mantiene para el caso de que la detección de la agitación sea exitosa.
	//Se le ha introducido algunos cambios en las funciones de call_back.
    function onSuccess(datosAceleracion) {
	//Aquí ahora tenemos dos llamadas, por un lado seguimos teniendo los datos de la agitación,
	//pero por otro estamos llevando también un registro de la Dirección con la función registraDireccion.
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }
//También hemos bajado la frecuencia de registro del acelerómetro de los 1000ms originales a 10ms
//Esto es importante para mantener una lectura ágil y hacer jugable el juego.
    navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 10 });
  },
  
  //Se ha mantenido la detección de la agitación que realizamos en la priemer clase.
  detectaAgitacion: function(datosAceleracion) {
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY) {
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function() {
    document.location.reload(true);
  },

  //Esta es la función encargada de registrar la dirección de la inclinación del dispositivo.
  registraDireccion: function(datosAceleracion) {
//Lo que hace es guardar en estas dos variable que inicializamos a 0 al inicio del código,
// el estado del acelerómetro.
    velocidadX = datosAceleracion.x;
    velocidadY = datosAceleracion.y;
  }
};

if ('addEventListener'in document) {
  document.addEventListener('deviceready', function() {
    app.inicio();
  }, false);
}
