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
    if (pct >= 0.9) return { label: 'エキスパート', emoji: '🏆', color: 'text-yellow-600' };
    if (pct >= 0.7) return { label: 'よくできました', emoji: '🌟', color: 'text-teal-600' };
    if (pct >= 0.5) return { label: 'もう少し！', emoji: '💪', color: 'text-orange-600' };
    return { label: '要復習', emoji: '📖', color: 'text-red-500' };
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

    // 安全な要素作成（innerHTML を避ける）
    const bitVal = document.createElement('div');
    bitVal.className = 'bit-val';
    bitVal.textContent = bit;

    const bitPos = document.createElement('div');
    bitPos.className = 'bit-pos';
    bitPos.textContent = '2';
    const sup = document.createElement('sup');
    sup.textContent = String(binaryStr.length - 1 - i);
    bitPos.appendChild(sup);

    cell.appendChild(bitVal);
    cell.appendChild(bitPos);
    container.appendChild(cell);
  });
}

// ===== 結果画面生成 =====
function renderResult(session, containerId, restartCallback, lessonUrl, nextUrl) {
  const container = document.getElementById(containerId);
  const rank = session.getRank();
  const pct = Math.round((session.correct / session.total) * 100);

  container.innerHTML = `
    <div class="text-center mb-10 animate-fade-in">
      <div class="text-6xl mb-4 transform hover:scale-110 transition-transform cursor-default">${rank.emoji}</div>
      <div class="text-4xl font-black text-slate-900 mb-2">${session.correct} / ${session.total} 問正解</div>
      <div class="text-2xl ${rank.color} font-black mb-3">${rank.label}</div>
      <div class="text-slate-400 font-bold tracking-wider">正答率 ${pct}%</div>
    </div>

    <!-- スコアバー -->
    <div class="progress-bar mb-10 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
      <div class="progress-bar__fill h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full shadow-lg" style="width: ${pct}%"></div>
    </div>

    <!-- 問題履歴 -->
    <div class="mb-10">
      <div class="text-sm text-slate-400 mb-6 font-bold flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
        📋 問題の振り返り
      </div>
      <div class="space-y-3" id="history-list"></div>
    </div>

    <!-- ボタン -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button onclick="${restartCallback}()" 
        class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-black hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95">
        🔄 もう一度挑戦
      </button>
      ${lessonUrl ? `
      <a href="${lessonUrl}"
        class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl font-black hover:bg-teal-100 hover:border-teal-200 transition-all shadow-sm active:scale-95">
        📖 解説を見直す
      </a>` : ''}
      ${nextUrl ? `
      <a href="${nextUrl}"
        class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg active:scale-95 hover:-translate-y-0.5">
        次の単元へ →
      </a>` : ''}
    </div>
  `;

  // 履歴リスト（安全な要素作成）
  const historyList = document.getElementById('history-list');
  session.history.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = `flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all hover:translate-x-1 ${item.isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`;

    const icon = document.createElement('span');
    icon.className = 'text-2xl';
    icon.textContent = item.isCorrect ? '✅' : '❌';

    const content = document.createElement('div');
    content.className = 'flex-1 min-w-0';

    const questionRow = document.createElement('div');
    questionRow.className = 'flex items-center gap-3 flex-wrap';

    const noLabel = document.createElement('span');
    noLabel.className = 'text-slate-400 font-bold text-xs';
    noLabel.textContent = `NO.${i + 1}`;

    const questionLabel = document.createElement('span');
    questionLabel.className = 'font-mono text-slate-800 font-black text-lg';
    questionLabel.textContent = `問: ${item.question}`;

    questionRow.appendChild(noLabel);
    questionRow.appendChild(questionLabel);

    const answerRow = document.createElement('div');
    answerRow.className = 'flex items-center gap-4 mt-1';

    const correctLabel = document.createElement('span');
    correctLabel.className = 'font-mono text-xs text-slate-500';
    correctLabel.textContent = '正解: ';
    const correctValue = document.createElement('span');
    correctValue.className = 'text-green-600 font-bold';
    correctValue.textContent = String(item.answer);
    correctLabel.appendChild(correctValue);
    answerRow.appendChild(correctLabel);

    if (!item.isCorrect) {
      const userLabel = document.createElement('span');
      userLabel.className = 'font-mono text-xs text-slate-500';
      userLabel.textContent = '解答: ';
      const userValue = document.createElement('span');
      userValue.className = 'text-red-500 font-bold';
      userValue.textContent = item.userAnswer || '未回答';
      userLabel.appendChild(userValue);
      answerRow.appendChild(userLabel);
    }

    content.appendChild(questionRow);
    content.appendChild(answerRow);
    div.appendChild(icon);
    div.appendChild(content);
    historyList.appendChild(div);
  });
}
