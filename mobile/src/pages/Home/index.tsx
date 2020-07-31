import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import axios from "axios";
import Picker from "react-native-picker-select";

import {
  Container,
  Main,
  Title,
  Description,
  Footer,
  Button,
  ButtonIcon,
  ButtonText,
  PickerSelector,
} from "./styles";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface Picker {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<Picker[]>([]);
  const [cities, setCities] = useState<Picker[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  const handleNavigateToMap = () => {
    navigation.navigate("Points", {
      selectedUf,
      selectedCity,
    });
  };

  useEffect(() => {
    api
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then((response) => {
        const ufsInitials = response.data.map((uf) => ({
          label: uf.sigla,
          value: uf.sigla,
        }));

        setUfs(ufsInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") return;
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((uf) => ({
          label: uf.nome,
          value: uf.nome,
        }));
        setCities(cityNames);
      });
  }, [selectedUf]);

  return (
    <Container source={require("../../assets/home-background.png")}>
      <Main>
        <Image source={require("../../assets/logo.png")} />
        <Title>Seu marketplace de coleta de resíduos</Title>
        <Description>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Description>
      </Main>
      <Picker
        placeholder={{
          label: "Selecione a UF",
          value: null,
          color: "#9EA0A4",
        }}
        onValueChange={(value) => setSelectedUf(value)}
        items={ufs}
        style={{
          viewContainer: {
            backgroundColor: "#fff",
            height: 60,
            paddingTop: 5,
            borderRadius: 10,
            marginBottom: 8,
          },
        }}
      />
      <Picker
        placeholder={{
          label: "Selecione a cidade",
          value: null,
          color: "#9EA0A4",
        }}
        onValueChange={(value) => setSelectedCity(value)}
        items={cities}
        style={{
          viewContainer: {
            backgroundColor: "#fff",
            height: 60,
            paddingTop: 5,
            borderRadius: 10,
            marginBottom: 8,
          },
        }}
      />
      <Footer>
        <Button onPress={handleNavigateToMap}>
          <ButtonIcon>
            <Icon name="arrow-right" color="#FFF" size={24}></Icon>
          </ButtonIcon>
          <ButtonText>Entrar</ButtonText>
        </Button>
      </Footer>
    </Container>
  );
};

export default Home;
