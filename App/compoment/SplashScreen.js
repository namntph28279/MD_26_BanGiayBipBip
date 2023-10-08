import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'



const SplapshScreen = (props) => {
    setTimeout(() => {
        props.navigation.navigate('SplashScreen2');
    }, 3000);
    return (
        < View style={styles.container} >
            <Text style={styles.text}>CHÀO MỪNG BẠN ĐẾN VỚI SHOP</Text>
            <Text style={styles.text}>CHÚNG TÔI RẤT VUI VÌ BẠN ĐÃ ĐẾN</Text>
        </View >
    )
}

export default SplapshScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 22,
        padding: 8
    }
})