import { v4 as uuidv4 } from 'uuid';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilters } from '../types';

class TodoStore {
  private todos: Map<string, Todo> = new Map();

  // Get all todos with optional filtering
  async getTodos(filters?: TodoFilters): Promise<Todo[]> {
    const todos = [
      { id: '1', title: 'Hello world', completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'GraphQL @defer demo', completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '3', title: 'Yoga is cool', completed: false, createdAt: new Date(), updatedAt: new Date() },
    ]

    // simulate streaming one item at a time
    for (const todo of todos) {
      console.log('Resolving todos:', todo.title)
      await new Promise((r) => setTimeout(r, 2000)) // 2s delay per item
    }
    return todos
  }

  // Get a todo by ID
  getTodo(id: string): Todo | null {
    return this.todos.get(id) || null;
  }

  // Create a new todo
  createTodo(input: CreateTodoInput): Todo {
    const now = new Date();
    const todo: Todo = {
      id: uuidv4(),
      title: input.title,
      ...(input.description !== undefined && { description: input.description }),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.set(todo.id, todo);
    return todo;
  }

  // Update an existing todo
  updateTodo(input: UpdateTodoInput): Todo | null {
    const existingTodo = this.todos.get(input.id);
    if (!existingTodo) {
      return null;
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      ...input,
      id: existingTodo.id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    this.todos.set(input.id, updatedTodo);
    return updatedTodo;
  }

  // Delete a todo
  deleteTodo(id: string): boolean {
    return this.todos.delete(id);
  }

  // Toggle todo completion status
  toggleTodo(id: string): Todo | null {
    const todo = this.todos.get(id);
    if (!todo) {
      return null;
    }

    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date(),
    };

    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  // Clear all completed todos
  clearCompleted(): number {
    const completedTodos = Array.from(this.todos.values()).filter(todo => todo.completed);
    completedTodos.forEach(todo => this.todos.delete(todo.id));
    return completedTodos.length;
  }

  // Get todo statistics
  getStats() {
    const todos = Array.from(this.todos.values());
    const completed = todos.filter(todo => todo.completed).length;
    return {
      total: todos.length,
      completed,
      pending: todos.length - completed,
    };
  }

  // Seed with some sample data
  seedData(): void {
    const sampleTodos: CreateTodoInput[] = [
      { title: 'Learn GraphQL', description: 'Complete the GraphQL tutorial' },
      { title: 'Build a todo app', description: 'Create a full-stack todo application' },
      { title: 'Write documentation', description: 'Document the API endpoints' },
    ];

    sampleTodos.forEach(input => {
      const todo = this.createTodo(input);
      if (input.title === 'Learn GraphQL') {
        // Mark the first one as completed
        this.toggleTodo(todo.id);
      }
    });
  }
}

// Create and export a singleton instance
export const todoStore = new TodoStore(); 