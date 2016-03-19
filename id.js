/**
*
*A unique and incremental id generator.
*/
var bitChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('')
var length = 8;
var completed = false;

function genId(len,ch){
    var rt = '';
    for(var i= 0;i < len ;i++){
        rt += ch;
    }
    return rt;
}

function Id(init){
    this.bits = 2;
    this.value = '';
    for(var i= 0; i < length; i++){
        this.value += bitChars[0];
    }
}

Id.prototype.getId = function(){

    if (completed) {
        throw new Error("Id out of bounds.");        
    }
    var returnVal = this.value;
    var chars = this.value.split("");
    var lowest = this.bits - 1;

    while(lowest >= 0){
        //The lowest char in bit chars array's index.
        var index  = bitChars.indexOf(chars[lowest]);
        
        var step = false;
        //Increase one.
        var next = index + 1;
        //If it's overflow,we must increase the higher bit.
        if(next >= bitChars.length){
            next = 0;
            step =true;
        }
        chars[lowest] = bitChars[next];

        if(step){
            lowest--;
        }else{
            break;
        }
    }

    if (lowest < 0) {
       completed = true; 
    }

    var newValue = chars.join('');
    this.value = newValue;
    return returnVal;
}

exports.createId = function(init){
    return new Id(init);
}