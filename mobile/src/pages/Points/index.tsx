import React, { useState, useEffect } from "react";
import { TouchableOpacity, ScrollView, Alert } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import api from "../../services/api";
import * as Location from "expo-location";

import {
  Container,
  Main,
  Title,
  Description,
  MapContainer,
  MyMap,
  MapMarker,
  MapMarkerContainer,
  MapMarkerImage,
  MapMarkerTitle,
  ItemsContainer,
  Item,
  ItemTitle,
} from "./styles";

interface Item {
  id: number;
  imageUrl: string;
  title: string;
}

interface Points {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
}

interface RouteParams {
  selectedUf: string;
  selectedCity: string;
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Points[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosistion] = useState<[number, number]>([
    0,
    0,
  ]);

  const navigation = useNavigation();
  const routes = useRoute();

  const routeParams = routes.params as RouteParams;

  useEffect(() => {
    api.get("/items").then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get("/points", {
        params: {
          city: routeParams.selectedCity,
          uf: routeParams.selectedUf,
          items: selectedItems,
        },
      })
      .then((response) => {
        setPoints(response.data);
      });
  }, [selectedItems]);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Ops",
          "Precisamos da sua permissão para obter sua localização!"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setInitialPosistion([latitude, longitude]);
    }

    loadPosition();
  }, []);

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleNavigateToDetail = (id: number) => {
    navigation.navigate("Detail", { point_id: id });
  };

  const handleSelectItem = (id: number) => {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      return setSelectedItems(filteredItems);
    }

    setSelectedItems([...selectedItems, id]);
  };

  return (
    <>
      <Container source={require("../../assets/home-background.png")}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" color="#34cb79" size={20} />
        </TouchableOpacity>
        <Title>Bem-vindo.</Title>
        <Description>Encontre no mapa um ponto de coleta.</Description>
        <MapContainer>
          {initialPosition[0] !== 0 && (
            <MyMap
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map(({ latitude, longitude, name, image, id }) => (
                <MapMarker
                  key={String(id)}
                  onPress={() => handleNavigateToDetail(id)}
                  coordinate={{ latitude, longitude }}
                >
                  <MapMarkerContainer>
                    <MapMarkerImage source={{ uri: image }} />
                    <MapMarkerTitle>{name}</MapMarkerTitle>
                  </MapMarkerContainer>
                </MapMarker>
              ))}
            </MyMap>
          )}
        </MapContainer>
      </Container>
      <ItemsContainer>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
        >
          {items.map((item) => (
            <Item
              activeOpacity={0.6}
              selected={selectedItems.includes(item.id)}
              key={String(item.id)}
              onPress={() => handleSelectItem(item.id)}
            >
              <SvgUri width={42} height={42} uri={item.imageUrl} />
              <ItemTitle>{item.title}</ItemTitle>
            </Item>
          ))}
        </ScrollView>
      </ItemsContainer>
    </>
  );
};

export default Points;
