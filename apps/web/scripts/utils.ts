import { randomBytes } from "crypto";

export function randomHex(length = 32): string {
    if (length < 8 || length > 64) {
        throw new Error("length must be between 8 and 64");
    }

    return randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
}