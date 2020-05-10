/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import * as productActions from '../../store/actions/product';
import Input from '../../components/UI/Input';
import { useState } from 'react';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }

      const returningState = {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues,
      };

      return returningState;

      break;

    default:
      break;
  }

  return state;
};

const EditProductScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const prodId =
    props.route.params.productId !== null ? props.route.params.productId : null;

  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );

  const dispatch = useDispatch();

  const initial_state = {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: '',
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  };

  const [formState, dispatchFormState] = useReducer(formReducer, initial_state);

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occured', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' },
      ]);
      return;
    }

    Keyboard.dismiss();

    setError(null);
    setIsLoading(true);

    try {
      if (editedProduct) {
        await dispatch(
          productActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          productActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            +formState.inputValues.price
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const textChangeHandler = (inputIdentifier, text) => {
    let isValid = false;
    if (text.trim().length > 0) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: inputIdentifier,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.title}
            onChangeText={textChangeHandler.bind(this, 'title')}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
          />
          {!formState.inputValidities.title && (
            <Text>Please enter a valid title!</Text>
          )}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.imageUrl}
            onChangeText={textChangeHandler.bind(this, 'imageUrl')}
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.price}
              onChangeText={textChangeHandler.bind(this, 'price')}
              keyboardType="decimal-pad"
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.description}
            onChangeText={textChangeHandler.bind(this, 'description')}
          />
        </View>
      </View>
    </ScrollView>
  );

  // const inputChangeHandler = useCallback(
  //   (inputIdentifier, inputValue, inputValidity) => {
  //     dispatchFormState({
  //       type: FORM_INPUT_UPDATE,
  //       value: inputValue,
  //       isValid: inputValidity,
  //       input: inputIdentifier,
  //     });
  //   },
  //   [dispatchFormState]
  // );

  // return (
  //   <KeyboardAvoidingView style={{ flex: 1 }}>
  //     <ScrollView>
  //       <View style={styles.form}>
  //         <Input
  //           id="title"
  //           label="Title"
  //           errorText="Please Enter a valid Title!"
  //           keyboardType="default"
  //           returnKeyType="next"
  //           autoCorrect
  //           autoCapitalize="sentences"
  //           onInputChange={inputChangeHandler}
  //           initialValue={editedProduct ? editedProduct.title : ''}
  //           initiallyValid={!!editedProduct}
  //           required
  //         />
  //         <Input
  //           id="imageUrl"
  //           label="Image Url"
  //           errorText="Please Enter a valid Image Url!"
  //           keyboardType="default"
  //           returnKeyType="next"
  //           onInputChange={inputChangeHandler}
  //           initialValue={editedProduct ? editedProduct.imageUrl : ''}
  //           initiallyValid={!!editedProduct}
  //           required
  //         />
  //         {editedProduct ? null : (
  //           <Input
  //             id="price"
  //             label="Price"
  //             errorText="Please Enter a valid Price!"
  //             onInputChange={inputChangeHandler}
  //             keyboardType="decimal-pad"
  //             returnKeyType="next"
  //             required
  //             min={1}
  //           />
  //         )}
  //         <Input
  //           id="description"
  //           label="Description"
  //           errorText="Please Enter a valid Description!"
  //           onInputChange={inputChangeHandler}
  //           keyboardType="default"
  //           autoCorrect
  //           multiline
  //           numberOfLines={3}
  //           autoCapitalize="sentences"
  //           initialValue={editedProduct ? editedProduct.description : ''}
  //           initiallyValid={!!editedProduct}
  //           required
  //           minLength={5}
  //         />
  //         <Text>{formState.inputValues.title.toString()}</Text>
  //       </View>
  //     </ScrollView>
  //   </KeyboardAvoidingView>
  // );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EditProductScreen;
