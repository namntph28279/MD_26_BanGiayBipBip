import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Title({ children }) {
    return (
        <Text style={styles.title}>{children}</Text>
    )
}

const styles = StyleSheet.create({
     title :{
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 40,
        paddingLeft: 15,
        paddingBottom: 7,
        borderBottomWidth:1,
        borderBottomColor:'black'
     }
})