import React from "react";
import LandingPage from "../pages/LandingPage";
import Sandbox from "../pages/Sandbox";

const Home = ({ user }) => {
  return (
    <div className="nav-links">
      {user ? (
        <Sandbox />
      ) : (
        <LandingPage/>
      )}
    </div>
  );
};

export default Home;