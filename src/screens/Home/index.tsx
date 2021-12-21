import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

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
  CarList
} from './styles';

export function Home() {
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car })
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchCars() {
      try {
        const response = await api.get('/cars');
        if(isMounted) {
          setCars(response.data);
        }
      } catch (error) {
        console.log(error)
      } finally {
        if(isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCars();
    return () => {
      isMounted = false;
    }
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
    </Container>
  );
};
