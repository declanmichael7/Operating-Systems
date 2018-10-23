/* --------
   Utils.ts

   Utility functions.
   -------- */

module TSOS {

    export class Utils {

        public static trim(str): string {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        }

        public static rot13(str: string): string {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal: string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch: string = str[i];
                var code: number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }
        public static toHex(decimal) {
                return Math.abs(decimal).toString(16);
        }

        public static toDecimal(hex) {
            return parseInt(hex, 16);
        }
        public static hextoString(hex) {
                var hex = hex.toString();
                var str = '';
                for (var n = 0; n < hex.length; n += 2) {
                    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
                }
                return str;
        }
        public static addHex(hex1, hex2) {
            //I'm not sure exactly how javascript handles adding hex, but I'm assuming it wouldn't work well. So I convert them both to decimal, add them, and convert them back
            var hexdec1 = this.toDecimal(hex1);
            var hexdec2 = this.toDecimal(hex2);
            var result = hexdec1 + hexdec2;
            if (result > 255) {
                result = result - 256;
            }
            if (result <= 15) {
                return "0" + this.toHex(result);
            }
            return this.toHex(result);
        }
        public static branch(currentPC, branchAmount) {
            currentPC = Utils.toHex(currentPC);
            currentPC = parseInt(currentPC, 16);
            branchAmount = parseInt(branchAmount, 16);
            currentPC = currentPC + branchAmount;
            if (currentPC > 255) {
                currentPC = currentPC - 255;
            }
            return currentPC;
        }
    }
}
