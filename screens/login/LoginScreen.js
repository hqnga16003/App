import { Button } from "react-native";
import {View,Text,StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native"

export default function LoginScreen({navigation}){

    return(
    <View style = {styles.container}>
        <Text style = {styles.text}>Login Screen</Text>
        <Button
          title="Login"
          onPress={() => {
            console.log("aaaa"); // Print "oke" to the console
            navigation.replace('Main'); // Navigate to 'main' Screen
        }}
      />
    </View>)
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    text:{
        fontSize:24,
        fontWeight:"bold",
        marginBottom:16
    }
})