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

        test("Status 200: Returns all categories when the GET HTTP method is used on the categories endpoint", () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({body}) => {
                const { categories } = body;
                expect(categories).toBeInstanceOf(Array);
                expect(categories).toHaveLength(4);
                categories.forEach((category) => {
                    expect(category).toEqual(
                        expect.objectContaining ({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    )

                })
            })
        })
    })
})

describe("/api/reviews/:review_id", () => {

    describe("GET", () => {
        test("Status 200: When a valid correct review ID is searched, return that review", () => {

            const expectedReview = {
                review_id: 1,
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: "2021-01-18T10:00:20.514Z",
                votes: 1
            }

            return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({body}) => {
                const { review } = body;
                expect(review).toBeInstanceOf(Object)
                expect(review).toEqual((expectedReview));
            })
        })

        test("Status 400: When an incorrect data type is input, return status code 400 and 'Invalid review ID type'", () => {
            return request(app)
            .get("/api/reviews/myReview")
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('Invalid review ID type!')
            })
        })

        test("Status 404: When a valid ID is searched but doesn't exist, return status code 404 and 'Review ID does not exist'", () => {
            return request(app)
            .get("/api/reviews/9999")
            .expect(404)
            .then(({body}) => {
                const { msg } = body;
                expect(msg).toBe('Review ID does not exist!')
            }) 
        })
    })
})