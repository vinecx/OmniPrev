import React from 'react';
import { StatusBar } from 'react-native';

const ReStatusBar = () => {
  return (
    <StatusBar
      barStyle="dark-content"
      animated
      networkActivityIndicatorVisible
      translucent
      backgroundColor="hsla(0,0%,0%, 0)"
    />
  );
};

export default ReStatusBar;
