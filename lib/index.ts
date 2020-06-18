import { mergeStyleSets, getTheme } from "office-ui-fabric-react";
import { initializeIcons } from "@uifabric/icons";
import stylesJson from "./getStyle";
export {
  Fabric,
  Stack,
  Icon,
  IconButton,
  Separator,
  PrimaryButton,
  Panel,
  PanelType,
  Nav,
  loadTheme,
  getTheme,
  Toggle,
  TextField,
  Modal,
  DefaultButton,
  mergeStyleSets,
  mergeStyles,
  FontWeights,
  Checkbox,
  Pivot,
  PivotItem,
  Link as FLink,
  Dropdown,
  Label,
  DetailsList,
  DetailsRow,
  ComboBox,
  SelectionMode,
  TagPicker,
  ChoiceGroup,
  Dialog,
} from "office-ui-fabric-react";
export { useConstCallback } from "@uifabric/react-hooks";
export { Link, Route, Switch, Redirect, NavLink } from "react-router-dom";
export { useQuery, useMutation } from "@apollo/react-hooks";
export { ButtonDropdown } from "./ButtonDropdown";
export { format } from "date-fns";
export { default as Form } from "../../typical-admin-fabric/lib/templates/Form";
export { default as List } from "../../typical-admin-fabric/lib/List";

export const getStyle = () => mergeStyleSets(stylesJson(getTheme()));
export const getCurrentApp = () => {
  return document.location.pathname.split("/")[1];
};

export interface IndexableObject {
  [key: string]: any;
}

initializeIcons("./assets/fonts/");
