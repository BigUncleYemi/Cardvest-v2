import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GenericNavigationProps } from '@routes/types';
import ForgetPasswordEnterEmailPage from '@scenes/ForgetPasswordEnterEmailPage';
import IntroPage from '@scenes/IntroPage';
import LoginBackPage from '@scenes/LoginBackPage';
import LoginPage from '@scenes/LoginPage';
import ResetPage from '@scenes/ResetPage';
import SetTransactionPin from '@scenes/SetTransactionPin';
import SignUpPage from '@scenes/SignUpPage';
import Step2 from '@scenes/SignUpPage/Step2';
import Step3 from '@scenes/SignUpPage/Step3';
import VerifyPage from '@scenes/VerifyPage';
import { useQuery } from '@tanstack/react-query';
import navigationService from '@utils/Nav';
import { cacheService } from '@utils/cache';
import axios from 'axios';
import React, { FC, useEffect, useLayoutEffect } from 'react';
import { notificationManager } from '../NotificationManager';
// import { routeOverlayOption } from './routeOptions';
import { MainStackScreen } from './stacks/MainStack';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();

export const AuthStackScreen: FC = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen
        name="Login"
        component={LoginPage}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="LoginBack"
        component={LoginBackPage}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpPage}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="SignUpStep2"
        component={Step2}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="SignUpStep3"
        component={Step3}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="Verify"
        component={VerifyPage}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="ForgetPassword"
        component={ForgetPasswordEnterEmailPage}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="Reset"
        component={ResetPage}
        options={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

const i = Date.now();

export const RootStackScreen: FC = () => {
  const navigation = useNavigation<GenericNavigationProps>();
  const { data, isFetching } = useQuery({
    queryKey: [`login-user`],
    queryFn: async () => cacheService.get('login-user'),
  });
  useLayoutEffect(() => {
    async function fetchToks() {
      try {
        const toks = await cacheService.get('login-user');
        const res = await cacheService.get('firstTime');
        if (res === 'Yes' && toks.length === 0) {
          await navigation.navigate('Auth');
          return;
        }
        if (toks.length > 0) {
          navigation.navigate('LoginBack');
        } else {
          navigation.navigate('Auth');
        }
      } catch (error) {
        return false;
      }
    }
    fetchToks();
  });
  useEffect(() => {
    navigationService.navigation = navigation;
  }, [navigation]);
  useEffect(() => {
    if (!(typeof data === 'string' && data.length > 3) && !isFetching) navigation.navigate('Auth');
  }, [data]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      sendFcmToken();
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    const fetchFirstTime = async () => {
      const res = await cacheService.get('firstTime');
      if (res === 'Yes') {
        await navigation.navigate('Auth');
      } else {
        await navigation.navigate('Intro');
      }
    };
    fetchFirstTime();
    requestUserPermission();
  }, []);

  const sendFcmToken = async () => {
    console.log('Your Firebase Token is:', 'deviceToken');
    try {
      await messaging().registerDeviceForRemoteMessages();
      const deviceToken = await messaging().getToken();
      console.log('Your Firebase Token is:', deviceToken);

      const res = await axios.post('https://dart-africa.herokuapp.com/device/token', { deviceToken });
      console.log('Your Firebase Token is:', deviceToken, 'res is', res);
    } catch (err) {
      //Do nothing
      console.error(err);
      return;
    }
  };

  React.useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      notificationManager.showNotification(
        remoteMessage?.messageId,
        remoteMessage?.notification?.title,
        remoteMessage?.notification?.body,
        remoteMessage?.data,
        remoteMessage?.options,
        remoteMessage?.date || new Date(),
      );
    });
    return unsubscribe;
  }, []);
  return (
    <RootStack.Navigator>
      {/* {typeof data === 'string' && data.length > 3 ? ( */}
      {/* ) : ( */}
      <React.Fragment>
        <RootStack.Screen
          name="Intro"
          component={IntroPage}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="Auth"
          component={AuthStackScreen}
          options={{
            headerShown: false,
          }}
        />
      </React.Fragment>
      <React.Fragment>
        <RootStack.Screen
          name="Dashboard"
          component={MainStackScreen}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="SetTransactionPin"
          component={SetTransactionPin}
          options={{
            headerShown: false,
          }}
        />
      </React.Fragment>
      {/* )} */}
    </RootStack.Navigator>
  );
};
