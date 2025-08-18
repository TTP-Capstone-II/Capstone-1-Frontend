import React from "react";
import LandingPage from "../pages/LandingPage";

const Home = ({ user }) => {
  return (
    <div className="nav-links">
      {user ? (
        <div> test </div>
      ) : (
        <LandingPage/>
      )}
    </div>
  );
};

export default Home;