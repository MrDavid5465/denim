import { initializeIcons } from "office-ui-fabric-react";
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
  Dialog
} from "office-ui-fabric-react";
export { useConstCallback } from "@uifabric/react-hooks";
export { Link, Route, Switch, Redirect, NavLink } from "react-router-dom";
export { useQuery, useMutation } from "@apollo/react-hooks";
export { ButtonDropdown } from "./ButtonDropdown";
export { format } from "date-fns";
export { default as Form } from "./Templates/Form";
export { List } from "./List";

export { getStyle } from "../components";

export interface IndexableObject {
  [key: string]: any;
}

initializeIcons();
