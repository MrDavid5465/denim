import gql from "graphql-tag";
const GET_APPLICATIONS = gql`
  query getApplications {
    getApplications {
      id
      name
      path
      defaultRoute
      frontEnd
      roles {
        name
        groupNames
      }
      links {
        roles
        path
        text
      }
    }
  }
`;
export interface IListApplications {
  getApplications: Array<Partial<IApplication>>;
}
export interface IApplication {
  id: string;
  name: string;
  path: string;
  defaultRoute: string;
  frontEnd: string;
  roles: Array<IRole>;
  links: Array<ILink>;
}
export interface IRole {
  name: string;
  groupNames: Array<string>;
}
export interface ILink {
  roles: Array<string>;
  path: string;
  text: string;
}
const UPDATE_APPLICATION = gql`
  mutation updateApplication($id: String!, $application: ApplicationInput!) {
    updateApplication(id: $id, application: $application) {
      id
      name
      path
      defaultRoute
      frontEnd
      roles {
        name
        groupNames
      }
    }
  }
`;
export interface IUpdateApplication {
  updateApplication: Partial<IApplication>;
}
const ADD_APPLICATION = gql`
  mutation addApplication($application: ApplicationInput!) {
    addApplication(application: $application) {
      id
    }
  }
`;
export interface IAddApplication {
  addApplication: Partial<IApplication>;
}
const GET_GROUPS = gql`
  query getGroups {
    getGroups {
      id
      sAMAccountName
      name
      distinguishedName
    }
  }
`;
export interface IListGroups {
  getGroups: Array<IGroup>;
}
export interface IGroup {
  sid: string;
  sAMAccountName: string;
  distinguishedName: string;
  name: string;
}
const MY = gql`
  query my {
    my {
      sid
      sAMAccountName
      displayName
      applications {
        path
        defaultRoute
        name
        roles {
          name
          groupNames
        }
        links {
          roles
          path
          text
        }
        frontEnd
      }
      settings {
        id
        sAMAccountName
        launchPage
        theme
        fontSize
      }
      groups {
        name
        sAMAccountName
        distinguishedName
        sid
      }
    }
  }
`;
const USERS = gql`
  query users {
    users {
      sAMAccountName
      displayName
      physicalDeliveryOfficeName
    }
  }
`;
export interface IGetUsers {
  users: Array<Partial<IUser>>;
}
const UPDATE_MY_USER_SETTINGS = gql`
  mutation updateMySettings($settings: UserSettingInput!) {
    updateMyUserSettings(settings: $settings) {
      id
      sAMAccountName
      launchPage
      theme
      fontSize
    }
  }
`;
const GET_TYPIQL_CLIENT = gql`
  query getTypiQLClient {
    getTypiQLClient {
      ip
      computerName
    }
  }
`;
export interface IGetTypiQLClient {
  getTypiQLClient: Partial<ITypiQLClient>;
}
export interface ITypiQLClient {
  ip: string;
  computerName: string;
}
export interface IUserSettingInput {
  sAMAccountName: String;
  launchPage: String;
  theme: String;
}
export interface ISettings {
  id: string;
  sAMAccountName: string;
  launchPage: string;
  theme: string;
  fontSize: number;
}
export interface IAppNav {
  text: string;
  path: string;
  roles: Array<string>;
}

export interface IUser {
  sid: string;
  sAMAccountName: string;
  displayName: string;
  applications: Array<IApplication>;
  groups: Array<IGroup>;
  settings: Partial<ISettings>;
}

export interface IMy {
  my: Partial<IUser>;
}
export interface IFile {
  id: string;
  name: string;
  fileId: string;
  file: string;
  thumbnail: string;
  type: string;
}
const UPLOAD = gql`
  mutation uploadFile($name: String!, $file: String!, $type: String!) {
    uploadFile(name: $name, file: $file, type: $type) {
      id
      name
      thumbnail
    }
  }
`;

const GET_FILE = gql`
  query getFile($id: String!) {
    getFileBase64(id: $id) {
      id
      fileId
      name
      file
    }
  }
`;

const dispatcher = {
  my: MY,
  getUsers: USERS,
  updateMyUserSettings: UPDATE_MY_USER_SETTINGS,
  listApplications: GET_APPLICATIONS,
  listGroups: GET_GROUPS,
  addApplication: ADD_APPLICATION,
  updateApplication: UPDATE_APPLICATION,
  getFile: GET_FILE,
  upload: UPLOAD,
  getTypiQLClient: GET_TYPIQL_CLIENT
};

export default dispatcher;
