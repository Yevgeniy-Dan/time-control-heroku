import React, { Fragment } from "react";
import MainHeader from "./MainHeader";

const Layout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <Fragment>
      <MainHeader />
      <main className="container">{props.children}</main>
    </Fragment>
  );
};

export default Layout;
