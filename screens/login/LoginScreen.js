import { Button, TextInput, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/FontAwesome";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

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
    client_id: "DYLK6NWr7bxIi3R5fnLRKbWNBrKSZm4NxkGq7Ol3",
    client_secret:
      "o0j6xPxQ0DXUidurYv6iuV96K2W69DuTdrSU88JlHxDWGNf1FlWtsSVQdoppaXRKvht7iNkbgegC9OvXiWVg61WEUEXwz92gAcWvZ1oKJl740IUrpNjtRWIHZkNx3gae",
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

  const handleSubmit = () => {
    // Xử lý logic khi form được submit ở đây
    console.log(textInputValues);
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

      <TouchableOpacity
        onPress={() => {
          navigation.replace("Location");
        }}
      >
        <Text style={styles.content}>location now</Text>
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
