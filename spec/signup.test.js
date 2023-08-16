const supertest = require("supertest")
const app = require("../app")

test("GET /sign-up", async () => {
	const response = await supertest(app)
		.get("/sign-up")
		.expect(200);
});