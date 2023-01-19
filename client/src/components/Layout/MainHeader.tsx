import React from "react";
import { Link } from "react-router-dom";

const MainHeader = () => {
  return (
    <div className="container">
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <Link to="/timer" className="nav-link px-2 link-dark">
              Timer
            </Link>
          </li>
          <li>
            <Link to="/report" className="nav-link px-2 link-dark">
              Report
            </Link>
          </li>
          <li>
            <Link to="/report" className="nav-link px-2 link-dark">
              Categories
            </Link>
          </li>
          <li>
            <Link to="/report" className="nav-link px-2 link-dark">
              To-Do List
            </Link>
          </li>
        </ul>

        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <Link to="/login" className="nav-link px-2 link-dark">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="nav-link px-2 link-dark">
              Sign-up
            </Link>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default MainHeader;
