import React from "react";
import { Link, Stack, getStyle } from "../../../lib";
import { getTheme } from "./index";

interface Props {
  to: any;
  children: any;
  className?: string;
  active?: boolean;
}

export const HeaderLink: React.FC<Props> = ({
  to,
  children,
  className = "",
  active
}) => {
  const theme = getTheme();
  const style = getStyle();

  return (
    <Link to={to}>
      <Stack
        verticalAlign={"center"}
        className={style.headerLinkContainer}
        style={
          active
            ? {
                borderTop: `0.308em solid ${theme.palette.themePrimary}`,
                borderBottom: `0.308em solid ${theme.palette.themeTertiary}`
              }
            : {
                borderTop: `0.308em solid ${theme.palette.themePrimary}`,
                borderBottom: `0.308em solid ${theme.palette.themePrimary}`
              }
        }
      >
        <span className={`${style.headerLink} ${className}`}>{children}</span>
      </Stack>
    </Link>
  );
};
