const request = require("supertest");
const app = require ("../app.js");
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index")
const db = require("../db/connection")

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    db.end();
})

describe("/api/categories", () => {
    describe("/GET", () => {

        test("Status 200 returned when the GET HTTP method is used on endpoint", () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
        })

        test("Status 200: Returns all categories when the GET HTTP method is used on the categories endpoint", () => {
            return request(app)
            .get("/api/categories")
            .then(({body}) => {
                const { categories } = body;
                expect(categories).toBeInstanceOf(Array);
                expect(categories).toHaveLength(4);
                categories.forEach(() => {
                    expect.objectContaining ({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
        })
    })
})