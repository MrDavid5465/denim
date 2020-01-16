import React from "react";
import { getStyle } from "../../lib";

interface Props {
  Icon: React.FC<any>;
}

const Index: React.FC<Props> = ({ Icon }) => {
  const style = getStyle();
  return (
    <div className={style.app}>
      <header className={style.appHeader}>
        <Icon
          className={style.appLogo}
          style={{
            fill: "#fff"
          }}
        />
      </header>
    </div>
  );
};

export default Index;
