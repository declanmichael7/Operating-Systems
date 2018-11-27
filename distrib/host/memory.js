///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory() {
        }
        Memory.prototype.init = function () {
            var j = 0;
            i = 0;
            while (j < 3) {
                _Memory[j] = [];
                while (i < 256) {
                    _MemoryAccessor.writeMem(i, j, '00');
                    i++;
                }
                j++;
                i = 0;
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
