import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function ProfileScreen({navigation}) {
  const [user, setUser] = useState({});

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
    const fetchUserCurrent = async () => {
      const token = await getToken();
      try {
        const response = await fetch(
            "https://ngahq10.pythonanywhere.com/users/current",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
       

        const user = await response.json();

        if (typeof user == "object") setUser(user);
        else throw new Error("");
      } catch (error) {
        console.log("Lỗi khi lấy user:", error);
      }
    };

    fetchUserCurrent();
  }, []);

  //logout 
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@token");
      console.log("Đã xóa token");
      navigation.replace("Login");
    } catch (error) {
      console.log("Lỗi khi xóa token:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        style={{ width: "100%", height: 200 }} // Chỉ định giá trị kích thước là số, không cần đơn vị đo lường
        resizeMode="contain"
        source={{
          uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        }}
      />
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.info}>{user.username}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "red",
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
