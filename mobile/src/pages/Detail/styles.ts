import styled from "styled-components/native";
import Constants from 'expo-constants';
import { RectButton } from "react-native-gesture-handler";

export const Container = styled.ImageBackground.attrs({
  imageStyle: {
    width: 274,
    height: 368,
  },
})`
  flex: 1;
  padding: 32px;
  padding-top: ${20 + Constants.statusBarHeight}px;
`;

export const PointImage = styled.Image.attrs({
  resizeMode: "cover",
})`
  width: 100%;
  height: 120px;
  border-radius: 10px;
  margin-top: 32px;
`;

export const PointName = styled.Text`
  color: #322153;
  font-size: 28px;
  font-family: "Ubuntu_700Bold";
  margin-top: 24px;
`;

export const PointItems = styled.Text`
  font-family: "Roboto_400Regular";
  font-size: 16px;
  line-height: 24px;
  margin-top: 8px;
  color: #6c6c80;
`;

export const Address = styled.View`
  margin-top: 32px;
`;

export const AddressTitle = styled.Text`
  color: #322153;
  font-family: "Roboto_500Medium";
  font-size: 16px;
`;

export const AddressContent = styled.Text`
  color: #6c6c80;
  font-family: "Roboto_400Regular";
  line-height: 24px;
  margin-top: 8px;
`;

export const Footer = styled.View`
  /* border-top-width: StyleSheet.hairlineWidth, */
  border-color: #999;
  padding: 20px 32px;
  flex-direction: row;
  justify-content: space-between;
`;

export const Input = styled.View`
  height: 60px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 8px;
  padding: 0px 24px;
  font-size: 16px;
`;

export const Button = styled(RectButton)`
  width: 48%;
  background-color: #34cb79;
  height: 50px;
  flex-direction: row;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-family: "Roboto_500Medium";
  font-size: 16px;
  margin-left: 8px;
`;
