import React from "react";
import { Query } from "@apollo/react-components";
import dispatcher, { IUser, IMy } from "../../lib/queries";
interface Props {}

const defaultMy: Partial<IUser> = {
  settings: { theme: "light" },
  applications: []
};
export const MyAppContext = React.createContext(defaultMy);

export const MyAppProvider: React.FC<Props> = props => {
  return (
    <Query<IMy> query={dispatcher.my}>
      {({ data }) => {
        return (
          <MyAppContext.Provider
            {...props}
            value={data ? data.my : defaultMy}
          />
        );
      }}
    </Query>
  );
};
export default MyAppProvider;
