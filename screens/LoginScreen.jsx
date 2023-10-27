import { KeyboardAvoidingView, TextInput, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MainButton from "../components/common/buttons/MainButton";
import SecondaryButton from "../components/common/buttons/SecondaryButton";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import DismissibleAlert from "../components/common/alerts/DismissibleAlert";
import { registerIndieID } from "native-notify";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState({
    visibility: false,
    viewStyles: "border border-4 border-red-600",
    title: null,
    titleStyles: "text-red-600",
    message: null,
    messageStyles: "text-red-600 font-bold",
  });
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const handleLogin = () => {
    if (!email || !password) {
      setIsError((prev) => ({
        ...prev,
        visibility: true,
        title: "Error !",
        message: "Please enter email and password !",
      }));
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signed in with ", user.email);

        //register notify
        registerIndieID(user.uid, 13599, "gTBeP5h5evCxHcHdDs0yVQ");
      })
      .catch((error) => {
        console.log(error.code, error.message);
        if (error.code === "auth/invalid-email") {
          setIsError((prev) => ({
            ...prev,
            visibility: true,
            title: "Error !",
            message: "Please enter a valid email !",
          }));
        } else if (error.code === "auth/invalid-login-credentials") {
          setIsError((prev) => ({
            ...prev,
            visibility: true,
            title: "Error !",
            message: "Invalid email or password !",
          }));
        } else {
          setIsError((prev) => ({
            ...prev,
            visibility: true,
            title: "Error !",
            message: error.message + " - " + error.code,
          }));
        }
      });
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      className="flex-1 mt-4 justify-center items-center"
    >
      {isError.visibility && (
        <DismissibleAlert data={isError} setData={setIsError} />
      )}
      <Text className="text-3xl text-dark-blue font-bold mb-4 text-center">
        Welcome !
      </Text>
      <View className="w-4/5">
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          type="email"
          required
        />
         <View style={{ position: 'relative' }}>
          <TextInput
            className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl pr-30"
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={isPasswordHidden} 
            required
            type="password"
          />
          <TouchableOpacity
            onPress={() => setIsPasswordHidden(!isPasswordHidden)} 
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              paddingRight: 10,
            }}
          >
            <FontAwesomeIcon
              icon={isPasswordHidden ? faEye : faEyeSlash}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <MainButton
          containerStyles={"mt-4"}
          onPress={handleLogin}
          text="Login"
        />
        <SecondaryButton
          containerStyles={"mt-2"}
          onPress={() => navigation.replace("Register")}
          text="Register"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
