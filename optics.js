

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
function solveQuadratic(A, B, C, D, E, F, k, x0, y0) {
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
 * 计算给定点相对于二次曲线的对称点。
 * @param {number} x1 - 给定点的 X 坐标。
 * @param {number} y1 - 给定点的 Y 坐标。
 * @param {number} D - 二次曲线方程的系数 D。
 * @param {number} E - 二次曲线方程的系数 E。
 * @param {number} F - 二次曲线方程的系数 F。
 * @returns {Object} 对称点 { x, y }。
 */
function symPoint(x1, y1, D, E, F) {
    const denominator = D ** 2 + E ** 2;
    const xSym = (E ** 2 * x1 - D * E * y1 - D * F) / denominator;
    const ySym = (D ** 2 * y1 - D * E * x1 - E * F) / denominator;
    return { x: 2 * xSym - x1, y: 2 * ySym - y1 };
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
function calculateY(A, B, C, D, E, F, n) {
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
 * @param {number} p - 中心的 X 坐标。
 * @param {number} q - 中心的 Y 坐标。
 * @returns {Object} 二次曲线方程的系数 { A, B, C, D, E, F }。
 */
function conicsections(a, b, t, p, q) {
    // 计算A
    const A = (Math.cos(t) ** 2) / a ** 2 + (Math.sin(t) ** 2) / b ** 2;
    // 计算B
    const B = (-2 * Math.cos(t) * Math.sin(t)) / a ** 2 + (2 * Math.sin(t) * Math.cos(t)) / b ** 2;
    // 计算C
    const C = (Math.sin(t) ** 2) / a ** 2 + (Math.cos(t) ** 2) / b ** 2;
    // 计算D
    const D = 2 * A * q - B * p;
    // 计算E
    const E = B * q - 2 * C * p;
    // 计算F
    const F = A * q ** 2 - B * q * p + C * p ** 2 - 1;
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
 * @returns {Object} 导数 { largerDerivative, smallerDerivative } 或 { largerDerivative: null, smallerDerivative: null }（无解）。
 */
function calculateDerivative(A, B, C, D, E, F, x) {
    const { y1, y2 } = calculateY(A, B, C, D, E, F, x);

    if (y1 === null && y2 === null) {
        return { largerDerivative: null, smallerDerivative: null };
    }

    const derivative = (x, y) => -(2 * A * x + B * y + D) / (B * x + 2 * C * y + E);

    const derivative1 = y1 !== null ? derivative(0, y1) : null;
    const derivative2 = y2 !== null ? derivative(0, y2) : null;

    const largerDerivative = Math.max(derivative1, derivative2);
    const smallerDerivative = Math.min(derivative1, derivative2);

    return { largerDerivative, smallerDerivative };
}