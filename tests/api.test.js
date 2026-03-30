import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

// Test that the app module loads and exports correctly
describe("Task API", () => {
  let app;

  before(async () => {
    process.env.NODE_ENV = "test";
    process.env.MONGODB_URI = "mongodb://localhost:27017/task-api-test";
    const mod = await import("../src/index.js");
    app = mod.default;
  });

  describe("Module exports", () => {
    it("should export an Express app", () => {
      assert.ok(app, "app should exist");
      assert.equal(typeof app, "function", "app should be a function (Express app)");
    });

    it("should export User model", async () => {
      const { User } = await import("../src/index.js");
      assert.ok(User, "User model should exist");
      assert.equal(typeof User, "function");
    });

    it("should export Task model", async () => {
      const { Task } = await import("../src/index.js");
      assert.ok(Task, "Task model should exist");
      assert.equal(typeof Task, "function");
    });
  });

  describe("Routes exist", () => {
    it("should have auth register route", () => {
      const routes = app._router.stack
        .filter((r) => r.route)
        .map((r) => `${Object.keys(r.route.methods).join(",")} ${r.route.path}`);
      const hasRegister = routes.some((r) => r.includes("/api/auth/register"));
      assert.ok(hasRegister, "Should have POST /api/auth/register");
    });

    it("should have auth login route", () => {
      const routes = app._router.stack
        .filter((r) => r.route)
        .map((r) => `${Object.keys(r.route.methods).join(",")} ${r.route.path}`);
      const hasLogin = routes.some((r) => r.includes("/api/auth/login"));
      assert.ok(hasLogin, "Should have POST /api/auth/login");
    });

    it("should have health endpoint", () => {
      const routes = app._router.stack
        .filter((r) => r.route)
        .map((r) => `${Object.keys(r.route.methods).join(",")} ${r.route.path}`);
      const hasHealth = routes.some((r) => r.includes("/health"));
      assert.ok(hasHealth, "Should have GET /health");
    });

    it("should have task CRUD routes", () => {
      const routes = app._router.stack
        .filter((r) => r.route)
        .map((r) => `${Object.keys(r.route.methods).join(",")} ${r.route.path}`);
      const hasTasks = routes.some((r) => r.includes("/api/tasks"));
      assert.ok(hasTasks, "Should have /api/tasks routes");
    });
  });
});
