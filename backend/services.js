const https = require('https');
const ciudad = require('./ciudades');

//Redis
var redis = require('redis');
var redisClient = redis.createClient({ host: 'localhost', port: 6379 });

redisClient.on('ready', function () {
    console.log("Redis is ready on port 6379");
});

redisClient.on('error', function () {
    console.log("Error in Redis");
});

ObtenerDatosMetereologia = (ciudad, n_reintentos) => {
    return new Promise((res, rej) => {
        ObtenerValorRedis(ciudad)
            .then((data_lat_lon) => llamar_api(ciudad, data_lat_lon, n_reintentos))
            .then((prom) => {
                res(prom);
            },
            (error) => {
                //No devuelve rej ya que necesito mostrar que esa llamada a la api falló y el promisse.all queda incompleto
                res(error);
            })
    });
}

//Se realiza 3 reintentos, el metodo es recursivo
llamar_api = (ciudad, data_lat_lon, n_reintentos) => {
    return new Promise((res, rej) => {
        try {
            //Simula de un 100% de consultas, un 10% de errores 
            if (Math.random(0, 1) < 0.1) {
                InsertarErrorApi('How unfortunate! The API Request Failed');
                throw new Error('How unfortunate! The API Request Failed');
            }
            else {
                //Llamada a Api que retorna temperaturas 
                https.get('https://api.darksky.net/forecast/9f6d028c21854b1c4ce0f1c18de00d26/' + data_lat_lon.lat.toString() + ',' + data_lat_lon.lon.toString(),
                    (resp) => {
                        let data = '';

                        // A chunk of data has been recieved.
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        // The whole response has been received. Print out the result.
                        resp.on('end', () => {
                            var temperature = JSON.parse(data).currently.temperature;
                            var obj = { "city": ciudad, "temperature": temperature.toString() + "º" };
                            return res(obj);
                        });

                    }).on("error", (err) => {
                        console.log("Error en services.js: " + err.message);
                        throw new Error('How unfortunate! The API Request Failed');
                    });
            }
        }
        catch(error) {
            console.log("Error en llamada a api: " + error);
            console.log("Quedan " + n_reintentos.toString() + " intentos, llamada a api de ciudad: " + ciudad);
            if (n_reintentos === 1) return rej({ "city": ciudad, "temperature": "Error en la obtención de la temperatura..." });           
            return res(llamar_api(ciudad, data_lat_lon, n_reintentos - 1));
        }
    });
}

let InsertarLonLen = () => {
    //Insertar data en Redis
    var list = ciudad.ciudades.data;
    list.forEach(function (element) {
        //console.log(element);
        redisClient.hmset(element.ciudad.toString(),
            "lat", element.latitud.toString(),
            "lon", element.longitud.toString()
            , function (err, res) {
                console.log(err);
                console.log(res);
            });
    });
}

ActualizarRedis = (data_actualizada) => {
    //Insertar data en Redis
    data_actualizada.forEach(function (element) {
        //console.log(element);
        redisClient.hmset(element.city.toString(),
            "temperature", element.temperature
            , function (err, res) {
                console.log(err);
                console.log(res);
            });
    });
}

function InsertarErrorApi(error) {
    var timestamp = ObtenerTimeStamp();
    redisClient.hmset("api.errors",
        timestamp, error.toString()
        , function (err, res) {
            console.log(err);
            console.log(res);
        });
}

function ObtenerValorRedis(Clave) {
    return new Promise((res, rej) => {
        redisClient.hgetall(Clave, function (err, reply) {
            if (err) rej(err);
            res(reply);
        });
    });
}

let ProcesarPromesas = () => {
    const tasks = [];
    const numeroReintentos = 3;
    ciudad.ciudades.data.forEach(function (element) {
        tasks.push(() => this.ObtenerDatosMetereologia(element.ciudad, numeroReintentos));
    });

    const arrayOfPromises = tasks.map(task => task())

    // call Promise.all on that array
    return Promise.all(arrayOfPromises).then((resultado) => {
        //console.log({resultado});
        //Actualiza redis
        ActualizarRedis(resultado);
        return resultado;
    });
}

function ObtenerTimeStamp() {
    var date = new Date();
    var timestamp = date.getTime();
    return timestamp.toString();
}

module.exports = {
    InsertarLonLen,
    ProcesarPromesas
}