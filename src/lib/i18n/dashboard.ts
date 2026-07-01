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
    loadError: "加载失败，请稍后重试",
    retry: "重试",
    language: "语言",
    zh: "中文",
    ja: "日本語",
    emptyChart: "暂无趋势数据",
    emptyTable: "暂无模型用量数据",
    projectFilter: "项目筛选",
    allProjects: "全部项目",
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
    loadError: "読み込みに失敗しました。しばらくしてから再試行してください",
    retry: "再試行",
    language: "言語",
    zh: "中文",
    ja: "日本語",
    emptyChart: "推移データがありません",
    emptyTable: "モデル別データがありません",
    projectFilter: "プロジェクト",
    allProjects: "すべて",
  },
} as const;

export type DashboardMessages = (typeof messages)[DashboardLocale];

export function getDashboardMessages(locale: DashboardLocale): DashboardMessages {
  return messages[locale];
}
