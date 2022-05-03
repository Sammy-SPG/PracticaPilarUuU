import { Camera } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


export default function CameraComponente({ route }) {
    const camareReference = useRef();
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [hasPermission, setHasPermission] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState(false);
    const [uri, setUri] = useState(null);

    //Notifications
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
  const responseListener = useRef();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
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
                await schedulePushNotification();
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
                        onPress={() => cancelPreview()}
                        activeOpacity={0.7}
                    >
                        <AntDesign name="closesquare" size={40} color="#39AEA9" style={{ marginBottom: 5 }} />
                    </TouchableOpacity>
                    <Image source={{ uri: uri }} style={styles.logo} />
                    <Text style={{ textAlign: 'center', margin: 15 }}>Tu IMC es: {route.params.IMC}</Text>
                </View>}
        </Camera>
    );
}

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Se tomo la fotografiaaa!",
            body: 'Que guapo UuU',
            data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
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