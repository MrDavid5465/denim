import { SchemaDefinition } from "./components/Form/types";
import { differenceInCalendarYears, isValid, parseISO } from "date-fns";

export interface IPerson {
  firstName: string;
  lastName: string;
  dob: string;
  numberOfSiblings: number;
  hasDriversLicense: string;
  upgrade: string;
  agree: boolean;
}

type ProgramSchemaDefinition = SchemaDefinition<IPerson>;

export const schemaDefinition: ProgramSchemaDefinition = {
  firstName: {
    type: "text",
    label: "First Name",
    required: true,
    validations: [
      {
        test: ({ firstName }: IPerson) => /^[A-Z0-9]/.test(firstName),
        message: "Must start with an uppercase"
      },
      {
        test: ({ firstName }: IPerson) => /.{3}/.test(firstName),
        message: "Must be at least 3 characters"
      }
    ]
  },

  lastName: {
    type: "text",
    label: "Last Name",
    required: true,
    validations: [
      {
        test: ({ lastName }: IPerson) => /^[A-Z0-9]/.test(lastName),
        message: "Must start with an uppercase"
      },
      {
        test: ({ lastName }: IPerson) => /.{3}/.test(lastName),
        message: "Must be at least 3 characters"
      }
    ]
  },

  dob: {
    type: "date",
    label: "Date of Birth",
    required: true,
    defaultNull: new Date(3000, 0, 1),
    validations: [
      {
        test: ({ dob }: IPerson) => {
          const parsedDate = parseISO(dob);
          return parsedDate < new Date();
        },
        message: "Date of birth cannot be in the future"
      }
    ]
  },

  numberOfSiblings: {
    type: "number",
    label: "# of Siblings",
    defaultNull: 0,
    validations: [
      {
        test: ({ numberOfSiblings }: IPerson) => numberOfSiblings > -1,
        message: "Can not be less than 0"
      },
      {
        test: ({ numberOfSiblings }: IPerson) => numberOfSiblings < 20,
        message: "Can not greater than 20"
      }
    ]
  },

  hasDriversLicense: {
    type: "select",
    label: "Do you have a driver's license?",
    required: true,
    options: [{}, { value: "yes", text: "Yes" }, { value: "no", text: "No" }],
    validations: [
      {
        test: ({ dob, hasDriversLicense }: IPerson) => {
          const parsedDate = parseISO(dob);
          const ofDrivingAge = isValid(parsedDate)
            ? differenceInCalendarYears(new Date(), parsedDate) >= 16
            : false;
          const booleanHasDriversLicense = hasDriversLicense === "yes";

          return (
            !booleanHasDriversLicense ||
            (booleanHasDriversLicense && ofDrivingAge)
          );
        },
        message: "You must be 16 to have a driver's license"
      }
    ]
  },

  upgrade: {
    type: "radio",
    label: "Upgrade?",
    required: true,
    options: [
      { value: "accept", text: "Yes, upgrade my account" },
      { value: "decline", text: "No, I'll keep what I have" }
    ]
  },

  agree: {
    type: "checkbox",
    label: "I agree to the terms and conditions",
    required: true,
    validations: [
      {
        test: ({ agree }: IPerson) => agree === true,
        message: "You must agree to the terms and conditions"
      }
    ]
  }
};

export default {
  new: schemaDefinition
};
