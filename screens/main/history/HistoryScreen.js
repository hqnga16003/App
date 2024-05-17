import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function HistoryScreen() {
  const [userTickets, setUserTickets] = useState([]);


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
    const fetchUserTickets = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `https://ngahq10.pythonanywhere.com/ticket/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.length > 0) {
          setUserTickets(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Xử lý lỗi nếu cần
      }
    };

    fetchUserTickets();
  }, []);

  return (
    <ScrollView>
      <View>
        {userTickets.map((t, index) => {
          const formattedDate = format(new Date(t.departure_date), "dd-MM-yyyy");
          return (
            <View style = {styles.container} key={index}>
              <Text>Chuyến: {t.bus_route}</Text>
              <Text>Ghế số: {t.seat_number}</Text>
              <Text>Biển số xe: {t.bus_license_plate}</Text>
              <Text>Ngày khởi hành: {formattedDate} </Text>
              <Text>
                Giờ khởi hành: {t.departure_time.substring(0, 5)} - Giờ đến:{" "}
                {t.arrival_time.substring(0, 5)}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
    width: 70,
  },
});
