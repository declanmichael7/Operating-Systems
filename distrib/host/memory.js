///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory(maxLength, lengthUsed) {
            if (maxLength === void 0) { maxLength = 255; }
            if (lengthUsed === void 0) { lengthUsed = 0; }
            this.maxLength = maxLength;
            this.lengthUsed = lengthUsed;
        }
        Memory.prototype.init = function () {
            i = 0;
            while (i < 256) {
                _Memory[i] = '00';
                i++;
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
