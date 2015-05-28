var yelpKey = {
  consumer_key: process.env.KEY || require('./local_key').consumer_key,
  consumer_secret: process.env.CONSUMER_SECRET || require('./local_key').consumer_secret,
  token: process.env.TOKEN || require('./local_key').token,
  token_secret:  process.env.TOKEN_SECRET || require('./local_key').token_secret,
  ssl: true
};

module.exports = yelpKey;
