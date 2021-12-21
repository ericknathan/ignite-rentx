import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons';
import {
  Container,
  IconWrapper,
  InputText
} from './styles';

import { useTheme } from 'styled-components';

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;
}

export function PasswordInput({
  iconName,
  value,
  ...props
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const theme = useTheme();

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    setIsFocused(false);

    setIsFilled(!!value);
  }

  function handlePasswordPasswordVisibilityChange() {
    setIsPasswordVisible(prevState => !prevState);
  }

  return (
    <Container>
      <IconWrapper
        isFocused={isFocused}
        isFilled={isFilled}
      >
        <Feather
          name={iconName}
          size={24}
          color={isFocused || isFilled ? theme.colors.main : theme.colors.text_detail}
        />
      </IconWrapper>
      <InputText
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...props}
        secureTextEntry={isPasswordVisible}
        isFocused={isFocused}
        isFilled={isFilled}
        autoCorrect={false}
      />

      <BorderlessButton onPress={handlePasswordPasswordVisibilityChange}>
        <IconWrapper
          isFocused={isFocused}
          isFilled={isFilled}
        >
          <Feather
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={24}
            color={theme.colors.text_detail}
          />
        </IconWrapper>
      </BorderlessButton>
    </Container>
  );
};
