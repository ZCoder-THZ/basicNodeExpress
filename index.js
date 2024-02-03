const express = require('express')

const { PrismaClient } = require("@prisma/client");

const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const PORT = 4000;
const prisma = new PrismaClient();

const data = [
    { id: 1, name: 'user1' },
    { id: 2, name: 'user2' },
    { id: 3, name: 'user3' },
    { id: 4, name: 'user4' },
]

const cars = [
    { id: 1, name: 'bmw' },
    { id: 2, name: 'audi' },
    { id: 3, name: 'mercedes' },
    { id: 4, name: 'toyota' },
]


app.use(cors());

app.use(bodyParser.json());
app.get('/', (req, res) => {

    return res.json({ data });
})
app.get('/cars', async (req, res) => {

    const cars = await prisma.cars.findMany();

    return res.json({ cars });
})

app.get('/cars/:id', async (req, res) => {
    const carId = req.params.id * 1

    const cars = await prisma.cars.findUnique({
        where: {
            id: carId
        }
    });

    return res.json({ cars });
})


app.post('/cars', async (req, res) => {

    const carName = req.body.name

    const cars = await prisma.cars.create({
        data: {
            name: carName
        }
    });

    const updatedCars = await prisma.cars.findMany()

    return res.json({ updatedCars });
})

app.delete('/cars/:id', async (req, res) => {
    const carId = req.params.id * 1

    // return res.json(carId)
    const deleteCar = await prisma.cars.delete({
        where: {
            id: carId
        }
    })

    const updatedCars = await prisma.cars.findMany()

    return res.json({ deleteCar });

})

app.put('/cars/:id', async (req, res) => {
    const carId = req.params.id * 1

    const findCar = await prisma.cars.findUnique({
        where: {
            id: carId
        }
    })

    if (!findCar) {
        return res.json({ message: 'error' })
    }

    const updateName = req.body.name
    // return res.json(carId)
    const updateCar = await prisma.cars.update({
        where: {
            id: carId
        },
        data: {
            name: updateName
        }
    })

    const updatedCars = await prisma.cars.findMany()

    return res.json({ updateCar, updatedCars });

})


app.get('/cars/:carId', async (req, res) => {


    const id = req.params.carId;
    const resCar = await cars.filter(car => car.id == id)

    return res.json({ resCar });
})

app.put('/cars/:carId', (req, res) => {
    const id = req.params.carId * 1;
    const name = req.body.name;
    const updateId = req.body.updateId;

    const udpatedCars = cars.map((car) => {
        if (car.id === id) {
            return { ...car, name, id: updateId };
        } else {
            return car;
        }
    });

    return res.json({ udpatedCars })

})




app.post('/post', async (req, res) => {


    if (!req.body.name) {
        const returnData = await [...data, { expense: req.body.expense, description: req.body.description }];

        return res.json(returnData)
    }
})

app.delete('/delete/:name', async (req, res) => {
    const name = req.params.name;

    const deletedData = await data.filter(data => data.name == name);

    return res.json({ deletedData });

})



app.listen(PORT, () => console.log(`app running on ${PORT}`))