export interface Quote {
  text: string;
  author?: string;
  category?: 'motivation' | 'habit' | 'growth' | 'balance';
}

const quotes: Quote[] = [
  { text: '今日の小さな一歩が、未来の大きな変化につながる。', author: 'ハビスタ', category: 'motivation' },
  { text: '完璧を目指さなくていい、一歩踏み出すことが大切。', author: 'ハビスタ', category: 'motivation' },
  { text: '習慣は第二の天性である。', author: 'キケロ', category: 'habit' },
  { text: '自分を変えるのは、毎日の積み重ね。', author: 'ハビスタ', category: 'habit' },
  { text: '成長は快適ゾーンの外にある。', author: 'ハビスタ', category: 'growth' },
  { text: '昨日の自分より一歩前へ。', author: 'ハビスタ', category: 'growth' },
  { text: '自分のための5分は、家族のための1時間と同じ価値がある。', author: 'ハビスタ', category: 'balance' },
  { text: '自分を大切にすることは、周りの人を大切にすることにつながる。', author: 'ハビスタ', category: 'balance' },
];

export async function getDailyQuote(category?: Quote['category']): Promise<Quote> {
  // カテゴリでフィルタ
  const filtered = category ? quotes.filter(q => q.category === category) : quotes;
  // 日付ごとに名言を切り替え
  const today = new Date().toISOString().slice(0, 10);
  const hash = today.split('-').reduce((acc, v) => acc + parseInt(v), 0);
  const idx = hash % filtered.length;
  return filtered[idx];
} 