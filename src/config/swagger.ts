const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Library Management API",
    version: "1.0.0",
    description: "Swagger documentation for the authentication, profile, and book management APIs.",
  },
  servers: [
  {
    url: "http://localhost:4000",
    description: "Local server"
  },
  {
    url: "https://user-auth-api-black.vercel.app",
    description: "Production server"
  }
],
  tags: [
    { name: "Health", description: "Health and status endpoints" },
    { name: "Auth", description: "Authentication and user management" },
    { name: "Profile", description: "User profile management" },
    { name: "Books", description: "Book inventory and assignment management" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          statusCode: { type: "integer", example: 200 },
          message: { type: "string", example: "Request completed successfully" },
          data: { nullable: true },
          success: { type: "boolean", example: true },
        },
      },
      SignInRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@example.com" },
          password: { type: "string", example: "Admin123" },
        },
      },
      SignUpRequest: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          profileImage: {
            type: "string",
            format: "binary",
            description: "Optional profile image upload",
          },
          name: { type: "string", example: "Aman Kumar" },
          email: { type: "string", format: "email", example: "aman@example.com" },
          password: { type: "string", example: "Admin123" },
          role: {
            type: "string",
            enum: ["admin", "manager", "user"],
            example: "user",
          },
        },
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          profileImage: { type: "string", format: "uri", example: "https://example.com/avatar.jpg" },
          name: { type: "string", example: "Updated User" },
          email: { type: "string", format: "email", example: "updated@example.com" },
          password: { type: "string", example: "Updated123" },
          role: {
            type: "string",
            enum: ["admin", "manager", "user"],
            example: "manager",
          },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["email", "newpassword"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          newpassword: { type: "string", example: "NewPass123" },
        },
      },
      AssignManagerRequest: {
        type: "object",
        required: ["managerId"],
        properties: {
          managerId: { type: "string", example: "67f13fd47049a0c5551ed321" },
        },
      },
      CreateProfileRequest: {
        type: "object",
        required: ["bio", "phoneNumber", "address", "dateOfBirth"],
        properties: {
          bio: { type: "string", example: "Backend developer and book enthusiast." },
          phoneNumber: { type: "string", example: "9876543210" },
          address: { type: "string", example: "Bhubaneswar, Odisha" },
          avatar: { type: "string", example: "https://example.com/avatar.jpg" },
          dateOfBirth: { type: "string", format: "date", example: "2000-01-15" },
        },
      },
      UpdateProfileRequest: {
        allOf: [{ $ref: "#/components/schemas/CreateProfileRequest" }],
      },
      CreateBookRequest: {
        type: "object",
        required: ["title", "author", "description", "isbn", "price", "quantity", "category", "pdf"],
        properties: {
          title: { type: "string", example: "Atomic Habits" },
          author: { type: "string", example: "James Clear" },
          description: { type: "string", example: "A book about building better habits." },
          isbn: { type: "string", example: "9780735211292" },
          price: { type: "number", example: 399 },
          quantity: { type: "integer", example: 12 },
          category: { type: "string", example: "Self-help" },
          publishedYear: { type: "integer", example: 2018 },
          pdf: {
            type: "string",
            format: "binary",
            description: "Book PDF file",
          },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["Health"],
        summary: "Check server status",
        responses: {
          "200": {
            description: "Server is running",
          },
        },
      },
    },
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Create a new user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/SignUpRequest" },
            },
          },
        },
        responses: {
          "201": { description: "User created successfully" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/auth/signin": {
      post: {
        tags: ["Auth"],
        summary: "Sign in a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignInRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "400": { description: "Invalid credentials or validation error" },
        },
      },
    },
    "/api/auth/users": {
      get: {
        tags: ["Auth"],
        summary: "Get all users",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer" }, required: false },
          { in: "query", name: "limit", schema: { type: "integer" }, required: false },
          { in: "query", name: "name", schema: { type: "string" }, required: false },
        ],
        responses: {
          "200": { description: "Users fetched successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/auth/update/{email}": {
      patch: {
        tags: ["Auth"],
        summary: "Update a user by email",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "email",
            required: true,
            schema: { type: "string", format: "email" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRequest" },
            },
          },
        },
        responses: {
          "200": { description: "User updated successfully" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/auth/delete/{email}": {
      delete: {
        tags: ["Auth"],
        summary: "Delete a user by email",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "email",
            required: true,
            schema: { type: "string", format: "email" },
          },
        ],
        responses: {
          "200": { description: "User deleted successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/auth/reset-password": {
      patch: {
        tags: ["Auth"],
        summary: "Reset a user's password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResetPasswordRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Password reset successfully" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/auth/assign-user/{userId}": {
      patch: {
        tags: ["Auth"],
        summary: "Assign a user to a manager",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssignManagerRequest" },
            },
          },
        },
        responses: {
          "200": { description: "User assigned successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/profile/create": {
      post: {
        tags: ["Profile"],
        summary: "Create a profile for the authenticated user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProfileRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Profile created successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/profile/find/{userId}": {
      get: {
        tags: ["Profile"],
        summary: "Get a profile by user ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Profile fetched successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/profile/users": {
      get: {
        tags: ["Profile"],
        summary: "Get all user profiles",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Profiles fetched successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/profile/update": {
      patch: {
        tags: ["Profile"],
        summary: "Update the authenticated user's profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Profile updated successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/profile/delete/{userId}": {
      delete: {
        tags: ["Profile"],
        summary: "Delete a profile by user ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Profile deleted successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/books": {
      post: {
        tags: ["Books"],
        summary: "Create a new book",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CreateBookRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Book created successfully" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
      get: {
        tags: ["Books"],
        summary: "Get all books",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Books fetched successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/books/{bookId}/assign/{userId}": {
      post: {
        tags: ["Books"],
        summary: "Assign a book to a user",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "bookId", required: true, schema: { type: "string" } },
          { in: "path", name: "userId", required: true, schema: { type: "string" } },
        ],
        responses: {
          "201": { description: "Book assigned successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/books/{bookId}/revoke/{userId}": {
      post: {
        tags: ["Books"],
        summary: "Revoke a book from a user",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "bookId", required: true, schema: { type: "string" } },
          { in: "path", name: "userId", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Book revoked successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/books/assign/{id}": {
      get: {
        tags: ["Books"],
        summary: "Get assigned books by entity ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Assigned books fetched successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/book/assign/{id}": {
      get: {
        tags: ["Books"],
        summary: "Get a specific book assignment by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Book assignment fetched successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
  },
} as const;

export default swaggerDocument;
