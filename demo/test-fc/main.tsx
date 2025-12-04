import React from "react";
import ReactDom from "react-dom/client";

console.log("React", React);
function App() {
  return (
    <div>
      <Child />
    </div>
  );
}

function Child() {
  return <div>big-react</div>;
}

ReactDom.createRoot(document.getElementById("root") as HTMLDivElement).render(
  <App />,
);
