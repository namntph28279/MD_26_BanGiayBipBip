import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

import axios from 'axios';

const InformationLine = () => {


  return (
    <View>
        <Text>Thông tin vận chuyển</Text>
        <Text>Địa chỉ nhận hàng</Text>
        <View style={{ width: '100%', backgroundColor: 'gray', height: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default InformationLine;
