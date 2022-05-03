import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

export default function Home({ navigation }) {

    let [fontsLoaded] = useFonts({
        Inter_900Black,
    });

    const [peso, setPeso] = useState(0);
    const [altura, setAltura] = useState(0);

    if (!fontsLoaded) {
        return <AppLoading />;
      }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calcular IMC</Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%' }}>
                <TextInput placeholder="Ingresa el peso" style={styles.inputText} keyboardType="numeric" onChangeText={(value) => setPeso(parseFloat(value))} />
                <TextInput placeholder="Ingresa la altura" style={styles.inputText} keyboardType="numeric" onChangeText={(value) => setAltura(parseFloat(value))} />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('barra', {
                    IMC: (typeof peso === 'number' && typeof altura === 'number') ?
                        (Math.round(peso / Math.pow(altura, 2))) : 'No es numero'
                })}
            >
                <Text style={styles.text}>Tomar fotografia.</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 250
    },
    title: {
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: 26,
        marginBottom: 20,
        fontFamily: 'Inter_900Black'
    },
    inputText: {
        borderBottomWidth: 1,
        borderColor: '#2D31FA',
        width: '85%',
        margin: 10,
        padding: 2,
        borderRadius: 5,
    },
    button: {
        width: '60%',
        borderRadius: 200,
        padding: 10,
        backgroundColor: '#051367',
        marginTop: 20,
    },
    text: {
        textAlign: 'center',
        color: '#DFF6FF',
        fontSize: 20,
    }
})