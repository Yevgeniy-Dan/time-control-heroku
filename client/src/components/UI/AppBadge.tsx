import React, { useEffect } from "react";
import { Badge } from "react-bootstrap";

import classes from "./AppBadge.module.css";

const AppBadge: React.FC<
  React.PropsWithChildren<{ onClick: () => void; title: string }>
> = ({ onClick, title }) => {
  return (
    <div
      className={`d-flex align-items-center justify-content-center ${classes.categoryBadgeContainer}`}
    >
      <Badge onClick={onClick} bg="primary" className={classes.categoryBadge}>
        {title}
      </Badge>
    </div>
  );
};

export default AppBadge;
