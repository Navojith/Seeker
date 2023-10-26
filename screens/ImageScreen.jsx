import React, { useEffect, useState } from "react";
import { StyleSheet ,Image , View , Text , Button, TouchableOpacity} from "react-native";
import { FireStore, auth, storage } from "../firebase";
import Header from '../components/header';
import * as ImagePicker from 'expo-image-picker';
import MainButton from "../components/common/buttons/MainButton";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Modal  from "react-native-modal";
const URL = "https://seekervision.cognitiveservices.azure.com/vision/v3.1/analyze?visualFeatures=Description";

const ImageScreen =() =>{
    const [imageUri , setImageUri] = useState('');
    const [imageUrl , setImageUrl] = useState('');
    const [tags , setTags] = useState([]);
    const [description , setDescription] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
  
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
        generateTags(image);

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
        if(response.ok){
          const result = await response.text();
          const responseJson = JSON.parse(result);
          // console.log(result.description);
          // console.log(result.captions
          setModalVisible(true)
          console.log('result',result);
          console.log('response',responseJson);
          const tags = responseJson.description.tags;
          const captions = responseJson.description.captions;
          const text = captions.length > 0 ? captions[0].text : "";
          setTags(tags);
          setDescription(text);
          console.log("Tags:", tags);
          console.log("Description:", description);
        }
      }
      // generateTags();
      // }, [imageUrl]);

    const handleTags = () =>{
      setModalVisible(false);
      setTags([]);
      setDescription('');
    }

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
          modalStyle:{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          modalContainer:{
            backgroundColor: '#fff',
            padding: 30,
            borderRadius: 42,
            borderWidth: 6,
            borderColor: '#0369A1',
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
           <Modal 
              isVisible={isModalVisible}
              animationIn="zoomInDown"
              animationOut="zoomOutUp"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
           >
            <View style={styles.modalStyle}>
              <View style={styles.modalContainer}>
                <Text style={styles.title}>Select Tags</Text>
                <Text style={styles.subtitle}>Click the text to select tags.</Text>
                {tags.map((tag, index) => (
                      <View key={index}>
                        <TouchableOpacity>
                        <Text style={styles.tagText}>{tag}</Text>
                        </TouchableOpacity>
                      </View>
                  ))}
                <TouchableOpacity>
                <Text style={styles.modalText}>Description: {description}</Text>
                </TouchableOpacity>
                <Button title="Confirm" onPress={handleTags} />
            </View>
            </View>
          </Modal>
       </View>
       
       
    )

 }

export default ImageScreen;