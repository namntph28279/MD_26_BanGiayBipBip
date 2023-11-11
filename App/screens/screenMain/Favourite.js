import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity, Modal } from "react-native";
import { getMonney } from "../../util/money";
import {useDispatch, useSelector} from "react-redux";
import NoProduct from "../../components/NoProduct";
import {fetchDataAndSetToRedux} from "../../redux/AllData";
import url from "../../api/url";

export default function Favourite({navigation }) {
  const dispatch = useDispatch(); //trả về một đối tượng điều phối
  const [showDialog, setshowDialog] = useState(false);
  const [showDialogtc, setshowDialogtc] = useState(false);
  const [id, setid] = useState();
  const [dataSP, setDataSP] = useState([]);
  const dataSPFav = useSelector((state) => state.dataAll.dataSPFav); //lấy toàn bộ mảng dữ liệu Fav

  React.useEffect(() => {
      setDataSP(dataSPFav);
  }, [dataSPFav]);

  const CT = () => {
    const sortedProducts = [...dataSPFav];
    sortedProducts.sort((a, b) => (a.product_price < b.product_price ? 1 : -1));
    setDataSP(sortedProducts);
    setshowDialog(false);
  };

  const TC = () => {
    const sortedProducts = [...dataSPFav];
    sortedProducts.sort((a, b) => (a.product_price > b.product_price ? 1 : -1));
    setDataSP(sortedProducts);
    setshowDialog(false);
  };

  const Count = () => {
    return dataSP.length;
  };

  const closeModal = () => {
    setshowDialog(false);
  };

  const Delete = async (productId) => {
    dataSP.filter(item => item._id !== productId);
    await url.delete(`/favourite/delete/${productId}`)
    dispatch(fetchDataAndSetToRedux());
    setshowDialogtc(false);
  };
  return (
    <View style={styles.container}>
      {dataSP.length === 0 ? (
          <NoProduct
              title="DANH SÁCH YÊU THÍCH"
              titleContext="Chưa có mặt hàng yêu thích"
              context="Nhấp vào biểu tượng yêu thích để lưu mặt hàng"
          />
      ) : (
        <View>
          {/* Modal sắp xếp */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showDialog}
          >
            <View style={styles.modalContainer}>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor="rgba(0, 0, 0, 0.5)"
                onPress={closeModal}
              >
                <View />
              </TouchableHighlight>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>SẮP XẾP THEO</Text>
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="transparent"
                    style={styles.modalCloseButton}
                    onPress={closeModal}
                  >
                    <Image style={styles.modalCloseIcon} source={require('../../image/close.png')} />
                  </TouchableHighlight>
                </View>
                <View style={styles.modalDivider} />
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="white"
                  style={styles.modalOption}
                  onPress={TC}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../image/tc.png')} />
                    <Text style={styles.modalOptionText}>Giá [Thấp - Cao]</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="white"
                  style={styles.modalOption}
                  onPress={CT}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../image/ct.png')} />
                    <Text style={styles.modalOptionText}>Giá [Cao - Thấp]</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          {/* Modal tùy chọn */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showDialogtc}
          >
            <View style={styles.modalContainer}>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor="rgba(0, 0, 0, 0.5)"
                onPress={() => { setshowDialogtc(false) }}
              >
                <View />
              </TouchableHighlight>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>TÙY CHỌN</Text>
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="transparent"
                    style={styles.modalCloseButton}
                    onPress={() => { setshowDialogtc(false) }}
                  >
                    <Image style={styles.modalCloseIcon} source={require('../../image/close.png')} />
                  </TouchableHighlight>
                </View>
                <View style={styles.modalDivider} />
                {/* <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="white"
                  style={styles.modalOption}
                  key={product._id}
                  onPress={() => {
                    navigation.navigate("ProductDetail", { productId: product._id });
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../image/addcar.png')} style={{ marginRight: 10 }} />
                    <Text style={styles.modalOptionText}>Chi tiết sản phẩm</Text>
                  </View>
                </TouchableHighlight> */}
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="white"
                  style={styles.modalOption}
                  onPress={() => Delete(id)}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../image/delete.png')} style={{ marginRight: 15, marginLeft: 5 }} />
                    <Text style={styles.modalOptionText}>Xóa khỏi danh sách yêu thích</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          <Text style={styles.title}>DANH SÁCH YÊU THÍCH</Text>
          <View style={styles.titleDivider} />
          <View style={styles.infoContainer}>
            <Text>{Count()} MẶT HÀNG</Text>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="white"
              onPress={() => { setshowDialog(true) }}
            >
              <Image source={require('../../image/sx.png')} />
            </TouchableHighlight>
          </View>

          <ScrollView style={styles.frame}>
            {dataSP.map((item) => (
              <TouchableOpacity key={item.product}
                onPress={() => {
                  navigation.navigate("ProductDetail", { productId: item.product, userId: item.user});
                }} style={styles.productContainer}>

                <View style={styles.productBox}>
                  <Image source={{ uri: item.product_image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.product_title}</Text>
                    <Text style={styles.productPrice}>{getMonney(item.product_price)}</Text>
                  </View>

                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="white"
                    onPress={() => {
                      setshowDialogtc(true);
                      setid(item._id);
                    }}
                  >

                    <Image source={require('../../image/More.png')} />
                  </TouchableHighlight>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 40,
    marginLeft: 15,
    marginBottom: 7,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalHeaderText: {
    fontSize: 23,
    fontWeight: 'bold',
    margin: 14,
  },
  modalCloseButton: {
    marginTop: 15,
    marginLeft: 'auto',
  },
  modalCloseIcon: {
    width: 40,
    height: 40,
  },
  modalDivider: {
    width: '100%',
    borderBottomWidth: 1,
  },
  modalOption: {
    borderColor: '#5F5F5F',
    borderWidth: 1,
    width: '100%',
    padding: 20,
    paddingLeft: 23,
  },
  modalOptionText: {
    fontSize: 19,
  },
  titleDivider: {
    width: '100%',
    backgroundColor: 'black',
    height: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  frame: {
    marginRight: '3%',
    marginLeft: '3%',
  },
  productContainer: {
    marginTop: 14,
  },
  productBox: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  productImage: {
    width: 90,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  productInfo: {
    marginLeft: 14,
    width: 220,
  },
  productName: {
    fontWeight: 'bold',
  },
  productPrice: {
    marginTop: 3,
    marginBottom: 3,
    color: 'red',
  },
  addButton: {
    flexDirection: 'row',
    padding: 3,
    borderColor: '#000000',
    width: 130,
    backgroundColor: '#D7D8D9',
    borderRadius: 16
  },
  addButtonLabel: {
    fontSize: 13,
    padding: 4,
    marginLeft: 5
  },
  addButtonIcon: {
    width: 20,
    height: 20,
    margin: 4
  },
  
});

