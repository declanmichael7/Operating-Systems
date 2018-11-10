///<reference path="../globals.ts" />

module TSOS {
    export class Memory {
        constructor(public maxLength: number = 255,
            public lengthUsed: number = 0
        ) {
        }

        public init(){
            i=0
            while (i < 256) {
                _Memory[i] = '00';
                i++
            }
        }
    }
}