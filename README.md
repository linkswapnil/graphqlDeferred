# Todo GraphQL API

A modern, feature-complete Todo GraphQL API built with the latest GraphQL technologies.

## 🚀 Technologies Used

- **GraphQL 16.8.1** - Latest GraphQL specification
- **Apollo Server 4** - Modern GraphQL server
- **TypeScript 5.3** - Type safety and modern JavaScript features
- **Node.js 18+** - Runtime environment
- **UUID** - Unique identifier generation

## 📋 Features

- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete todos
- 🔍 **Advanced Filtering** - Filter by completion status and search text
- 📊 **Statistics** - Get todo counts and completion statistics
- 🎯 **Type Safety** - Full TypeScript support with generated types
- 🛡️ **Error Handling** - Comprehensive error handling and validation
- 🔧 **Developer Experience** - GraphQL Playground for easy testing

## 🏗️ Project Structure

```
src/
├── data/
│   └── todoStore.ts          # In-memory data store
├── resolvers/
│   └── index.ts              # GraphQL resolvers
├── schema/
│   └── typeDefs.ts           # GraphQL schema definition
├── types/
│   └── index.ts              # TypeScript type definitions
└── index.ts                  # Server entry point
```

## 🛠️ Setup and Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

4. **Generate TypeScript types:**
   ```bash
   npm run codegen
   ```

## 🎮 Usage

### Access GraphQL Playground
Once the server is running, open your browser and navigate to:
```
http://localhost:4000
```

### Sample Queries

#### Get All Todos
```graphql
query GetTodos {
  todos {
    id
    title
    description
    completed
    createdAt
    updatedAt
  }
}
```

#### Get Todos with Filters
```graphql
query GetFilteredTodos {
  todos(filters: { completed: false, search: "learn" }) {
    id
    title
    completed
  }
}
```

#### Get Single Todo
```graphql
query GetTodo {
  todo(id: "your-todo-id") {
    id
    title
    description
    completed
  }
}
```

#### Get Todo Statistics
```graphql
query GetTodoStats {
  todoStats {
    total
    completed
    pending
  }
}
```

### Sample Mutations

#### Create Todo
```graphql
mutation CreateTodo {
  createTodo(input: {
    title: "Learn GraphQL"
    description: "Complete the GraphQL tutorial"
  }) {
    id
    title
    description
    completed
    createdAt
  }
}
```

#### Update Todo
```graphql
mutation UpdateTodo {
  updateTodo(input: {
    id: "your-todo-id"
    title: "Updated title"
    completed: true
  }) {
    id
    title
    completed
    updatedAt
  }
}
```

#### Toggle Todo Completion
```graphql
mutation ToggleTodo {
  toggleTodo(id: "your-todo-id") {
    id
    title
    completed
  }
}
```

#### Delete Todo
```graphql
mutation DeleteTodo {
  deleteTodo(id: "your-todo-id")
}
```

#### Clear All Completed Todos
```graphql
mutation ClearCompleted {
  clearCompleted
}
```

## 📝 API Schema

### Types

```graphql
type Todo {
  id: ID!
  title: String!
  description: String
  completed: Boolean!
  createdAt: Date!
  updatedAt: Date!
}

type TodoStats {
  total: Int!
  completed: Int!
  pending: Int!
}
```

### Inputs

```graphql
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
```

### Operations

- **Queries:**
  - `todos(filters: TodoFilters): [Todo!]!`
  - `todo(id: ID!): Todo`
  - `todoStats: TodoStats!`

- **Mutations:**
  - `createTodo(input: CreateTodoInput!): Todo!`
  - `updateTodo(input: UpdateTodoInput!): Todo!`
  - `deleteTodo(id: ID!): Boolean!`
  - `toggleTodo(id: ID!): Todo!`
  - `clearCompleted: Int!`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking
- `npm run codegen` - Generate TypeScript types from GraphQL schema

### Data Storage

Currently uses an in-memory data store for simplicity. In a production environment, you would integrate with a real database like:

- PostgreSQL with Prisma/TypeORM
- MongoDB with Mongoose
- SQLite with better-sqlite3
- Any other database of your choice

### Adding Authentication

To add authentication, you can extend the `Context` interface and add authentication middleware:

```typescript
interface Context {
  user?: User;
  token?: string;
}
```

### Error Handling

The API includes comprehensive error handling:
- Input validation
- Resource not found errors
- Proper error formatting for development/production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Next Steps

- Add database integration
- Implement user authentication
- Add subscriptions for real-time updates
- Add input validation with a schema validation library
- Add unit and integration tests
- Add Docker support
- Add rate limiting and security middleware 


```// Deferred spectrum data query on lab
query DevicesDataQuery(
  $operatorId: String!
  $networkEntity: String!
  $ids: [ID!]
  $deviceFilter: DeviceFilterInput
  $offset: Int = 0
  $count: Int = 20
  $spectrumInput: SpectrumDataInput
) {
  devicesData(
    operatorId: $operatorId
    networkEntity: $networkEntity
    ids: $ids
    deviceFilter: $deviceFilter
    offset: $offset
    count: $count
    spectrumInput: $spectrumInput
  ) {
    devicesData {
      offset
      totalCount
      data {
        id
        serialNumber
        type
        connected
        softwareVersion
        endpoints {
          http { ip port }
        }
      }
    }
    ... @defer {
      spectrumData
    }
  }
}


// variables

{
  "operatorId": "150554",
  "ids":[398489,402270],
  "networkEntity":"regions",
  "deviceFilter": {
    "type": "RN",
    "connected": true
  },
  "spectrumInput": {
    "deviceSerialNumbers": [],
    "eirpCarrier0": true
  },
  "offset": 0,
  "count": 5000
}```



```//Streamed all devices data 
query AllDevicesQuery(
  $operatorId: String!
  $networkEntity: String!
  $ids: [ID!]
  $deviceFilter: DeviceFilterInput
  $limit: Int = 2
) {
  allDevices(
    operatorId: $operatorId
    networkEntity: $networkEntity
    ids: $ids
    deviceFilter: $deviceFilter
    limit: $limit
  ) @stream(initialCount: $limit) {
    devicesData{
      data {
        serialNumber
      }
    }
  }
}

{
  "operatorId": "150554",
  "ids":[398489,402270],
  "networkEntity":"regions",
  "deviceFilter": {
    "type": "RN"
  },
  "limit": 2
}```