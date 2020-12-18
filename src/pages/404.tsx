import React from "react";
import { navigate } from "@reach/router";
import { useEffect } from "react";

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    navigate("/");
  }, []);

  return null;
};

export default NotFoundPage;
