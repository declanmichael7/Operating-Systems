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
        MemoryAccessor.prototype.clearMem = function (partition) {
            if (partition == 0 || partition == 1 || partition == 2) {
                i = 0;
                while (i < 256) {
                    this.writeMem(i, partition, '00');
                    i++;
                }
            }
            else if (partition == 'all') {
                i = 0;
                var j = 0;
                while (j < 3) {
                    _Memory[j] = [];
                    while (i < 256) {
                        _MemoryAccessor.writeMem(i, j, '00');
                        i++;
                    }
                    j++;
                    i = 0;
                }
            }
            _MemoryManager.freeMem(partition);
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
