const EventEmitter = require('events');

var url = 'http://mylogger.io/log';
class Logger {
    log(message) {
        console.log(message);
        this.emit('messageLogged', { id: 1, url: 'http://' })
    }
}
module.exports = log;