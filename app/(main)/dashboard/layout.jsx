import React, { Suspense } from "react";
import { Infinity } from "ldrs/react";

const Layout = ({ children }) => {
  return (
    <div className={"px-5"}>
      <div className={"flex items-center justify-between mb-5"}>
        <h1 className={"text-6xl font-bold gradient-title"}>
          Industry Insights
        </h1>
      </div>
      <Suspense
        fallback={
          <Infinity
            size={"65"}
            stroke={"5"}
            speed={"1.2"}
            strokeLength={"0.15"}
            bgOpacity={"0.1"}
            color={"gray"}
            className={"mt-4"}
          />
        }
      ></Suspense>
      {children}
    </div>
  );
};
export default Layout;
