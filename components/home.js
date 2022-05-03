import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import * as Location from 'expo-location';

export default function Home({ navigation }) {

    const [peso, setPeso] = useState(0);
    const [altura, setAltura] = useState(0);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    let text = 'Waiting..';

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            {errorMsg ? <Text>{text}</Text> :
                <View style = {{width: '90%', flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                    <Text>Ubicacion</Text>
                    <Text>{text}</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%' }}>
                        <Text style={styles.title}>Calcular IMC</Text>
                        <TextInput placeholder="Ingresa el peso" style={styles.inputText} keyboardType="numeric" onChangeText={(value) => setPeso(parseFloat(value))} />
                        <TextInput placeholder="Ingresa la altura" style={styles.inputText} keyboardType="numeric" onChangeText={(value) => setAltura(parseFloat(value))} />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Camera', {
                            IMC: (typeof peso === 'number' && typeof altura === 'number') ?
                                (Math.round(peso / Math.pow(altura, 2))) : 'No es numero'
                        })}
                    >
                        <Text style={styles.text}>Tomar fotografia.</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: 26,
        marginBottom: 20,
    },
    inputText: {
        borderBottomWidth: 1,
        borderColor: '#2D31FA',
        width: '100%',
        margin: 10,
        padding: 2,
        borderRadius: 5,
    },
    button: {
        width: '80%',
        borderRadius: 100,
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