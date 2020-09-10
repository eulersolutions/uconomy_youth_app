import moment from 'moment';

/**
 * This exists because I don't understand
 * hooks at all and this is a simple solution
 * getKey() returns a simple key for listItems
 */ 
module.exports = {
    token: null,
    getKey: () => {
        return new Date().getTime().toString() + (Math.floor(Math.random() * Math.floor(new Date().getTime()))).toString();
    }
 };