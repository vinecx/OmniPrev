import React from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Style from '../../../../commons/Style';

const ImageCard: React.FC<{ image: string; onDelete: () => void }> = ({
  image,
  onDelete,
}) => (
  <ImageBackground
    source={{
      uri: image,
    }}
    imageStyle={{
      borderRadius: 10,
    }}
    style={{ height: 110, width: 110, marginHorizontal: 5 }}>
    <TouchableOpacity
      style={{
        position: 'absolute',
        top: 6,
        right: 6,
      }}
      onPress={() => onDelete()}>
      <Icon
        name="closecircle"
        color={Style.theme.error[50]}
        size={30}
        style={{
          elevation: 5,
          backgroundColor: 'white',
          borderRadius: 50,
        }}
      />
    </TouchableOpacity>
  </ImageBackground>
);

export default ImageCard;
