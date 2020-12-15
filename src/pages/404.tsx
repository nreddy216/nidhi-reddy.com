import React from "react";

import { useEffect } from 'react';
import { navigate } from "@reach/router"

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    navigate('/');
  }, []);

  return null;
};

export default NotFoundPage;
