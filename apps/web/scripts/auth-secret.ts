async function main(): Promise<void> {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);

    const hex = Array.from(bytes, b =>
        b.toString(16).padStart(2, "0")
    ).join("");

    console.log(hex);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});