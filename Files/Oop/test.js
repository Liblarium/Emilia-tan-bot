 function _Testing (option) {
    this.option = option;
    if (option == undefined) return console.log(`Краш`);
    console.log(option.Проверка);
    if (option == `Нет`) return console.log(`Нет, так нет`)
 }
 function Test (a) {
    this.a = a;
    _Testing.call(this, a);
    return this;
 }
 Test.prototype = Object.create(_Testing.prototype);
 exports.Test = Test;