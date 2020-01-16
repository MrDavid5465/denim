import React from "react";
import "./App.css";

import MasterForm from "./templates/MasterForm";
import { master } from "./master-form";

const App: React.FC = () => {
  return (
    <div className="container">
      <MasterForm
        masterSchema={master}
        initialValues={{
          person: {
            firstName: "Michael",
            lastName: "Wood",
            dob: "2005-04-06",
            hasDriversLicense: "yes",
            upgrade: "decline",
            agree: true
          },
          vehicles: [
            { make: "Ford", year: "2011", model: "Fusion" },
            { make: "Tesla", year: "2021", model: "Cybertruck" }
          ]
        }}
      />
    </div>
  );
};

export default App;
