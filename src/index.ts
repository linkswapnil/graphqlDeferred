import { createYoga, createSchema } from 'graphql-yoga';
import { useDeferStream } from '@graphql-yoga/plugin-defer-stream';
import { createServer } from 'node:http';
import { typeDefs } from './schema/typeDefs';
import { deviceTypeDefs } from './schema/deviceTypeDefs';
import { resolvers } from './resolvers';
import { todoStore } from './data/todoStore';

async function startServer() {
  // Create schema - Yoga handles defer/stream directives automatically
  const schema = createSchema({
    typeDefs: [deviceTypeDefs, typeDefs],
    resolvers,
  });

  // Create Yoga server with defer/stream plugin
  const yoga = createYoga({
    schema,
    plugins: [useDeferStream()],
    // Customize GraphiQL
    graphiql: {
      title: 'Todo GraphQL API with @defer',
      defaultQuery: `# Try these @defer examples:

# 1. Todo with deferred analytics
query TodoWithDeferredAnalytics {
  todos {
    id
    title
    completed
    ... @defer {
      analytics {
        timeSpentEstimate
        complexityScore
        completionPrediction
      }
    }
  }
}

# 2. Expensive report with deferred analysis
query ExpensiveReportWithDefer {
  expensiveReport {
    summary
    ... @defer { recommendations }
    ... @defer {
      detailedAnalysis {
        dataProcessingTime
        insights
        predictions
      }
    }
  }
}`,
    },
    // Handle CORS
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  // Create HTTP server
  const server = createServer(yoga);

  // Seed the data store with sample todos
  todoStore.seedData();

  // Start the server
  const port = Number(process.env.PORT) || 4000;
  server.listen(port, () => {
    console.log(`🚀 Server ready at: http://localhost:${port}/graphql`);
    console.log(`📊 GraphiQL available at: http://localhost:${port}/graphql`);
    console.log('');
    console.log('🎯 Sample @defer queries you can try:');
    console.log('');
    console.log('1. Todo with deferred analytics:');
    console.log(`query TodoWithDeferredAnalytics {
  todos {
    id
    title
    completed
    ... @defer {
      analytics {
        timeSpentEstimate
        complexityScore
        completionPrediction
      }
    }
  }
}`);
    console.log('');
    console.log('2. Todo stats with deferred expensive fields:');
    console.log(`query StatsWithDeferredData {
  todoStats {
    total
    completed
    pending
    ... @defer {
      productivity {
        averageCompletionTime
        completionRate
        streakCount
      }
    }
    ... @defer {
      trends {
        weeklyProgress
        timePatterns
      }
    }
  }
}`);
    console.log('');
    console.log('3. Expensive report with deferred analysis:');
    console.log(`query ExpensiveReportWithDefer {
  expensiveReport {
    summary
    ... @defer { recommendations }
    ... @defer {
      detailedAnalysis {
        dataProcessingTime
        insights
        predictions
      }
    }
  }
}`);
    console.log('');
    console.log('💡 Notice how fast responses come back, then watch deferred fields arrive!');
    console.log('🔥 @defer directive is now properly executed with streaming!');
    console.log('');
    console.log('📡 To test with curl (includes proper headers):');
    console.log(`curl -X POST \
  -H "Accept: multipart/mixed" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { expensiveReport { summary ... @defer { detailedAnalysis { insights } } } }"}' \
  http://localhost:${port}/graphql`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
}); 