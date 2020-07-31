import React, { useState, useEffect } from "react";
import { TouchableOpacity, Linking } from "react-native";
import {
  Feather as FeatherIcon,
  MaterialCommunityIcons as MaterialIcon,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../../services/api";
import * as MailComposer from "expo-mail-composer";

import {
  Container,
  PointImage,
  PointName,
  PointItems,
  Address,
  AddressTitle,
  AddressContent,
  Footer,
  Input,
  Button,
  ButtonText,
} from "./styles";

interface RouteParams {
  point_id: number;
}

interface Data {
  point: {
    email: string;
    whatsapp: string;
    image: string;
    city: string;
    uf: string;
    name: string;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routParams = route.params as RouteParams;

  useEffect(() => {
    api.get(`/points/${routParams.point_id}`).then((response) => {
      setData(response.data);
    });
  }, []);

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone={${data.point.whatsapp}}&text='Tenho interesse na coleta de resíduos'`
    );
  };

  const handleComposeEmail = () => {
    MailComposer.composeAsync({
      subject: "Interesse na coleta de resíduos",
      recipients: [data.point.email],
    });
  };

  if (!data.point) {
    return null;
  }

  return (
    <>
      <Container source={require("../../assets/home-background.png")}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <FeatherIcon name="arrow-left" color="#34cb79" size={20} />
        </TouchableOpacity>
        <PointImage source={{ uri: data.point.image }} />
        <PointName>{data.point.name}</PointName>
        <PointItems>
          {data.items.map((item) => item.title).join(", ")}
        </PointItems>
        <Address>
          <AddressTitle>Endereço</AddressTitle>
          <AddressContent>
            {data.point.city}, {data.point.uf}
          </AddressContent>
        </Address>
      </Container>
      <Footer>
        <Button onPress={handleWhatsapp}>
          <MaterialIcon name="whatsapp" color="#FFF" size={20} />
          <ButtonText>Whatsapp</ButtonText>
        </Button>
        <Button onPress={handleComposeEmail}>
          <MaterialIcon name="email" color="#FFF" size={20} />
          <ButtonText>E-mail</ButtonText>
        </Button>
      </Footer>
    </>
  );
};

export default Detail;
