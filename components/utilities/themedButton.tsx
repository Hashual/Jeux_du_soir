import React, { useState } from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, View, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from './themedText';

export type ThemedButtonVisualProps = {
  type?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: string; 
  text_position?: 'left' | 'center' | 'right';
  textColor?: string; // couleur du texte et de l'icône
}

export type ThemedButtonProps = ThemedButtonVisualProps & {
  title?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onTop?: boolean;
  onPress: () => void;
  padV?: number;
  padH?: number;
};

export function ThemedButton({
  title,
  icon,
  onTop,
  onPress,
  type = 'primary',
  style,
  padV,
  padH,
  color = '#3498db',
  text_position = 'left',
  textStyle,
  textColor,
  }: ThemedButtonProps) {
  const buttonStyles = [
    styles.button,
    { 
      paddingVertical: padV ?? 12, 
      paddingHorizontal: padH ?? 24, 
      backgroundColor: color
    },
    style,
  ];

  const [scale] = useState(new Animated.Value(1)); 

  const onPressIn = () => {
    Animated.timing(scale, {
      toValue: 0.8,
      duration: 80,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };
  
  const onPressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 80,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  let justifyContent: ViewStyle["justifyContent"] = "flex-start";
  if (text_position === "center") justifyContent = "center";
  else if (text_position === "right") justifyContent = "flex-end";

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} >
      <Animated.View
        style={[
          buttonStyles,
          { transform: [{ scale }] },
        ]}
      > 
        <View style={{flexDirection: onTop ? "column" : "row", justifyContent, alignItems: onTop ? justifyContent : "center", width: "100%"}}>
          {icon && (
            <View style={[styles.iconContainer, {marginBottom: onTop ? 5 : 0, marginRight: onTop ? 0 : 10, borderColor: textColor}]}>
              <MaterialCommunityIcons name={icon} size={20} color={textColor} />
            </View>
          )}
          {title && <ThemedText variant='bold' align={text_position} style={textStyle} color={textColor}>{title}</ThemedText>}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  iconContainer: {
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 2
  },
});
