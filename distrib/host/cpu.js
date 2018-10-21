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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            _Kernel.krnTrace(_Memory[this.PC]);
            //LDA
            if (_Memory[this.PC] == 'A9') {
                this.Acc = _Memory[this.PC + 1];
                document.getElementById('Acc').innerHTML = "" + this.Acc;
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Acc = ' + this.Acc);
            }
            //LDA
            else if (_Memory[this.PC] == 'AD') {
                this.Acc = _Memory[TSOS.Utils.toDecimal(_Memory[this.PC + 1])];
                this.PC = this.PC + 2;
                document.getElementById('Acc').innerHTML = "" + this.Acc;
            }
            //ADC
            //STA
            else if (_Memory[this.PC] == '8D') {
                _Memory[TSOS.Utils.toDecimal(_Memory[this.PC + 1])] = this.Acc;
                document.getElementById(_Memory[TSOS.Utils.toDecimal(this.PC + 1)]).innerHTML = "" + this.Acc;
                this.PC = this.PC + 2;
            }
            //LDX
            else if (_Memory[this.PC] == 'A2') {
                this.Xreg = _Memory[this.PC + 1];
                document.getElementById('Xreg').innerHTML = "" + this.Xreg;
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Xreg = ' + this.Xreg);
            }
            //LDX
            else if (_Memory[this.PC] == 'AE') {
                this.Xreg = _Memory[TSOS.Utils.toDecimal(_Memory[this.PC + 1])];
                this.PC = this.PC + 2;
                document.getElementById('Xreg').innerHTML = "" + this.Xreg;
                _Kernel.krnTrace("Xreg = " + this.Xreg);
            }
            //LDY
            else if (_Memory[this.PC] == 'A0') {
                this.Yreg = _Memory[this.PC + 1];
                document.getElementById('Yreg').innerHTML = "" + this.Yreg;
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Yreg = ' + this.Yreg);
            }
            //LDY
            else if (_Memory[this.PC] == 'AC') {
                this.Yreg = _Memory[TSOS.Utils.toDecimal(_Memory[this.PC + 1])];
                this.PC = this.PC + 2;
                document.getElementById('Yreg').innerHTML = "" + this.Yreg;
                _Kernel.krnTrace('Yreg = ' + this.Yreg);
            }
            //NOP
            else if (_Memory[this.PC] == 'EA') {
                _Kernel.krnTrace("No Operation");
            }
            //BRK
            else if (_Memory[this.PC] == '00') {
                _Kernel.krnTrace("Break");
                //this.isExecuting = false;
            }
            //CPX
            //BNE
            //INC
            else if (_Memory[this.PC] == 'EE') {
                TSOS.Utils.addHex(_Memory[TSOS.Utils.toDecimal(this.PC + 1)], 1);
                console.log(_Memory[TSOS.Utils.toDecimal(this.PC + 1)]);
                document.getElementById(_Memory[TSOS.Utils.toDecimal(this.PC + 1)]).innerHTML = "" + _Memory[_Memory[TSOS.Utils.toDecimal(this.PC + 1)]];
                this.PC = this.PC + 2;
            }
            //SYS
            else if (_Memory[this.PC] == 'FF') {
                if (this.Xreg == 1) {
                    _StdOut.putText(this.Yreg);
                }
                if (this.Xreg == 2) {
                    i = TSOS.Utils.toDecimal(this.Yreg);
                    while (_Memory[i] != '00') {
                        _StdOut.putText(TSOS.Utils.hextoString(_Memory[i]));
                        i++;
                    }
                }
            }
            this.PC++;
            document.getElementById('PC').innerHTML = "" + this.PC;
            if (this.PC >= _Memory.lengthUsed) {
                this.isExecuting = false;
                _Process1.state = 'Complete';
                //Reset the values of everything
                this.init();
                //update the CPU table
                document.getElementById('PC').innerHTML = "" + 0;
                document.getElementById('Acc').innerHTML = "" + 0;
                document.getElementById('Xreg').innerHTML = "" + 0;
                document.getElementById('Yreg').innerHTML = "" + 0;
                document.getElementById('Zflag').innerHTML = "" + 0;
            }
        };
        Cpu.prototype.runProgram = function (pid) {
            if (pid == 0) {
                _Process1.state = "Running";
                _CPU.isExecuting = true;
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
