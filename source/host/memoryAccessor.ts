///<reference path="../globals.ts" />

module TSOS {
    export class MemoryAccessor {
        constructor(
        ) { }
        public writeMem(char1, char2, position) {
            _Memory[position] = char1 + char2;
        }
    }
}