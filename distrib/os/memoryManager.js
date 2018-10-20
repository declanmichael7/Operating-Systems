///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager(partition0) {
            if (partition0 === void 0) { partition0 = true; }
            this.partition0 = partition0;
        }
        MemoryManager.prototype.allocate = function (process) {
            if (this.partition0) {
                this.partition0 = false;
                process.memLocation = 0;
            }
        };
        MemoryManager.prototype.deallocate = function (partition) {
            if (partition = 0) {
                this.partition0 = true;
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
