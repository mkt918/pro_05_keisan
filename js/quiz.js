/**
 * IT基礎学習 - 練習問題 共通ロジック
 */

// ===== 問題生成 =====

/** 二進数→十進数 問題生成（4〜8ビット） */
function generateBinToDecQuestion() {
  const bits = Math.floor(Math.random() * 5) + 4; // 4〜8ビット
  let num = 0;
  while (num === 0) num = Math.floor(Math.random() * (Math.pow(2, bits) - 1)) + 1;
  const binary = num.toString(2).padStart(bits, '0');
  return { question: binary, answer: num, type: 'bin2dec' };
}

/** 十進数→二進数 問題生成（1〜255） */
function generateDecToBinQuestion() {
  const num = Math.floor(Math.random() * 254) + 1; // 1〜254
  const binary = num.toString(2);
  return { question: num, answer: binary, type: 'dec2bin' };
}

// ===== スコア管理 =====
class QuizSession {
  constructor(total = 10) {
    this.total = total;
    this.current = 0;
    this.correct = 0;
    this.history = []; // { question, answer, userAnswer, isCorrect }
  }

  submit(question, answer, userAnswer, isCorrect) {
    this.current++;
    if (isCorrect) this.correct++;
    this.history.push({ question, answer, userAnswer, isCorrect });
  }

  get score() { return this.correct; }
  get progress() { return this.current / this.total; }
  get isComplete() { return this.current >= this.total; }

  getRank() {
    const pct = this.correct / this.total;
    if (pct >= 0.9) return { label: 'エキスパート', emoji: '🏆', color: 'text-yellow-400' };
    if (pct >= 0.7) return { label: 'よくできました', emoji: '🌟', color: 'text-teal-400' };
    if (pct >= 0.5) return { label: 'もう少し！', emoji: '💪', color: 'text-orange-400' };
    return { label: '要復習', emoji: '📖', color: 'text-red-400' };
  }
}

// ===== ビット表示ヘルパー =====
function renderBinaryDisplay(binaryStr, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  binaryStr.split('').forEach((bit, i) => {
    const cell = document.createElement('div');
    cell.className = `bit-display-cell ${bit === '1' ? 'bit-on' : 'bit-off'}`;
    cell.innerHTML = `
      <div class="bit-val">${bit}</div>
      <div class="bit-pos">2<sup>${binaryStr.length - 1 - i}</sup></div>
    `;
    container.appendChild(cell);
  });
}

// ===== 結果画面生成 =====
function renderResult(session, containerId, restartCallback, lessonUrl, nextUrl) {
  const container = document.getElementById(containerId);
  const rank = session.getRank();
  const pct = Math.round((session.correct / session.total) * 100);

  container.innerHTML = `
    <div class="text-center mb-8 animate-fade-in">
      <div class="text-5xl mb-3">${rank.emoji}</div>
      <div class="text-3xl font-black text-white mb-1">${session.correct} / ${session.total} 問正解</div>
      <div class="text-xl ${rank.color} font-bold mb-2">${rank.label}</div>
      <div class="text-gray-400 text-sm">正答率 ${pct}%</div>
    </div>

    <!-- スコアバー -->
    <div class="progress-bar mb-8">
      <div class="progress-bar__fill" style="width: ${pct}%"></div>
    </div>

    <!-- 問題履歴 -->
    <div class="mb-8">
      <div class="text-sm text-gray-400 mb-4 font-medium">📋 問題の振り返り</div>
      <div class="space-y-2" id="history-list"></div>
    </div>

    <!-- ボタン -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <button onclick="${restartCallback}()" 
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-700 border border-navy-600 text-white rounded-xl font-bold hover:bg-navy-600 transition-all">
        🔄 もう一度挑戦
      </button>
      ${lessonUrl ? `
      <a href="${lessonUrl}"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-900/40 border border-teal-700/50 text-teal-400 rounded-xl font-bold hover:bg-teal-900/60 transition-all">
        📖 解説を見直す
      </a>` : ''}
      ${nextUrl ? `
      <a href="${nextUrl}"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg">
        次の単元へ →
      </a>` : ''}
    </div>
  `;

  // 履歴リスト
  const historyList = document.getElementById('history-list');
  session.history.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = `flex items-center gap-3 p-3 rounded-lg ${item.isCorrect ? 'bg-green-900/15 border border-green-800/30' : 'bg-red-900/15 border border-red-800/30'}`;
    div.innerHTML = `
      <span class="text-lg">${item.isCorrect ? '✅' : '❌'}</span>
      <span class="text-gray-400 text-sm w-4">${i+1}</span>
      <span class="font-mono text-white text-sm flex-1">問: <span class="${item.isCorrect ? 'text-teal-400' : 'text-red-400'}">${item.question}</span></span>
      <span class="font-mono text-xs text-gray-500">正解: <span class="text-green-400">${item.answer}</span></span>
      ${!item.isCorrect ? `<span class="font-mono text-xs text-gray-500">あなた: <span class="text-red-400">${item.userAnswer || '未回答'}</span></span>` : ''}
    `;
    historyList.appendChild(div);
  });
}
