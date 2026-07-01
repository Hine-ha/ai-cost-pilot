export type DocsLocale = "zh" | "ja";

const messages = {
  zh: {
    title: "2行代码，AI成本全掌握",
    subtitle: "接入后自动记录每次 API 调用的 token 用量和成本",
    language: "语言",
    step1Title: "安装 SDK",
    step2Title: "初始化",
    step3Title: "查看仪表盘",
    step1Desc: "通过 pip 安装 AI Cost Pilot SDK",
    step2Desc: "用 track() 包装 Anthropic 客户端",
    step3Desc: "正常使用 API，数据自动上报",
    supportedModels: "支持的模型",
    viewDashboard: "查看仪表盘",
    feedback: "反馈",
    copy: "复制",
    copied: "已复制",
    codeStep1: "pip install aicostpilot",
    codeStep2: `import anthropic
from aicostpilot import track

client = track(
    anthropic.Anthropic(),
    project="my-project"
)`,
    codeStep3: `# 之后正常使用，数据自动上报
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1000,
    messages=[{"role": "user", "content": "你好"}]
)`,
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
    step1Desc: "pip で AI Cost Pilot SDK をインストール",
    step2Desc: "track() で Anthropic クライアントをラップ",
    step3Desc: "通常どおり API を利用するとデータが自動送信されます",
    supportedModels: "対応モデル",
    viewDashboard: "ダッシュボードを見る",
    feedback: "フィードバック",
    copy: "コピー",
    copied: "コピーしました",
    codeStep1: "pip install aicostpilot",
    codeStep2: `import anthropic
from aicostpilot import track

client = track(
    anthropic.Anthropic(),
    project="my-project"
)`,
    codeStep3: `# 之后正常使用，数据自动上报
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1000,
    messages=[{"role": "user", "content": "你好"}]
)`,
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
