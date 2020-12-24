// In App.js in a new project

import * as React from 'react';
import App from './App';
import firebase from '@react-native-firebase/app';
import Auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import functions from '@react-native-firebase/functions';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import inAppMessaging from '@react-native-firebase/in-app-messaging';
import analytics from '@react-native-firebase/analytics';
import {fcmService} from './src/FCMService';
import {localNotificationService} from './src/LocalNotificationService';
const firebaseConfig = {
  apiKey: 'AIzaSyDjSJpW2oWc6pLCP9bbjSYiJtGfS4tcsAc',
  authDomain: 'fir-demo-e2751.firebaseapp.com',
  databaseURL: 'https://fir-demo-e2751.firebaseio.com',
  projectId: 'fir-demo-e2751',
  storageBucket: 'fir-demo-e2751.appspot.com',
  messagingSenderId: '81014207550',
  appId: '1:81014207550:web:0a4f29e52f2e01ee38cd6f',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export {
  firebase,
  Auth,
  database,
  firestore,
  storage,
  functions,
  messaging,
  dynamicLinks,
  inAppMessaging,
  analytics,
};

const Setup = () => {
  const onReceived = notification => {
    console.log('Notification received: ', notification);
  };

  const onOpened = openResult => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  };

  const onIds = device => {
    console.log('Device info: ', device);
  };

  const setupCloudMessaging = async () => {
    const token = await messaging().getToken();
    //  alert(token);
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const handleDynamicLink = link => {
    // alert(link.url);
  };
  React.useEffect(async () => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('[App] onRegister: ', token);
    }

    function onNotification(notify) {
      console.log('[App] onNotification: ', notify);
      const options = {
        soundName: 'default',
        playSound: true,
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }

    function onOpenNotification(notify) {
      console.log('[App] onOpenNotification: ', notify);
      alert('Open Notification: ' + notify.body);
    }

    return () => {
      console.log('[App] unRegister');
      fcmService.unRegister();
      localNotificationService.unRegister();
    };
  }, []);
  return <App />;
};

export default Setup;
