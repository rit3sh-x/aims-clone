async function main(): Promise<void> {
    const key: CryptoKey = await crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );

    const jwk: JsonWebKey = await crypto.subtle.exportKey("jwk", key);

    console.log(jwk.k);
}

main().catch((err) => {
    console.error("Key generation failed:", err);
    process.exit(1);
});
