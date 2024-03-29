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
            var pos = '0';
            var table = document.getElementById("diskTable");
            var tableString = "<table id='diskTable' style='width:1000px; background-color:white;'>";
            var blockString;
            while (t < _Disk.trackNum) {
                s = 0;
                while (s < _Disk.sectorNum) {
                    b = 0;
                    while (b < _Disk.blockNum) {
                        pos = '0';
                        blockString = "";
                        while (parseInt(pos) < _Disk.blockSize) {
                            if (parseInt(pos) < 10) {
                                pos = '0' + pos;
                            }
                            blockString += _Disk[t + "" + s + "" + b + "" + pos];
                            pos = (parseInt(pos) + 1).toString();
                        }
                        tableString += "<tr><td>" + t + "" + s + "" + b + "   " + blockString + "</td></tr>";
                        b++;
                    }
                    s++;
                }
                t++;
            }
            tableString += "</table>";
            table.innerHTML = tableString;
        };
        DiskDeviceDriver.prototype.krnDiskRollOut = function (processOut, processIn) {
            //Roll out one process...
            var process = "";
            i = 0;
            while (i <= _Processes[processOut].length) {
                process += _MemoryAccessor.readMem(i, _Processes[processOut].memLocation) + " ";
                i++;
            }
            var partition = _Processes[processOut].memLocation;
            _MemoryAccessor.clearMem(_Processes[processOut].memLocation);
            _Processes[processOut].memlocation = this.krnFindFreeFrame();
            this.krnDiskLoad(this.krnFindFreeFrame(), process);
            _Processes[processOut].State = "Disk";
            TSOS.Control.updatePCB();
            this.updateDiskDisplay();
            //...And roll in another
            this.krnDiskRollIn(processIn, 0, partition, _Processes[processIn].memLocation);
        };
        DiskDeviceDriver.prototype.krnDiskRollIn = function (processIn, position, partition, frame) {
            var pos = '4';
            i = position;
            if ((_Disk[frame + "" + "00"]) != "02") {
                var isLastFrame = false;
            }
            else {
                isLastFrame = true;
            }
            while (parseInt(pos) < this.blockSize && i < 256) {
                if ((parseInt(pos) < 10)) {
                    pos = "0" + pos;
                }
                _MemoryAccessor.writeMem(i, partition, _Disk[frame + "" + pos]);
                _Disk[frame + "" + pos] = "00";
                i++;
                pos = (parseInt(pos) + 1).toString();
            }
            if (isLastFrame) {
                console.log(partition);
                _Processes[processIn].memLocation = partition;
                _Processes[processIn].State = "Resident";
                _Disk[frame + "" + "00"] = "00";
                _Disk[frame + "" + "01"] = "00";
                _Disk[frame + "" + "02"] = "00";
                _Disk[frame + "" + "03"] = "00";
                TSOS.Control.updatePCB();
                this.updateDiskDisplay();
            }
            else {
                var nextFrame = parseInt(_Disk[frame + "01"]) + "" + parseInt(_Disk[frame + "02"]) + "" + parseInt(_Disk[frame + "03"]);
                _Disk[frame + "" + "00"] = "00";
                _Disk[frame + "" + "01"] = "00";
                _Disk[frame + "" + "02"] = "00";
                _Disk[frame + "" + "03"] = "00";
                this.krnDiskRollIn(processIn, i, partition, nextFrame);
            }
        };
        //Finds a free frame to load a process or file
        DiskDeviceDriver.prototype.krnFindFreeFrame = function () {
            //Find the first open tsb to put the program
            var t = 1;
            var s = 0;
            var b = 0;
            var match = false;
            while (t < this.trackNum && match == false) {
                s = 0;
                while (s < this.blockNum && match == false) {
                    b = 0;
                    while (b < this.sectorNum && match == false) {
                        if (_Disk[t + "" + s + "" + b + "" + "00"] == "00") {
                            match = true;
                            return (t + "" + s + "" + b);
                        }
                        b++;
                    }
                    s++;
                }
                t++;
            }
        };
        //Loads a process onto the disk
        DiskDeviceDriver.prototype.krnDiskLoad = function (firstFrame, program) {
            var t = parseInt(firstFrame.charAt(0));
            var s = parseInt(firstFrame.charAt(1));
            var b = parseInt(firstFrame.charAt(2));
            //Sets the first byte of the tsb to 01 so we know there's something in that frame
            _Disk[t + "" + s + "" + b + "00"] = "01";
            //If it's too large for one frame...
            if (program.length >= 180) {
                //make a temp string to hold alll that will fit in the current frame
                var thisFrame = program.substr(0, 179);
                //and make the program string what it is minus the temp string
                program = program.substr(180, program.length);
                //and set a boolean so we know that we'll have to load more later
                var tooBig = true;
            }
            else {
                thisFrame = program;
                tooBig = false;
            }
            var pos = '4';
            var opCode;
            i = 0;
            while (i <= thisFrame.length) {
                opCode = thisFrame.charAt(i - 1) + thisFrame.charAt(i);
                if (((i - 1) % 3) == 0) {
                    if (parseInt(pos) < 10) {
                        pos = '0' + pos;
                    }
                    _Disk[t + "" + s + "" + b + "" + pos] = opCode;
                    pos = (parseInt(pos) + 1).toString();
                }
                i++;
            }
            if (tooBig) {
                var nextFrame = _DiskDeviceDriver.krnFindFreeFrame();
                _Disk[t + "" + s + "" + b + "" + "01"] = "0" + nextFrame.charAt(0);
                _Disk[t + "" + s + "" + b + "" + "02"] = "0" + nextFrame.charAt(1);
                _Disk[t + "" + s + "" + b + "" + "03"] = "0" + nextFrame.charAt(2);
                this.krnDiskLoad(nextFrame, program);
            }
            else {
                _Disk[t + "" + s + "" + b + "" + "00"] = "02";
                _Disk[t + "" + s + "" + b + "" + "01"] = "FF";
                _Disk[t + "" + s + "" + b + "" + "02"] = "FF";
                _Disk[t + "" + s + "" + b + "" + "03"] = "FF";
            }
            this.updateDiskDisplay();
        };
        DiskDeviceDriver.prototype.krnCreate = function (filename) {
            //Create a file
            var fileName = filename.toString();
            var t = 0;
            var s = 7;
            var b = 7;
            var match = false;
            //search for a block to put the pointer to the file data and put the name in
            while (s < this.sectorNum && match == false) {
                b = 7;
                while (b < this.blockNum && match == false) {
                    //if there's an open block
                    if (_Disk[t + "" + s + "" + b + "" + "00"] == "00") {
                        var fileNameHex = "";
                        i = 0;
                        //convert the filename to hex
                        while (i < fileName.length) {
                            var char = fileName.charCodeAt(i).toString(16);
                            fileNameHex += char;
                            i++;
                        }
                        //find a frame to put the file data in and put '01' and the tsb in the first four bytes
                        var fileFrame = _DiskDeviceDriver.krnFindFreeFrame();
                        _Disk[t + "" + s + "" + b + "" + "00"] = "01";
                        _Disk[t + "" + s + "" + b + "" + "01"] = "0" + fileFrame.charAt(0);
                        _Disk[t + "" + s + "" + b + "" + "02"] = "0" + fileFrame.charAt(1);
                        _Disk[t + "" + s + "" + b + "" + "03"] = "0" + fileFrame.charAt(2);
                        //Put a 01 in the first byte of that frame so it can be written to
                        _Disk[fileFrame.charAt(0) + "" + fileFrame.charAt(1) + "" + fileFrame.charAt(2) + "" + "00"] = "01";
                        var pos = '4';
                        i = 0;
                        var j = 0;
                        //write the filename in hex to the block
                        while (j <= fileName.length) {
                            if (parseInt(pos) < 10) {
                                pos = "0" + pos;
                            }
                            _Disk[t + "" + s + "" + b + "" + pos] = (fileNameHex.substr(i, 2));
                            i = i + 2;
                            pos = (parseInt(pos) + 1).toString();
                            j++;
                        }
                        match = true;
                    }
                    b--;
                }
                s--;
            }
            this.updateDiskDisplay();
        };
        DiskDeviceDriver.prototype.findFile = function (filename) {
            var fileName = filename.toString();
            var t = 0;
            var s = 7;
            var b = 7;
            var match = false;
            //search for a block that contains the filename
            while (s > 0 && match == false) {
                b = 7;
                while (b > 0 && match == false) {
                    //if there's something in the block, check to see if it's the file you're looking for
                    if (_Disk[t + "" + s + "" + b + "" + "00"] == "01") {
                        //Get the hex for the file name you want to check
                        var fileNameCheck = "";
                        i = 0;
                        var pos = "04";
                        while (_Disk[t + "" + s + "" + b + "" + pos] != "00") {
                            fileNameCheck += _Disk[t + "" + s + "" + b + "" + pos];
                            pos = (parseInt(pos) + 1).toString();
                            if (parseInt(pos) < 10) {
                                pos = "0" + pos;
                            }
                        }
                        //convert it into text
                        fileNameCheck = TSOS.Utils.hextoString(fileNameCheck);
                        //if they match, return the pointer for the file data
                        if (fileNameCheck == filename) {
                            var frame = "";
                            frame += _Disk[t + "" + s + "" + b + "" + "01"];
                            frame += _Disk[t + "" + s + "" + b + "" + "02"];
                            frame += _Disk[t + "" + s + "" + b + "" + "03"];
                            return frame;
                            match = true;
                        }
                    }
                    b--;
                }
                s--;
            }
            if (match == false) {
                frame = "File not found";
                return frame;
            }
        };
        DiskDeviceDriver.prototype.krnWrite = function (filename, data) {
            //Find the tsb that matches the filename
            var dataFrame = this.findFile(filename);
            if (dataFrame == "File not found") {
                _StdOut.putText("File not found");
            }
            else {
                var t = parseInt(dataFrame.substr(0, 2));
                var s = parseInt(dataFrame.substr(2, 2));
                var b = parseInt(dataFrame.substr(4, 2));
                //convert the data to hex
                i = 1;
                var dataHex = "";
                //convert the data to hex
                while (i < (data.length - 1)) {
                    var char = data.charCodeAt(i).toString(16);
                    dataHex += char;
                    i++;
                }
                var pos = '4';
                i = 0;
                var j = 0;
                //write the data in hex to the block
                while (j <= data.length - 1) {
                    if (parseInt(pos) < 10) {
                        pos = "0" + pos;
                    }
                    _Disk[t + "" + s + "" + b + "" + pos] = (dataHex.substr(i, 2));
                    i = i + 2;
                    pos = (parseInt(pos) + 1).toString();
                    j++;
                }
                _StdOut.putText("Data written to file");
                this.updateDiskDisplay();
            }
        };
        DiskDeviceDriver.prototype.krnRead = function (filename) {
            //Read the contents of a file
            var dataFrame = this.findFile(filename);
            if (dataFrame == "File not found") {
                _StdOut.putText("File not found");
            }
            else {
                var t = parseInt(dataFrame.substr(0, 2));
                var s = parseInt(dataFrame.substr(2, 2));
                var b = parseInt(dataFrame.substr(4, 2));
                var pos = "04";
                var dataHex = "";
                //While the value of the block isn't 00, add it to the hex string
                while (_Disk[t + "" + s + "" + b + "" + pos] != "00") {
                    dataHex += _Disk[t + "" + s + "" + b + "" + pos];
                    pos = (parseInt(pos) + 1).toString();
                    if (parseInt(pos) < 10) {
                        pos = "0" + pos;
                    }
                }
                //Convert it to text
                var dataString = TSOS.Utils.hextoString(dataHex);
                //And output it
                _StdOut.putText(dataString);
            }
        };
        DiskDeviceDriver.prototype.krnDelete = function (filename) {
            //Delete a file
            var fileName = filename.toString();
            var t = 0;
            var s = 7;
            var b = 7;
            var match = false;
            //search for a block that contains the filename
            while (s > 0 && match == false) {
                b = 7;
                while (b > 0 && match == false) {
                    //if there's something in the block, check to see if it's the file you're looking for
                    if (_Disk[t + "" + s + "" + b + "" + "00"] == "01") {
                        //Get the hex for the file name you want to check
                        var fileNameCheck = "";
                        i = 0;
                        var pos = "04";
                        while (_Disk[t + "" + s + "" + b + "" + pos] != "00") {
                            fileNameCheck += _Disk[t + "" + s + "" + b + "" + pos];
                            pos = (parseInt(pos) + 1).toString();
                            if (parseInt(pos) < 10) {
                                pos = "0" + pos;
                            }
                        }
                        //convert it into text
                        fileNameCheck = TSOS.Utils.hextoString(fileNameCheck);
                        //if they match, save the pointer for the file data
                        if (fileNameCheck == filename) {
                            var frame = "";
                            frame += _Disk[t + "" + s + "" + b + "" + "01"];
                            frame += _Disk[t + "" + s + "" + b + "" + "02"];
                            frame += _Disk[t + "" + s + "" + b + "" + "03"];
                            console.log(frame);
                            console.log(t + "" + s + "" + b);
                            //And wipe the pointer location
                            pos = "00";
                            while (parseInt(pos) < this.blockSize) {
                                _Disk[t + "" + s + "" + b + "" + pos] = "00";
                                pos = (parseInt(pos) + 1).toString();
                                if (parseInt(pos) < 10) {
                                    pos = "0" + pos;
                                }
                            }
                            match = true;
                        }
                    }
                    b--;
                }
                s--;
                //Now, go the data location
                t = parseInt(frame.substr(0, 2));
                s = parseInt(frame.substr(2, 2));
                b = parseInt(frame.substr(4, 2));
                pos = "00";
                //And wipe all of it's data too
                while (parseInt(pos) < this.blockSize) {
                    _Disk[t + "" + s + "" + b + "" + pos] = "00";
                    pos = (parseInt(pos) + 1).toString();
                    if (parseInt(pos) < 10) {
                        pos = "0" + pos;
                    }
                }
                _StdOut.putText("File Deleted");
                this.updateDiskDisplay();
            }
        };
        DiskDeviceDriver.prototype.krnList = function () {
            var t = 0;
            var s = 7;
            var b = 7;
            //search for a block that contains the filename
            while (s > 0) {
                b = 7;
                while (b > 0) {
                    //if there's something in the block, get the name of the file
                    if (_Disk[t + "" + s + "" + b + "" + "00"] == "01") {
                        //Get the hex for the file name
                        var fileNameCheck = "";
                        i = 0;
                        var pos = "04";
                        while (_Disk[t + "" + s + "" + b + "" + pos] != "00") {
                            fileNameCheck += _Disk[t + "" + s + "" + b + "" + pos];
                            pos = (parseInt(pos) + 1).toString();
                            if (parseInt(pos) < 10) {
                                pos = "0" + pos;
                            }
                        }
                        //convert it into text
                        fileNameCheck = TSOS.Utils.hextoString(fileNameCheck);
                        //And output it to the screen
                        _StdOut.putText(fileNameCheck);
                        _StdOut.advanceLine();
                    }
                    b--;
                }
                s--;
            }
        };
        return DiskDeviceDriver;
    }(TSOS.DeviceDriver));
    TSOS.DiskDeviceDriver = DiskDeviceDriver;
})(TSOS || (TSOS = {}));
