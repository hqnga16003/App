import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Location({ navigation }) {
  useEffect(
    fetch("https://ngahq10.pythonanywhere.com/locations/")
      .then((res) => res.json())
      .then((data) => console.log(data)), // chạy lại
    []
  );
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "black" }}>location</Text>
    </View>
  );
}
