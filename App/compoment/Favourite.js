// import { getAuth } from 'firebase/auth';
// import React, { useEffect, useState } from 'react'
// import { View, StyleSheet, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity, Modal } from "react-native";
// // import firebase from '../config/FirebaseConfig';
// // import { getDatabase, off, onValue, remove, ref, push } from 'firebase/database';
// import { getMonney } from "../util/money";
// import axios from 'axios';

// export default function Favourite({route, navigation }) {
//   const [favProducts, setFavProducts] = useState([]);
//   const [showDialog, setshowDialog] = useState(false);
//   const [showDialogtc, setshowDialogtc] = useState(false);
//   // const auth = getAuth(firebase);
//   // const data = getDatabase(firebase);
//   const [id, setid] = useState();
//   const [name, setName] = useState();
//   const [pice, setpice] = useState();
//   const [img, setImg] = useState();
//   const [check, setCheck] = useState([]);

//   const [products, setProducts] = useState([]);
//   const [userFavorites, setUserFavorites] = useState([]);
//   const { productId } = route.params;
//   const userId = '65411aca70c402301ab981a9';

//   useEffect(() => {
//     fetchUserFavorites();
//   }, [userId]);

//   const fetchUserFavorites = () => {
//     axios.get(`https://md26bipbip-496b6598561d.herokuapp.com/favourite/${userId}`)
//       .then(response => {
//         const favoriteItems = response.data;
//         setUserFavorites(favoriteItems);
//         setIsLoading(false);
//       })
//       .catch(error => {
//         console.error('Lỗi khi lấy sản phẩm trong favorites:', error);
//         setIsLoading(false);
//       });
//   };



  
//   const Count = () => {
//     return favProducts.length
//   }
//   const TC = () => {
//     const sortedProducts = [...favProducts];
//     const n = sortedProducts.length;

//     for (let i = 0; i < n - 1; i++) {
//       for (let j = 0; j < n - i - 1; j++) {
//         if (sortedProducts[j].product_price > sortedProducts[j + 1].product_price) {
//           // Hoán đổi vị trí
//           const temp = sortedProducts[j];
//           sortedProducts[j] = sortedProducts[j + 1];
//           sortedProducts[j + 1] = temp;
//         }
//       }
//     }
//     setshowDialog(false)
//     setFavProducts(sortedProducts);
//   }
//   const CT = () => {
//     const sortedProducts = [...favProducts];
//     const n = sortedProducts.length;

//     for (let i = 0; i < n - 1; i++) {
//       for (let j = 0; j < n - i - 1; j++) {
//         if (sortedProducts[j].product_price < sortedProducts[j + 1].product_price) {
//           // Hoán đổi vị trí
//           const temp = sortedProducts[j];
//           sortedProducts[j] = sortedProducts[j + 1];
//           sortedProducts[j + 1] = temp;
//         }
//       }
//     }
//     setshowDialog(false)
//     setFavProducts(sortedProducts);
//   }
//   const closeModal = () => {
//     setshowDialog(false);
//   }


//   // const Delete = (productId) => {
//   //   const userId = auth.currentUser.uid;

//   //   const favRef = ref(data, `Favourite/${userId}/${productId}`);

//   //   remove(favRef)
//   //     .then(() => {
//   //       console.log('Đã xóa sản phẩm thành công');
//   //       setshowDialogtc(false)
//   //     })
//   //     .catch((error) => {
//   //       console.error('Lỗi xóa sản phẩm:', error);
//   //     });
//   // };
//   // const addToCart = (product) => {
//   //   const auth = getAuth(firebase);
//   //   const userId = auth.currentUser.uid;

//   //   const database = getDatabase(firebase);

//   //   push(ref(database, `Cart/${userId}`), {
//   //     search_image: product.product_image,
//   //     price: product.product_price,
//   //     brands_filter_facet: product.product_category,
//   //     quantity: product.quantity
//   //   })
//   //     .then((newRef) => {
//   //       const cartItemId = newRef.key;
//   //       console.log('Người dùng với id:', userId);
//   //       console.log('Đã thêm sản phẩm vào giỏ hàng:', product);
//   //       console.log('ID của sản phẩm trong giỏ hàng:', cartItemId);

//   //       // Xóa mục yêu thích
//   //       remove(ref(database, `Favourite/${userId}/${product.id}`))
//   //         .then(() => {
//   //           console.log('Đã xóa yêu thích');
//   //         })
//   //         .catch((error) => {
//   //           console.error('Lỗi xóa yêu thích:', error);
//   //         });

//   //     })
//   //     .catch((error) => {
//   //       console.error('Lỗi thêm sản phẩm vào giỏ hàng:', error);
//   //     });
//   // };

//   // const addCart = (id, img, name, pice) => {
//   //   const auth = getAuth(firebase);
//   //   const userId = auth.currentUser.uid;

//   //   const database = getDatabase(firebase);

//   //   push(ref(database, `Cart/${userId}`), {
//   //     search_image: img,
//   //     price: pice,
//   //     brands_filter_facet: name
//   //   })
//   //     .then((newRef) => {
//   //       const cartItemId = newRef.key;
//   //       console.log('Người dùng với id:', userId);
//   //       console.log('ID của sản phẩm trong giỏ hàng:', cartItemId);

//   //       // Xóa mục yêu thích
//   //       remove(ref(database, `Favourite/${userId}/${id}`))
//   //         .then(() => {
//   //           setshowDialogtc(false)

//   //         })
//   //         .catch((error) => {
//   //           console.error('Lỗi xóa yêu thích:', error);
//   //         });

//   //     })
//   //     .catch((error) => {
//   //       console.error('Lỗi thêm sản phẩm vào giỏ hàng:', error);
//   //     });
//   // }
//   return (
//     <View style={styles.container}>

//       {check.length == 0 ? (
//         <View>
//           <Text style={styles.title}>DANH SÁCH YÊU THÍCH </Text>
//           <View style={{ width: '100%', backgroundColor: 'black', height: 1 }} />

//           <View style={{
//             alignItems: 'center', justifyContent: 'center', height: '90%',
//           }}>
//             <Text style={styles.TitleConten}>Chưa có mặt hàng yêu thích
//             </Text>
//             <Text style={styles.Conten}>
//               Nhấp vào biểu tượng yêu thích để lưu mặt hàng
//             </Text>

//             <TouchableOpacity
//               activeOpacity={0.6}
//               style={{
//                 flexDirection: 'row',
//                 margin: 7,
//                 backgroundColor: 'black',
//                 padding: 9,
//                 borderRadius: 15,
//                 paddingLeft: 30,
//                 paddingRight: 30,
//                 alignItems: 'center'
//               }}
//               onPress={() => { navigation.navigate('AllShoes') }}
//             >
//               <View>
//                 <Text style={{
//                   marginRight: 7,
//                   color: 'white',
//                   fontWeight: 'bold'
//                 }} >Xem sản phẩm </Text>
//               </View>
//               <Image source={require('../image/arrow.png')} />
//             </TouchableOpacity>

//           </View>
//         </View>
//       ) : (
//         <View>
//           {/* modal sắp xếp */}
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={showDialog}
//           >
//             <View style={styles.modalContainer}>
//               <TouchableHighlight
//                 activeOpacity={1}
//                 underlayColor="rgba(0, 0, 0, 0.5)"
//                 onPress={closeModal}
//               >
//                 <View />
//               </TouchableHighlight>

//               <View style={styles.modalContent}>
//                 <View style={styles.modalHeader}>
//                   <Text style={styles.modalHeaderText}>SẮP XẾP THEO</Text>
//                   <TouchableHighlight
//                     activeOpacity={0.6}
//                     underlayColor="transparent"
//                     style={styles.modalCloseButton}
//                     onPress={closeModal}
//                   >
//                     <Image style={styles.modalCloseIcon} source={require('../image/close.png')} />
//                   </TouchableHighlight>
//                 </View>

//                 <View style={styles.modalDivider} />

//                 <TouchableHighlight
//                   activeOpacity={0.6}
//                   underlayColor="white"
//                   style={styles.modalOption}
//                   onPress={TC}
//                 >

//                   <View style={{ flexDirection: 'row' }}>
//                     <Image source={require('../image/tc.png')} />
//                     <Text style={styles.modalOptionText}>Giá [Thấp - Cao]</Text>

//                   </View>
//                 </TouchableHighlight>

//                 <TouchableHighlight
//                   activeOpacity={0.6}
//                   underlayColor="white"
//                   style={styles.modalOption}
//                   onPress={CT}
//                 >
//                   <View style={{ flexDirection: 'row' }}>
//                     <Image source={require('../image/ct.png')} />
//                     <Text style={styles.modalOptionText}>Giá [Cao - Thấp]</Text>

//                   </View>
//                 </TouchableHighlight>
//               </View>
//             </View>
//           </Modal>

//           {/* modal tùy chọn */}
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={showDialogtc}
//           >
//             <View style={styles.modalContainer}>
//               <TouchableHighlight
//                 activeOpacity={1}
//                 underlayColor="rgba(0, 0, 0, 0.5)"
//                 onPress={() => { setshowDialogtc(false) }}
//               >
//                 <View />
//               </TouchableHighlight>

//               <View style={styles.modalContent}>
//                 <View style={styles.modalHeader}>
//                   <Text style={styles.modalHeaderText}>TÙY CHỌN</Text>
//                   <TouchableHighlight
//                     activeOpacity={0.6}
//                     underlayColor="transparent"
//                     style={styles.modalCloseButton}
//                     onPress={() => { setshowDialogtc(false) }}
//                   >
//                     <Image style={styles.modalCloseIcon} source={require('../image/close.png')} />
//                   </TouchableHighlight>
//                 </View>

//                 <View style={styles.modalDivider} />

//                 <TouchableHighlight
//                   activeOpacity={0.6}
//                   underlayColor="white"
//                   style={styles.modalOption}
//                   onPress={() => addCart(id, img, name, pice)}
//                 >

//                   <View style={{ flexDirection: 'row' }}>
//                     <Image source={require('../image/addcar.png')} style={{ marginRight: 10 }} />
//                     <Text style={styles.modalOptionText}>Thêm vào giỏ hàng</Text>

//                   </View>
//                 </TouchableHighlight>

//                 <TouchableHighlight
//                   activeOpacity={0.6}
//                   underlayColor="white"
//                   style={styles.modalOption}
//                   onPress={() => Delete(id)}
//                 >
//                   <View style={{ flexDirection: 'row' }}>
//                     <Image source={require('../image/delete.png')} style={{ marginRight: 15, marginLeft: 5 }} />
//                     <Text style={styles.modalOptionText}>Xóa khỏi danh sách yêu thích</Text>

//                   </View>
//                 </TouchableHighlight>
//               </View>
//             </View>
//           </Modal>
//           <Text style={styles.title}>DANH SÁCH YÊU THÍCH </Text>

//           <View style={styles.titleDivider} />
//           <View style={styles.infoContainer}>

//             <Text>{Count()} MẶT HÀNG</Text>

//             <TouchableHighlight
//               activeOpacity={0.6}
//               underlayColor="white"
//               onPress={() => { setshowDialog(true) }}
//             >
//               <Image source={require('../image/sx.png')} />
//             </TouchableHighlight>
//           </View>

//           <ScrollView style={styles.frame}>
//             {favProducts.map((product) => (
//               <TouchableOpacity key={product._id}
//                 onPress={() => {
//                   navigation.navigate("ProductDetail", { productId: product._id });
//                 }} style={styles.productContainer}>
//                 <View style={styles.productBox}>
//                   <Image source={{ uri: product.product_image }} style={styles.productImage} />
//                   <View style={styles.productInfo}>
//                     <Text style={styles.productName}>{product.product_title}</Text>
//                     <Text style={styles.productPrice}>{getMonney(product.product_price)}</Text>
//                   </View>

//                   <TouchableHighlight
//                     activeOpacity={0.6}
//                     underlayColor="while"
//                     onPress={() => {
//                       setshowDialogtc(true),
//                       setid(product && product.id ? product.id : null);
//                         setImg(product.product_image),
//                         setName(product.product_title),
//                         setpice(product.product_price)
//                     }}
//                   >
//                     <Image source={require('../image/More.png')} />
//                   </TouchableHighlight>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>)}


//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   TitleConten: {
//     fontSize: 23,
//     width: 300,
//     textAlign: 'center',
//     fontWeight: 'bold'
//   },
//   Conten: {
//     marginTop: 7,
//     width: 330,
//     textAlign: 'center',
//     fontSize: 15,
//     marginBottom: 7
//   },


//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 40,
//     marginLeft: 15,
//     marginBottom: 7,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },

//   modalContent: {
//     width: '100%',
//     backgroundColor: 'white',
//     justifyContent: 'flex-end',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',

//   },
//   modalHeaderText: {

//     fontSize: 23,
//     fontWeight: 'bold',
//     margin: 14,
//   },
//   modalCloseButton: {
//     marginTop: 15,
//     marginLeft: 'auto',
//   },
//   modalCloseIcon: {
//     width: 40,
//     height: 40,
//   },
//   modalDivider: {
//     width: '100%',
//     borderBottomWidth: 1,
//   },
//   modalOption: {
//     borderColor: '#5F5F5F',
//     borderWidth: 1,
//     width: '100%',
//     padding: 20,
//     paddingLeft: 23,
//   },
//   modalOptionText: {
//     fontSize: 19,
//   },
//   titleDivider: {
//     width: '100%',
//     backgroundColor: 'black',
//     height: 1,
//   },
//   infoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 15,
//     marginLeft: 15,
//     marginRight: 15,
//   },
//   frame: {
//     marginRight: 14,
//     marginLeft: 14,
//   },
//   productContainer: {
//     marginTop: 14,
//   },
//   productBox: {
//     alignItems: 'center',
//     borderRadius: 16,
//     padding: 10,
//     backgroundColor: 'white',
//     flexDirection: 'row',
//   },
//   productImage: {
//     width: 90,
//     height: 60,
//     resizeMode: 'cover',
//     borderRadius: 8,
//   },
//   productInfo: {
//     marginLeft: 14,
//     width: 220,
//   },
//   productName: {
//     fontWeight: 'bold',
//   },
//   productPrice: {
//     // fontWeight: 'bold',
//     marginTop: 3,
//     marginBottom: 3,
//     color: 'red',
//   },
//   addButton: {
//     flexDirection: 'row',
//     padding: 3,
//     borderColor: '#000000',
//     width: 130,
//     backgroundColor: '#D7D8D9',
//     borderRadius: 16
//   },
//   addButtonLabel: {
//     fontSize: 13,
//     padding: 4,
//     marginLeft: 5
//   },
//   addButtonIcon: {
//     width: 20,
//     height: 20,
//     margin: 4
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity, Modal } from "react-native";
import { getMonney } from "../util/money";
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

export default function Favourite({route, navigation }) {
  const [favProducts, setFavProducts] = useState([]);
  const [showDialog, setshowDialog] = useState(false);
  const [showDialogtc, setshowDialogtc] = useState(false);
  const [id, setid] = useState();
  const [name, setName] = useState();
  const [pice, setpice] = useState();
  const [img, setImg] = useState();
  // const { userID } = useRoute();

  const userID = route.params?.userID || '';

  useEffect(() => {
      console.log('Giá trị userID ở màn favo:', userID);
      // Thực hiện các xử lý khác với userID
  }, [userID]);

  

  useEffect(() => {
    fetchUserFavorites(); 
  }, []);

  const fetchUserFavorites = () => {
    axios.get(`https://md26bipbip-496b6598561d.herokuapp.com/favourite/${userID}`)
      .then(response => {
        const favoriteItems = response.data;
        setFavProducts(favoriteItems);
      })
      .catch(error => {
        console.error('Lỗi khi lấy sản phẩm trong favorites:', error);
      });
  };

  const Count = () => {
    return favProducts.length;
  };

  const TC = () => {
    const sortedProducts = [...favProducts];
    sortedProducts.sort((a, b) => a.product_price - b.product_price);
    setshowDialog(false);
    setFavProducts(sortedProducts);
  };

  const CT = () => {
    const sortedProducts = [...favProducts];
    sortedProducts.sort((a, b) => b.product_price - a.product_price);
    setshowDialog(false);
    setFavProducts(sortedProducts);
  };

  const closeModal = () => {
    setshowDialog(false);
  };

//   const Delete = () => {
//     const favoriteItemToDelete = favProducts.find(item => item.product === productId);

//     if (favoriteItemToDelete) {

//         const favoriteItemId = favoriteItemToDelete._id;

//         axios.delete(`https://md26bipbip-496b6598561d.herokuapp.com/favourite/delete/${favoriteItemId}`)
//             .then(response => {
//                 setIsLiked(false);
//                 fetchUserFavorites(); // Cập nhật danh sách yêu thích sau khi xóa
//             })
//             .catch(error => {
//                 console.error('Lỗi khi xóa khỏi danh sách yêu thích:', error);
//             });
//     } else {
//         console.error('Không tìm thấy mục yêu thích với productId:', productId,favProducts);
//     }
// };

const Delete = (productId) => {
  // Gọi API DELETE để xóa sản phẩm khỏi danh sách yêu thích
  axios.delete(`https://md26bipbip-496b6598561d.herokuapp.com/favourite/delete/${productId}`)
    .then(() => {
      // Xóa thành công, cập nhật danh sách sản phẩm yêu thích bằng cách loại bỏ sản phẩm có favoriteItemId
      fetchUserFavorites(prevProducts => prevProducts.filter(product => product._id !== productId));
    })
    .catch(error => {
      console.error('Lỗi khi xóa sản phẩm khỏi danh sách yêu thích:', error);
    });
};

  return (
    <View style={styles.container}>
      {favProducts.length === 0 ? (
        <View>
          <Text style={styles.title}>DANH SÁCH YÊU THÍCH</Text>
          <View style={{ width: '100%', backgroundColor: 'black', height: 1 }} />
          <View style={{
            alignItems: 'center', justifyContent: 'center', height: '90%',
          }}>
            <Text style={styles.TitleConten}>Chưa có mặt hàng yêu thích</Text>
            <Text style={styles.Conten}>Nhấp vào biểu tượng yêu thích để lưu mặt hàng</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                flexDirection: 'row',
                margin: 7,
                backgroundColor: 'black',
                padding: 9,
                borderRadius: 15,
                paddingLeft: 30,
                paddingRight: 30,
                alignItems: 'center'
              }}
              onPress={() => { navigation.navigate('AllShoes') }}
            >
              <View>
                <Text style={{
                  marginRight: 7,
                  color: 'white',
                  fontWeight: 'bold'
                }}>Xem sản phẩm</Text>
              </View>
              <Image source={require('../image/arrow.png')} />
            </TouchableOpacity>
          </View>
        </View>
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
                    <Image style={styles.modalCloseIcon} source={require('../image/close.png')} />
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
                    <Image source={require('../image/tc.png')} />
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
                    <Image source={require('../image/ct.png')} />
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
                    <Image style={styles.modalCloseIcon} source={require('../image/close.png')} />
                  </TouchableHighlight>
                </View>
                <View style={styles.modalDivider} />
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="white"
                  style={styles.modalOption}
                  onPress={() => addCart(id, img, name, pice)}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../image/addcar.png')} style={{ marginRight: 10 }} />
                    <Text style={styles.modalOptionText}>Thêm vào giỏ hàng</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="white"
                  style={styles.modalOption}
                  onPress={() => Delete(id)}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../image/delete.png')} style={{ marginRight: 15, marginLeft: 5 }} />
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
              <Image source={require('../image/sx.png')} />
            </TouchableHighlight>
          </View>

          <ScrollView style={styles.frame}>
            {favProducts.map((product) => (
              <TouchableOpacity key={product._id}
                onPress={() => {
                  navigation.navigate("ProductDetail", { productId: product._id });
                }} style={styles.productContainer}>
                <View style={styles.productBox}>
                  <Image source={{ uri: product.product_image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.product_title}</Text>
                    <Text style={styles.productPrice}>{getMonney(product.product_price)}</Text>
                  </View>

                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="white"
                    onPress={() => {
                      setshowDialogtc(true);
                      setid(product && product.id ? product.id : null);
                      setImg(product.product_image);
                      setName(product.product_title);
                      setpice(product.product_price);
                    }}
                  >
                    <Image source={require('../image/More.png')} />
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
    marginRight: 14,
    marginLeft: 14,
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

