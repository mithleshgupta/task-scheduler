const { Worker } = require('bullmq');
const Redis = require('ioredis');

const redisConnection = new Redis({ maxRetriesPerRequest: null });
const workerId = process.pid;

async function registerWorker() {
    console.log(`Worker ${workerId} registering in Redis`);
    await redisConnection.hset('worker_load', workerId, 0);
}

async function incrementActiveJobs() {
    await redisConnection.hincrby('worker_load', workerId, 1);
}

async function decrementActiveJobs() {
    await redisConnection.hincrby('worker_load', workerId, -1);
}

registerWorker();

const worker = new Worker(
    'taskQueue',
    async (job) => {
        await incrementActiveJobs();

        console.log(`Worker ${workerId} processing job ${job.id}: ${job.name}`);
        console.log(`Job Data:`, job.data);

        await new Promise(resolve => setTimeout(resolve, 12000));

        console.log(`Worker ${workerId} completed job ${job.id}: ${job.name}`);
        await decrementActiveJobs();
    },
    {
        connection: redisConnection,
        concurrency: 8
    }
);

worker.on('completed', async (job) => {
    console.log(`Worker ${workerId} completed job ${job.id}`);
    console.log(`Updated Load:`, await redisConnection.hgetall('worker_load'));
});

worker.on('failed', async (job, err) => {
    console.log(`Worker ${workerId} failed with error ${err.message}`);
    await decrementActiveJobs();
});
