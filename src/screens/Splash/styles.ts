import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.header};
`;

export const Box = styled(Animated.View)`
  position: absolute;
`;

export const Button = styled.Button`
`;