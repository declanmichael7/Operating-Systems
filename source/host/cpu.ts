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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: string = '0',
                    public Xreg: string = '0',
                    public Yreg: string = '0',
                    public Zflag: string = '0',
                    public currentPartition = 0,
                    public currentProcess: number = null,
                    public sinceSwitch: number = 0,
                    public quantum: number = 6,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = '0';
            this.Xreg = '0';
            this.Yreg = '0';
            this.Zflag = '0';
            this.currentPartition = 0;
            this.currentProcess = null;
            this.quantum = 6;
            this.isExecuting = false;
        }

        public cycle(): void {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.sinceSwitch == this.quantum && readyQueue.length > 1) {
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
                this.Acc = _MemoryAccessor.readMem(Utils.toDecimal(_MemoryAccessor.readMem((this.PC + 1), this.currentPartition)), this.currentPartition);
                this.PC = this.PC + 2;
                document.getElementById('Acc').innerHTML = "" + this.Acc;
                _Kernel.krnTrace('Acc = ' + this.Acc);
            }
            //ADC
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == '6D') {
                console.log(Utils.addHex(_MemoryAccessor.readMem(Utils.toDecimal(_MemoryAccessor.readMem(this.PC + 1, this.currentPartition)), this.currentPartition), this.Acc));
                this.Acc = Utils.addHex(_MemoryAccessor.readMem(Utils.toDecimal(_MemoryAccessor.readMem(this.PC + 1, this.currentPartition)), this.currentPartition), this.Acc);
                document.getElementById('Acc').innerHTML = "" + Utils.toHex(this.Acc);
                this.PC = this.PC + 2;
            }
            //STA
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == '8D') {
                _MemoryAccessor.writeMem(Utils.toDecimal(_MemoryAccessor.readMem(this.PC + 1, this.currentPartition)),
                                         this.currentPartition,
                                         this.Acc);
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
                this.Xreg = _MemoryAccessor.readMem(Utils.toDecimal(_MemoryAccessor.readMem((this.PC + 1), this.currentPartition)), this.currentPartition);
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
                this.Yreg = _MemoryAccessor.readMem(Utils.toDecimal(_MemoryAccessor.readMem((this.PC + 1), this.currentPartition)), this.currentPartition);
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
                if (this.Xreg == _MemoryAccessor.readMem(Utils.toDecimal(_MemoryAccessor.readMem((this.PC + 1), this.currentPartition)), this.currentPartition)) {
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
                    this.PC = Utils.branch(this.PC, _MemoryAccessor.readMem((this.PC + 1), this.currentPartition));
                }
                else {
                    this.PC = this.PC + 1;
                }
            }
            //INC
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'EE') {
                _MemoryAccessor.writeMem(Utils.toDecimal(_MemoryAccessor.readMem(this.PC +1, this.currentPartition)),
                                         this.currentPartition, 
                                         Utils.addHex(_MemoryAccessor.readMem(Utils.toDecimal(_MemoryAccessor.readMem(this.PC +1, this.currentPartition)), this.currentPartition), 1));
                this.PC = this.PC + 2;
            }
            //SYS
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == 'FF') {
                if (this.Xreg == '01') {
                    console.log("Output: " +this.Yreg);
                    _StdOut.putText(this.Yreg);
                }
                if (this.Xreg == '02') {
                    i = Utils.toDecimal(this.Yreg);
                    while (_MemoryAccessor.readMem(i, this.currentPartition) != '00') {
                        _StdOut.putText(Utils.hextoString(_MemoryAccessor.readMem(i, this.currentPartition)));
                        i++;
                    }
                }
            }
            //BRK
            else if (_MemoryAccessor.readMem(this.PC, this.currentPartition) == '00') {
                _Kernel.krnTrace("Break");
                _Processes[this.currentProcess].State = "Completed";
                _Processes[this.currentProcess].memLocation = null;
                console.log("Process " + this.currentProcess + " is " + _Processes[this.currentProcess].State);
                _MemoryAccessor.clearMem(this.currentPartition);
                Control.updatePCB();
                readyQueue.shift();
                if (readyQueue[0] == undefined) {
                    this.isExecuting = false;
                    this.PC = 0;
                    this.Acc = '0';
                    this.Xreg = '0';
                    this.Yreg = '0';
                    this.Zflag = '0';
                    document.getElementById('PC').innerHTML = "0";
                    document.getElementById('Acc').innerHTML = "0";
                    document.getElementById('Xreg').innerHTML = "0";
                    document.getElementById('Yreg').innerHTML = "0";
                    document.getElementById('Zflag').innerHTML = "0";
                }
                else {
                    this.contextSwitch();
                }
            }
            if (this.isExecuting) {
                this.PC++;
                document.getElementById('PC').innerHTML = "" + this.PC;
                _Processes[this.currentProcess].PC = this.PC;
                _Processes[this.currentProcess].Acc = this.Acc;
                _Processes[this.currentProcess].Xreg = this.Xreg;
                _Processes[this.currentProcess].Yreg = this.Yreg;
                _Processes[this.currentProcess].Zflag = this.Zflag;
                Control.updatePCB();
            }
            if (this.PC >= _Processes[this.currentProcess].length) {
                _Processes[this.currentProcess].State = "Completed";
                _Processes[this.currentProcess].memLocation = null;
                console.log("Process " + this.currentProcess + " is " + _Processes[this.currentProcess].State);
                _MemoryAccessor.clearMem(this.currentPartition);
                readyQueue.shift();
                console.log(readyQueue.toString());
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
                else {
                    this.contextSwitch();
                }
                console.log("Process " + this.currentProcess + " is " + _Processes[this.currentProcess].State);
                Control.updatePCB();
            }
            this.sinceSwitch++;
        }
        public runProgram(pid) {
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
                console.log("Process " + pid + " is " + _Processes[pid].State);
                readyQueue.push(pid);
            }
        }
        public contextSwitch() {
            if (this.currentProcess != null) {
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
            Control.updatePCB();
            _Kernel.krnTrace("Context switch to process " + this.currentProcess);
        }
        public kill(process) {
            _MemoryAccessor.clearMem(_Processes[process].memLocation);
            _Processes[process].State = "Killed";
            console.log("Process " + process + " has been " + _Processes[process].State);
            var indtoRemove = readyQueue.indexOf(parseInt(process));
            console.log(indtoRemove);
            readyQueue.splice(indtoRemove, 1);
            this.contextSwitch();
        }
    }
}
