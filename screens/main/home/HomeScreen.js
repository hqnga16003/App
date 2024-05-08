import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";

export default function HomeScreen() {
  const [locations, setLocations] = useState([]);
  const [language1, setLanguage1] = useState("");
  const [language2, setLanguage2] = useState("");

  useEffect(() => {
    fetch("https://ngahq10.pythonanywhere.com/locations/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 2LnxVEfADCyyphZb618nnsoLJDEu37`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setLocations(data);
        }
      }); // chạy lại
  }, []);
  return (
    <ImageBackground
      source={{
        uri: "https://w0.peakpx.com/wallpaper/410/758/HD-wallpaper-van-mountains-travel-nature-vector-art.jpg",
      }}
      style={styles.container}
    >
      <Text style={{ color: "black", textAlign: "center", fontSize: 30 }}>
        location
      </Text>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black", fontSize: 20 }}>Điểm đi:</Text>
          <Picker
            selectedValue={language1}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => setLanguage1(itemValue)}
          >
            {locations.map((locate, index) => (
              <Picker.Item key={index} label={locate.name} value={locate.id} />
            ))}
          </Picker>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black", fontSize: 20 }}>Điểm đến:</Text>
          <Picker
            selectedValue={language2}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => setLanguage2(itemValue)}
          >
            {locations.map((locate, index) => (
              <Picker.Item key={index} label={locate.name} value={locate.id} />
            ))}
          </Picker>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
