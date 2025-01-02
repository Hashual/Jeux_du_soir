import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

const textAlign = {
  left: 'left',
  center: 'center',
  right: 'right',
} as const;

export type ThemedTextProps = TextProps & {
  variant?: keyof typeof styles,
  align?: keyof typeof textAlign,
};

export function ThemedText({variant, align, style, ...rest}: ThemedTextProps) {

  return (
    <Text style={[styles[variant ?? "default"], {textAlign: align ?? "left"},  style]} {...rest}></Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  bold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: "Pacifico"
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: "Pacifico",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fs10: {
    fontSize: 10,
  },
  fs14: {
    fontSize: 14,
  },
  fs20: {
    fontSize: 20,
  }
});
