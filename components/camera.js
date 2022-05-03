import { Camera } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

export default function CameraComponente({ route }) {
    const camareReference = useRef();
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [hasPermission, setHasPermission] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState(false);
    const [uri, setUri] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No hay acceso a la camara</Text>;
    }


    const tomarFoto = async () => {
        if (camareReference.current) {
            const options = { quality: 0.7, base64: true }
            let photo = await camareReference.current.takePictureAsync(options);
            const { uri, base64 } = photo;
            if (base64) {
                await camareReference.current.pausePreview();
                setVistaPrevia(true);
                setUri(uri);
            } else {
                alert('No se tomo');
            }
        } else {
            console.log('No referencia a la camara');
        }
    }

    const cancelPreview = async () => {
        await camareReference.current.resumePreview();
        setVistaPrevia(false);
    };

    return (
        <Camera type={type} ref={camareReference} style={styles.camera}>
            <TouchableOpacity
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    );
                }}>
                <Ionicons name="md-camera-reverse-outline" size={50} color="#E4AEC5" />
            </TouchableOpacity>
            {!vistaPrevia ? //si es falso
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => tomarFoto()}
                    >
                        <MaterialIcons name="photo-camera" size={60} color="#E4AEC6" />
                    </TouchableOpacity>
                </View>
                : //si es verdadero
                <View style={styles.viewImage}>
                    <TouchableOpacity
                                onPress={()=>cancelPreview()}
                                activeOpacity={0.7}
                            >
                                <AntDesign name="closesquare" size={40} color="#39AEA9" style = {{marginBottom: 5}}/>
                            </TouchableOpacity>
                    <Image source={{ uri: uri }} style={styles.logo} />
                    <Text style={{textAlign: 'center', margin: 15}}>Tu IMC es: {route.params.IMC}</Text>
                </View>}
        </Camera>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
        padding: 10
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
        padding: 100,
        position: 'relative'
    },
    viewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#FFDDEE',
        padding: 20,
    },
    logo: {
        width: '100%',
        height: '60%',
        borderRadius: 50,
    },
});