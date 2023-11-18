import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';

import axios from 'axios';
import { TouchableHighlight } from 'react-native-gesture-handler';
// import { TextInput } from 'react-native-paper';

const InformationLine = () => {


  return (
    <View>
      <Text>Thông tin vận chuyển</Text>
      <Text>Địa chỉ nhận hàng</Text>
      <View style={{ width: '100%', backgroundColor: 'gray', height: 1 }} />
      <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Hủy đơn</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder='Nhập lý do hủy đơn'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderRadius: 5,
    width: '90%',
    height: 48,
    margin: 10,
    borderWidth: 2,
    padding: 8,
    borderColor: '#33FFCC'
  },
  cancelButton: {
    alignItems: 'center',
    textAlign: 'center',
    width: 250,
    marginLeft:'19%',
    marginRight:'20%',
    marginTop: 10,
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 10,
    
  },
  cancelButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default InformationLine;
