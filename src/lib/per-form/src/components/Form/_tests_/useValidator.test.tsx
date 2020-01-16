import { useSchema } from "../useSchema";
import { useValidator } from "../useValidator";
import { schemaDefinition, IProgram } from "./schema";
import { Form } from "../types";

const invalidForm: Form<IProgram> = {
  name: "a",
  code: "",
  description: "a"
};

const validForm: Form<IProgram> = {
  name: "New Program",
  code: "np",
  description: ""
};

const schema = useSchema(schemaDefinition);

const validate = useValidator(schema);

it("should list errors on invalid fields", () => {
  const messages = validate(invalidForm);

  expect(messages.name.length).toBe(2);
  expect(messages.code.length).toBe(1);
  expect(messages.description.length).toBe(1);
});

it("should not list errors on non-required fields with no value", () => {
  const messages = validate(validForm);

  expect(messages.description.length).toBe(0);
});

it("should not list errors on valid fields", () => {
  const messages = validate(validForm);
  console.log(messages);

  expect(messages.name.length).toBe(0);
  expect(messages.code.length).toBe(0);
  expect(messages.description.length).toBe(0);
});
