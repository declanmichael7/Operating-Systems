///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager(partition0) {
            if (partition0 === void 0) { partition0 = true; }
            this.partition0 = partition0;
        }
        MemoryManager.prototype.init = function () {
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
