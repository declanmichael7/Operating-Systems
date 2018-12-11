///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Disk = /** @class */ (function () {
        function Disk(isFormatted, trackNum, sectorNum, blockNum, blockSize) {
            if (isFormatted === void 0) { isFormatted = false; }
            if (trackNum === void 0) { trackNum = 3; }
            if (sectorNum === void 0) { sectorNum = 8; }
            if (blockNum === void 0) { blockNum = 8; }
            if (blockSize === void 0) { blockSize = 64; }
            this.isFormatted = isFormatted;
            this.trackNum = trackNum;
            this.sectorNum = sectorNum;
            this.blockNum = blockNum;
            this.blockSize = blockSize;
        }
        Disk.prototype.formatDisk = function () {
            var t = 0;
            var s = 0;
            var b = 0;
            var pos = 0;
            while (t < this.trackNum) {
                s = 0;
                while (s < this.sectorNum) {
                    b = 0;
                    while (b < this.blockNum) {
                        pos = 0;
                        while (pos < this.blockSize) {
                            _Disk[t + "" + s + "" + b + "" + pos] = "00";
                            pos++;
                        }
                        b++;
                    }
                    s++;
                }
                t++;
            }
            _StdOut.putText("Disk has been formatted");
            this.isFormatted = true;
            _DiskDeviceDriver.updateDiskDisplay();
        };
        return Disk;
    }());
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {}));
