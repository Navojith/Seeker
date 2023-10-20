import React, { useEffect, useState } from "react";
import { StyleSheet ,Image , View , Text , Button} from "react-native";
import Header from '../components/header';
import * as ImagePicker from 'expo-image-picker';
// import * as tf from '@tensorflow/tfjs';
// import { decodeJpeg } from '@tensorflow/tfjs-react-native';
// import * as FileSystem from 'expo-file-system';
// import * as jpeg from 'jpeg-js'
// import * as mobilenet from '@tensorflow-models/mobilenet';

const ImageScreen =() =>{
    const [image , setImage] = useState('');
    // const [isTfReady, setIsTfReady] = useState(false);
    // const [result, setResult] = useState('');

    const pickImage = async () =>{
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[4,3],
            quality:1,
        });
        console.log(result);

        if(!result.cancelled){
            setImage(result.uri);
            console.log(image);
        }
    }

    // const classifyUsingMobilenet = async() =>{
    //     try{
    //         // load mobilenet
    //         await tf.ready();
    //         const model = await mobilenet.load();
    //         setIsTfReady(true);
    //         console.log("starting inference with picked image");

    //         const img = await FileSystem.readAsStringAsync(image,{
    //             encoding:FileSystem.EncodingType.Base64,
    //         });
    //         const imgBuffer = tf.util.encodeString(img , 'base64').buffer;
    //         const raw = new Uint8Array(imgBuffer);
    //         const imageTensor = decodeJpeg(raw);

    //         const prediction = await model.classify(imageTensor);
    //         if (prediction && prediction.length > 0) {
    //         setResult(
    //             `${prediction[0].className} (${prediction[0].probability.toFixed(3)})`
    //         );
    //   }}catch (error){
    //     console.log(error);
    //   }
    // }

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
    //     if (image) {
    //         classifyUsingMobilenet();
    //     }
    //   }, [image]);

    return(
        <View>
           <Header title="Scan Item" />
            <View style={styles.container}>
             <Text style={styles.title}>Upload Image</Text>
              { /* {isTfReady && */}
                <Button title="Pick an image" onPress={pickImage}/>
                {/* } */}
             {image && (
                <View>
                    <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                    <Text>Image URI: {image}</Text>
                </View>
              )}
              {/* {!isTfReady && <Text>Loading TFJS model...</Text>}
              {isTfReady && result === '' && <Text>Pick an image to classify!</Text>}
              {result !== '' && <Text>{result}</Text>} */}
           </View>
       </View>
    )

 }

export default ImageScreen;