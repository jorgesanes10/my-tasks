const fastify = require("fastify")({ logger: true });
const fastifyMongo = require("@fastify/mongodb");
const fastifyJwt = require("@fastify/jwt");
const jwksClient = require("jwks-rsa");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

require("dotenv").config();

const mongodbUrl = process.env.MONGODB_URL!;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsCognitoURL = process.env.AWS_COGNITO_URL;
const awsCognitoClientId = process.env.AWS_COGNITO_CLIENT_ID;

AWS.config.update({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretAccessKey,
  region: "us-east-1",
});

const cognito = new AWS.CognitoIdentityServiceProvider();

fastify.register(require("@fastify/cors"), {
  origin: "*",
});

fastify.register(fastifyMongo, {
  url: mongodbUrl,
});

fastify.decorate("authenticate", async (request: any, reply: any) => {
  try {
    const token = request.headers.authorization.split("Bearer ")[1];
    const decodedToken = jwt.decode(token, { complete: true });

    const jwksUri = awsCognitoURL;
    const client = jwksClient({ jwksUri });
    const kid = decodedToken.header.kid;
    const key = await client.getSigningKey(kid);
    key.getPublicKey();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    reply.code(401).send({ error: "Unauthorized - Invalid token" });
  }
});

// Define routes

fastify.post("/login", async (request: any, reply: any) => {
  const { username, password } = JSON.parse(request.body);

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: awsCognitoClientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const response = await cognito.initiateAuth(params).promise();

    reply.send(response.AuthenticationResult);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
});

fastify.get(
  "/tasks",
  { preHandler: [fastify.authenticate] },
  async (request: any, reply: any) => {
    const collection = fastify.mongo.db.collection("my-tasks");

    const tasks = await collection.find({}).toArray();
    reply.send(tasks);
  }
);

fastify.get(
  "/tasks/:id",
  { preHandler: [fastify.authenticate] },
  async (request: any, reply: any) => {
    const collection = fastify.mongo.db.collection("my-tasks");
    const task = await collection.findOne({
      _id: new fastify.mongo.ObjectId(request.params.id),
    });
    reply.send(task);
  }
);

fastify.post(
  "/tasks",
  { preHandler: [fastify.authenticate] },
  async (request: any, reply: any) => {
    const collection = fastify.mongo.db.collection("my-tasks");
    const result = await collection.insertOne(JSON.parse(request.body));
    reply.send(result);
  }
);

fastify.put(
  "/tasks/:id",
  { preHandler: [fastify.authenticate] },
  async (request: any, reply: any) => {
    const collection = fastify.mongo.db.collection("my-tasks");

    const result = await collection.findOneAndUpdate(
      { _id: new fastify.mongo.ObjectId(request.params.id) },
      { $set: JSON.parse(request.body) },
      { returnDocument: "after" }
    );
    reply.send(result.value);
  }
);

fastify.delete(
  "/tasks/:id",
  { preHandler: [fastify.authenticate] },
  async (request: any, reply: any) => {
    const collection = fastify.mongo.db.collection("my-tasks");
    await collection.deleteOne({
      _id: new fastify.mongo.ObjectId(request.params.id),
    });
    reply.send({ message: "Task deleted" });
  }
);

// Run the server
const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
    });
    fastify.log.info(`Server is running at http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
