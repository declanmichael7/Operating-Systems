///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.writeMem = function (position, partition, opCode) {
            _Memory[position + (partition * 255)] = opCode;
            TSOS.Control.updateMemory(position, partition);
        };
        MemoryAccessor.prototype.readMem = function (position, partition) {
            return _Memory[position + (partition * 256)];
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
