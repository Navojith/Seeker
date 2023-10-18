import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import InformationIcon from '../../assets/icons/InformationIcon';

const BuyBoost = ({ route, navigation }) => {
  // const { itemId } = route.params;
  const [cardNo, setCardNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView styles={{ padding: 30, display: 'flex', flex: 1 }}>
        <View>
          <Text style={styles.textLabel}>Credit / Debit Card Number</Text>
          <TextInput
            value={cardNo}
            onChangeText={(value) => setCardNo(value)}
            placeholder="Eg: XXXX-XXXXX-XXXX-XXXX"
            style={styles.input}
          />
          <Text style={styles.textLabel}>Expiry Date</Text>
          <TextInput
            value={expiryDate}
            onChangeText={(value) => setExpiryDate(value)}
            placeholder="Eg: mm/yyyy"
            style={styles.input}
          />
          <Text style={styles.textLabel}>CVV</Text>
          <TextInput
            value={cvv}
            onChangeText={(value) => setCvv(value)}
            placeholder=""
            cstyle={styles.input}
          />
        </View>
        <View className="flex flex-row flex-wrap mt-8">
          <Text style={styles.textLabel}>Select a Tier</Text>
          <InformationIcon className="ml-auto" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textLabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 4,
    borderColor: '#0284C7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    color: 'black',
  },
});

export default BuyBoost;
