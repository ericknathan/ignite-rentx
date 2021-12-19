import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring
} from 'react-native-reanimated';

import { StatusBar, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

import { PanGestureHandler } from 'react-native-gesture-handler';

import Logo from '../../assets/logo.svg';
import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';

import { Car } from '../../components/Car'
import { AnimatedLoader } from '../../components/AnimatedLoader';

import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList,
  MyCarsButton
} from './styles';

export function Home() {
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: positionY.value },
        { translateX: positionX.value }
      ]
    };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value;

    },
    onActive: (event, ctx: any) => {
      positionY.value = ctx.positionX + event.translationY;
      positionX.value = ctx.positionY + event.translationX;
    },
    onEnd: (event, ctx) => {
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    }
  })

  const navigation = useNavigation();
  const theme = useTheme();

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car })
  }

  function handleOpenMyCars() {
    navigation.navigate('MyCars')
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    }

    fetchCars();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }, []);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)}
            height={RFValue(12)}
          />
          {
            !isLoading && 
            <TotalCars>
              Total de {cars.length} carros
            </TotalCars>
          }
        </HeaderContent>
      </Header>

      {
        isLoading ? <AnimatedLoader /> :
        <CarList
          data={cars}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => 
            <Car
              data={item}
              onPress={() => handleCarDetails(item)}
            />
          }
        />
      }
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <MyCarsButton onPress={handleOpenMyCars} style={myCarsButtonStyle}>
          <Ionicons
            name="ios-car-sport"
            size={32}
            color={theme.colors.shape}
          />
        </MyCarsButton>
      </PanGestureHandler>
    </Container>
  );
};
