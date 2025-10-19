import { GraphQLScalarType, Kind, ValueNode } from "graphql";
import { todoStore } from "../data/todoStore";
import {
  Context,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilters,
} from "../types";
import { getDevicesDataQuery } from "./queries/getDevicesData";
import { getSpectrumDataQuery } from "./queries/getSpectrumData";
import { getAllDevicesDataQuery } from "./queries/getAllDevicesData";
import { getCommonHeaders } from "./utils/auth";

// Helper function to simulate expensive operations
const simulateExpensiveOperation = (ms: number = 2000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Helper to generate mock analytics
const generateTodoAnalytics = async (todo: any) => {
  await simulateExpensiveOperation(1500); // Simulate API call

  // Use todo data to influence the analytics
  const titleLength = todo.title.length;
  const baseComplexity = titleLength > 20 ? 8 : titleLength > 10 ? 5 : 3;

  return {
    timeSpentEstimate: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
    complexityScore: baseComplexity + Math.random() * 3,
    priorityRanking: Math.floor(Math.random() * 100) + 1,
    completionPrediction: `${Math.floor(Math.random() * 7) + 1} days`,
  };
};

// Helper to generate AI suggestions
const generateAISuggestions = async (todo: any) => {
  await simulateExpensiveOperation(3000); // Simulate expensive AI API call
  return {
    similarTasks: [
      `Complete ${todo.title.toLowerCase()} documentation`,
      `Review ${todo.title.toLowerCase()} requirements`,
      `Test ${todo.title.toLowerCase()} functionality`,
    ],
    improvementTips: [
      "Break this task into smaller subtasks",
      "Set a specific deadline",
      "Allocate focused time blocks",
    ],
    estimatedDuration: `${Math.floor(Math.random() * 4) + 1}-${
      Math.floor(Math.random() * 4) + 5
    } hours`,
    difficultyAssessment: ["Easy", "Medium", "Hard", "Very Hard"][
      Math.floor(Math.random() * 4)
    ],
  };
};

// Custom Date scalar resolver
const DateType = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error("Value is not a valid Date");
  },
  parseValue(value: unknown): Date {
    if (typeof value === "string") {
      return new Date(value);
    }
    throw new Error("Value is not a valid Date string");
  },
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error("Can only parse strings to dates");
  },
});

// Minimal JSON scalar resolver
const parseLiteral = (ast: ValueNode): any => {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value);
    case Kind.NULL:
      return null;
    case Kind.OBJECT: {
      const value: Record<string, any> = {};
      for (const field of ast.fields) {
        value[field.name.value] = parseLiteral(field.value);
      }
      return value;
    }
    case Kind.LIST:
      return ast.values.map(parseLiteral);
    default:
      return null;
  }
};

const JSONType = new GraphQLScalarType({
  name: "JSON",
  description: "Arbitrary JSON value",
  serialize(value: unknown): any {
    return value as any;
  },
  parseValue(value: unknown): any {
    return value as any;
  },
  parseLiteral(ast: ValueNode): any {
    return parseLiteral(ast);
  },
});

export const resolvers = {
  Date: DateType,
  JSON: JSONType,

  Todo: {
    // Expensive analytics field - perfect for @defer
    analytics: async (parent: any) => {
      console.log(
        `🔄 Resolving analytics for todo ${parent.id} (this will take ~1.5s)`
      );
      return await generateTodoAnalytics(parent);
    },

    // Expensive related todos computation with error handling for specific ID
    relatedTodos: async (parent: any) => {
      console.log(
        `🔄 Finding related todos for ${parent.id} (this will take ~2s)`
      );

      // Fail for a specific todo ID to demonstrate error handling
      if (parent.title === "Learn GraphQL") {
        await simulateExpensiveOperation(1000); // Still take some time before failing
        console.log(
          `❌ Simulating failure for todo "${parent.title}" (${parent.id})`
        );
        throw new Error(
          `Failed to load related todos for "${parent.title}": External API timeout`
        );
      }

      await simulateExpensiveOperation(2000);

      // Find todos with similar keywords
      const allTodos = todoStore.getTodos();
      const keywords = parent.title.toLowerCase().split(" ");
      const related = allTodos
        .filter(
          (todo) =>
            todo.id !== parent.id &&
            keywords.some((keyword: string) =>
              todo.title.toLowerCase().includes(keyword)
            )
        )
        .slice(0, 3);

      console.log(
        `✅ Successfully found ${related.length} related todos for "${parent.title}"`
      );
      return related;
    },

    // Very expensive AI suggestions
    aiSuggestions: async (parent: any) => {
      console.log(
        `🔄 Generating AI suggestions for todo ${parent.id} (this will take ~3s)`
      );
      return await generateAISuggestions(parent);
    },
  },

  TodoStats: {
    // Expensive productivity calculations
    productivity: async () => {
      console.log(`🔄 Calculating productivity stats (this will take ~2.5s)`);
      await simulateExpensiveOperation(2500);

      return {
        averageCompletionTime: Math.random() * 48 + 12, // 12-60 hours
        mostProductiveHour: Math.floor(Math.random() * 12) + 8, // 8am-8pm
        completionRate: Math.random() * 0.4 + 0.6, // 60-100%
        streakCount: Math.floor(Math.random() * 10) + 1,
      };
    },

    // Expensive trend analysis
    trends: async () => {
      console.log(`🔄 Analyzing todo trends (this will take ~3s)`);
      await simulateExpensiveOperation(3000);

      return {
        weeklyProgress: Array.from({ length: 7 }, () =>
          Math.floor(Math.random() * 10)
        ),
        categoryBreakdown: [
          { category: "Development", count: 5, completionRate: 0.8 },
          { category: "Planning", count: 3, completionRate: 0.9 },
          { category: "Testing", count: 2, completionRate: 0.7 },
        ],
        timePatterns: [
          "Most active in mornings",
          "Productivity peaks at 2pm",
          "Lower activity on Fridays",
        ],
      };
    },
  },

  Query: {
    todos: (
      _parent: unknown,
      args: { filters?: TodoFilters },
      _context: Context
    ) => {
      return todoStore.getTodos(args.filters);
    },

    todo: (_parent: unknown, args: { id: string }, _context: Context) => {
      return todoStore.getTodo(args.id);
    },

    todoStats: (_parent: unknown, _args: unknown, _context: Context) => {
      return todoStore.getStats();
    },

    // Very expensive report generation
    expensiveReport: async () => {
      console.log(
        `🔄 Generating expensive report (this will take ~1s for summary, ~4s for analysis)`
      );
      return {
        summary: "Quick summary of todo performance",
      };
    },

    devicesData: async (_parent: unknown, _args: unknown, _context: Context) => {
      const { operatorId, networkEntity, ids, offset, count, deviceFilter } = _context?.params?.variables;
      const devicesData = await getDevicesDataQuery({ operatorId: operatorId, networkEntity: networkEntity, ids: ids, offset: offset, count: count, deviceFilter });
      return devicesData;
    },

    getDevicesData: async (
      _parent: unknown,
      args: {
        networkEntity: string;
        offset: number;
        count: number;
        operatorId: string;
        deviceFilter?: {
          type?: string;
          savedConfig?: boolean;
          reportedConfig?: boolean;
          reportedState?: boolean;
        };
        ids: number[];
      }
    ) => {
      const { networkEntity, offset, count, operatorId, deviceFilter, ids } = args;
      const queryParams: any = { operatorId, networkEntity, offset, count };
      if (typeof ids !== "undefined") queryParams.ids = ids;
      if (typeof deviceFilter !== "undefined") queryParams.deviceFilter = deviceFilter;
      return await getDevicesDataQuery(queryParams);
    },

    getSpectrumData: async (
      _parent: unknown,
      args: {
        operatorId: string;
        input: {
          deviceSerialNumbers: string[];
          eirpCarrier0: boolean;
          eirpCarrier1: boolean;
          eirpCarrier2: boolean;
          eirpCarrier3: boolean;
          palCount: boolean;
          reason: boolean;
          status: boolean;
        };
      }
    ) => {
      const { operatorId, input } = args;
      return await getSpectrumDataQuery({ operatorId, input });
    },

    getAllDevicesData: async (
      _parent: unknown,
      args: {
        operatorId: string;
        networkEntity: string;
        deviceFilter?: {
          type?: string;
          savedConfig?: boolean;
          reportedConfig?: boolean;
          reportedState?: boolean;
        };
        offset?: number;
        count?: number;
        ids?: number[];
        spectrumInput?: {
          eirpCarrier0?: boolean;
          eirpCarrier1?: boolean;
          eirpCarrier2?: boolean;
          eirpCarrier3?: boolean;
          palCount?: boolean;
          reason?: boolean;
          status?: boolean;
        };
      }
    ) => {
      const {
        operatorId,
        networkEntity,
        deviceFilter,
        offset,
        count,
        ids,
        spectrumInput,
      } = args;
      const queryParams: any = { operatorId, networkEntity, ids };
      if (typeof deviceFilter !== "undefined") queryParams.deviceFilter = deviceFilter;
      if (typeof offset !== "undefined") queryParams.offset = offset;
      if (typeof count !== "undefined") queryParams.count = count;
      if (typeof spectrumInput !== "undefined") queryParams.spectrumInput = spectrumInput;
      return await getAllDevicesDataQuery(queryParams);
    },

    getDevice: async (
      _parent: unknown,
      args: {
        serialNumber: string;
        token?: string;
        ancestry?: boolean;
        reportedState?: boolean;
      }
    ) => {
      const baseUrl =
        "https://portal.tcc-sandbox.cloud.taranawireless.com/api/tni/v2/devices";
      const url = new URL(
        `${baseUrl}/${encodeURIComponent(args.serialNumber)}`
      );
      const ancestry =
        typeof args.ancestry === "boolean" ? args.ancestry : true;
      const reportedState =
        typeof args.reportedState === "boolean" ? args.reportedState : true;
      url.searchParams.set("ancestry", String(ancestry));
      url.searchParams.set("reportedState", String(reportedState));

      const headers = getCommonHeaders("195");

      const response = await fetch(url, { method: "GET", headers });
      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        let errorBody: any = undefined;
        try {
          errorBody = contentType.includes("application/json")
            ? await response.json()
            : await response.text();
        } catch {
          // ignore parse error
        }
        const message = `Failed to fetch device (${response.status} ${response.statusText})`;
        throw new Error(
          typeof errorBody === "string" || errorBody == null
            ? message
            : `${message}: ${JSON.stringify(errorBody)}`
        );
      }

      return contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    },
  },

  DevicesData: {
    devicesData: async (parent: any, _args: unknown, _context: Context) => {
      return parent;
    },
    spectrumData: async (devicesData: any, _args: unknown, _context: Context) => {
      // console.log(a, b, c, d);
      const { operatorId } = _context?.params?.variables;
      const spectrumData = await getSpectrumDataQuery({ operatorId: operatorId, input: { deviceSerialNumbers: devicesData.data.map((device: any) => device.serialNumber), eirpCarrier0: true, eirpCarrier1: true, eirpCarrier2: true, eirpCarrier3: true, palCount: true, reason: true, status: true } });
      return spectrumData;
    },
  },

  ExpensiveReport: {
    detailedAnalysis: async () => {
      console.log(`🔄 Performing detailed analysis (this will take ~4s)`);
      await simulateExpensiveOperation(4000);

      return {
        dataProcessingTime: 4.2,
        insights: [
          "Users complete tasks faster in the morning",
          "Complex tasks benefit from being broken down",
          "Regular breaks improve overall productivity",
        ],
        predictions: [
          "Completion rate will improve by 15% next month",
          "New task categories are emerging",
          "User engagement peaks on Tuesdays",
        ],
        correlations: [
          {
            field1: "task_complexity",
            field2: "completion_time",
            correlation: 0.78,
            significance: "High",
          },
          {
            field1: "time_of_day",
            field2: "productivity",
            correlation: 0.65,
            significance: "Medium",
          },
        ],
      };
    },

    recommendations: async () => {
      await simulateExpensiveOperation(1000);
      return [
        "Implement task complexity scoring",
        "Add time tracking features",
        "Create productivity dashboards",
        "Enable task dependencies",
      ];
    },
  },



  Mutation: {
    createTodo: (
      _parent: unknown,
      args: { input: CreateTodoInput },
      _context: Context
    ) => {
      if (!args.input.title.trim()) {
        throw new Error("Todo title cannot be empty");
      }
      return todoStore.createTodo(args.input);
    },

    updateTodo: (
      _parent: unknown,
      args: { input: UpdateTodoInput },
      _context: Context
    ) => {
      const todo = todoStore.updateTodo(args.input);
      if (!todo) {
        throw new Error(`Todo with id ${args.input.id} not found`);
      }
      return todo;
    },

    deleteTodo: (_parent: unknown, args: { id: string }, _context: Context) => {
      const deleted = todoStore.deleteTodo(args.id);
      if (!deleted) {
        throw new Error(`Todo with id ${args.id} not found`);
      }
      return true;
    },

    toggleTodo: (_parent: unknown, args: { id: string }, _context: Context) => {
      const todo = todoStore.toggleTodo(args.id);
      if (!todo) {
        throw new Error(`Todo with id ${args.id} not found`);
      }
      return todo;
    },

    clearCompleted: (_parent: unknown, _args: unknown, _context: Context) => {
      return todoStore.clearCompleted();
    },
  },
};
