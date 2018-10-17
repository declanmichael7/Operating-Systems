///<reference path="../globals.ts" />

module TSOS {
    export class Memory {
        constructor(public maxLength: number = 255
        ) {
        }

        public init(){
            i=0
            while (i < 256) {
                _Memory[i] = '00';
                i++
            }
            document.getElementById("taProgramInput").innerHTML = _Memory[255];
        }
    }
}