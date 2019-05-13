import React, { Component } from 'react'
import moment from 'moment-timezone';
import { Services } from './services'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};


const URL = 'ws://localhost:3030'
const esperandoTemp = 'Esperando temperatura...';

class Ciudades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      horaSantiago: '',
      temperaturaSantiago: esperandoTemp,
      horaZurich: '',
      temperaturaZurich: esperandoTemp,
      horaAucland: '',
      temperaturaAucland: esperandoTemp,
      horaLondres: '',
      temperaturaLondres: esperandoTemp,
      horaGeorgia: '',
      temperaturaGeorgia: esperandoTemp,
      horaSydney: '',
      temperaturaSydney: esperandoTemp
    }
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
    }

    this.ws.onmessage = evt => {
      // on receiving a message
      //const ListaCiudades = evt.data;
      const ListaCiudades = JSON.parse(evt.data)
      this.ActualizaStateTemperaturas(ListaCiudades);
      //this.addMessage(message)
    }

    this.ws.onclose = () => {
      console.log('disconnected');
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }

    //Intervalos cada 1 segundo para actualizar hora
    this.intervalHour = setInterval(
      () => this.tickHora(),
      1000
    );

    //Intervalos cada 10 segundos para actualizar temperatura
    this.intervalTemperature = setInterval(
      () => this.ActualizarTemperaturas(),
      10000
    );

    //Datos al inicio
    this.SetearTemperaturasInicio();
  }

  SetearTemperaturasInicio = () => {
    Services.ObtenerTemperaturas()
      .then((respuesta) => {
        console.log(respuesta);
        //Setear temperaturas desde servicio
        var ListaCiudades = respuesta; //.data.Ciudades;
        this.ActualizaStateTemperaturas(ListaCiudades);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ActualizaStateTemperaturas = ListaCiudades => {
    ListaCiudades.forEach((element) => {
      this.setState({
        ["temperatura" + element.city]: element.temperature
      });
    })
    console.log('Temperaturas actualizadas via WebSocket...');
  }

  ActualizarTemperaturas() {
    //Manda mensaje
    const actualizaTemp = 'Actualizando temperatura...';
    this.setState({ temperaturaSantiago: actualizaTemp });
    this.setState({ temperaturaZurich: actualizaTemp });
    this.setState({ temperaturaAucland: actualizaTemp });
    this.setState({ temperaturaLondres: actualizaTemp });
    this.setState({ temperaturaGeorgia: actualizaTemp });
    this.setState({ temperaturaSydney: actualizaTemp });
    this.ws.send(JSON.stringify('true'))
    console.log('Envía solicitud para actualizar temperaturas por WebSocket...');
  }

  tickHora() {
    //Hora
    var currentDate = new Date();
    var june = moment(currentDate);
    this.setState({ horaSantiago: june.tz('America/Santiago').format('LTS') });
    this.setState({ horaZurich: june.tz('Europe/Zurich').format('LTS') });
    this.setState({ horaAucland: june.tz('Pacific/Auckland').format('LTS') });
    this.setState({ horaLondres: june.tz('Europe/London').format('LTS') });
    this.setState({ horaGeorgia: june.tz('America/Chicago').format('LTS') });
    this.setState({ horaSydney: june.tz('Australia/Sydney').format('LTS') });
  }

  componentWillUnmount() {
    clearInterval(this.intervalHour);
    clearInterval(this.intervalTemperature);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <p></p>
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Grid container className={classes.demo} justify="center" spacing={16}>
              <Grid item>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Santiago (CL) 
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Hora 
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {this.state.horaSantiago}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Temperatura
                    </Typography>
                    <Typography component="p">
                      {this.state.temperaturaSantiago}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
              <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Zurich (CH) 
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Hora 
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {this.state.horaZurich}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Temperatura
                    </Typography>
                    <Typography component="p">
                      {this.state.temperaturaZurich}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
              <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Auckland (NZ) 
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Hora 
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {this.state.horaAucland}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Temperatura
                    </Typography>
                    <Typography component="p">
                      {this.state.temperaturaAucland}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container className={classes.demo} justify="center" spacing={16}>
              <Grid item>
              <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Londres (UK)
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Hora 
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {this.state.horaLondres}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Temperatura
                    </Typography>
                    <Typography component="p">
                      {this.state.temperaturaLondres}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
              <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Georgia (USA)
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Hora 
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {this.state.horaGeorgia}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Temperatura
                    </Typography>
                    <Typography component="p">
                      {this.state.temperaturaGeorgia}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
              <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Sydney (AU)
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Hora 
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {this.state.horaSydney}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Temperatura
                    </Typography>
                    <Typography component="p">
                      {this.state.temperaturaSydney}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Ciudades.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Ciudades);

//export default Ciudades
