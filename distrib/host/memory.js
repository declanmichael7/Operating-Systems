///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory(maxLength) {
            if (maxLength === void 0) { maxLength = 255; }
            this.maxLength = maxLength;
        }
        Memory.prototype.init = function () {
            i = 0;
            while (i < 256) {
                _Memory[i] = '00';
                i++;
            }
            document.getElementById("taProgramInput").innerHTML = _Memory[255];
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
