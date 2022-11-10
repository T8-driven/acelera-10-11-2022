import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

const app = express();
dotenv.config();
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

// Top-Level Await para esperar o mongoClient se conectar ao servidor do Mongo!
// Tratar possíveis erros de conexão com await através do try/catch
try {
  await mongoClient.connect();
  console.log("MongoDB Conectado!");
} catch (err) {
  console.log(err);
}

const db = mongoClient.db("marvel"); // Se o banco existir ele ENTRA, se não, cria e entra
const collectionHerois = db.collection("herois"); // Const global para criar e/ou entrar em uma coleção

// ROTAS
app.post("/herois", async (req, res) => {
  const { nome, idade } = req.body;
  if (!nome || !idade) {
    res.sendStatus(400);
    return;
  }

  try {
    await collectionHerois.insertOne({ nome, idade });
    res.sendStatus(201);
    /* 
    Quero receber a resposta estranha no insertOne:
        const response = await collectionHerois.insertOne({nome, idade})
        console.log(response)
    */
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});



app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
