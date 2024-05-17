import { Alert, Button, TextInput, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email address."),
  password: Yup.string().min(8).required("Please enter your password."),
  confirmPassword: Yup.string()
    .min(8)
    .oneOf([Yup.ref("password")], "Your password do not match.")
    .required("Confirm password is required"),
});

export default function RegisterScreen({ navigation }) {
  const [textInputValues, setTextInputValues] = useState({
    username: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const handleInputChange = (inputName, text) => {
    setTextInputValues({
      ...textInputValues,
      [inputName]: text,
    });
  };

  const handleSubmit = () => {
    fetch("https://ngahq10.pythonanywhere.com/users/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        // 'Content-type': 'application/json'
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(textInputValues),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id != null) {
          Alert.alert(
            "Đăng ký thành công",
            "Mời bạn đăng nhập",
            [{ text: "OK", onPress: () => navigation.replace("Login") }],
            { cancelable: false }
          );
        } else {
          throw new Error("Đăng ký thất bại");
        }
      })
      .catch((error) => {
        Alert.alert(
          "Đăng ký tài khoản thất bại!",
          "Mời bạn đăng ký lại",
          [{ text: "OK" }],
          { cancelable: false }
        );
      });
  };
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SignupSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldTouched,
        isValid,
      }) => (
        <View style={styles.container}>
          <View>
            <Text style={[styles.text, { textAlign: "left", marginBottom: 0 }]}>
              Hi!
            </Text>
            <Text style={[{ marginBottom: 30 }, styles.content]}>
              Create a new account
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.icon}>
              <Icon name="user" size={25} color={"white"}></Icon>
            </View>
            <TextInput
              style={styles.input}
              placeholder="User Name"
              onChangeText={(text) => handleInputChange("username", text)}
            ></TextInput>
          </View>

          <View style={styles.row}>
            <View style={styles.icon}>
              <Icon name="user" size={25} color={"white"}></Icon>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={values.email}
              // onChangeText={handleChange("email")}
              onChangeText={(text) => {
                handleChange("email")(text);
                handleInputChange("email", text);
              }}
              
              onBlur={() => setFieldTouched("email")}
            ></TextInput>
          </View>
          {touched.email && errors.email && (
            <Text style={styles.errorTxt}>{errors.email}</Text>
          )}

          <View style={styles.row}>
            <View style={styles.icon}>
              <Icon name="lock" size={25} color={"white"}></Icon>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={(text) => {
                handleInputChange("password", text);
                handleChange("password")(text);
              }}
              secureTextEntry={true}
              value={values.password}
              onBlur={() => setFieldTouched("password")}
            ></TextInput>
          </View>
          {touched.password && errors.password && (
            <Text style={styles.errorTxt}>{errors.password}</Text>
          )}

          <View style={styles.row}>
            <View style={styles.icon}>
              <Icon name="lock" size={25} color={"white"}></Icon>
            </View>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Confirm Password"
              onChangeText={(text) => {
                handleInputChange("retypePassword", text);
                handleChange("confirmPassword")(text);
              }}
              value={values.confirmPassword}
              onBlur={() => setFieldTouched("confirmPassword")}
            ></TextInput>
          </View>
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.errorTxt}>{errors.confirmPassword}</Text>
          )}

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={{ margin: 20, flexDirection: "row" }}>
            <Text style={{ paddingRight: 5, fontSize: 14 }}>
              Already have an account?
            </Text>
            <TouchableOpacity
              style={{ paddingTop: 0 }}
              onPress={() => {
                navigation.replace("Login");
              }}
            >
              <Text style={{ fontSize: 14, color: "#005FFF" }}>Login here</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
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
    height: 50,
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
