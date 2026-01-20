import { z } from 'zod';
import { 
  insertUserSchema, 
  insertPlantSchema, 
  insertTaskSchema, 
  insertMessageSchema,
  users,
  plants,
  trends,
  tasks,
  messages
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/user/:id',
      input: insertUserSchema.partial(),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getUser: {
      method: 'GET' as const,
      path: '/api/user/:id',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  plants: {
    list: {
      method: 'GET' as const,
      path: '/api/plants',
      responses: {
        200: z.array(z.custom<typeof plants.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/plants/:id',
      responses: {
        200: z.custom<typeof plants.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  trends: {
    list: {
      method: 'GET' as const,
      path: '/api/trends',
      input: z.object({ search: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof trends.$inferSelect>()),
      },
    }
  },
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks',
      responses: {
        200: z.array(z.custom<typeof tasks.$inferSelect>()),
      },
    },
    toggle: {
      method: 'PATCH' as const,
      path: '/api/tasks/:id/toggle',
      input: z.object({ isCompleted: z.boolean() }),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  chat: {
    send: {
      method: 'POST' as const,
      path: '/api/chat',
      input: z.object({ content: z.string() }),
      responses: {
        200: z.custom<typeof messages.$inferSelect>(), // Returns the assistant's reply
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/chat/history',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
