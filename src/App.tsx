import React from "react";
import Denim from "./components";

//import Programs from "./components/Programs";
import light from "./lib/light";
import dark from "./lib/dark";

const App: React.FC = () => {
  return (
    <Denim
      //components={{ Admin, ReactiveAdmin, Programs }}
      themes={{ default: light(), light: light(), dark }}
    />
  );
};

export default App;
