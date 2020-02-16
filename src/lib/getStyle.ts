import { IStyle } from "@uifabric/styling";
import { ITheme, FontSizes, FontWeights } from "office-ui-fabric-react";

export interface Style {
  content: IStyle;
  sm: IStyle;
  md: IStyle;
  lg: IStyle;
  xLg: IStyle;
  xxLg: IStyle;
  xxxLg: IStyle;
  hiddenSm: IStyle;
  hiddenMd: IStyle;
  hiddenMdDown: IStyle;
  hiddenMdUp: IStyle;
  hiddenLg: IStyle;
  hiddenLgDown: IStyle;
  hiddenLgUp: IStyle;
  hiddenXl: IStyle;
  hiddenXlDown: IStyle;
  hiddenXlUp: IStyle;
  hiddenXxl: IStyle;
  hiddenXxlDown: IStyle;
  hiddenXxlUp: IStyle;
  hiddenXxxl: IStyle;
  labelHorizontal: IStyle;
  fieldHorizontal: IStyle;
  appNavLink: IStyle;
  appNavLinkActive: IStyle;
  headerIconButton: IStyle;
  headerLink: IStyle;
  headerLinkContainer: IStyle;
  iconButtonStyle: IStyle;
  dangerButton: IStyle;
  errors: IStyle;
  error: IStyle;
  hint: IStyle;
  link: IStyle;
  dropdownLink: IStyle;
  modalHeader: IStyle;
  modalBody: IStyle;
  app: IStyle;
  appLogo: IStyle;
  appHeader: IStyle;
  navBar: IStyle;
}

const style = (theme: ITheme) =>
  ({
    content: {
      position: "fixed",
      top: 50,
      paddingRight: "5vw",
      paddingLeft: "5vw",
      width: "100%",
      marginRight: "auto",
      marginLeft: "auto"
      // selectors: {
      //   "@media (min-width: 639px)": {
      //     maxWidth: 639
      //   },
      //   "@media (min-width: 1023px)": {
      //     maxWidth: 1023
      //   },
      //   "@media (min-width: 1365px)": {
      //     maxWidth: 1365
      //   }
      // }
    },
    sm: {
      width: "100%",
      selectors: {
        "@media (min-width: 479px)": {
          maxWidth: 479
        }
      }
    },
    md: {
      width: "100%",
      selectors: {
        "@media (min-width: 479px)": {
          maxWidth: 479
        },
        "@media (min-width: 639px)": {
          maxWidth: 639
        }
      }
    },
    lg: {
      width: "100%",
      selectors: {
        "@media (min-width: 479px)": {
          maxWidth: 479
        },
        "@media (min-width: 639px)": {
          maxWidth: 639
        },
        "@media (min-width: 1023px)": {
          maxWidth: 1023
        }
      }
    },
    xLg: {
      width: "100%",
      selectors: {
        "@media (min-width: 479px)": {
          maxWidth: 479
        },
        "@media (min-width: 639px)": {
          maxWidth: 639
        },
        "@media (min-width: 1023px)": {
          maxWidth: 1023
        },
        "@media (min-width: 1365px)": {
          maxWidth: 1365
        }
      }
    },
    xxLg: {
      width: "100%",
      selectors: {
        "@media (min-width: 479px)": {
          maxWidth: 479
        },
        "@media (min-width: 639px)": {
          maxWidth: 639
        },
        "@media (min-width: 1023px)": {
          maxWidth: 1023
        },
        "@media (min-width: 1365px)": {
          maxWidth: 1365
        }
      }
    },
    xxxLg: {
      width: "100%"
    },
    hiddenSm: {
      selectors: {
        "@media (max-width: 479px)": {
          display: "none"
        }
      }
    },
    hiddenMd: {
      selectors: {
        "@media (min-width: 480px) and (max-width: 639px)": {
          display: "none"
        }
      }
    },
    hiddenMdDown: {
      selectors: {
        "@media (max-width: 640px)": {
          display: "none"
        }
      }
    },
    hiddenMdUp: {
      selectors: {
        "@media (min-width: 479px)": {
          display: "none"
        }
      }
    },
    hiddenLg: {
      selectors: {
        "@media (min-width: 640px) and (max-width: 1023px)": {
          display: "none"
        }
      }
    },
    hiddenLgDown: {
      selectors: {
        "@media (max-width: 1024px)": {
          display: "none"
        }
      }
    },
    hiddenLgUp: {
      selectors: {
        "@media (min-width: 639px)": {
          display: "none"
        }
      }
    },
    hiddenXl: {
      selectors: {
        "@media (min-width: 1024px) and (max-width: 1365px)": {
          display: "none"
        }
      }
    },
    hiddenXlDown: {
      selectors: {
        "@media (max-width: 1366px)": {
          display: "none"
        }
      }
    },
    hiddenXlUp: {
      selectors: {
        "@media (min-width: 1023px)": {
          display: "none"
        }
      }
    },
    hiddenXxl: {
      selectors: {
        "@media (min-width: 1366px) and (max-width: 1919px)": {
          display: "none"
        }
      }
    },
    hiddenXxlDown: {
      selectors: {
        "@media (max-width: 1920px)": {
          display: "none"
        }
      }
    },
    hiddenXxlUp: {
      selectors: {
        "@media (min-width: 1365px)": {
          display: "none"
        }
      }
    },
    hiddenXxxl: {
      selectors: {
        "@media (min-width: 1919px)": {
          display: "none"
        }
      }
    },
    labelHorizontal: {
      paddingRight: 10
    },
    fieldHorizontal: {
      minWidth: 300
    },
    appNavLink: {
      position: "fixed",
      left: 0,
      paddingLeft: 28,
      width: 208,
      textAlign: "left",
      overflow: "hidden",
      color: theme.semanticColors.actionLink,
      textDecoration: "none",
      selectors: {
        ":hover": {
          color: theme.semanticColors.link
        }
      }
    },
    appNavLinkActive: {
      background: theme.palette.neutralLight,
      borderLeft: `3px solid ${theme.palette.themePrimary}`,
      selectors: {
        ":hover": {
          background: theme.palette.neutralLighter
        }
      }
    },
    headerIconButton: {
      color: theme.semanticColors.primaryButtonText,
      backgroundColor: theme.semanticColors.primaryButtonBackground,
      height: 50,
      width: 50,
      padding: 0,
      borderRight: `solid ${theme.palette.themeTertiary} 1px`,
      borderRadius: 0,
      selectors: {
        ":hover": {
          color: theme.semanticColors.primaryButtonTextHovered,
          backgroundColor: theme.semanticColors.primaryButtonBackgroundHovered
        },
        ":active": {
          backgroundColor: theme.semanticColors.primaryButtonBackgroundPressed
        }
      }
    },
    dangerButton: {
      background: theme.isInverted ? theme.palette.redDark : theme.palette.red,
      color: theme.isInverted
        ? theme.semanticColors.buttonText
        : theme.semanticColors.primaryButtonText,
      selectors: {
        ":hover": {
          background: theme.isInverted
            ? theme.palette.redDark
            : theme.palette.red,
          color: theme.isInverted
            ? theme.semanticColors.buttonTextHovered
            : theme.semanticColors.primaryButtonBackgroundHovered
        }
      }
    },
    link: {
      color: theme.semanticColors.link,
      textDecoration: "none",
      selectors: {
        ":hover": {
          color: theme.semanticColors.linkHovered,
          textDecoration: "underline"
        }
      }
    },
    dropdownLink: {
      color: theme.semanticColors.buttonText,
      textDecoration: "none",
      selectors: {
        ":hover": {
          color: theme.semanticColors.buttonTextHovered
        }
      }
    },
    headerLink: {
      color: theme.palette.themeLighter,
      fontSize: theme.fonts.large.fontSize,
      textDecoration: "none"
    },
    headerLinkContainer: {
      display: "inline-block",
      height: 50,
      padding: 10,
      selectors: {
        ":hover": {
          backgroundColor: theme.semanticColors.primaryButtonBackgroundHovered
        }
      }
    },
    iconButtonStyle: {
      color: theme.semanticColors.primaryButtonText,
      backgroundColor: theme.semanticColors.primaryButtonBackground,
      height: 50,
      width: 50,
      padding: 0,
      selectors: {
        ":hover": {
          color: theme.semanticColors.primaryButtonTextHovered,
          backgroundColor: theme.semanticColors.primaryButtonBackgroundHovered
        },
        ":active": {
          backgroundColor: theme.semanticColors.primaryButtonBackgroundPressed
        }
      }
    },
    errors: {
      minHeight: "1.32em",
      fontSize: "0.8em",
      marginBottom: "0.5em"
    },
    error: { color: theme.semanticColors.errorText },
    hint: { color: theme.palette.themePrimary },
    modalHeader: {
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
      fontSize: FontSizes.xLarge,
      alignItems: "center",
      fontWeight: parseInt(FontWeights.semibold.toString()),
      padding: "12px 12px 14px 24px"
    },
    modalBody: { padding: "0 24px 24px 24px" },
    app: {
      textAlign: "center",
      backgroundColor: theme.palette.themePrimary,
      color: theme.palette.white
    },
    appLogo: {
      height: "20vh",
      paddingTop: "40vh",
      fill: theme.palette.white
    },
    appHeader: {
      minHeight: "100vh",
      backgroundColor: theme.palette.themePrimary,
      alignItems: "center",
      justifyContent: "center",
      color: theme.palette.themeDarker,
      margin: 0
    },
    navBar: {
      position: "fixed",
      right: 0
    }
  } as Style);

export default style;
