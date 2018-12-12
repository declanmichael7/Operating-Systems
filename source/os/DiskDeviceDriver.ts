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
            var pos = '0';
            var table = document.getElementById("diskTable");
            var tableString = "<table id='diskTable' style='width:1000px; background-color:white;'>"
            var blockString;
            while (t < _Disk.trackNum) {
                s = 0;
                while (s < _Disk.sectorNum) {
                    b = 0;
                    while (b < _Disk.blockNum) {
                        pos = '0';
                        blockString = ""
                        while (parseInt(pos) < _Disk.blockSize) {
                            if (parseInt(pos) < 10) {
                                pos = '0' + pos;
                            }
                            blockString += _Disk[t + "" + s + "" + b + "" + pos];
                            pos = (parseInt(pos)+1).toString();
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
        }
        public krnDiskRollOut(processOut, processIn){
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
            Control.updatePCB();
            this.updateDiskDisplay();

            //...And roll in another
            this.krnDiskRollIn(processIn, 0, partition, _Processes[processIn].memLocation);
        }

        public krnDiskRollIn(processIn, position, partition, frame) {
            var pos = '4';
            i = position;
            if ((_Disk[frame + "" + "00"]) != "02") {
                var isLastFrame = false;
            }
            else {
                isLastFrame = true;
            }
            while (parseInt(pos) < this.blockSize && i<256) {
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
                Control.updatePCB();
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
        }

        //Finds a free frame to load a process or file
        public krnFindFreeFrame() {
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
        }

        //Loads a process onto the disk
        public krnDiskLoad(firstFrame, program) {
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
            var opCode: string;
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
                i++
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
        }
        public krnCreate(filename) {
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
                            fileNameHex += char
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
                            _Disk[t + "" + s + "" + b + "" + pos] = (fileNameHex.substr(i,2));
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