
export function calculateDelta(A, B, C, D, E, F) {
    return B * B - 4 * A * C;
}

export function calculateDelta1(A, B, C, D, E, F) {
    const delta = calculateDelta(A, B, C, D, E, F);
    const sigma1 = calculateSigma1(A, B, C, D, E, F);
    return F * delta + sigma1;
}

export function calculateDelta2(A, B, C, D, E, F) {
    return D * D + E * E - 4 * (A + C) * F;
}

export function calculateSigma1(A, B, C, D, E, F) {
    return A * E * E + C * D * D - B * D * E;
}

export function calculateSigma2(A, B, C, D, E, F) {
    return Math.hypot((A - C),B);
    //return Math.sqrt((A - C) * (A - C) + B * B);
    // 等价实现:
    // return Math.sqrt((A + C) * (A + C) + calculateDelta(A, B, C, D, E, F));
}

export function calculateSigmaX(A, B, C, D, E, F) {
    return 2 * C * D - B * E;
}

export function calculateSigmaY(A, B, C, D, E, F) {
    return 2 * A * E - B * D;
}


export function calculateCenterX(A, B, C, D, E, F) {
    const sigmaX = calculateSigmaX(A, B, C, D, E, F);
    const delta = calculateDelta(A, B, C, D, E, F);
    return sigmaX / delta;
}

export function calculateCenterY(A, B, C, D, E, F) {
    const sigmaY = calculateSigmaY(A, B, C, D, E, F);
    const delta = calculateDelta(A, B, C, D, E, F);
    return sigmaY / delta;
}


// 离心率计算
export function calculateEccentricity(A, B, C, D, E, F) {
    const delta1 = calculateDelta1(A, B, C, D, E, F);
    const sigma2 = calculateSigma2(A, B, C, D, E, F);
    const aPlusC = A + C;

    if (delta1 > 0) {
        return Math.sqrt(2 * sigma2 / (sigma2 + aPlusC));
    } else if (delta1 < 0) {
        return Math.sqrt(2 * sigma2 / (sigma2 - aPlusC));
    } else {
        return 1; // 抛物线情况
    }
}

// 椭圆面积计算
export function calculateEllipseArea(A, B, C, D, E, F) {
    const delta = calculateDelta(A, B, C, D, E, F);
    const delta1 = calculateDelta1(A, B, C, D, E, F);

    // 检查是否为椭圆 (Δ > 0 且 Δ·δ₁ < 0)
    if (delta > 0 && delta * delta1 < 0) {
        const term = Math.sqrt(-1 / delta);
        return Math.abs((2 / delta) * delta1 * term) * Math.PI;
    } else {
        return 0;
    }
}
