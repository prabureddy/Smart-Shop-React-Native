import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/product';

const UserProductsScreen = props => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = id => {
    props.navigation.navigate('Edit_Product', { productId: id });
  };

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occured', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const deleteHandler = id => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          setError(null);
          setIsLoading(true);
          try {
            await dispatch(productsActions.deleteProduct(id));
            setIsLoading(false);
          } catch (error) {
            setError(error.message);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found Maybe start creating some?</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}>
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserProductsScreen;
