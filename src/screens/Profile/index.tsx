import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';
import { useNetInfo } from '@react-native-community/netinfo';

import { Feather } from '@expo/vector-icons';
import { BackButton } from '../../components/BackButton';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  OptionsWrapper,
  Option,
  OptionTitle,
  Section
} from './styles';

export function Profile() {
  const { user, signOut, updateUser } = useAuth();
  const netInfo = useNetInfo();

  const theme = useTheme();
  const navigation = useNavigation();

  const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);
  
  function handleBack() {
    navigation.goBack();
  }

  function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit') {
    if(netInfo.isConnected === false && optionSelected === 'passwordEdit') {
      Alert.alert('Sem conexão com a internet', 'É necessário ter conexão com a internet para alterar a senha.');
    } else {
      setOption(optionSelected);
    }
  }

  async function handleAvatarSelect() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    });

    if(result.cancelled) {
      return;
    }

    if(result.uri) {
      setAvatar(result.uri);
    }
  }

  async function handleSignOut() {
    Alert.alert(
      'Tem certeza disso?',
      'Se você sair, irá precisar de internet para conectar-se novamente.',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Sair',
          onPress: () => signOut()
        }
      ]
    );
  }

  async function handleUpdateProfile() {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string().required('CNH obrigatória'),
        name: Yup.string().required('Nome obrigatório')
      });

      const data = { name, driverLicense };
      await schema.validate(data);

      await updateUser({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name,
        driver_license: driverLicense,
        avatar,
        token: user.token
      });

      navigation.navigate('Confirmation', {
        title: 'Feito!',
        message: 'Perfil atualizado com sucesso!',
        nextScreenRoute: 'Profile'
      })
    } catch (error) {
      if(error instanceof Yup.ValidationError) {
        Alert.alert('Erro na validação', error.message);
      } else {
        Alert.alert('Não foi possível atualizar o perfil');
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <Header>
            <HeaderTop>
              <BackButton
                color={theme.colors.shape}
                onPress={handleBack}
              />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather
                  name="power"
                  size={24}
                  color={theme.colors.shape}
                />
              </LogoutButton>
            </HeaderTop>

            <PhotoContainer>
              { !!avatar && <Photo source={{ uri: avatar }} /> }
              <PhotoButton onPress={handleAvatarSelect}>
                <Feather
                  name="camera"
                  size={24}
                  color={theme.colors.shape}
                />
              </PhotoButton>

            </PhotoContainer>
          </Header>

          <Content style={{ marginBottom: useBottomTabBarHeight() }}>
            <OptionsWrapper>
              <Option
                active={option === 'dataEdit'}
                onPress={() => handleOptionChange('dataEdit')}
              >
                <OptionTitle active={option === 'dataEdit'}>
                  Dados
                </OptionTitle>
              </Option>
              {
                netInfo.isConnected &&
                <Option
                  active={option === 'passwordEdit'}
                  onPress={() => handleOptionChange('passwordEdit')}
                >
                  <OptionTitle active={option === 'passwordEdit'}>
                    Trocar senha
                  </OptionTitle>
                </Option>
              }
            </OptionsWrapper>

            {
              option === 'dataEdit' ?
              <Section>
                <Input
                  iconName="user"
                  placeholder="Nome"
                  autoCorrect={false}
                  defaultValue={user.name}
                  onChangeText={setName}
                />
                <Input
                  iconName="mail"
                  editable={false}
                  defaultValue={user.email}
                />
                <Input
                  iconName="credit-card"
                  placeholder="CNH"
                  keyboardType="numeric"
                  defaultValue={user.driver_license}
                  onChangeText={setDriverLicense}
                />
              </Section>
              :
              <Section>
                <PasswordInput
                  iconName="lock"
                  placeholder="Senha atual"
                />
                <PasswordInput
                  iconName="lock"
                  placeholder="Nova senha"
                />
                <PasswordInput
                  iconName="lock"
                  placeholder="Repetir senha"
                />
              </Section>
            }

            <Button
              title="Salvar alterações"
              onPress={handleUpdateProfile}
            />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
