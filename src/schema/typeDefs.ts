import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar Date
  scalar JSON

  type Todo {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    createdAt: Date!
    updatedAt: Date!
    
    # Expensive fields that benefit from @defer
    analytics: TodoAnalytics
    relatedTodos: [Todo!]!
    aiSuggestions: TodoAISuggestions
  }

  # Expensive analytics data
  type TodoAnalytics {
    timeSpentEstimate: Int
    complexityScore: Float
    priorityRanking: Int
    completionPrediction: String
  }

  # AI-generated suggestions (simulates expensive AI API call)
  type TodoAISuggestions {
    similarTasks: [String!]!
    improvementTips: [String!]!
    estimatedDuration: String
    difficultyAssessment: String
  }

  # Enhanced todo stats with expensive computations
  type TodoStats {
    total: Int!
    completed: Int!
    pending: Int!
    
    # Expensive analytics fields
    productivity: ProductivityStats
    trends: TodoTrends
  }

  type ProductivityStats {
    averageCompletionTime: Float
    mostProductiveHour: Int
    completionRate: Float
    streakCount: Int
  }

  type TodoTrends {
    weeklyProgress: [Int!]!
    categoryBreakdown: [CategoryStats!]!
    timePatterns: [String!]!
  }

  type CategoryStats {
    category: String!
    count: Int!
    completionRate: Float!
  }

  input CreateTodoInput {
    title: String!
    description: String
  }

  input UpdateTodoInput {
    id: ID!
    title: String
    description: String
    completed: Boolean
  }

  input TodoFilters {
    completed: Boolean
    search: String
  }

  input DeviceFilterInput {
    type: String
    savedConfig: Boolean
    connected: Boolean
    reportedConfig: Boolean
    reportedState: Boolean
  }

  type Query {
    todos(filters: TodoFilters): [Todo!]!
    todo(id: ID!): Todo
    todoStats: TodoStats!

    # Fetch device details from external API
    getDevice(
      serialNumber: String!
      token: String
      ancestry: Boolean = true
      reportedState: Boolean = true
    ): DeviceResponse

    # Fetch devices list (returns DeviceListResponse)
    getDevicesData(
      operatorId: String!
      networkEntity: String!
      offset: Int!
      count: Int!
      deviceFilter: DeviceFilterInput
      ids: [ID!]
    ): DeviceListResponse

    # Fetch spectrum data from SDS
    getSpectrumData(operatorId: String!, input: SpectrumDataInput!): JSON

    # Fetch all devices (aggregates NIS list and SDS spectrum per-device)
    getAllDevicesData(
      operatorId: String!
      networkEntity: String!
      ids: [ID!]
      deviceFilter: DeviceFilterInput
      offset: Int = 500
      count: Int = 20
      spectrumInput: SpectrumDataInput
    ): [AllDeviceData!]!

    allDevices(
      operatorId: String!
      networkEntity: String!
      limit: Int!
      deviceFilter: DeviceFilterInput
      ids: [ID!]
    ): [DevicesData!]!

    # Expensive operations perfect for @defer
    expensiveReport: ExpensiveReport!

    # all devices data with @defer
    devicesData(
      operatorId: String!
      networkEntity: String!
      ids: [ID!]
      deviceFilter: DeviceFilterInput
      offset: Int = 0
      count: Int = 20
      spectrumInput: SpectrumDataInput
    ): DevicesData
  }

  type DevicesData {
    devicesData: DeviceListResponse!
    spectrumData: JSON!
  }

  type ExpensiveReport {
    summary: String!
    detailedAnalysis: ReportAnalysis
    recommendations: [String!]!
  }

  type ReportAnalysis {
    dataProcessingTime: Float!
    insights: [String!]!
    predictions: [String!]!
    correlations: [CorrelationData!]!
  }

  type CorrelationData {
    field1: String!
    field2: String!
    correlation: Float!
    significance: String!
  }

  type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(input: UpdateTodoInput!): Todo!
    deleteTodo(id: ID!): Boolean!
    toggleTodo(id: ID!): Todo!
    clearCompleted: Int!
  }

  type Subscription {
    todoAdded: Todo!
    todoUpdated: Todo!
    todoDeleted: ID!
  }
`;
