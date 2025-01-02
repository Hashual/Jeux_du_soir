import React, { useState } from 'react';
import { View } from 'react-native';

const addPlayer = (players: string[], newPlayer: string) => {
    return [...players, newPlayer];
    };

const removePlayer = (players: string[], playerToRemove: string) => {
    return players.filter(player => player !== playerToRemove);
    };

const askPlayers = () => {
return (
    <View>
        

    </View>
);
};