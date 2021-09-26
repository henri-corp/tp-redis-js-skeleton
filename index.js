const { exit } = require('process');
const redis = require('redis');
const colors = require('colors');
require('dotenv').config();

(async () => {
    const client = redis.createClient({url: process.env.REDIS_URL});
  
    client.on('error', (err) => console.log('Redis Client Error'.white.bgRed.bold, err));
    await client.connect();
    console.log('📞 Redis Client Connected'.green);

    await client.SELECT(process.env.REDIS_DB);
    console.log(`🦘 Redis Database ${process.env.REDIS_DB} Selected`.green);

    const cmd = process.argv.slice(2)[0];
    let exercice=null;
    try{
        exercice = require(`./exercices/${cmd}.js`);
        console.log(`🦊 Exercice ${cmd} found`.green);

    }catch(error){
        console.error(`😭 Cannot find ${cmd}.js in exercices or ${cmd} contains errors`.white.bgRed.bold);
        console.debug(error);
        exit(100)    
    }
    console.log(`🍣 Starting ${cmd}`.green);
    try{
        await exercice(client);
    }catch(error){
        console.log(`😱 An error occured`.red.bold);
        console.log(error);
    }
    console.log(`👋 Closing redis`.gray);
    client.quit();
    exit(0);
})();
