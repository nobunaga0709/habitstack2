import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { signUp, signIn } from '../utils/firebaseAuth';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'register') {
        await signUp(email, password);
        Alert.alert('登録完了', '新規登録が完了しました。');
      } else {
        await signIn(email, password);
        Alert.alert('ログイン成功', 'ログインしました。');
      }
      router.replace('/'); // TOP画面へ遷移
    } catch (e: any) {
      setError(e.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ロゴ */}
      <View style={styles.logoContainer}>
        {/* 仮のロゴ画像。実際はassetsに差し替え可 */}
        <FontAwesome name="user-circle" size={64} color="#222" />
        <Text style={styles.logoText}>HabitStack</Text>
      </View>

      {/* タブ切り替え */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setTab('login')} style={[styles.tab, tab === 'login' && styles.activeTab]}>
          <Text style={[styles.tabText, tab === 'login' && styles.activeTabText]}>ログイン</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('register')} style={[styles.tab, tab === 'register' && styles.activeTab]}>
          <Text style={[styles.tabText, tab === 'register' && styles.activeTabText]}>新規登録</Text>
        </TouchableOpacity>
      </View>

      {/* メールアドレス・パスワード入力欄 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="パスワード"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.authButton, loading && { opacity: 0.6 }]}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.authButtonText}>{tab === 'register' ? '新規登録' : 'ログイン'}</Text>
        </TouchableOpacity>
      </View>

      {/* ソーシャルログインボタン */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#4285F4' }]} onPress={() => {}}>
          <FontAwesome name="google" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Googleで{tab === 'login' ? 'ログイン' : '登録'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000' }]} onPress={() => {}}>
          <FontAwesome name="apple" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Appleで{tab === 'login' ? 'ログイン' : '登録'}</Text>
        </TouchableOpacity>
      </View>

      {/* 利用規約リンク */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          <Text style={styles.link}>利用規約</Text>と<Text style={styles.link}>個人情報保護方針</Text>に
          同意の上ご利用ください。
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    letterSpacing: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: 280,
    alignSelf: 'center',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#4285F4',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsContainer: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  link: {
    color: '#4285F4',
    textDecorationLine: 'underline',
  },
}); 