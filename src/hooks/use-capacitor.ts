import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const useCapacitor = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Initialize Status Bar
    const initStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Default });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
      } catch (e) {
        console.error('StatusBar error:', e);
      }
    };

    // Initialize Splash Screen
    const initSplashScreen = async () => {
      try {
        await SplashScreen.hide();
      } catch (e) {
        console.error('SplashScreen error:', e);
      }
    };

    // Handle App State and Back Button
    const initAppListeners = async () => {
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
    };

    initStatusBar();
    initSplashScreen();
    initAppListeners();

    return () => {
      App.removeAllListeners();
    };
  }, []);
};
