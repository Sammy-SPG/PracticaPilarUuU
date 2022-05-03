import * as Notification from 'expo-notifications'
import { constants } from 'expo-constants'
import { addNotificationsDroppedListener } from 'expo-notifications'
import { Platform } from 'expo-modules-core'

export const getToken = async => {
    if (! constants.isDevice){
        Alert.alert ("Debes ejecutarlo en un dispositivo fisico para usar las notificaciones")
        return
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync ()
    let finalStatus = existingStatus
    if (existingStatus !== "granted"){
        const {status} = await Notifications.requetPermissionAsync()
        finalStatus = status
    } 
    if (finalStatus !== "granted") {
        Alert.alert("Debes dar el permiso para el uso de notificaciones.")
        return
    }
}
