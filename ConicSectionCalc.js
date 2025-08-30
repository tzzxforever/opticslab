
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

/**
 * 求解二次方程以找到直线与二次曲线的交点。
 * @param {number} A - 二次曲线方程的系数 A。
 * @param {number} B - 二次曲线方程的系数 B。
 * @param {number} C - 二次曲线方程的系数 C。
 * @param {number} D - 二次曲线方程的系数 D。
 * @param {number} E - 二次曲线方程的系数 E。
 * @param {number} F - 二次曲线方程的系数 F。
 * @param {number} k - 直线的斜率。
 * @param {number} x0 - 直线上某点的 X 坐标。
 * @param {number} y0 - 直线上某点的 Y 坐标。
 * @returns {Object|string} 交点 { x1, y1, x2, y2 } 或 "No real roots"（无实数解）。
 */
export function solveQuadratic(A, B, C, D, E, F, k, x0, y0) {
    let a = A + B * k + C * Math.pow(k, 2);
    let b = -B * k * x0 + B * y0 + D + E * k;
    let c = C * Math.pow(k, 2) * Math.pow(x0, 2) - 2 * C * k * x0 * y0 + C * Math.pow(y0, 2) - E * k * x0 + E * y0 + F;
    let discriminant = Math.pow(b, 2) - 4 * a * c;
    if (discriminant < 0) return "No real roots";
    let sqrtDiscriminant = Math.sqrt(discriminant);
    let x1 = (-b + sqrtDiscriminant) / (2 * a);
    let x2 = (-b - sqrtDiscriminant) / (2 * a);
    let y1 = k * (x1 - x0) + y0;
    let y2 = k * (x2 - x0) + y0;
    return { x1, y1, x2, y2 };
}

/**
 * 计算给定 X 坐标的二次曲线上的 Y 坐标。
 * @param {number} A - 二次曲线方程的系数 A。
 * @param {number} B - 二次曲线方程的系数 B。
 * @param {number} C - 二次曲线方程的系数 C。
 * @param {number} D - 二次曲线方程的系数 D。
 * @param {number} E - 二次曲线方程的系数 E。
 * @param {number} F - 二次曲线方程的系数 F。
 * @param {number} n - 给定的 X 坐标。
 * @returns {Object} Y 坐标 { y1, y2 } 或 { y1: null, y2: null }（无实数解）。
 */
export function calculateY(A, B, C, D, E, F, n) {
    const a = C;
    const b = B * n + E;
    const c = A * n ** 2 + D * n + F;
    const discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) {
        return { y1: null, y2: null };
    }

    const sqrtDiscriminant = Math.sqrt(discriminant);
    const y1 = (-b + sqrtDiscriminant) / (2 * a);
    const y2 = (-b - sqrtDiscriminant) / (2 * a);

    return y1 === y2 ? { y1, y2: null } : { y1, y2 };
}

/**
 * 计算给定参数的二次曲线方程的系数。
 * @param {number} a - 长轴半径。
 * @param {number} b - 短轴半径。
 * @param {number} t - 旋转角度（弧度）。
 * @param {number} p - 中心的 Y 坐标。
 * @param {number} q - 中心的 X 坐标。
 * @returns {Object} 二次曲线方程的系数 { A, B, C, D, E, F }。
 */
export function conicsections(a, b, t, p, q) {
    // 计算A
    const A = (Math.cos(t) ** 2) / a ** 2 + (Math.sin(t) ** 2) / b ** 2;
    // 计算B
    const B = (-2 * Math.cos(t) * Math.sin(t)) / a ** 2 + (2 * Math.sin(t) * Math.cos(t)) / b ** 2;
    // 计算C
    const C = (Math.sin(t) ** 2) / a ** 2 + (Math.cos(t) ** 2) / b ** 2;
    // 计算D
    const D = -2 * A * q - B * p;
    // 计算E
    const E = -1 * B * q - 2 * C * p;
    // 计算F
    const F = A * q ** 2 + B * q * p + C * p ** 2 - 1;
    return { A, B, C, D, E, F };
}

/**
 * 计算二次曲线的导数。
 * @param {number} A - 二次曲线方程的系数 A。
 * @param {number} B - 二次曲线方程的系数 B。
 * @param {number} C - 二次曲线方程的系数 C。
 * @param {number} D - 二次曲线方程的系数 D。
 * @param {number} E - 二次曲线方程的系数 E。
 * @param {number} F - 二次曲线方程的系数 F。
 * @param {number} x - 给定的 X 坐标。
 * @param {number} y - 给定的 Y 坐标。
 * @returns {number|null} 导数值或 null（无解）。
 */
export function calculateDerivative(A, B, C, D, E, F, x, y) {
    const denominator = B * x + 2 * C * y + E;
    if (denominator == 0) {
        throw new Error("Division by zero in derivative calculation.");
    }
    return -(2 * A * x + B * y + D) / denominator;
}

