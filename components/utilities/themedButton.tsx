import React, { useState } from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, View, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from './themedText';

export type ThemedButtonVisualProps = {
  type?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
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
  padH
}: ThemedButtonProps) {
  const buttonStyles = [
    styles.button,
    {paddingVertical: padV ?? 12, paddingHorizontal: padH ?? 24},
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

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} >
      <Animated.View
        style={[
          buttonStyles,
          { transform: [{ scale }] },
        ]}
      > 
        
        <View style={[{flexDirection: onTop ? "column" : "row"}]}>
        {icon && (
          <View style={[styles.iconContainer, {marginBottom: onTop ? 5 : 0, marginRight: onTop ? 0 : 10}]}>
            <MaterialCommunityIcons name={icon} size={20}  />
          </View>
        )}
        
        {title && <ThemedText variant='bold'>{title}</ThemedText>}
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
