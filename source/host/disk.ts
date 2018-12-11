///<reference path="../globals.ts" />

module TSOS {
    export class Disk {
        constructor(
            public isFormatted: boolean = false,
            public trackNum: number = 3,
            public sectorNum: number = 8,
            public blockNum: number = 8,
            public blockSize: number = 64) {
        }
        public formatDisk() {
            var t = 0;
            var s = 0;
            var b = 0;
            var pos = '0';
            while (t < this.trackNum) {
                s = 0;
                while (s < this.sectorNum) {
                    b = 0;
                    while (b < this.blockNum) {
                        pos = '0';
                        while (parseInt(pos) < this.blockSize) {
                            if ((parseInt(pos) < 10)) {
                                pos = "0" + pos;
                            }
                            _Disk[t + "" + s+"" + b+"" + pos] = "00";
                            pos = (parseInt(pos) + 1).toString();
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
        }
    }
}