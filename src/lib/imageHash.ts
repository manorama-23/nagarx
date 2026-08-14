/**
 * 1. Computes a 64-bit difference hash (dHash) directly in the browser
 * using HTML5 Canvas. Catches duplicates even if renamed, resized, or compressed.
 */
export function computeBrowserImageHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context unavailable'));

                // Resize down to 9x8 for a 64-bit visual gradient hash
                const width = 9;
                const height = 8;
                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);
                const imgData = ctx.getImageData(0, 0, width, height).data;

                // Convert pixels to grayscale values safely
                const grays: number[] = [];
                for (let i = 0; i < imgData.length; i += 4) {
                    const r = imgData[i] ?? 0;
                    const g = imgData[i + 1] ?? 0;
                    const b = imgData[i + 2] ?? 0;
                    grays.push(r * 0.299 + g * 0.587 + b * 0.114);
                }

                // Compare adjacent pixels horizontally to build a 64-bit binary string
                let hash = '';
                for (let row = 0; row < height; row++) {
                    for (let col = 0; col < width - 1; col++) {
                        const left = grays[row * width + col] ?? 0;
                        const right = grays[row * width + col + 1] ?? 0;
                        hash += left > right ? '1' : '0';
                    }
                }
                resolve(hash);
            };
            img.onerror = () => reject(new Error('Failed to load image file'));
            img.src = event.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
    });
}

/**
 * 2. Hamming distance calculator to compare two hashes.
 * 0 = identical photo
 * <= 10 = visually the same photo (re-saved, re-compressed, or slight crop)
 */
export function getHammingDistance(h1?: string | null, h2?: string | null): number {
    if (!h1 || !h2 || h1.length !== h2.length) return 999;
    let diff = 0;
    for (let i = 0; i < h1.length; i++) {
        if (h1[i] !== h2[i]) diff++;
    }
    return diff;
}

/**
 * 3. Haversine formula to compute distance between two GPS coordinates in meters.
 */
export function getDistanceInMeters(
    lat1?: number | null,
    lon1?: number | null,
    lat2?: number | null,
    lon2?: number | null
): number {
    if (
        lat1 === undefined || lat1 === null ||
        lon1 === undefined || lon1 === null ||
        lat2 === undefined || lat2 === null ||
        lon2 === undefined || lon2 === null
    ) {
        return 999999;
    }
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}