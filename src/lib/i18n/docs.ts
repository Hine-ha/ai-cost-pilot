export type DocsLocale = "zh" | "ja";

const messages = {
  zh: {
    title: "2行代码，AI成本全掌握",
    subtitle: "接入后自动记录每次 API 调用的 token 用量和成本",
    language: "语言",
    step1Title: "安装 SDK",
    step2Title: "初始化",
    step3Title: "查看仪表盘",
    step1Desc: "通过 pip 安装 TokenLens SDK",
    step2Desc: "用 track() 包装 Anthropic 或 OpenAI 客户端",
    step3Desc: "在仪表盘查看自动上报的用量与成本",
    supportedModels: "支持的模型",
    viewDashboard: "查看仪表盘",
    feedback: "反馈",
    copy: "复制",
    copied: "已复制 ✓",
    tabAnthropic: "Anthropic",
    tabOpenAI: "OpenAI",
    prereqTitle: "前提条件",
    prereqInstallLabel: "安装 SDK",
    prereqApiKeyLabel: "设置 API Key（写入环境变量，永久生效）",
    prereqApiKeyNote: "API Key 在仪表盘的设置页面获取",
    codePrereqInstall:
      'pip3 install "git+https://github.com/Hine-ha/tokenlens-.git#subdirectory=tokenlens"',
    codePrereqApiKey: `echo 'export TOKENLENS_API_KEY=你的key' >> ~/.zshrc
source ~/.zshrc`,
    codeStep1:
      'pip3 install "git+https://github.com/Hine-ha/tokenlens-.git#subdirectory=tokenlens"',
    codeStep2Anthropic: `import anthropic
from tokenlens import track

client = track(
    anthropic.Anthropic(),
    project="my-project"
)

# 之后正常使用
response = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=1000,
    messages=[{"role": "user", "content": "你好"}]
)`,
    codeStep2OpenAI: `import openai
from tokenlens import track

client = track(
    openai.OpenAI(),
    project="my-project"
)

# 之后正常使用
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "你好"}]
)`,
    codeStep3: `# 打开仪表盘查看上报数据
# https://my-tokenlens.vercel.app/dashboard`,
    models: {
      claude: "Claude",
      gpt4: "GPT-4",
      gemini: "Gemini",
      deepseek: "DeepSeek",
    },
  },
  ja: {
    title: "2行のコードでAIコストを可視化",
    subtitle:
      "接続後、API呼び出しごとのトークン使用量とコストを自動記録します",
    language: "言語",
    step1Title: "SDK をインストール",
    step2Title: "初期化",
    step3Title: "ダッシュボードを確認",
    step1Desc: "pip で TokenLens SDK をインストール",
    step2Desc: "track() で Anthropic または OpenAI クライアントをラップ",
    step3Desc: "ダッシュボードで自動送信された利用量とコストを確認",
    supportedModels: "対応モデル",
    viewDashboard: "ダッシュボードを見る",
    feedback: "フィードバック",
    copy: "コピー",
    copied: "コピーしました ✓",
    tabAnthropic: "Anthropic",
    tabOpenAI: "OpenAI",
    prereqTitle: "前提条件",
    prereqInstallLabel: "SDK をインストール",
    prereqApiKeyLabel: "API Key を設定（環境変数に永続化）",
    prereqApiKeyNote: "API Key はダッシュボードの設定ページで取得できます",
    codePrereqInstall:
      'pip3 install "git+https://github.com/Hine-ha/tokenlens-.git#subdirectory=tokenlens"',
    codePrereqApiKey: `echo 'export TOKENLENS_API_KEY=your-key' >> ~/.zshrc
source ~/.zshrc`,
    codeStep1:
      'pip3 install "git+https://github.com/Hine-ha/tokenlens-.git#subdirectory=tokenlens"',
    codeStep2Anthropic: `import anthropic
from tokenlens import track

client = track(
    anthropic.Anthropic(),
    project="my-project"
)

# 通常どおり利用
response = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=1000,
    messages=[{"role": "user", "content": "こんにちは"}]
)`,
    codeStep2OpenAI: `import openai
from tokenlens import track

client = track(
    openai.OpenAI(),
    project="my-project"
)

# 通常どおり利用
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "こんにちは"}]
)`,
    codeStep3: `# ダッシュボードで送信データを確認
# https://my-tokenlens.vercel.app/dashboard`,
    models: {
      claude: "Claude",
      gpt4: "GPT-4",
      gemini: "Gemini",
      deepseek: "DeepSeek",
    },
  },
} as const;

export type DocsMessages = (typeof messages)[DocsLocale];

export function getDocsMessages(locale: DocsLocale): DocsMessages {
  return messages[locale];
}
