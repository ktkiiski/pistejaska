import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { CurrentUser } from "./CurrentUser";
import firebase from "firebase";
import { DatabaseList } from "./DatabaseList";
import { InputScoresForm, MarsForm } from "./InputScoresForm";
import { NavBar } from "./NavBar";

var config = {
  apiKey: "AIzaSyDI_XDKW2vVftx7oUy1a_QTR5BE8j6S-Ds",
  authDomain: "pistejaska-dev.firebaseapp.com",
  databaseURL: "https://pistejaska-dev.firebaseio.com",
  projectId: "pistejaska-dev",
  storageBucket: "pistejaska-dev.appspot.com",
  messagingSenderId: "597805798706"
};
firebase.initializeApp(config);

const isSignedIn = firebase.auth().currentUser != null;

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <CurrentUser />
        {isSignedIn ? <DatabaseList /> : <></>}
        <MarsForm />
      </div>
    );
  }
}

export default App;
