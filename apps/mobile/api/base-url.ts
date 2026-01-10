export function getBaseUrl() {
    const url = process.env.EXPO_PUBLIC_API_URL;

    if (!url) {
        throw new Error("Missing EXPO_PUBLIC_API_URL");
    }

    return url;
}