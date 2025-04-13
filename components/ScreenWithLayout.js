import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../App';
import { FooterTabs } from '../App';

const ScreenWithLayout = ({ children, navigation }) => {
  return (
    <View style={styles.wrapper}>
      <Header navigation={navigation} />
      <View style={styles.content}>{children}</View>
      <FooterTabs />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 16, paddingBottom: 70 }, // enough padding so footer isn't overlapped
});

export default ScreenWithLayout;
