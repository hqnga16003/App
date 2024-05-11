import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@rneui/themed";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [day, setDay] = useState("");

  const [image, setImage] = useState(null);

  const handleDayPress = (day) => {
    setDay(day.dateString); // Lưu ngày đã chọn vào biến state
    setModalVisible(false); // Đóng Modal sau khi chọn ngày
  };

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

  // Hàm xóa token
  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("@token");
      console.log("Token đã được xóa khỏi bộ nhớ");
    } catch (error) {
      console.log("Lỗi khi xóa token:", error);
    }
  };

  const uploadImage = async (imagePath) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("avatar", {
        uri: imagePath,
        type: "image/jpeg", // kiểu của ảnh, có thể thay đổi tùy thuộc vào loại ảnh bạn có
        name: "avatar.jpg", // tên của file ảnh
      });

      const response = await fetch(
        "https://ngahq10.pythonanywhere.com/users/update/",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Truyền đường dẫn ảnh vào body của yêu cầu
        }
      );

      const data = await response.json();
      if (data.message) {
        const userResponse = await fetch(
          "https://ngahq10.pythonanywhere.com/users/current",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newUser = await userResponse.json();
        setUser(newUser);
        Alert.alert("Thành công", "Đã cập nhật hình ảnh thành công");
      } else {
        // Nếu có lỗi trong quá trình xử lý yêu cầu, hiển thị thông báo lỗi
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật hình ảnh");
      }
    } catch (error) {
      // Xử lý khi có lỗi xảy ra
      console.error("Lỗi khi gửi yêu cầu:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi yêu cầu");
    }
  };

  const pickerAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied!");
    } else {
      const res = await ImagePicker.launchImageLibraryAsync();
      if (!res.canceled) {
        uploadImage(res.assets[0].uri);
      }
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
    const token = await getToken();
    const response = await fetch(
      "https://ngahq10.pythonanywhere.com/users/logout/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const message = await response.json();
    if (message.message === "Logout successful") {
      await removeToken();
      navigation.replace("Login");
    } else {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đăng xuất!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {user.avatar ? (
          <Image
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: 1,
              borderRadius: 50,
            }} // Chỉ định giá trị kích thước là số, không cần đơn vị đo lường
            resizeMode="contain"
            source={{
              uri: "https://res.cloudinary.com/dy6rtaxgh/" + user.avatar,
            }}
          />
        ) : (
          <Icon name="user" size={80} color={"black"} />
        )}
      </View>

      <TouchableOpacity style={styles.btn} onPress={pickerAvatar}>
        <Text style={{ fontSize: 16, color: "white" }}>đổi hình đại diện</Text>
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.info}>{user.username}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>

      {user.user_type === "driver" && (
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Chức vụ:</Text>
          <Text style={styles.info}>{user.user_type}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text
          style={styles.logoutText}
          onPress={() => {
            handleLogout;
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>

      {user.user_type === "driver" && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.logoutText}>lịch lái xe</Text>
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
      )}
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
    width: 70,
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
  btn: {
    backgroundColor: "#0093cf",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "black",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
