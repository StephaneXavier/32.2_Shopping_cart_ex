process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let item = {
    name: "corn",
    price: "131"
}

beforeEach(function () {
    items.push(item);
});

afterEach(function () {
    items.length = 0;
});

describe("GET /items", () => {
    test('get list of all items in fake db', async function () {
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([{
            name: "corn",
            price: "131"
        }])
    })
})

describe("POST /items", () => {
    test("post an item to our fake db", async function () {
        const resp = await request(app).post("/items").send({ name: "steak", price: "33" });

        expect(resp.body).toEqual({ "added": { "newItem": { "name": "steak", "price": "33" } } })

    })
})

describe("GET /items/:name", () => {
    test("retrieve item", async function () {
        const resp = await request(app).get(`/items/${item.name}`);

        expect(resp.body).toEqual(item);
    })
    test("throw error if item does not exist", async function () {
        const badresp = await request(app).get(`/items/badresp`);

        expect(badresp.statusCode).toBe(400);
    })
})

describe("PATCH /items/:name", () => {
    test("patch item", async function () {
        const resp = await request(app).patch(`/items/${item.name}`).send({ "name": "corndog", "price": "75" });

        expect(resp.body).toEqual({
            "updated": {
                "name": "corndog",
                "price": "75"
            }
        });
    })
    test("throw error if item does not exist", async function () {
        const badresp = await request(app).patch(`/items/badresp`);

        expect(badresp.statusCode).toBe(400);
    })
})

describe("DELETE /items/:name", () => {
    test("delete item", async function () {
        const resp = await request(app).delete(`/items/${item.name}`)

        expect(resp.body).toEqual({
            "message": "Deleted"
        })
    })
})