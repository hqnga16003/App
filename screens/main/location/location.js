import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Location({ navigation }) {
  // const location
  const [language1, setLanguage1] = useState('');
  const [language2, setLanguage2] = useState('');


  useEffect(() => {
    fetch("https://ngahq10.pythonanywhere.com/locations/",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 2LnxVEfADCyyphZb618nnsoLJDEu37`,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data)); // chạy lại
  }, [])
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "black" }}>location</Text>
    
      <Picker
        selectedValue={language1}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) =>
          setLanguage1(itemValue)
        }>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
        <Picker.Item label="Python" value="python" />
        <Picker.Item label="C#" value="csharp" />
        <Picker.Item label="Ruby" value="ruby" />
      </Picker>

      <Picker
        selectedValue={language2}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) =>
          setLanguage2(itemValue)
        }>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
        <Picker.Item label="Python" value="python" />
        <Picker.Item label="C#" value="csharp" />
        <Picker.Item label="Ruby" value="ruby" />
      </Picker>
    </View>
  );
}
