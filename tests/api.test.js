import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

// We test the exported models and auth middleware directly
// Full integration tests would require a running MongoDB instance

describe("Task API", () => {
  describe("Module exports", () => {
    it("should export app, User, Task, and auth", async () => {
      const mod = await import("../src/index.js");
      assert.ok(mod.default, "app should be exported as default");
      assert.ok(mod.User, "User model should be exported");
      assert.ok(mod.Task, "Task model should be exported");
      assert.ok(mod.auth, "auth middleware should be exported");
    });

    it("app should be an express app with expected methods", async () => {
      const mod = await import("../src/index.js");
      const app = mod.default;
      assert.equal(typeof app.listen, "function");
      assert.equal(typeof app.use, "function");
    });
  });

  describe("User model", () => {
    it("should have required fields", async () => {
      const { User } = await import("../src/index.js");
      const schema = User.schema;
      assert.ok(schema.path("username").isRequired);
      assert.ok(schema.path("email").isRequired);
      assert.ok(schema.path("password").isRequired);
    });

    it("should enforce unique username and email", async () => {
      const { User } = await import("../src/index.js");
      const usernameOpts = User.schema.path("username").options;
      const emailOpts = User.schema.path("email").options;
      assert.equal(usernameOpts.unique, true);
      assert.equal(emailOpts.unique, true);
    });
  });

  describe("Task model", () => {
    it("should have required title field", async () => {
      const { Task } = await import("../src/index.js");
      assert.ok(Task.schema.path("title").isRequired);
    });

    it("should default status to todo", async () => {
      const { Task } = await import("../src/index.js");
      assert.equal(Task.schema.path("status").defaultValue, "todo");
    });

    it("should default priority to medium", async () => {
      const { Task } = await import("../src/index.js");
      assert.equal(Task.schema.path("priority").defaultValue, "medium");
    });

    it("should validate status enum", async () => {
      const { Task } = await import("../src/index.js");
      const enumValues = Task.schema.path("status").enumValues;
      assert.deepEqual(enumValues.sort(), ["done", "in-progress", "todo"]);
    });

    it("should validate priority enum", async () => {
      const { Task } = await import("../src/index.js");
      const enumValues = Task.schema.path("priority").enumValues;
      assert.deepEqual(enumValues.sort(), ["high", "low", "medium"]);
    });

    it("should require owner reference", async () => {
      const { Task } = await import("../src/index.js");
      assert.ok(Task.schema.path("owner").isRequired);
    });
  });

  describe("Auth middleware", () => {
    it("should reject requests without authorization header", async () => {
      const { auth } = await import("../src/index.js");
      const req = { headers: {} };
      let statusCode;
      let body;
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) { body = data; },
      };
      auth(req, res, () => {});
      assert.equal(statusCode, 401);
      assert.equal(body.error, "No token provided");
    });

    it("should reject requests with invalid token", async () => {
      const { auth } = await import("../src/index.js");
      const req = { headers: { authorization: "Bearer invalid-token" } };
      let statusCode;
      let body;
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) { body = data; },
      };
      auth(req, res, () => {});
      assert.equal(statusCode, 401);
      assert.equal(body.error, "Invalid token");
    });
  });
});
