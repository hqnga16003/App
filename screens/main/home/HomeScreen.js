import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Button, Card, Divider } from "@rneui/themed";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function HomeScreen({ navigation }) {
  const [locations, setLocations] = useState([]);
  const [language1, setLanguage1] = useState("");
  const [language2, setLanguage2] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [day, setDay] = useState("");

  const [busRoutes, setBusRoutes] = useState([]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (token !== null) {
        console.log("Token đã được lấy:", token);
        return token;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi lấy token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          "https://ngahq10.pythonanywhere.com/locations/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.length > 0) {
          setLocations(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Xử lý lỗi nếu cần
      }
    };

    fetchData();
  }, []);

  const handleConfirm = () => {
    setModalVisible(false);
  };

  const handleDayPress = (day) => {
    setDay(day.dateString); // Lưu ngày đã chọn vào biến state
    setModalVisible(false); // Đóng Modal sau khi chọn ngày
  };

  // call api get all routes
  const handleBusRoutes = async () => {
    try {
      const token = await getToken();
      const id_departure = parseInt(language1);
      const id_arrival = parseInt(language2);

      const response = await fetch(
        `https://ngahq10.pythonanywhere.com/busSchedule/?id_departure_point=${id_departure}&id_arrival_point=${id_arrival}&departure_date=${day}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (Array.isArray(data)) {
        console.log(data);
        setBusRoutes(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Xử lý lỗi nếu cần
    }
  };

  // Hàm định dạng số tiền
  const formatCurrency = (amount) => {
    // Sử dụng hàm toLocaleString để định dạng số tiền theo định dạng tiền tệ của Việt Nam
    const formattedAmount = amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    // Đảo ngược vị trí của ký hiệu tiền tệ và số tiền
    const reversedFormattedAmount = formattedAmount.replace(" VND", "");

    return reversedFormattedAmount;
  };

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
          <Text style={{ color: "black", fontSize: 22, minWidth: 100 }}>
            Điểm đi:
          </Text>
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
          <Text style={{ color: "black", fontSize: 20, minWidth: 100 }}>
            Điểm đến:
          </Text>
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

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 20,
              minWidth: 100,
            }}
          >
            Ngày đi:
          </Text>

          <View>
            <TouchableOpacity
              style={{
                height: 50,
                width: 150,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ fontSize: 20 }}>{day ? day : "Chọn ngày"}</Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  onPress: () => {
                    setModalVisible(false);
                  },
                }}
              >
                <View style={{ backgroundColor: "#fff", padding: 20 }}>
                  <Calendar
                    style={{ width: 300, height: 330 }}
                    onDayPress={handleDayPress}
                    markedDates={{
                      [day]: {
                        selected: true,
                        disableTouchEvent: true,
                      },
                    }}
                  />
                  <Button
                    title="Đóng"
                    onPress={() => setModalVisible(!modalVisible)}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleBusRoutes}>
          <Text style={{ fontSize: 16, color: "white" }}>Xem chuyến xe</Text>
        </TouchableOpacity>

        {/* // tat ca chuyen xe */}
        <Divider />
        <ScrollView style={{ width: 500 }}>
          {busRoutes.map((b, index) => {
            return (
              <ImageBackground
                source={{
                  uri: "https://cdn3.vectorstock.com/i/1000x1000/30/72/bus-driving-to-school-background-flat-style-vector-21743072.jpg",
                }}
                style={{ padding: 50 }}
              >
                <View key={index}>
                  <Card.Title style={styles.whiteColor}>
                    {b.bus_route}
                  </Card.Title>
                  <Card.Divider />
                  <View style={{ position: "relative", alignItems: "center" }}>
                    <Text style={{margin: 5,...styles.whiteColor}}>
                      Thời gian: {b.departure_time.substring(0, 5)} -{" "}
                      {b.arrival_time.substring(0, 5)}
                    </Text>

                    <Text style={styles.whiteColor}>
                      Giá vé: {formatCurrency(b.total)}
                    </Text>
                    {/* <Image
                    style={{ width: '100%', height: 100, margin: 10 }}
                    resizeMode="contain"
                    source={{
                      uri: "https://t4.ftcdn.net/jpg/00/54/07/93/360_F_54079317_chS5Sx0ThtNDy9Pgp9au4r4ruHgVYbw0.jpg",
                    }}
                  /> */}
                    <Button
                      style={styles.button}
                      onPress={() =>
                        navigation.replace("Ticket", { busRouteId: b.id })
                      }
                    >
                      Xem vé xe
                    </Button>
                  </View>
                </View>
              </ImageBackground>
            );
          })}
        </ScrollView>
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
  content: {
    fontSize: 16,
    color: "#005FFF",
  },
  buttonContainer: {
    backgroundColor: "#005FFF",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#005FFF",
    width: 200,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  scrollView: {},
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 20, // Đảm bảo khoảng cách dưới cùng của nội dung
  },
  whiteColor: { color: "white", fontSize: 20 },
});
