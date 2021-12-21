import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { useAuth } from '../hooks/auth';

import { AppTabRoutes } from './app.tab.routes';
import { AuthRoutes } from './auth.routes';

import { AnimatedLoader } from '../components/AnimatedLoader';

export function Routes() {
  const { user, isLoading } = useAuth();

  return (
      isLoading ? <AnimatedLoader /> : (
        <NavigationContainer>
          { user.id ? <AppTabRoutes /> : <AuthRoutes /> }
        </NavigationContainer>
      )
  );
};
