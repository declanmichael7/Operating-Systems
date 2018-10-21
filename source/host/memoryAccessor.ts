///<reference path="../globals.ts" />

module TSOS {
    export class MemoryAccessor {
        constructor(
        ) { }
        public writeMem(opCode, position) {
            _Memory[position] = opCode;
        }
    }
}