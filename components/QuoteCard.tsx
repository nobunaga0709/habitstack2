import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { Quote, getDailyQuote } from '../utils/quotes';
import { colors, typography } from '../utils/theme';

interface QuoteCardProps {
  category?: 'motivation' | 'habit' | 'growth' | 'balance';
  onClose?: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  category,
  onClose
}) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());

  // 金言を取得する関数
  const fetchQuote = async () => {
    try {
      // フェードアウト
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(async () => {
        // 新しい金言を取得
        const newQuote = await getDailyQuote(category);
        setQuote(newQuote);
        
        // フェードイン
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    } catch (error) {
      console.error('金言の取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    // 初回マウント時に金言を取得
    fetchQuote();
    
    // 日付が変わった時に金言を更新するタイマーを設定
    const timer = setInterval(() => {
      const now = new Date();
      const dateStr = now.toDateString();
      
      // 日付が変わったら金言を更新
      if (dateStr !== currentDate) {
        setCurrentDate(dateStr);
        fetchQuote();
      }
    }, 60000); // 1分ごとにチェック
    
    return () => clearInterval(timer);
  }, [currentDate, category]);

  if (!quote) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>
          『{quote.text}』
        </Text>
        <View style={styles.authorContainer}>
          {quote.author && (
            <Text style={styles.authorText}>
              {quote.author}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: 'bold',
  },
  quoteContainer: {
    paddingHorizontal: 8,
  },
  quoteText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  authorContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  authorText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'right',
    fontWeight: '500',
    paddingRight: 4,
  },
});

export default QuoteCard; 