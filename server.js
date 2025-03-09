const { Queue } = require('bullmq');
const express = require('express');
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 3000;

const redisConnection = new Redis();
const queue = new Queue('taskQueue', { connection: redisConnection });

app.use(express.json());

async function getLeastLoadedWorker() {
    const workerLoad = await redisConnection.hgetall('worker_load');

    if (!workerLoad || Object.keys(workerLoad).length === 0) {
        console.log("No available workers found in Redis.");
        return null;
    }

    return Object.keys(workerLoad).reduce((a, b) =>
        parseInt(workerLoad[a] || 0) < parseInt(workerLoad[b] || 0) ? a : b
    );
}

app.post('/enqueue-task', async (req, res) => {
    try {
        const { jobName, data } = req.body;

        if (!jobName || !data) {
            return res.status(400).json({ error: 'jobName and data are required' });
        }

        const leastLoadedWorker = await getLeastLoadedWorker();

        if (!leastLoadedWorker) {
            return res.status(500).json({ error: 'No available workers' });
        }

        const job = await queue.add(jobName, data, {
            removeOnComplete: true,
            removeOnFail: false,
            priority: -parseInt(await redisConnection.hget('worker_load', leastLoadedWorker) || 0)
        });

        console.log(`Assigned Job ${job.id} to Worker ${leastLoadedWorker}`);

        res.json({
            message: 'Task enqueued successfully',
            jobId: job.id,
            jobName: jobName,
            jobData: data,
            assignedWorker: leastLoadedWorker
        });

    } catch (error) {
        console.error('Error enqueuing task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
