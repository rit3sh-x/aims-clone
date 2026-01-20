export function randomHex(length = 32): string {
    if (length < 8 || length > 64) {
        throw new Error("length must be between 8 and 64");
    }

    const bytes = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(bytes);

    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, length);
}
