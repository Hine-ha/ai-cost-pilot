export type DashboardLocale = "zh" | "ja";

const messages = {
  zh: {
    title: "用量仪表盘",
    subtitle: "实时查看 API 用量、成本趋势与模型分布",
    monthlyCost: "本月总花费",
    totalRequests: "总请求数",
    failureRate: "失败率",
    cacheSavings: "缓存节省金额",
    usd: "USD",
    dailyTrend: "过去 30 天每日花费趋势",
    modelBreakdown: "按模型分组的用量明细",
    model: "模型名",
    requests: "请求数",
    inputTokens: "Input Tokens",
    outputTokens: "Output Tokens",
    cost: "花费",
    noData: "暂无数据",
    noDataHint:
      "在运行 SDK 的应用中设置 TOKENLENS_API_KEY，并用 user_id（Dashboard 上方可复制）或 TOKENLENS_USER_ID 关联到你的账号。",
    loadError: "加载失败，请稍后重试",
    retry: "重试",
    language: "语言",
    zh: "中文",
    ja: "日本語",
    emptyChart: "暂无趋势数据",
    emptyTable: "暂无模型用量数据",
    projectFilter: "项目筛选",
    allProjects: "全部项目",
    sdkConfigTitle: "SDK 配置",
    sdkConfigDesc:
      "设置 TOKENLENS_API_KEY 后 SDK 才会上报；user_id 可在此复制，或设置 TOKENLENS_USER_ID。",
    userIdLabel: "你的 user_id",
    copy: "复制",
    copied: "已复制",
    sdkExample:
      "示例：export TOKENLENS_API_KEY=… TOKENLENS_USER_ID=… 后 track(client, project=\"my-app\")",
  },
  ja: {
    title: "利用量ダッシュボード",
    subtitle: "API 利用量、コスト推移、モデル別内訳をリアルタイムで確認",
    monthlyCost: "今月の総コスト",
    totalRequests: "総リクエスト数",
    failureRate: "失敗率",
    cacheSavings: "キャッシュ削減額",
    usd: "USD",
    dailyTrend: "過去30日間の日次コスト推移",
    modelBreakdown: "モデル別利用明細",
    model: "モデル名",
    requests: "リクエスト数",
    inputTokens: "Input Tokens",
    outputTokens: "Output Tokens",
    cost: "コスト",
    noData: "データがありません",
    noDataHint:
      "SDK を動かす環境に TOKENLENS_API_KEY を設定し、user_id（ダッシュボード上部でコピー可）または TOKENLENS_USER_ID でアカウントに紐づけてください。",
    loadError: "読み込みに失敗しました。しばらくしてから再試行してください",
    retry: "再試行",
    language: "言語",
    zh: "中文",
    ja: "日本語",
    emptyChart: "推移データがありません",
    emptyTable: "モデル別データがありません",
    projectFilter: "プロジェクト",
    allProjects: "すべて",
    sdkConfigTitle: "SDK 設定",
    sdkConfigDesc:
      "TOKENLENS_API_KEY を設定すると SDK が送信します。user_id はここでコピーするか TOKENLENS_USER_ID を設定してください。",
    userIdLabel: "あなたの user_id",
    copy: "コピー",
    copied: "コピーしました",
    sdkExample:
      "例：export TOKENLENS_API_KEY=… TOKENLENS_USER_ID=… のあと track(client, project=\"my-app\")",
  },
} as const;

export type DashboardMessages = (typeof messages)[DashboardLocale];

export function getDashboardMessages(locale: DashboardLocale): DashboardMessages {
  return messages[locale];
}
