# App React que muestra las horas y temperaturas de ciudades del mundo

La aplicación se estructura de una parte Backend y Frontend. Utiliza las siguientes tecnologías:

Node.js 
ReactJS 
Redis 
ES6 
Websockets 

#Requerimientos:

Se desea mostrar en pantalla completa la hora y la temperatura y hora de las siguientes ciudades: 

Santiago (CL), Zurich (CH), Auckland (NZ), Sydney (AU), Londres (UK), Georgia (USA) 

Las latitudes y longitudes de cada ciudad deben ser guardadas en Redis al momento de iniciar la aplicación. 

Cada request de la API deberá ir a Redis, sacar las latitudes y longitudes correspondientes, y hacer las consultas necesarias al servicio de Forecast.io. 

Cada request a la API tiene un 10% de chances de fallar, al momento de hacer el request deberá suceder lo siguiente: 

if (Math.rand(0, 1) < 0.1) throw new Error('How unfortunate! The API Request Failed') 

Esto nos simulara un fallo del 10%~, la aplicacion deberá rehacer el request las veces que sea necesario para tener una respuesta correcta, 
cada fallo deberá guardarse en Redis dentro de un hash llamado "api.errors", la llave deberá ser el timestamp y el contenido debe ser relevante al error. 
El handler de error deberá capturar solamente este error y no otro con diferente clase o mensaje. 

El frontend deberá actualizarse cada 10 segundos a través de web sockets. El proceso deberá actualizar redis y luego enviar el update al frontend. 

El temas el diseño esta 100% en tus manos, nos interesa más la funcionalidad y orden más que cuan bonito se ve. 

La aplicación deberá ser subida a AWS o Heroku (tu elección) y a un repositorio de Git, recuerda documentar como se sube!

#Iniciar app:

FrontEnd:
npm install
npm start

BackEnd:
npm install
node app.js

#Consideraciones

La app en su parte backend ocupa los puertos 3001 express método get, puerto 3030 WebSocket, 6379 Redis.
En la parte FrontEnd utiliza el puerto 3000.
Acerca de la cantidad de intentos, me decidí por 3 reintentos máximo. El método es recursivo y si excede la cantidad de reintentos muestra error.
Si bien es cierto solo se simula un 10% de errores, en la vida real las api se caen y no responden. De esta manera se evita que este consultando eternamente (bucle infinito).