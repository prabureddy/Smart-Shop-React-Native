import React, { useEffect, useRef } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { NavigationActions } from '@react-navigation/compat';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList,
} from '@react-navigation/drawer';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colors from '../constants/Colors';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/UI/HeaderButton';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from './../screens/shop/OrdersScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserProductsScreen from './../screens/user/UserProductsScreen';
import EditProductScreen from './../screens/user/EditProductScreen';
import AuthScreen from './../screens/user/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';
import { View, SafeAreaView, Button } from 'react-native';

const Stack = createStackNavigator();

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: 'white',
  headerTitleStyle: { fontFamily: 'OpenSans-Bold' },
  headerBackTitleStyle: { fontFamily: 'OpenSans-Regular' },
};

const ProductsNavigator = props => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="Products_Overview"
        options={({ navigation }) => ({
          title: 'All Products',
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="menu"
                iconName="bars"
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Cart"
                iconName="shopping-cart"
                onPress={() => {
                  navigation.navigate('Cart_Screen');
                }}
              />
            </HeaderButtons>
          ),
        })}
        component={ProductsOverviewScreen}
      />

      <Stack.Screen
        name="Products_Detail_Screen"
        options={({ route }) => ({
          title: route.params['productTitle'],
        })}
        component={ProductDetailScreen}
      />

      <Stack.Screen
        name="Cart_Screen"
        options={({ route }) => ({
          title: 'Cart',
        })}
        component={CartScreen}
      />
    </Stack.Navigator>
  );
};

const ordersNavigator = props => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={({ navigation }) => ({
          title: 'Orders',
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="menu"
                iconName="bars"
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const adminNavigator = props => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="Products"
        component={UserProductsScreen}
        options={({ navigation }) => ({
          title: 'User Products',
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="menu"
                iconName="bars"
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="add"
                iconName="plus-square"
                onPress={() => {
                  navigation.navigate('Edit_Product', { productId: null });
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
      <Stack.Screen
        name="Edit_Product"
        component={EditProductScreen}
        options={({ route }) => ({
          title:
            route.params['productId'] !== null ? 'Edit Product' : 'Add Product',
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Save"
                iconName={'save'}
                onPress={route.params['submit']}
              />
            </HeaderButtons>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const DrawerContent = props => {
  const dispatch = useDispatch();
  return (
    <View>
      <SafeAreaView
        forceInSet={{
          top: 'always',
          horizontal: 'never',
        }}>
        <DrawerItemList {...props} />
        <Button
          title="Logout"
          color={Colors.primary}
          onPress={() => {
            dispatch(authActions.logout());
            // props.navigation.navigate('Auth');
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const ShopDrawer = props => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{ activeTintColor: Colors.primary }}
      initialRouteName="Root"
      drawerContent={props => {
        return <DrawerContent {...props} />;
      }}>
      <Drawer.Screen
        name="Products_Navigator"
        options={{
          title: 'Products',
          drawerIcon: ({ color }) => (
            <Icon name="shopping-cart" size={23} color={color} />
          ),
        }}
        component={ProductsNavigator}
      />
      <Drawer.Screen
        name="Orders_Navigator"
        options={{
          title: 'Orders',
          drawerIcon: ({ color }) => (
            <Icon name="list-ul" size={23} color={color} />
          ),
        }}
        component={ordersNavigator}
      />
      <Drawer.Screen
        name="Admin_Navigator"
        options={{
          title: 'User Products',
          drawerIcon: ({ color }) => (
            <Icon name="edit" size={23} color={color} />
          ),
        }}
        component={adminNavigator}
      />
    </Drawer.Navigator>
  );
};

const authNavigator = props => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={({ navigation }) => ({
          title: 'Authenticate',
        })}
      />
    </Stack.Navigator>
  );
};

const ShopNavigator = props => {
  const { isAuth } = props;
  const navRef = useRef();
  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(NavigationActions.navigate({routeName: 'Auth'}));
    }
  }, [isAuth]);

  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StartUp" component={StartUpScreen} />
        <Stack.Screen name="Auth" component={authNavigator} />
        <Stack.Screen name="Home" component={ShopDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ShopNavigator;
