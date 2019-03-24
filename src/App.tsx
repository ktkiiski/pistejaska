import React, { Component } from "react";
import "./App.css";
import { Login } from "./Login";
import * as firebase from "firebase/app";
import "firebase/auth";
import { NavBar } from "./NavBar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { ListGames } from "./ListGames";
import { Admin } from "./Admin";
import { SelectGame } from "./SelectGame";
import { SelectPlayers } from "./SelectPlayers";
import { PlayEdit } from "./PlayEdit";
import { PlayShow } from "./PlayShow";

var config = {
  apiKey: "AIzaSyDI_XDKW2vVftx7oUy1a_QTR5BE8j6S-Ds",
  authDomain: "pistejaska-dev.firebaseapp.com",
  databaseURL: "https://pistejaska-dev.firebaseio.com",
  projectId: "pistejaska-dev",
  storageBucket: "pistejaska-dev.appspot.com",
  messagingSenderId: "597805798706"
};
firebase.initializeApp(config);

const App = () => {
  const { initialising, user } = useAuthState(firebase.auth());
  const app = !user ? (
    <Login />
  ) : (
    <div>
      <Route path="/" component={NavBar} />
      <Route path="/" exact component={ListGames} />
      <Route path="/show/:playId" component={PlayShow} />
      <Route path="/edit/:playId" component={PlayEdit} />
      <Route path="/new/:gameId" component={SelectPlayers} />
      <Route path="/new/" exact component={SelectGame} />
      <Route path="/admin/" component={Admin} />
    </div>
  );

  return (
    <div className="App">
      <Router>{app}</Router>
    </div>
  );
};

export default App;
