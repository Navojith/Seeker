import React  , {useState , useEffect} from "react";
import { View  , Text , StyleSheet , TouchableOpacity , Button} from "react-native";
import Header from '../components/header';
import { Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
const addImage = require("../assets/images/PostCreation/AddImage.png");


const ImageScreen =() =>{
    const [galleryPermission , setGalleryPermission] = useState(null);
    // const [isTfReady , setIsTfReady] = useState(false);
    // const [result , setresult] = useState('');
    const [image , setImage] = useState(null);

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

    // useEffect(() => {
    //     (async () =>{
    //         const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //         setGalleryPermission(galleryStatus.status === 'granted');
    //     })();
    // },[])

    //choose image
    const pickImage= async ()=>{
        console.log("pick an image");
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            aspect:[4,3],
            quality: 1,
        });
        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log(image);
        }
    };

    // if(galleryPermission === false){
    //     return <Text>No access to Internal Storage</Text>
    // }

    return(
        <View>
            <Header title="Scan Item" />
            <View style={styles.container}>
            <Text style={styles.title}>Upload Image</Text>
            {/* Show a button to open the image picker */}
            {/* <Image source={addImage} onPress={pickImage} ></Image> */}
            <Button onPress={pickImage} title="Add image"></Button>
            {image && <Image source={{uri:image}} />}
            <TouchableOpacity 
            // onPress={handleUploadedImage} 
            style={styles.itemButton}>
                <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>
        </View>
    )

}

export default ImageScreen;