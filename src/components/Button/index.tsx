import React from 'react';
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components';

import {
  Container,
  Title
} from './styles';

interface Props {
  title: string;
  color?: string;
  onPress: () => void;
  enabled?: boolean;
  isLoading?: boolean;
}

export function Button({
  title,
  color,
  onPress,
  enabled = true,
  isLoading = false
}: Props) {
  const theme = useTheme();

  return (
    <Container
      color={color}
      onPress={onPress}
      enabled={enabled}
      style={{ opacity: (enabled === true || isLoading === false) ? 1 : .5 }}
    >
      { isLoading ? <ActivityIndicator color={theme.colors.shape} /> : <Title>{title}</Title> }
    </Container>
  );
};
