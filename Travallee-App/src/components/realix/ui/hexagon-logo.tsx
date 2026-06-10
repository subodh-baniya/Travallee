import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/app/color';

interface HexagonLogoProps {
  size?: number;
  text?: string;
}

export const HexagonLogo: React.FC<HexagonLogoProps> = ({
  size = 100,
  text = 'GG',
}) => {
  return (
    <View style={[styles.container, { width: size, height: size * 1.15 }]}>
      <View style={[styles.hexagon, { width: size, height: size * 0.58 }]}>
        <View
          style={[
            styles.hexagonTop,
            {
              borderLeftWidth: size / 2,
              borderRightWidth: size / 2,
              borderBottomWidth: size * 0.29,
            },
          ]}
        />
        <View
          style={[
            styles.hexagonBody,
            { width: size, height: size * 0.58 },
          ]}
        />
        <View
          style={[
            styles.hexagonBottom,
            {
              borderLeftWidth: size / 2,
              borderRightWidth: size / 2,
              borderTopWidth: size * 0.29,
            },
          ]}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.text, { fontSize: size * 0.35 }]}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagon: {
    position: 'relative',
  },
  hexagonTop: {
    width: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.primary,
  },
  hexagonBody: {
    backgroundColor: Colors.primary,
  },
  hexagonBottom: {
    width: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.background,
    fontWeight: '700',
  },
});

export default HexagonLogo;
