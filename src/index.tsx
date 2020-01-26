import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-components";

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri:
      process.env.REACT_APP_ENV === "production"
        ? "http://aph141671d/genericAPI/api/GraphQL"
        : process.env.REACT_APP_ENV === "staging"
        ? "http://aph-api2/generic/api/GraphQL"
        : process.env.REACT_APP_ENV === "dev"
        ? "http://aph141671d/generic/api/GraphQL"
        : process.env.REACT_APP_ENV === "local"
        ? "http://aph141671d/genericAPI/api/GraphQL"
        : "http://aph-api2/foo/api/GraphQL",
    credentials: "include",
    fetch
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
