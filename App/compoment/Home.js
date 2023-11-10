import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {MaterialIcons,} from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import {Dropdown} from "react-native-element-dropdown";
import {getMonney} from "../util/money";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataAndFav, fetchDataAndSetToRedux} from "../redux/AllData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../api/url";

function Home({ navigation }) {

    const dispatch = useDispatch(); //trả về một đối tượng điều phối
    const dataSP1 = useSelector((state) => state.dataAll.dataSP); //lấy toàn bộ mảng dữ liệu
    const dataSPFav = useSelector((state) => state.dataAll.dataSPFav); //lấy toàn bộ mảng dữ liệu Fav
//lấy id sp Fav
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkColorFav,setCheckColorFav] = useState([]);

    const [valueSortBy, setValueSortBy] = useState(0);
    const [valueFilter, setValueFilter] = useState(null);

    const swiperRef = useRef(null);

    const [dataSP, setDataSP] = useState([]);
    const [dataSwiper, setDataSwiper] = useState([]);

    React.useEffect(() => {
        return navigation.addListener("focus", () => {
            dispatch(fetchDataAndSetToRedux());

        });
    }, [navigation]);

    useEffect(() => {
        setDataSP(dataSP1);
        setDataSwiper(dataSP1);
    }, [dataSP1]);
    useEffect(() => {
        setCheckColorFav(dataSPFav.map((item) => item.product))
    }, [dataSPFav]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (swiperRef.current && swiperRef.current.scrollBy) {
                swiperRef.current.scrollBy(1); //di chuyen anh tiep
            }
        }, 5000); // Thời gian tự động chuyển ảnh (ms)

        return () => clearInterval(interval);
    }, []);

    //array for dropdown
    const sortBy = [
        { label: "Giá Cao - Thấp", value: "2" },
        { label: "Giá Thấp - Cao ", value: "3" },
    ];
    const Filter = [
        { label: "Tất cả", value: "1" },
        { label: "Nam", value: "2" },
        { label: "Nữ", value: "3" },
    ];
    //Chưa có nổi bật nên chỉ sắp sếp theo giá
    const sortByPrice = (item) => {
        console.log(item._index)
        setValueSortBy(item.value);
        const dataSort = [...dataSP1];

        if (item._index === 0) {
            dataSort.sort((a, b) => (a.product_price < b.product_price ? 1 : -1));
            console.log("Giá Cao - Thấp")
            setDataSP(dataSort);
        }
        if (item._index === 1) {
            dataSort.sort((a, b) => (a.product_price > b.product_price ? 1 : -1));
            setDataSP(dataSort);
            console.log("Giá Thấp - Cao")
        }
    };
    const filterByCategory = (item) => {
        setValueFilter(item.value);
        console.log(item)
        const dataCategory = [...dataSP1];

        if (item._index === 0) {
            setDataSP(dataCategory);
        }
        if (item._index === 1) {
            const filteredData = dataCategory.filter((product) => product.product_category === "men");
            setDataSP(filteredData);
        }
        if (item._index === 2) {
            const filteredData = dataCategory.filter((product) => product.product_category === "women");
            setDataSP(filteredData);
        }
    };
    //item layout
    const renderItemSortBy = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };
    const renderItemFilter = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    const renderProductItem = (item) => {
        const isFav =  checkColorFav.includes(item._id);
        const toggleHeartColor = async () => {

            const checkLogin = await AsyncStorage.getItem('Email');

            if (!checkLogin){
                alert("Vui lòng đăng nhập");
                navigation.navigate('Login');
                return
            }
            if (isProcessing) {
                console.log("Chặn click nhiều lần ")
                alert("Yêu cầu của bạn đang được xử lý")
                return; // Chặn tương tác nếu đang xử lý
            }
            setIsProcessing(true);
            const idFavourite = item._id;
            const email = await AsyncStorage.getItem('Email');
            if ( isFav === false) {
                await url.post("/favourite/addFav", {product_id: idFavourite, user_id: email})
                 checkColorFav.push(item._id)
                dispatch(fetchDataAndFav());
                setIsProcessing(false);
                console.log("Them")
            } else {
                await url.post("/favourite/addFav", {product_id: idFavourite, user_id: email})
                let index = checkColorFav.indexOf(item._id);
                checkColorFav.splice(index, item._id)
                dispatch(fetchDataAndFav());
                setIsProcessing(false);
                console.log("Xoa")
            }
        };
        return (
            <View style={styles.productContainer}>
                <TouchableOpacity
                    key={item._id}
                    onPress={() => {
                        navigation.navigate("ProductDetail", { productId: item._id });
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            height: 200,
                            paddingBottom: 3,
                            borderRadius: 10,
                        }}
                    >
                        <Image
                            source={{ uri: item.product_image }}
                            style={{
                                width: "100%",
                                height: "70%",
                                borderRadius: 10,
                            }}
                        />

                        <View>
                            <Text
                                numberOfLines={1}
                                style={{
                                    marginLeft: 15,
                                    marginTop: 7,
                                    fontSize: 17,
                                    fontWeight: "bold",
                                }}
                            >
                                {item.product_title}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 7,
                                }}
                            >
                                <Text style={{ marginLeft: 15, width: 140 }}>
                                    Giá : {getMonney(item.product_price)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ position: "absolute", left: 10, top: 7 }}
                    onPress={toggleHeartColor}
                >
                    <MaterialIcons
                        name={ isFav ? "favorite" : "favorite-outline"}
                        size={30}
                        color={ isFav ? "red" : "black"}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    //swiper layout
    const setSwiper = () => {
        if (dataSwiper.length !== 0) {
            const arrLength = dataSwiper.length;
            const arrSwiper = dataSwiper.slice(arrLength - 3, arrLength);
            return (
                <Swiper
                    ref={swiperRef}
                    autoplay={false} // Tắt chế độ autoplay của Swiper
                    showsPagination={true}
                >
                    {arrSwiper.map((item) => (
                        <View key={item._id}>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("ProductDetail", { productId: item._id });
                            }}>
                                <Image
                                    source={{ uri: item.product_image }}
                                    style={styles.imageBackground}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </Swiper>
            );
        } else {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.slide}>{setSwiper()}</View>
                </View>

                <View style={styles.option}>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>
                        Sản phẩm
                    </Text>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("AllShoes");
                            }}
                        >
                            <Text> Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={{display:"flex", flexDirection: "row", margin: 10,alignItems:"center"  }}>

                    <Dropdown
                        style={styles.dropdown}
                        data={sortBy}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Sắp xếp"
                        value={valueSortBy}
                        onChange={(item) => {
                            sortByPrice(item);
                        }}
                        renderItem={renderItemSortBy}
                    />

                    <Dropdown
                        style={[styles.dropdown, { width: 100 }, { marginLeft: 10 }]}
                        data={Filter}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Lọc"
                        value={valueFilter}
                        labelStyle={{ fontWeight: "bold" }}
                        onChange={(item) => {
                            filterByCategory(item);
                        }}
                        renderItem={renderItemFilter}
                    />

                </View>

                <View style={styles.columnsContainer}>
                    {dataSP.map((item) => (
                        <View key={item._id} style={styles.columnItem}>
                            {renderProductItem(item)}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    option:{
        borderBottomWidth:1,
        alignItems:"center",
        marginLeft:20,
        marginRight:20,
        marginTop:20,
        paddingBottom:10,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    columnsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    columnItem: {
        width: "48%", // Display two items per row
        marginTop: 10,
        marginLeft: 7,
    },
    slide: {
        height: 200,
        width: "95%",
        backgroundColor: "white",
        borderRadius: 30,
        marginTop: 8,
    },

    productContainer: {
        width: "100%",
        borderRadius: 10,
        backgroundColor: "white", // Màu nền của View
        elevation: 5, // Độ đổ bóng
        shadowColor: "gray", // Màu đổ bóng
        shadowOffset: {width: 0, height: 2}, // Độ dịch chuyển đổ bóng
        shadowOpacity: 0.5, // Độ trong suốt của đổ bóng
        shadowRadius: 5, // Độ mờ của đổ bóng
    },
    container: {
        paddingTop: 15,
        backgroundColor: "#DDD",
    },
    textArrange: {
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
    },
    arrange: {
        backgroundColor: "#362C2C",
        padding: 8,
        marginRight: 14,
        borderRadius: 10,
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: 100,
        margin: 7,
    },
    imageBackground: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        resizeMode: "contain",
    },

    dropdown: {
        height: 40,
        width: 160,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },

    item: {
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});