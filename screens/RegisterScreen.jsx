import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, FireStore } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import MainButton from "../components/common/buttons/MainButton";
import SecondaryButton from "../components/common/buttons/SecondaryButton";
import DismissibleAlert from "../components/common/alerts/DismissibleAlert";
import { registerIndieID } from "native-notify";
import { setDoc, doc } from "firebase/firestore";
import { passwordPattern } from "../util/regex/regexPatterns";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isError, setIsError] = useState({
    visibility: false,
    viewStyles: "border border-4 border-red-600",
    title: null,
    titleStyles: "text-red-600",
    message: null,
    messageStyles: "text-red-600 font-bold",
  });
  const [passwordError, setPasswordError] = useState({
    visibility: false,
    message: null,
  });
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const handleSignUp = () => {
    if (!email || !password || !fullName || !rePassword || !mobile) {
      setIsError((prev) => ({
        ...prev,
        visibility: true,
        title: "Error !",
        message: "Please fill all the fields !",
      }));
      return;
    } else if (password !== rePassword) {
      setIsError((prev) => ({
        ...prev,
        visibility: true,
        title: "Error !",
        message: "Passwords do not match !",
      }));
      return;
    } else if (mobile.length !== 10) {
      setIsError((prev) => ({
        ...prev,
        visibility: true,
        title: "Error !",
        message: "Mobile should be 10 digits !",
      }));
      return;
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          console.log("Registered user: " + user.email);
          try {
            await setDoc(doc(FireStore, "userDetails", user.uid), {
              displayedName: fullName,
              email: email,
              phoneNo: mobile,
              points: 0,
              userId: user.uid,
            });
            console.log("user details added");
          } catch (error) {
            console.log(error);
          }

          try {
            await setDoc(doc(FireStore, "notifications", user.uid), {
              lostItemNotifications: true,
              foundItemNotifications: true,
              userId: user.uid,
            });
            console.log("deafult settings configured");
          } catch (error) {
            console.log(error);
          }

          // register notify
          registerIndieID(user.uid, 13599, "gTBeP5h5evCxHcHdDs0yVQ");
        })
        .catch((error) => {
          console.log(error.code);
          if (error.code === "auth/email-already-in-use") {
            setIsError((prev) => ({
              ...prev,
              visibility: true,
              title: "Error !",
              message: "Email already in use !",
            }));
            return;
          } else if (error.code === "auth/invalid-email") {
            setIsError((prev) => ({
              ...prev,
              visibility: true,
              title: "Error !",
              message: "Please enter a valid email !",
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
    }
  };

  const handleChange = (text) => {
    if (!passwordPattern().exec(text)) {
      setPasswordError((prev) => ({
        ...prev,
        visibility: true,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
      }));
    } else {
      setPasswordError((prev) => ({
        ...prev,
        visibility: false,
        message: null,
      }));
    }
    setPassword(text);
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      className="flex-1 justify-center items-center"
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
          placeholder="Full Name"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
          type="text"
        />
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          type="email"
        />
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Mobile"
          value={mobile}
          onChangeText={(text) => setMobile(text)}
          type="tel"
        />
        <View style={{ position: "relative" }}>
          <TextInput
            className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl pr-30"
            placeholder="Password"
            value={password}
            onChangeText={(text) => handleChange(text)}
            secureTextEntry={isPasswordHidden}
            required
            type="password"
          />
          <TouchableOpacity
            onPress={() => setIsPasswordHidden(!isPasswordHidden)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
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
        {passwordError.visibility && (
          <Text className="text-red-600 font-bold">
            {passwordError.message}
          </Text>
        )}
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Re-enter Password"
          value={rePassword}
          onChangeText={(text) => setRePassword(text)}
          secureTextEntry={isPasswordHidden}
          required
          type="password"
        />
      </View>
      <View>
        <MainButton
          containerStyles={"mt-4"}
          onPress={handleSignUp}
          text="Register"
        />
        <SecondaryButton
          containerStyles={"mt-2"}
          onPress={() => navigation.replace("Login")}
          text="Login"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
