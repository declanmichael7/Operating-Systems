///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />


module TSOS {

    // Extends DeviceDriver
    export class DiskDeviceDriver extends DeviceDriver {

        constructor(
            public isFormatted: boolean = false,
            public trackNum: number = 4,
            public sectorNum: number = 8,
            public blockNum: number = 8,
            public blockSize: number = 64) {
            super();
            this.driverEntry = this.krnDiskDeviceDriverEntry;
        }
        public krnDiskDeviceDriverEntry() {
            this.status = "loaded";
        }
        public krnDiskFormat() {
            //Set up and format the disk
            _Disk.formatDisk();
            this.updateDiskDisplay();
        }
        public updateDiskDisplay() {
            //Similar to Control's updatePCB
            var t = 0;
            var s = 0;
            var b = 0;
            var pos = 0;
            var table = document.getElementById("diskTable");
            var tableString = "<table id='diskTable' style='width:1000px; background-color:white;'>"
            var blockString;
            while (t < _Disk.trackNum) {
                s = 0;
                while (s < _Disk.sectorNum) {
                    b = 0;
                    while (b < _Disk.blockNum) {
                        pos = 0;
                        blockString = ""
                        while (pos < _Disk.blockSize) {
                            blockString += _Disk[t + "" + s + "" + b + "" + pos];
                            pos++;
                        }
                        b++;
                        tableString += "<tr><td>" +t+""+s+""+b+"   " + blockString + "</td></tr>";
                    }
                    s++;
                }
                t++;
            }
            tableString += "</table>";
            table.innerHTML = tableString;
        }
        public krnDiskRollOut(){
            //Roll in one process and roll out another
        }
        //Loads a process onto the disk
        public krnDiskLoad(program) {
            //Check to see if the program needs multiple frames

        }
        public krnCreate() {
            //Create a file
        }
        public krnWrite(filename) {
            //Write data to a file
        }
        public krnRead(filename) {
            //Read the contents of a file
        }
        public krnDelete(filename) {
            //Delete a file
        }
    }
}