import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colours from '../../styles/colours';
import spacing from '../../styles/spacing';

const MetricHistory = ({ title, data }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title} (Last 5 Days)</Text>
            {data.map((entry, index) => (
                <View key={index} style={styles.entry}>
                    <Text style={styles.date}>{entry.date}</Text>
                    <Text style={styles.value}>{entry.value}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.paddingMedium,
        backgroundColor: colours.background,
        borderRadius: 10,
        marginBottom: spacing.marginMedium,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colours.textPrimary,
        marginBottom: spacing.marginSmall,
    },
    entry: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.paddingSmall,
        borderBottomWidth: 1,
        borderBottomColor: colours.divider,
    },
    date: {
        fontSize: 16,
        color: colours.textSecondary,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colours.textPrimary,
    },
});

export default MetricHistory;
