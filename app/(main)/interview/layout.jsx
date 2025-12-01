import React, { Suspense } from "react";
import { Infinity } from "ldrs/react";

const Layout = ({ children }) => {
  return (
    <div className={"px-5"}>
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
            width={"100%"}
          />
        }
      >
        {children}
      </Suspense>
    </div>
  );
};
export default Layout;
