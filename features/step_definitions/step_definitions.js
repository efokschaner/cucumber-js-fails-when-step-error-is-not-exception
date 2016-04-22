var Promise = require('bluebird');

var unusualErrorObject = {};
unusualErrorObject.member = unusualErrorObject;

module.exports = function () {
  this.Given('I reject a promise', function () {
    return Promise.reject(unusualErrorObject);
  });
  
  this.Given('I pass an error to the callback', function (cb) {
    cb(unusualErrorObject);
  });
  
  this.Given('I raise an exception', function () {
    throw unusualErrorObject;
  });
};