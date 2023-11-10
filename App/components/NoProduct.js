import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Title from './Title'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
export default function NoProduct({ title, titleContext, context }) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Title>{title}</Title>
            <View style={{
                alignItems: 'center', justifyContent: 'center', height: '90%',borderTopWidth:1
            }}>
                <Text style={styles.TitleConten}>{titleContext}
                </Text>
                <Text style={styles.Conten}>
                    {context}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.btn}
                    onPress={() => { navigation.navigate('AllShoes') }}
                >
                    <View>
                        <Text style={styles.btnText} >Xem sản phẩm </Text>
                    </View>
                    <AntDesign name="arrowright" size={24} color="white"  />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    TitleConten: {
        fontSize: 23,
        width: 300,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    Conten: {
        marginTop: 7,
        width: 330,
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 7
    },
    btn: {
        flexDirection: 'row',
        margin: 7,
        backgroundColor: 'black',
        padding: 9,
        borderRadius: 15,
        paddingLeft: 30,
        paddingRight: 30,
        alignItems: 'center'
    },
    btnText: {
        marginRight: 7,
        color: 'white',
        fontWeight: 'bold'
    }
})