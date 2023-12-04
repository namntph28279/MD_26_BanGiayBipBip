import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, StyleSheet, Text, Image, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../api/url";
import {useSelector} from "react-redux";
import {io} from "socket.io-client";

const ChatScreen = ({ navigation }) => {
    const [message, setMessage] = useState('');
    const [dataAll, setDataALL] = useState();
    const [dataName, setDataName] = useState();
    
    const dataUserID = useSelector((state) => state.dataAll.dataUserID);
    const tokenApp = useSelector((state) => state.dataAll.dataTokenApp);

    const [socket, setSocket] = useState(null);

    const fetchData = async () => {
        try {
            console.log('load')
            const name = await AsyncStorage.getItem('Name');
            setDataName(name);

            const response = await url.post("/chatShop", { user: dataUserID });
            const newData = response.data.content;
            if (newData !== undefined) {
                newData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setDataALL(newData)
                return
            }
            setDataALL([])

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const socketInstance = io('http://172.20.10.2');
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('server-send', function (data) {
                fetchData()
            });
        }
    }, [socket]);



    const handleSendMessage = async () => {
        if (message.length > 0) {
            await url.post("/home/chatShop", { user: dataUserID, fullName: dataName, beLong: "user", conTenMain: message, status: "true" });
            setMessage('')
            if (socket) {
                socket.emit('client-send');
            }
        }
    };

    const renderItem = ({ item }) => {
        const isCurrentUser = item.beLong === "user";
        const messageStyle = isCurrentUser ? styles.sentMessage : styles.receivedMessage;
        const textStyle = isCurrentUser ? styles.sentText : styles.receivedText;
        return (
            <View style={messageStyle}>
                <Text style={textStyle}>{item.conTenMain}</Text>
            </View>
        );
    };

    const backScreen = async () => {

        await url.post("/checkClientMess", { user: dataUserID, IdClient: tokenApp, status: false });
        navigation.navigate('TabNavi');
    }

    return (

        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            extraScrollHeight={10}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
        >
        <View style={styles.container}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 14,marginTop:17, borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={backScreen}>
                        <Image source={require('../../image/back.png')} style={{ width: 28, height: 28 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, marginLeft: 8 }}>
                        Chat với Shop
                    </Text>
                </View>
                <FlatList
                    data={dataAll}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    inverted
                    keyExtractor={(item) => item._id.toString()}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Vui lòng nhập tin nhắn..."
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        <Text style={styles.sendButtonText}>Gửi</Text>
                    </TouchableOpacity>
                </View>
        </View>
        </KeyboardAwareScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#a19e9e',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 8,
        backgroundColor: '#FFFFFF',
    },
    sendButton: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sentMessage: {
        margin: 7,
        maxWidth: "80%",
        backgroundColor: '#3967d9',
        marginLeft: "auto",
        padding: 14,
        borderRadius: 14
    },
    receivedMessage: {
        margin: 7,
        maxWidth: "80%",
        backgroundColor: '#adadad',
        marginRight: "auto",
        padding: 14,
        borderRadius: 14
    },
    sentText: {
        color: 'white'
    },
    receivedText: {
        color: 'black'
    },
});
export default ChatScreen;
