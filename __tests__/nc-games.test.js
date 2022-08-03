const request = require("supertest")
const app = require ("../app.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index")
const db = require("../db/connection")
require("jest-sorted")


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

describe("/api/reviews", () => {
    describe("GET", () => {
        test("Status 200: Returns an array of reviews objects", () => {
            return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({body}) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews).toHaveLength(13)
                reviews.forEach((review) => {
                    expect(review).toEqual(
                        expect.objectContaining({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: expect.any(String),
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            designer: expect.any(String),
                            comment_count: expect.any(String)
                        })
                    )
                })
            })
        })
        
        test("Status 200: Returns an array default sorted by date in descending order", () => {
            return request(app)
            .get("/api/reviews")
            .then(({body}) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy('created_at', { 
                    descending: true })
            })
        })
    })
})

describe("/api/reviews/:review_id", () => {

    describe("GET", () => {
        test("Status 200: When a valid correct review ID is searched, return that review", () => {

            return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({body}) => {
                const { review } = body;
                expect(review).toBeInstanceOf(Object)
                expect(review).toEqual(
                    expect.objectContaining({
                        review_id: 1,
                        title: 'Agricola',
                        designer: 'Uwe Rosenberg',
                        owner: 'mallionaire',
                        review_img_url:
                          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        review_body: 'Farmyard fun!',
                        category: 'euro game',
                        created_at: "2021-01-18T10:00:20.514Z",
                        votes: 1,
                    })
                );
            })
        })

        test("Status 200: When a valid review ID is returned, comment_count is a property.", () => {
            return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({body}) => {
                const { review } = body;
                expect(review.hasOwnProperty("comment_count")).toBe(true);
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
        test("Status 200: When a valid review_id is passed, if a positive number is passed, increment it by that much", () => {

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

        test("Status 200: When a valid review_id is passed, if a negative number is passed, decrement it by that much", () => {

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

describe("/api/reviews/:review_id/comments", () => {
    describe("GET", () => {
        test("Status 200: If review_id is valid and has comments, returns array of comments", () => {
            return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(({body}) => {
                const { comments } = body;
                expect(comments).toBeInstanceOf(Array)
                expect(comments).toHaveLength(3)
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            review_id: 2
                        })
                    )
                })
            })
        })

        test("Status 200: If review_id is valid but has no comments, returns 'No comments'.", () => {
            return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then(({body}) => {
                const { comments } = body;
                expect(comments).toBe('No Comments!')
            })
        })

        test("Status 400: When an incorrect data type is input, return status code 400 and 'Invalid review ID type", () => {
            return request(app)
            .get("/api/reviews/byMatt/comments")
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('Invalid review ID type!')
            })
        })

        test("Status 404: When a valid ID is searched but doesn't exist, return status code 404 and 'Review ID does not exist'", () => {
            return request(app)
            .get("/api/reviews/404/comments")
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('Review ID does not exist!')
            })
        })
    })

    describe("POST", () => {
        test("Status 201: When POST is used on the ./comments endpoint and passed an object with a username and body, returns the posted comment.", () => {
            return request(app)
            .post("/api/reviews/12/comments")
            .send({username: 'bainesface', body: 'Scythe is Lythe'})
            .expect(201)
            .then(({body}) => {
                const { comment } = body;
                expect(comment).toEqual({
                    comment_id: 7,
                    body: 'Scythe is Lythe',
                    review_id: 12,
                    author: 'bainesface',
                    votes: 0,
                    created_at: expect.any(String)
                })
            })
        })

        test("Status 400: When an incorrect data type is input, return status code 400 and 'Invalid review ID type'", () => {
            return request(app)
            .post("/api/reviews/twelve/comments")
            .expect(400)
            .send({username: 'bainesface', body: 'Scythe is Lythe'})
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('Invalid review ID type!')
            })
        })

        test("Status 400: If body is empty (no comment), return status code 400 and 'No comment supplied!'", () => {
            return request(app)
            .post("/api/reviews/7/comments")
            .expect(400)
            .send({username: 'bainesface'})
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('No comment supplied!')
            })
        })

        test("Status 400: If username is empty, return status code 400 and 'No username supplied'", () => {
            return request(app)
            .post("/api/reviews/7/comments")
            .expect(400)
            .send({body: "Really cool game, liked it a lot."})
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('No username supplied!')
            })
        })

        test("Status 404: When a username that doesn't exist, return status code 404 and 'Username doesn't exist'", () => {
            return request(app)
            .post("/api/reviews/10/comments")
            .send({username: 'LeeNC', body:"Didn't like this version, so I'm ditching it for a newer version."})
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Username doesn't exist");
            })
        })

        test("Status 404: When a valid ID is searched but doesn't exist, return status code 404 and 'Review ID does not exist'", () => {
            return request(app)
            .post("/api/reviews/99/comments")
            .expect(404)
            .send({username: 'bainesface', body: 'Red Balloons is the best horror game. IT rocks.'})
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe('Review ID does not exist!')
            })
        })
    })
})

describe("/api/users", () => {
    describe("GET", () => {
        test("Status 200: Returns an array of all users when the GET HTTP method is used on the users endpoint.", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({body}) => {
                const { users } = body;
                expect(users).toBeInstanceOf(Array);
                expect(users).toHaveLength(4);
                users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining ({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    )
                })
            })
        })
    })
})