import React, { useEffect, createRef } from 'react';

import ShopNavigator from './ShopNavigator';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

const NavigationContainer = props => {
    
  const isAuth = useSelector(state => !!state.auth.token);
  return <ShopNavigator isAuth={isAuth} />;
};

export default NavigationContainer;
