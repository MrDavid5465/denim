import gql from 'graphql-tag';

export interface IApplication {
  name: string;
  path: string;
  defaultRoute: string;
  frontEnd: string;
  links: Array<ILink>;
}
export interface ILink {
  path: string;
  text: string;
}
// `my.settings` (backend: a real `UserSetting` typiql type, see
// backend/src/user_settings.rs) is deliberately not selected here — this
// app's live Denim chrome reads/writes theme settings via browser
// localStorage instead (see `lib/localSettings.ts`), since a single
// backend-shared settings record would leak across every anonymous visitor
// with no auth yet to scope it by. The backend piece exists ready for when
// JWT auth lands and a real per-account settings mutation becomes
// meaningful — this app just doesn't call it yet.
const MY = gql`
  query my {
    my {
      applications {
        path
        defaultRoute
        name
        links {
          path
          text
        }
        frontEnd
      }
    }
  }
`;
export interface IAppNav {
  text: string;
  path: string;
  roles: Array<string>;
}

export interface IUser {
  applications: Array<IApplication>;
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
  getFile: GET_FILE,
  upload: UPLOAD
};

export default dispatcher;
