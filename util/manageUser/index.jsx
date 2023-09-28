const storeToken = async (user) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(user));
  } catch (error) {
    console.log('Something went wrong', error);
  }
};

const getToken = async (user) => {
  try {
    let userData = await AsyncStorage.getItem('userData');
    let data = JSON.parse(userData);
    console.log(data);
  } catch (error) {
    console.log('Something went wrong', error);
  }
};

export { storeToken, getToken };
