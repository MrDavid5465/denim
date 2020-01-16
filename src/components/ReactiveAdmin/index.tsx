import React from "react";
import ReactiveAdmin from "../../lib/reactive-admin";

import Update from "./Update";
import List from "./List";
import Create from "./Create";
import Show from "./Show";
import { DisplaySchema } from "../../lib/reactive-admin/lib";
import { SchemaDefinition } from "../../lib/per-form/src/templates/lib";
import { getCurrentApp } from "../../App";

interface Props {
  dispatcher: { list: any; create: any; get: any; update: any; remove: any };
  match: any;
  name: any;
  components?: any;
  schemaDefinition: {
    list: DisplaySchema<any>;
    create: SchemaDefinition<any>;
    review: DisplaySchema<any>;
    update: SchemaDefinition<any>;
  };
}

const Index: React.FC<Props> = ({
  dispatcher,
  match,
  name,
  schemaDefinition
}) => {
  return (
    <ReactiveAdmin
      dispatcher={dispatcher}
      match={match}
      name={name}
      components={{
        list: List,
        create: (props: any) => <Create {...props} app={getCurrentApp()} />,
        review: Show,
        update: (props: any) => <Update {...props} app={getCurrentApp()} />
      }}
      schemaDefinition={schemaDefinition}
    />
  );
};
export default Index;
