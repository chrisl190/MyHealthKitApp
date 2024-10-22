import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import colours from '../../styles/colours';
import typography from '../../styles/typography';
import spacing from '../../styles/spacing';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HealthCardProps {
  title: string;
  value: string | number;
  unit?: string;
  time: string;
  iconName?: string;
}

const HealthCard: React.FC<HealthCardProps> = ({ title, value, unit, time, iconName }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.card}>
      <View style={styles.titleContainer}>
        <View style={styles.iconTitleContainer}>
          {iconName && (
            <Ionicons name={iconName} size={20} color={colours.blue} style={styles.icon} />
          )}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.cardTime}>{time}</Text>
      </View>
      <Animated.Text
        style={[
          styles.cardValue,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {value} {value !== 'No Data' && unit ? unit : ''}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.cardBackground,
    padding: spacing.paddingMedium,
    borderRadius: 12,
    marginBottom: spacing.marginMedium,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  cardTitle: {
    ...typography.mediumTitle,
  },
  cardTime: {
    ...typography.smallText,
  },
  cardValue: {
    ...typography.largeTitle,
    marginTop: spacing.marginSmall,
  },
});

export default HealthCard;