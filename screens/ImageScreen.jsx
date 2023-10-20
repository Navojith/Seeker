import React, { useEffect, useState } from "react";
import { StyleSheet ,Image , View , Text , Button} from "react-native";
import Header from '../components/header';
import * as ImagePicker from 'expo-image-picker';

const ImageScreen =() =>{
    const [image , setImage] = useState(null);

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
             <Button title="Pick an image" onPress={pickImage}/>
             {image && (
                <View>
                    <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                    <Text>Image URI: {image}</Text>
                </View>
              )}
           </View>
       </View>
    )

 }

export default ImageScreen;