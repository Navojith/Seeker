import React, { useEffect, useState } from "react";
import { StyleSheet ,Image , View , Text , Button} from "react-native";
import { FireStore, auth, storage } from "../firebase";
import Header from '../components/header';
import * as ImagePicker from 'expo-image-picker';
import MainButton from "../components/common/buttons/MainButton";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const URL = "https://seekervision.cognitiveservices.azure.com/vision/v3.1/analyze?visualFeatures=Description";

const ImageScreen =() =>{
    const [imageUri , setImageUri] = useState('');
    const [imageUrl , setImageUrl] = useState('');
  
    const pickImage = async () =>{
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            // aspect:[4,3],
            quality:1,
        });
        console.log(result);

        if(!result.canceled){
            setImageUri(result.assets[0].uri);
            console.log(imageUri);
        }
    }

    const uploadImageToFirebaseStorage = async (imageUri) => {
      console.log('uri',imageUri);
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        console.log(blob);
        const storageRef = ref(
          storage,
          `images/${auth.currentUser.uid}/${Date.now()}.jpg`
        );
        console.log('storageref', storageRef);
        await uploadBytes(storageRef, blob);
        const image = await getDownloadURL(storageRef);
        console.log('imageurl',image);
        setImageUrl(image);
        generateTags(imageUrl);
      } catch (error) {
        console.error("Error uploading image to Firebase Storage: ", error);
        return null;
      }
    };

    // useEffect(() => {
    //   console.log(imageUrl);

      const generateTags = async(imageUrl)=>{
        console.log(imageUrl);
        const url = {
          "url" : imageUrl,
        };

      //   console.log(url);

        const response = await fetch(URL , {
          method : 'POST',
          headers : {
            'Ocp-Apim-Subscription-Key':'feffc98877e84bf59420e96d05adeb0d',
            'Content-Type': 'application/json',
          },
          body : JSON.stringify(url),  
        })

        // console.log(response);

        // if(response.ok){
          const result = await response.text();
          console.log('result',result);
        // }
      }
      // generateTags();
      // }, [imageUrl]);

    const styles = StyleSheet.create({
        container: {
            marginTop: 200,
            justifyContent: "center",
            alignItems: "center",
          },
          title: {
            fontSize : 28,
            fontWeight:'bold',
            margin:10,
          },
          itemButton: {
            backgroundColor: "#0369a1",
            color: "#fff",
            borderRadius: 30,
            padding: 10, 
            marginVertical: 10, 
            width: "40%", 
            height: 70,
          },
          buttonText: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize:30,
          },
    })

    return(
        <View>
           <Header title="Scan Item" />
            <View style={styles.container}>
             <Text style={styles.title}>Upload Image</Text>
              { /* {isTfReady && */}
                <Button title="Pick an image" onPress={pickImage}/>
                {/* } */}
             {imageUri && (
                <View>
                    <Image source={{ uri: imageUri }} style={{ width: 250, height: 250 }} />
                </View>
              )}
              <MainButton 
                onPress={() => {uploadImageToFirebaseStorage(imageUri)}} 
                text="Scan" 
                containerStyles={"mt-6 mb-12 rounded-full w-50% drop-shadow-md"}/>
              {/* {!isTfReady && <Text>Loading TFJS model...</Text>}
              {isTfReady && result === '' && <Text>Pick an image to classify!</Text>}
              {result !== '' && <Text>{result}</Text>} */}
           </View>
       </View>
       
    )

 }

export default ImageScreen;