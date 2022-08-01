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

    describe("PATCH", () => {
        test("Status 201: When a valid review_id is passed, if a positive number is passed, increment it by that much", () => {

            return request(app)
            .patch("/api/reviews/2")
            .send({inc_votes: 20})
            .expect(201)
            .then(({ body }) => {
                const { review } = body; 
                expect(review).toEqual(
                    expect.objectContaining({
                        votes: 25
                    }))
            })
        })

        test("Status 201: When a valid review_id is passed, if a negative number is passed, decrement it by that much", () => {

            return request(app)
            .patch("/api/reviews/4")
            .send({inc_votes: -3})
            .expect(201)
            .then(({ body }) => {
                const { review } = body; 
                expect(review).toEqual(
                    expect.objectContaining({
                        votes: 4
                    }))
            })
        })

        test("Status 400: When an incorrect data type is input, return status code 400 and 'Invalid review ID type'", () => {
            return request(app)
            .patch("/api/reviews/thirteen")
            .expect(400)
            .send({inc_votes: 13})
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('Invalid review ID type!')
            })
        })

        test("Status 400: When inc_votes is left out/changed, return a status 400 with 'Invalid property'", () => {
            return request(app)
            .patch("/api/reviews/2")
            .expect(400)
            .send({change_votes: 100})
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('Invalid property!')
            })
        })

        test("Status 400: When an non-number data type is patched to inc_votes, return a status 400 with 'Invalid value'", () => {
            return request(app)
            .patch("/api/reviews/2")
            .expect(400)
            .send({inc_votes: "one hundred million"})
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('Invalid value!')
            })
        })

        test("Status 404: When a valid ID is searched but doesn't exist, return status code 404 and 'Review ID does not exist'", () => {
            return request(app)
            .patch("/api/reviews/40")
            .expect(404)
            .send({inc_votes: -100})
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('Review ID does not exist!')
            })
        })
    })


    

})