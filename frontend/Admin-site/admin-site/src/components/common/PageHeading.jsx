import React from "react";

const PageHeading = ({ eyebrow = "Workspace", title, description }) => (
  <div className="admin-page-heading">
    <div>
      <p className="admin-page-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className="admin-page-description">{description}</p>}
    </div>
  </div>
);

export default PageHeading;
