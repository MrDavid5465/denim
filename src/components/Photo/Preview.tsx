import React from "react";

export default React.forwardRef(
  ({ cropping, height, width }: any, ref: any) => {
    const dimension =
      width === height
        ? { height: "198px", width: "198px" }
        : width > height
        ? { height: "auto", width: "198px" }
        : { height: "198px", width: "auto" };

    return (
      <div id="preview" style={{ display: cropping ? "block" : "none" }}>
        <canvas
          style={{
            ...dimension,
            border: "dashed",
            borderRadius: 5
          }}
          ref={ref}
        />
      </div>
    );
  }
);
