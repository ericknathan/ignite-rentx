import styled, { css } from 'styled-components/native';
import { TextInput } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface Props {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.View`
  width: 100%;
  height: 56px;

  flex-direction: row;

  margin-bottom: 8px;
`;

export const IconWrapper = styled.View<Props>`
  height: 100%;
  width: 55px;
  justify-content: center;
  align-items: center;

  margin-right: 2px;
  
  background-color: ${({ theme }) => theme.colors.background_secondary};

  ${({ theme, isFocused, isFilled }) => (isFocused || isFilled) && css`
    border-bottom-width: 2px;
    border-bottom-color: ${theme.colors.main};
  `}
`;

export const InputText = styled(TextInput)<Props>`
  flex: 1;

  background-color: ${({ theme }) => theme.colors.background_secondary};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary_400};
  font-size: ${RFValue(15)}px;

  padding: 0 23px;

  ${({ theme, isFocused, isFilled }) => (isFocused || isFilled) && css`
    border-bottom-width: 2px;
    border-bottom-color: ${theme.colors.main};
  `}
`;