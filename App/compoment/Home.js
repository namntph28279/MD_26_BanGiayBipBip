import React, {useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {MaterialIcons,} from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import {Dropdown} from "react-native-element-dropdown";
import {getMonney} from "../util/money";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataAndSetToRedux} from "../redux/AllData";
import axios from 'axios';

function Home({route, navigation}) {
    const dispatch = useDispatch(); //trả về một đối tượng file phối
    const dataSP1 = useSelector((state) => state.dataAll.dataSP); //lấy toàn bộ mảng dữ liệu
    const dataSPFav = useSelector((state) => state.dataAll.dataSPFav); //lấy toàn bộ mảng dữ liệu Fav

    const idSPFavs = dataSPFav.map((item) => item.product); //lấy id sp Fav

    const [valueSortBy, setValueSortBy] = useState(0);
    const [valueFilter, setValueFilter] = useState(null);

    const swiperRef = useRef(null);


    const [dataSP, setDataSP] = useState([]);
    const [dataSwiper, setDataSwiper] = useState([]);
    const userID = route.params?.userID || '';

    useEffect(() => {
        console.log('Giá trị userID từ home:', userID);
        if (!userID) {
            console.log('không có user');

        }
    }, [userID]);

    React.useEffect(() => {
        return navigation.addListener("focus", () => {
            dispatch(fetchDataAndSetToRedux());
        });
    }, [navigation]);

    useEffect(() => {
        if (dataSP1) {
            const products = Object.keys(dataSP1).map((key) => ({
                id: key,
                ...dataSP1[key],
                isFav: false,
            }));

            setDataSP(products);
        } else {
            setDataSP([]);
        }

        setDataSwiper(dataSP1);
    }, [dataSP1, dataSPFav]);

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
        {label: "Nổi bật", value: "1"},
        {label: "Giá Cao - Thấp", value: "2"},
        {label: "Giá Thấp - Cao ", value: "3"},
    ];
    const Filter = [
        {label: "Tất cả", value: "1"},
        {label: "Nam", value: "2"},
        {label: "Nữ", value: "3"},
    ];

    //Chưa có nổi bật nên chỉ sắp sếp theo giá
    const sortByPrice = (item) => {
        setValueSortBy(item.value);
        const dataSort = [...dataSP1];

        if (item.value === 2) {
            dataSort.sort((a, b) => (a.product_price < b.product_price ? 1 : -1));
            setDataSP(dataSort);
        }
        if (item.value === 3) {
            dataSort.sort((a, b) => (a.product_price > b.product_price ? 1 : -1));
            setDataSP(dataSort);
        }
    };

    const filterByCategory = (value) => {
        setValueFilter(value);
        const dataCategory = [...dataSP1];

        if (value === 1) {
            setDataSP(dataCategory);
        }
        if (value === 2) {
            const filteredData = dataCategory.filter(
                (product) => product.product_category === "men"
            );
            setDataSP(filteredData);
        }
        if (value === 3) {
            const filteredData = dataCategory.filter(
                (product) => product.product_category === "women"
            );
            setDataSP(filteredData);
        }
    };

    //checked
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

        item.isFav = idSPFavs.includes(item._id);
        const toggleHeartColor = () => {
            if (item.isFav === false) {
                axios.post('https://md26bipbip-496b6598561d.herokuapp.com/favourite/add', {
                    product_id: item._id,
                    user_id: "64ab9784b65d14d1076c3477"
                })
                    .then(() => {

                    })
                    .catch(error => {
                        console.error('Lỗi:', error);
                    });
            } else {
                const favoriteItemToDelete = dataSPFav.find(itemFav => itemFav.product === item._id);
                if (favoriteItemToDelete) {
                    const favoriteItemId = favoriteItemToDelete._id;
                    axios.delete(`https://md26bipbip-496b6598561d.herokuapp.com/favourite/delete/${favoriteItemId}`)
                        .then(() => {
                            //reload data when user delete favorite
                        })
                        .catch(error => {
                            console.error('Lỗi khi xóa khỏi danh sách yêu thích:', error);
                        });
                } else {
                    console.error('Không tìm thấy mục yêu thích với productId:', item._id, dataSPFav);
                }
            }
        };
        return (
            <View style={styles.productContainer}>
                <TouchableOpacity
                    key={item._id}
                    onPress={() => {
                        navigation.navigate("ProductDetail", {productId: item._id, userId: userID});
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
                            source={{uri: item.product_image}}
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
                                <Text style={{marginLeft: 15, width: 140}}>
                                    Giá : {getMonney(item.product_price)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{position: "absolute", left: 10, top: 7}}
                    onPress={toggleHeartColor}
                >
                    <MaterialIcons
                        name={item.isFav ? "favorite" : "favorite-outline"}
                        size={30}
                        color={item.isFav ? "red" : "black"}
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
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ProductDetail", {productId: item._id});
                                }}
                            >
                                <Image
                                    source={{uri: item.product_image}}
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
                    <ActivityIndicator size="large" color="blue"/>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{alignItems: "center"}}>
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

                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        margin: 10,
                    }}
                >
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
                        style={[styles.dropdown, {width: 100}, {marginLeft: 10}]}
                        data={Filter}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Lọc"
                        value={valueFilter}
                        labelStyle={{fontWeight: "bold"}}
                        onChange={(item) => {
                            filterByCategory(item.value);
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
        </SafeAreaView>
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
