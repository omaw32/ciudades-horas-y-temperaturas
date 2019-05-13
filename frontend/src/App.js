import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Ciudades from './Ciudades'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Ciudades con Hora y Temperatura </h1>
        </header>
        <Ciudades />
      </div>
    )
  }
}

export default App
