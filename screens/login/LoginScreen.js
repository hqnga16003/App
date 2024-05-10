import { Alert, Button, TextInput, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/FontAwesome";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";


import AsyncStorage from '@react-native-async-storage/async-storage';

// const SignupSchema = Yup.object().shape({
//   email: Yup.string()
//     .email('Invalid email')
//     .required('Please enter your email address.'),
//   password: Yup.string()
//     .min(8)
//     .required('Please enter your password.'),
// });

export default function LoginScreen({ navigation }) {
  const [textInputValues, setTextInputValues] = useState({
    client_id: "mmqa0Je637Bh1TlOqRagzxFB0qjbioyoEoSu6PXB",
    client_secret:
      "OIbtPFlaieI3tSh5pcwOdSJdxQ6x0DDe2s1a3EOOc1wBNGrwUT3ysG3GrYjV0noxwrDO5VNfQQzoAKBFvlF7Yjg9rAQX0uSuiVimAtbKEGfCd3jLdiNvtudu4YTxK6Ax",
    grant_type: "password",
    username: "",
    password: "",
  });

  const handleInputChange = (inputName, text) => {
    setTextInputValues({
      ...textInputValues,
      [inputName]: text,
    });
  };

  const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem('@token', token);
      console.log('Token đã được lưu trữ');
    } catch (error) {
      console.log('Lỗi khi lưu trữ token:', error);
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (token !== null) {
        console.log('Token đã được lấy:', token);
        return token;
      } else {
        console.log('Không tìm thấy token');
        return null;
      }
    } catch (error) {
      console.log('Lỗi khi lấy token:', error);
      return null;
    }
  };

  // Hàm xóa token
  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('@token');
      console.log('Token đã được xóa khỏi bộ nhớ');
    } catch (error) {
      console.log('Lỗi khi xóa token:', error);
    }
  };
  
  
  const handleSubmit = async () => {
    if (!textInputValues.username || !textInputValues.password) {
      Alert.alert(
        'Vui lòng điền đầy đủ thông tin tài khoản!',
        '',
        [{ text: 'OK' }],
        { cancelable: false }
      );
      return; // Dừng hàm nếu không điền đầy đủ thông tin
    }
    
    try {
      const formData = new FormData();
      formData.append("client_id", textInputValues.client_id);
      formData.append("client_secret", textInputValues.client_secret);
      formData.append("username", textInputValues.username);
      formData.append("password", textInputValues.password);
      formData.append("grant_type", textInputValues.grant_type);


      const response = await fetch(
        "https://ngahq10.pythonanywhere.com/o/token/",
        {// co headers la bi loi network request failed
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.access_token) {
       saveToken(data.access_token);
       navigation.replace("Main");
      } else {
        throw new Error("Đăng nhập thất bại!");
      }
    } catch (error) {
      Alert.alert(
        "Đăng nhập tài khoản thất bại!",
        "Mời bạn đăng nhập lại",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  };
  return (
    // <Formik
    // initialValues={{
    //   email: '',
    //   password: '',
    // }}
    // validationSchema={SignupSchema}>
    // {({values, errors, touched, handleChange, setFieldTouched, isValid, handleSubmit}) => (
    <View style={styles.container}>
      <Text style={[styles.text, { marginBottom: 0 }]}>Welcome!</Text>
      <Text style={[{ marginBottom: 30 }, styles.content]}>
        Sign in to continue
      </Text>

      <View style={styles.row}>
        <View style={styles.icon}>
          <Icon name="user" size={25} color={"white"}></Icon>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => handleInputChange("username", text)}
          // value={values.email}
          // onChangeText={handleChange('email')}
          // onBlur={() => setFieldTouched('email')}
        ></TextInput>
      </View>
      {/* {touched.email && errors.email && (
          <Text style={styles.errorTxt}>{errors.email}</Text>
      )} */}

      <View style={styles.row}>
        <View style={styles.icon}>
          <Icon name="lock" size={25} color={"white"}></Icon>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => handleInputChange("password", text)}
          // value={values.password}
          // onChangeText={handleChange('password')}
          // onBlur={() => setFieldTouched('password')}
        ></TextInput>
      </View>
      {/* {touched.password && errors.password && (
          <Text style={styles.errorTxt}>{errors.password}</Text>
      )} */}

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSubmit}
          // disabled={!isValid}
        >
          <Text style={{ fontSize: 16, color: "white" }}>Login</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 14, margin: 20, marginBottom: 5 }}>
        Don't have account?
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.replace("Register");
        }}
      >
        <Text style={styles.content}>Register now</Text>
      </TouchableOpacity>


    </View>
    // )}
    // </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#005FFF",
  },
  content: {
    fontSize: 16,
    color: "#005FFF",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1.5,
    backgroundColor: "#005FFF",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  input: {
    backgroundColor: "#dadce0",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    flex: 8,
    paddingLeft: 10,
  },
  row: {
    margin: 10,
    width: "90%",
    height: 60,
    flexDirection: "row",
  },
  buttonContainer: {
    backgroundColor: "#005FFF",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  errorTxt: {
    fontSize: 12,
    color: "#FF0D10",
  },
});
