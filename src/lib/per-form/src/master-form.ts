import vehicleSchema, { IVehicle } from "./vehicle-schema";
import personSchema, { IPerson } from "./person-schema";
import { ISubform, MasterForm, IForm } from "./templates/lib";

interface Test {
  person: ISubform<IVehicle>;
  vehicles: ISubform<IPerson>;
}

export const master: MasterForm<Test, IForm> = {
  name: "Master Form",
  forms: {
    person: {
      type: "single",
      name: { plural: "People", singular: "Person" },
      schema: personSchema.new
    },
    vehicles: {
      type: "list",
      max: 3,
      min: 1,
      name: { plural: "Vehicles", singular: "Vehicle" },
      schema: vehicleSchema.new
    }
  }
};
