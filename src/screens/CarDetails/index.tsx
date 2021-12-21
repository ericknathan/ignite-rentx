import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useNetInfo } from '@react-native-community/netinfo';

import { Car as ModelCar } from '../../database/model/Car';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import {
  Container,
  HeaderWrapper,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  About,
  Footer,
  OfflineInfo
} from './styles';

interface Params {
  car: ModelCar;
}

export function CarDetails() {
  const [updatedCar, setUpdatedCar] = useState<CarDTO>({} as CarDTO);
  
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params as Params;

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 200],
        [200, 70],
        Extrapolate.CLAMP
      )
    }
  });

  const sliderCarsStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 150],
        [1, 0],
        Extrapolate.CLAMP
      )
    }
  });

  function handleConfirmRental() {
    navigation.navigate('Scheduling', {
      car
    });
  }

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchUpdatedCar() {
      const response = await api.get(`/cars/${car.id}`);
      setUpdatedCar(response.data);
    }

    if(netInfo.isConnected === true) {
      fetchUpdatedCar();
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <HeaderWrapper
        style={[headerStyleAnimation]}
      >
        <Header>
          <BackButton onPress={handleBack} />
        </Header>

        <CarImages style={[sliderCarsStyleAnimation]}>
          <ImageSlider imagesUrl={
            !!updatedCar.photos ?
              updatedCar.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
          }/>
        </CarImages>
      </HeaderWrapper>

      <Content
        onScroll={scrollHandler}
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {netInfo.isConnected === true ? car.price : '...'}</Price>
          </Rent>
        </Details>

        {
          updatedCar.accessories &&
          <Accessories>
            {
              updatedCar.accessories.map(accessory => (
                <Accessory
                  key={accessory.type}  
                  name={accessory.name}
                  icon={getAccessoryIcon(accessory.type)}
                />
              ))
            }
          </Accessories>
        }

        <About>{car.about}</About>
      </Content>

      <Footer>
        <Button
          title="Escolher período do aluguel"
          onPress={handleConfirmRental}
          enabled={netInfo.isConnected === true}
        />

        {
          netInfo.isConnected === false &&
          <OfflineInfo>
            Conecte-se à internet para ver mais detalhes e agendar seu carro
          </OfflineInfo>
        }
      </Footer>
    </Container>
  );
};
