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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, currentPartition, currentProcess, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = '0'; }
            if (Xreg === void 0) { Xreg = '0'; }
            if (Yreg === void 0) { Yreg = '0'; }
            if (Zflag === void 0) { Zflag = '0'; }
            if (currentPartition === void 0) { currentPartition = 0; }
            if (currentProcess === void 0) { currentProcess = null; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.currentPartition = currentPartition;
            this.currentProcess = currentProcess;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = '0';
            this.Xreg = '0';
            this.Yreg = '0';
            this.Zflag = '0';
            this.currentPartition = 0;
            this.currentProcess = null;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
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
                _Kernel.krnTrace("Break");
                this.isExecuting = false;
                _Processes[this.currentProcess].State = "Completed";
                _Processes[this.currentProcess].memLocation = null;
                console.log("Process " + this.currentProcess + " is " + _Processes[this.currentProcess].State);
                _MemoryAccessor.clearMem(this.currentPartition);
                TSOS.Control.updatePCB();
                this.init();
                document.getElementById('PC').innerHTML = "0";
                document.getElementById('Acc').innerHTML = "0";
                document.getElementById('Xreg').innerHTML = "0";
                document.getElementById('Yreg').innerHTML = "0";
                document.getElementById('Zflag').innerHTML = "0";
            }
            //Something is going wrong with this. It isn't a major issue but during some testing and messing around with the console, I realized that the cpu sometimes does one extra cycle after this.isExecuting is set to false. Can't figure out why
            if (this.PC >= _Processes[this.currentProcess].length) {
                this.isExecuting = false;
                _Processes[this.currentProcess].State = "Completed";
                _Processes[this.currentProcess].memLocation = null;
                console.log("Process " + this.currentProcess + " is " + _Processes[this.currentProcess].State);
                _MemoryAccessor.clearMem(this.currentPartition);
                TSOS.Control.updatePCB();
                //Reset the values of everything
                this.init();
                //update the CPU table
                document.getElementById('PC').innerHTML = '0';
                document.getElementById('Acc').innerHTML = '0';
                document.getElementById('Xreg').innerHTML = '0';
                document.getElementById('Yreg').innerHTML = '0';
                document.getElementById('Zflag').innerHTML = '0';
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
        };
        Cpu.prototype.runProgram = function (pid) {
            _Processes[pid].State = "Running";
            _CPU.isExecuting = true;
            this.currentProcess = pid;
            console.log("Process " + this.currentProcess + " is " + _Processes[this.currentProcess].State);
            this.currentPartition = _Processes[pid].memLocation;
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
