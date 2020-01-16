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
    <Link to={to} className={`${style.headerLink} ${className}`}>
      <Stack
        verticalAlign={"center"}
        className={style.headerLinkContainer}
        style={
          active
            ? {
                borderTop: `4px solid ${theme.palette.themePrimary}`,
                borderBottom: `4px solid ${theme.palette.themeTertiary}`
              }
            : {
                borderTop: `4px solid ${theme.palette.themePrimary}`,
                borderBottom: `4px solid ${theme.palette.themePrimary}`
              }
        }
      >
        {children}
      </Stack>
    </Link>
  );
};
