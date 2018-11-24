///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.writeMem = function (position, partition, opCode) {
            _Memory[partition][position] = opCode;
            TSOS.Control.updateMemory(position, partition);
        };
        MemoryAccessor.prototype.readMem = function (position, partition) {
            return _Memory[partition][position];
        };
        MemoryAccessor.prototype.clearMem = function () {
            _Memory.init();
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
