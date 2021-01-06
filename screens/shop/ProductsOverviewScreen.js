import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';

import * as cartActions from '../../store/actions/cart';
import Colors from '../../constants/Colors';
import * as productActions from '../../store/actions/product';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const products = useSelector(state => state.products.availableProducts);

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productActions.fetchProducts());
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setError, setIsLoading]);

  // useEffect(() => {
  //   const willFocusSub = props.navigation.addListener(
  //     'willFocus',
  //     loadProducts
  //   );
  //   return () => {
  //     willFocusSub.remove();
  //   };
  // }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('Products_Detail_Screen', {
      productId: id,
      productTitle: title,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An Error Occured!</Text>
        <Button
          title="Try Again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}>
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() =>
              selectItemHandler(itemData.item.id, itemData.item.title)
            }
          />
          <Button
            color={Colors.primary}
            title="Add To Cart"
            onPress={() => dispatch(cartActions.addToCart(itemData.item))}
          />
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductsOverviewScreen;
