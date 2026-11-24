import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const useCapacitor = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Initialize Status Bar according to current theme
    const initStatusBar = async () => {
      try {
        const isDark = document.documentElement.classList.contains("dark");
        if (isDark) {
          // Dark theme -> Style.Dark (white icons on dark background)
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#0f1712' });
        } else {
          // Light theme -> Style.Light (dark icons on light background)
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
        }
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
