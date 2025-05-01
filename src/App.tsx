import React from "react";
import "./App.css";
import NavBarSmall from "./components/navigation/navBarSmall/NavBarSmall";
import ContentSection from "./components/content/ContentSection";

const App: React.FC = () => {
  return (
    <div className="app">
      <NavBarSmall />
      <ContentSection />
    </div>
  );
};

export default App;
