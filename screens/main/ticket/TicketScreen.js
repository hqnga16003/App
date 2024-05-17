import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "@rneui/themed";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
const { width } = Dimensions.get("window");
const buttonWidth = (width - 40) / 3 - 10; // Độ rộng mỗi button

export default function TicketScreen({ route, navigation }) {
  // Nhận tham số busRouteId từ route.params
  const { busRouteId } = route.params;

  //re-render component
  const [ isReRender, setIsReRender ] = useState(false);

  //   id của các vét đã đặt
  const [orderedTicketID, setOrderedTicketID] = useState([]);



  // Mảng chứa các nút từ 1 đến 12
  const buttons = Array.from({ length: 12 }, (_, i) => i + 1);

  // Tạo một mảng chứa các hàng
  const rows = [];
  for (let i = 0; i < buttons.length; i += 3) {
    rows.push(buttons.slice(i, i + 3)); // Tách mảng buttons thành các phần nhỏ (3 phần tử mỗi phần)
  }

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
          `https://ngahq10.pythonanywhere.com/ticket/allTicket/?bus_schedule_id=${busRouteId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.length > 0) {
          let orderedTickets = [];
          // lấy seat_number ra để disabled các ghế đã được đặt
          data.forEach((d) => {
            orderedTickets.push(d.seat_number);
          });

          setOrderedTicketID(orderedTickets)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Xử lý lỗi nếu cần
      }
    };

    fetchData();
  }, [isReRender]);


  // đặt vé
  const orderTicket = async (seat_number) => {
    Alert.alert(
      "Xác nhận",
      `Bạn muốn đặt ghế số ${seat_number} ?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              const token = await getToken();

              const formData = new FormData();
              formData.append("bus_schedule", busRouteId);
              formData.append("seat_number", seat_number);

              const response = await fetch(
                "https://ngahq10.pythonanywhere.com/ticket/",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  body: formData,
                }
              );

              const data = await response.json();
              if (data.booking_status == "CONFIRMED") {
                setIsReRender((prevState) => !prevState);
                Alert.alert(
                  "Đặt vé thành công !",
                  "Mời bạn tiếp tục đặt vé",
                  [{ text: "OK" }],
                  { cancelable: false }
                );
              } else {
                throw new Error("");
              }
            } catch (error) {
              console.error("Error fetching data:", error);
              // Xử lý lỗi nếu cần
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
    <TouchableOpacity
    style={{marginTop: 60, ...styles.button}}
        onPress={() => {
          navigation.replace("Main");
        }}
      >
        
        <Text style={{ color:"#fff" ,...styles.content}}>
          Về trang chủ
        </Text>
      </TouchableOpacity>
    <View style={styles.container}>
     <Text style={{fontSize: 40, color:"black", marginBottom: 50}}>Tất cả ghế ngồi</Text>
      {/* Duyệt qua mảng rows để tạo các hàng */}
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          {/* Duyệt qua các nút trong từng hàng */}
          {row.map((number) => (
            <TouchableOpacity
              key={number}
              style={orderedTicketID.includes(number) ? styles.disabledButton : styles.button}
              onPress={() => orderTicket(number)}
              disabled={orderedTicketID.includes(number)}
            >
              <Icon name="chair" size={40} color="#fff" />
              <Text style={{color:"#fff", fontSize: 20}}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#005FFF",
    width: 100,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    margin: 5
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "grey",
    width: buttonWidth,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center", // Giảm độ mờ của nút khi bị vô hiệu hóa
    margin: 5
  },
});
