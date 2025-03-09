const cluster = require('cluster');
const os = require('os');
const Redis = require('ioredis');

if (cluster.isMaster) {
    const redisConnection = new Redis();

    console.log(`Master ${process.pid} is running`);

    redisConnection.exists('worker_load').then(async (exists) => {
        if (!exists) {
            await redisConnection.del('worker_load');
        }
    });

    const numWorkers = os.cpus().length;
    console.log(`Forking ${numWorkers} workers`);
    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    require('./worker'); 
}
