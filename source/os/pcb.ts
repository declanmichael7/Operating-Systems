/// <reference path="../globals.ts" />

module TSOS {
    export class Pcb {
        constructor(public pid: number,
            public memLocation: number,
            public length: number,
            public Priority: number,
            public State: string,
            public PC: number = 0,
            public Acc: string = '0',
            public Xreg: string = '0',
            public Yreg: string = '0',
            public Zflag: string = '0') { }
    }
}