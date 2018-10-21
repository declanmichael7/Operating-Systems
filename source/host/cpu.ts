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
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            _Kernel.krnTrace(_Memory[this.PC]);
            if (_Memory[this.PC] == 'A9') {
                this.Acc = _Memory[this.PC + 1];
                document.getElementById('Acc').innerHTML = ""+this.Acc;
                //For now this is just +1. Change later
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Acc = ' + this.Acc);
            }
            else if (_Memory[this.PC] == 'AD') {
                this.Acc = _Memory[_Memory[this.PC + 1]];
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Acc = ' + this.Acc);
            }
            this.PC++;
            document.getElementById('PC').innerHTML = "" + this.PC;
            if (this.PC > _Memory.lengthUsed) {
                this.isExecuting = false;
            }
        }

        public runProgram(pid) {
            _Process1.state = "Running";
            _CPU.isExecuting = true;
        }
    }
}
