/// <reference path="../globals.ts" />

module TSOS {
    export class Pcb {
        constructor(public pid: string,
            public memLocation: number,
            public PC: number = 0,
            public Acc: number = 0,
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public state: string = 'Resident'
        ) { }
    }
}