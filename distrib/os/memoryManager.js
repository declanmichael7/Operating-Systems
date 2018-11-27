///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager(partition0, partition1, partition2, memLoaded) {
            if (partition0 === void 0) { partition0 = true; }
            if (partition1 === void 0) { partition1 = true; }
            if (partition2 === void 0) { partition2 = true; }
            if (memLoaded === void 0) { memLoaded = true; }
            this.partition0 = partition0;
            this.partition1 = partition1;
            this.partition2 = partition2;
            this.memLoaded = memLoaded;
        }
        MemoryManager.prototype.assignMem = function (pid) {
            this.memLoaded = true;
            if (this.partition0) {
                this.partition0 = false;
                _Processes[pid].memLocation = 0;
            }
            else if (this.partition1) {
                this.partition1 = false;
                _Processes[pid].memLocation = 1;
            }
            else if (this.partition2) {
                this.partition2 = false;
                _Processes[pid].memLocation = 2;
            }
            else {
                this.memLoaded = false;
            }
        };
        MemoryManager.prototype.freeMem = function (partition) {
            if (partition == 'all') {
                this.partition0 = true;
                this.partition1 = true;
                this.partition2 = true;
            }
            else {
                if (partition == 0) {
                    this.partition0 = true;
                }
                else if (partition == 1) {
                    this.partition1 = true;
                }
                else if (partition == 2) {
                    this.partition2 = true;
                }
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
