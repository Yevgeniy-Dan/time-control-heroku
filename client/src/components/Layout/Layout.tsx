import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

import MainHeader from "./MainHeader";

const Layout: React.FC = () => {
  return (
    <Fragment>
      <MainHeader />
      <main className="container">
        <Outlet />
      </main>
    </Fragment>
  );
};

export default Layout;
