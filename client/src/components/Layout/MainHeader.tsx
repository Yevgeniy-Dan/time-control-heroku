import React from "react";

const MainHeader = () => {
  return (
    <div className="container">
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <a href="/timer" className="nav-link px-2 link-dark">
              Timer
            </a>
          </li>
          <li>
            <a href="/report" className="nav-link px-2 link-dark">
              Report
            </a>
          </li>
          <li>
            <a href="/categories" className="nav-link px-2 link-dark">
              Categories
            </a>
          </li>
          <li>
            <a href="to-do-list" className="nav-link px-2 link-dark">
              To-Do List
            </a>
          </li>
        </ul>

        <div className="col-md-3 text-end">
          <button type="button" className="btn btn-outline-primary me-2">
            Login
          </button>
          <button type="button" className="btn btn-primary">
            Sign-up
          </button>
        </div>
      </header>
    </div>
  );
};

export default MainHeader;
