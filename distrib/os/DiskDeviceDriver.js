///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DiskDeviceDriver = /** @class */ (function (_super) {
        __extends(DiskDeviceDriver, _super);
        function DiskDeviceDriver(isFormatted, trackNum, sectorNum, blockNum, blockSize) {
            if (isFormatted === void 0) { isFormatted = false; }
            if (trackNum === void 0) { trackNum = 4; }
            if (sectorNum === void 0) { sectorNum = 8; }
            if (blockNum === void 0) { blockNum = 8; }
            if (blockSize === void 0) { blockSize = 64; }
            var _this = _super.call(this) || this;
            _this.isFormatted = isFormatted;
            _this.trackNum = trackNum;
            _this.sectorNum = sectorNum;
            _this.blockNum = blockNum;
            _this.blockSize = blockSize;
            _this.driverEntry = _this.krnDiskDeviceDriverEntry;
            return _this;
        }
        DiskDeviceDriver.prototype.krnDiskDeviceDriverEntry = function () {
            this.status = "loaded";
        };
        DiskDeviceDriver.prototype.krnDiskFormat = function () {
            //Set up and format the disk
            _Disk.formatDisk();
            this.updateDiskDisplay();
        };
        DiskDeviceDriver.prototype.updateDiskDisplay = function () {
            //Similar to Control's updatePCB
            var t = 0;
            var s = 0;
            var b = 0;
            var pos = 0;
            var table = document.getElementById("diskTable");
            var tableString = "<table id='diskTable' style='width:1000px; background-color:white;'>";
            var blockString;
            while (t < _Disk.trackNum) {
                s = 0;
                while (s < _Disk.sectorNum) {
                    b = 0;
                    while (b < _Disk.blockNum) {
                        pos = 0;
                        blockString = "";
                        while (pos < _Disk.blockSize) {
                            blockString += _Disk[t + "" + s + "" + b + "" + pos];
                            pos++;
                        }
                        b++;
                        tableString += "<tr><td>" + t + "" + s + "" + b + "   " + blockString + "</td></tr>";
                    }
                    s++;
                }
                t++;
            }
            tableString += "</table>";
            table.innerHTML = tableString;
        };
        DiskDeviceDriver.prototype.krnDiskRollOut = function () {
            //Roll in one process and roll out another
        };
        //Loads a process onto the disk
        DiskDeviceDriver.prototype.krnDiskLoad = function (program) {
            //Check to see if the program needs multiple frames
        };
        DiskDeviceDriver.prototype.krnCreate = function () {
            //Create a file
        };
        DiskDeviceDriver.prototype.krnWrite = function (filename) {
            //Write data to a file
        };
        DiskDeviceDriver.prototype.krnRead = function (filename) {
            //Read the contents of a file
        };
        DiskDeviceDriver.prototype.krnDelete = function (filename) {
            //Delete a file
        };
        return DiskDeviceDriver;
    }(TSOS.DeviceDriver));
    TSOS.DiskDeviceDriver = DiskDeviceDriver;
})(TSOS || (TSOS = {}));
