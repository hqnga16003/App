import AsyncStorage from "@react-native-async-storage/async-storage";
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
      <View >
        {userTickets.map((t, index) => {
          return (
            <View style={styles.container} key={index}>
              <Text style={styles.title}>Chuyến: {t.bus_route}</Text>
              <Text style={styles.description}>Ghế số: {t.seat_number}</Text>
              <Text style={styles.description}>
                Biển số xe: {t.bus_license_plate}
              </Text>
              <Text style={styles.date}>
                Ngày khởi hành: {t.departure_date}{" "}
              </Text>
              <Text style={styles.date}>
                Thời gian: {t.departure_time} - {t.arrival_time}
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
