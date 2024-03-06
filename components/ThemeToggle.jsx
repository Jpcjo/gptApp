"use client";

import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useState } from "react";

const themes = {
  winter: "winter",
  dracula: "dracula",
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(themes.winter);

  const toggleTheme = () => {
    const newTheme = theme === themes.winter ? themes.dracula : themes.winter;
    document.documentElement.setAttribute("data-theme", newTheme);
    // documnet.documentElemet is to access the root of html
    // setAttribute is to add attribute and name. for example:
    // setAttribute("id", button) will be < id="button" />
    setTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === "winter" ? (
        <BsMoonFill className="h-4 w-4 " />
      ) : (
        <BsSunFill className="h-4 w-4" />
      )}
    </button>
  );
};
export default ThemeToggle;

// "use client";
// import React, { useState, useEffect } from "react";
// import { BsMoonFill, BsSunFill } from "react-icons/bs";

// const themes = {
//   winter: "winter",
//   dracula: "dracula",
// };

// const ThemeToggle = () => {
//   const [currentTheme, setCurrentTheme] = useState(themes.winter);
//   console.log(currentTheme);

//   const toggleTheme = () => {
//     setCurrentTheme((prevTheme) =>
//       prevTheme === themes.winter ? themes.dracula : themes.winter
//     );
//   };

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", currentTheme);
//   }, [currentTheme]);

//   return (
//     <div className="btn btn-sm btn-outline" onClick={toggleTheme}>
//       {currentTheme === themes.winter ? (
//         <BsMoonFill className="h-4 w-4 " />
//       ) : (
//         <BsSunFill className="h-4 w-4" />
//       )}{" "}
//       Theme
//     </div>
//   );
// };

// export default ThemeToggle;
