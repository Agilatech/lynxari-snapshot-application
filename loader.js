module.exports = function(server) {
  
  const config = require('./config');
  const snapshot = require('./snapshot');

  config.sources.forEach(function(source) {
  	new snapshot(server, source);    
  });
  
}
