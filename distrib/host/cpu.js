///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, currentPartition, currentProcess, sinceSwitch, quantum, isExecuting, Schedule) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = '0'; }
            if (Xreg === void 0) { Xreg = '0'; }
            if (Yreg === void 0) { Yreg = '0'; }
            if (Zflag === void 0) { Zflag = '0'; }
            if (currentPartition === void 0) { currentPartition = 0; }
            if (currentProcess === void 0) { currentProcess = null; }
            if (sinceSwitch === void 0) { sinceSwitch = 0; }
            if (quantum === void 0) { quantum = 6; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (Schedule === void 0) { Schedule = "RR"; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.currentPartition = currentPartition;
            this.currentProcess = currentProcess;
            this.sinceSwitch = sinceSwitch;
            this.quantum = quantum;
            this.isExecuting = isExecuting;
            this.Schedule = Schedule;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = '0';
            this.Xreg = '0';
            this.Yreg = '0';
            this.Zflag = '0';
            this.currentPartition = 0;
            this.currentProcess = null;
            this.quantum = 6;
            this.isExecuting = false;
            this.Schedule = "RR";
        };
        Cpu.prototype.cycle = function () {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.sinceSwitch == this.quantum && readyQueue.length > 1 && this.Schedule == "RR") {
                this.contextSwitch();
                this.sinceSwitch = 0;
            }
            _Kernel.krnTrace(this.PC + " " + _MemoryAccessor.readMem(this.PC, this.currentPartition));
            //LDA
            if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'A9') {
                this.Acc = _MemoryAccessor.readMem((this.PC + 1), this.currentPartition);
                document.getElementById('Acc').innerHTML = "" + this.Acc;
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Acc = ' + this.Acc);
            }
            //LDA
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'AD') {
                this.Acc = _MemoryAccessor.readMem(TSOS.Utils.toDecimal(_MemoryAccessor.readMem((this.PC + 1), this.currentPartition)), this.currentPartition);
                this.PC = this.PC + 2;
                document.getElementById('Acc').innerHTML = "" + this.Acc;
                _Kernel.krnTrace('Acc = ' + this.Acc);
            }
            //ADC
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == '6D') {
                console.log(TSOS.Utils.addHex(_MemoryAccessor.readMem(TSOS.Utils.toDecimal(_MemoryAccessor.readMem(this.PC + 1, this.currentPartition)), this.currentPartition), this.Acc));
                this.Acc = TSOS.Utils.addHex(_MemoryAccessor.readMem(TSOS.Utils.toDecimal(_MemoryAccessor.readMem(this.PC + 1, this.currentPartition)), this.currentPartition), this.Acc);
                document.getElementById('Acc').innerHTML = "" + TSOS.Utils.toHex(this.Acc);
                this.PC = this.PC + 2;
            }
            //STA
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == '8D') {
                _MemoryAccessor.writeMem(TSOS.Utils.toDecimal(_MemoryAccessor.readMem(this.PC + 1, this.currentPartition)), this.currentPartition, this.Acc);
                this.PC = this.PC + 2;
            }
            //LDX
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'A2') {
                this.Xreg = _MemoryAccessor.readMem((this.PC + 1), this.currentPartition);
                document.getElementById('Xreg').innerHTML = "" + this.Xreg;
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Xreg = ' + this.Xreg);
            }
            //LDX
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'AE') {
                this.Xreg = _MemoryAccessor.readMem(TSOS.Utils.toDecimal(_MemoryAccessor.readMem((this.PC + 1), this.currentPartition)), this.currentPartition);
                this.PC = this.PC + 2;
                document.getElementById('Xreg').innerHTML = "" + this.Xreg;
                _Kernel.krnTrace("Xreg = " + this.Xreg);
            }
            //LDY
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'A0') {
                this.Yreg = _MemoryAccessor.readMem((this.PC + 1), this.currentPartition);
                document.getElementById('Yreg').innerHTML = "" + this.Yreg;
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Yreg = ' + this.Yreg);
            }
            //LDY
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'AC') {
                this.Yreg = _MemoryAccessor.readMem(TSOS.Utils.toDecimal(_MemoryAccessor.readMem((this.PC + 1), this.currentPartition)), this.currentPartition);
                this.PC = this.PC + 2;
                document.getElementById('Yreg').innerHTML = "" + this.Yreg;
                _Kernel.krnTrace('Yreg = ' + this.Yreg);
            }
            //NOP
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'EA') {
                _Kernel.krnTrace("No Operation");
            }
            //CPX
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'EC') {
                if (this.Xreg == _MemoryAccessor.readMem(TSOS.Utils.toDecimal(_MemoryAccessor.readMem((this.PC + 1), this.currentPartition)), this.currentPartition)) {
                    this.Zflag = '1';
                    document.getElementById('Zflag').innerHTML = "" + this.Zflag;
                }
                else {
                    this.Zflag = '0';
                    document.getElementById('Zflag').innerHTML = "" + this.Zflag;
                }
                this.PC = this.PC + 2;
            }
            //BNE
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'D0') {
                if (this.Zflag == '0') {
                    this.PC = TSOS.Utils.branch(this.PC, _MemoryAccessor.readMem((this.PC + 1), this.currentPartition));
                }
                else {
                    this.PC = this.PC + 1;
                }
            }
            //INC
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'EE') {
                _MemoryAccessor.writeMem(TSOS.Utils.toDecimal(_MemoryAccessor.readMem(this.PC + 1, this.currentPartition)), this.currentPartition, TSOS.Utils.addHex(_MemoryAccessor.readMem(TSOS.Utils.toDecimal(_MemoryAccessor.readMem(this.PC + 1, this.currentPartition)), this.currentPartition), 1));
                this.PC = this.PC + 2;
            }
            //SYS
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'FF') {
                if (this.Xreg == '01') {
                    console.log("Output: " + this.Yreg);
                    _StdOut.putText(this.Yreg);
                }
                if (this.Xreg == '02') {
                    i = TSOS.Utils.toDecimal(this.Yreg);
                    while (_MemoryAccessor.readMem(i, this.currentPartition) != '00') {
                        _StdOut.putText(TSOS.Utils.hextoString(_MemoryAccessor.readMem(i, this.currentPartition)));
                        i++;
                    }
                }
            }
            //BRK
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == '00') {
                this.completeProcess();
            }
            if (this.isExecuting) {
                this.PC++;
                document.getElementById('PC').innerHTML = "" + this.PC;
                _Processes[this.currentProcess].PC = this.PC;
                _Processes[this.currentProcess].Acc = this.Acc;
                _Processes[this.currentProcess].Xreg = this.Xreg;
                _Processes[this.currentProcess].Yreg = this.Yreg;
                _Processes[this.currentProcess].Zflag = this.Zflag;
                TSOS.Control.updatePCB();
            }
            if (this.PC >= _Processes[this.currentProcess].length) {
                this.completeProcess();
            }
            this.sinceSwitch++;
        };
        Cpu.prototype.runProgram = function (pid) {
            _CPU.isExecuting = true;
            if (pid == 'all') {
                i = 0;
                while (i < _Processes.length) {
                    if (_Processes[i].State == "Resident") {
                        readyQueue.push(i);
                        _Processes[i].State = "Waiting";
                    }
                    i++;
                }
                this.currentProcess = readyQueue[0];
                this.currentPartition = _Processes[this.currentProcess].memLocation;
                _Processes[this.currentProcess].State = "Running";
            }
            else {
                this.currentProcess = pid;
                _Processes[pid].State = "Running";
                this.currentPartition = _Processes[pid].memLocation;
                console.log("Process " + pid + " is " + _Processes[pid].State);
                readyQueue.push(pid);
            }
        };
        Cpu.prototype.completeProcess = function () {
            _Processes[this.currentProcess].State = "Completed";
            _Processes[this.currentProcess].memLocation = null;
            console.log("Process " + this.currentProcess + " is " + _Processes[this.currentProcess].State);
            _MemoryAccessor.clearMem(this.currentPartition);
            //If the schedule algorithm isn't Priority, then just take the process out of the ready queue and it'll go to the next one
            if (this.Schedule == "RR" || this.Schedule == "FCFS") {
                readyQueue.splice(readyQueue.indexOf(this.currentProcess), 1);
                console.log(readyQueue.toString());
            }
            //For priority:
            else {
                //If there are only 2 processes in the ready queue, that means there's only one left. So just shift to it
                if (readyQueue.length == 2) {
                    readyQueue.shift();
                    console.log(readyQueue.toString());
                }
                else {
                    //Loop through the ready queue to check the priority of each process
                    i = 1;
                    //If they all have the same priority, then run the next one in the queue
                    var lowestPriorityProcess = readyQueue[0];
                    while (i < readyQueue.length) {
                        if (_Processes[readyQueue[i]].Priority < _Processes[lowestPriorityProcess].Priority) {
                            console.log(readyQueue[i] + " is lower priority than " + lowestPriorityProcess);
                            lowestPriorityProcess = readyQueue[i];
                        }
                        console.log("Lowest: " + lowestPriorityProcess + " Priority: " + _Processes[lowestPriorityProcess].Priority);
                        i++;
                    }
                    //Set the current process to the lowest priority process
                    this.currentProcess = lowestPriorityProcess;
                    this.currentPartition = _Processes[lowestPriorityProcess].memLocation;
                    _Processes[lowestPriorityProcess].State = "Running";
                    //Instead of removing the first process in the queue (the one that just completed) and putting the lowest priority process first...
                    //...Remove the index of the queue that contains the process you're going to run...
                    readyQueue.splice(readyQueue.indexOf(lowestPriorityProcess), 1);
                    //...And move it to the front of the queue (which won't affect anything else because that is the process that just completed)
                    readyQueue[0] = lowestPriorityProcess;
                    console.log(readyQueue.toString());
                }
            }
            //If there's nothing left in the ready queue, reset the state of the cpu
            if (readyQueue[0] == undefined) {
                this.isExecuting = false;
                //Reset the values of everything
                this.PC = 0;
                this.Acc = '0';
                this.Xreg = '0';
                this.Yreg = '0';
                this.Zflag = '0';
                //update the CPU table
                document.getElementById('PC').innerHTML = '0';
                document.getElementById('Acc').innerHTML = '0';
                document.getElementById('Xreg').innerHTML = '0';
                document.getElementById('Yreg').innerHTML = '0';
                document.getElementById('Zflag').innerHTML = '0';
            }
            //If there are more processes left to run, switch to the next one in the ready queue
            else {
                this.contextSwitch();
            }
            TSOS.Control.updatePCB();
        };
        Cpu.prototype.contextSwitch = function () {
            if (this.currentProcess != null && this.Schedule != "Priority") {
                var temp = readyQueue[0];
                readyQueue.shift();
                readyQueue.push(temp);
                console.log(readyQueue.toString());
            }
            this.currentProcess = readyQueue[0];
            this.currentPartition = _Processes[this.currentProcess].memLocation;
            _Processes[this.currentProcess].State = "Running";
            i = 1;
            while (i < readyQueue.length) {
                _Processes[readyQueue[i]].State = "Waiting";
                i++;
            }
            this.PC = _Processes[this.currentProcess].PC;
            this.Acc = _Processes[this.currentProcess].Acc;
            this.Xreg = _Processes[this.currentProcess].Xreg;
            this.Yreg = _Processes[this.currentProcess].Yreg;
            this.Zflag = _Processes[this.currentProcess].Zflag;
            TSOS.Control.updatePCB();
            _Kernel.krnTrace("Context switch to process " + this.currentProcess);
        };
        Cpu.prototype.kill = function (process) {
            //In order to kill a process, it has to be taken out of the ready queue, have the memory it was taking up be erased, and have it's state updated
            _MemoryAccessor.clearMem(_Processes[process].memLocation);
            _Processes[process].State = "Killed";
            console.log("Process " + process + " has been " + _Processes[process].State);
            var indtoRemove = readyQueue.indexOf(parseInt(process));
            console.log(indtoRemove);
            readyQueue.splice(indtoRemove, 1);
            //Now that it's removed from the ready queue, make sure that it wasn't the process that was currently running. If it was, then switch to the next one in the queue
            if (indtoRemove == 0) {
                this.contextSwitch();
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
