//全文代码规范：使用含ABCDDEF的一般式表示二次曲线
//使用y-y0=k(x-x0)表示光线，其中k为斜率，(x0,y0)为光线的起始点，光线应该具有终了位置（特殊情况除外）
//使用kx+y+c=0表示直线工作面，曲线工作面问题应该化为直线工作面问题求解。


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

/** 存储所有光线的列表 */
const rays = [];

/**
 * 表示光线的对象。
 * @typedef {Object} Ray
 * @property {number} startX - 光线的起始点 X 坐标。
 * @property {number} startY - 光线的起始点 Y 坐标。
 * @property {number} slope - 光线的斜率（垂直于 X 轴时为 NaN）。
 * @property {number} [endX] - 光线的终了点 X 坐标（可选）。
 */
const ray = {
    startX: 0,
    startY: 0,
    slope: NaN,
    endX: undefined
};

/**
 * 创建一个新的光线并添加到列表中。
 * @param {number} startX - 光线的起始点 X 坐标。
 * @param {number} startY - 光线的起始点 Y 坐标。
 * @param {number} slope - 光线的斜率（垂直于 X 轴时为 NaN）。
 */
function createRay(startX, startY, slope) {
    rays.push({ startX, startY, slope, endX: undefined });
}

/**
 * 为指定索引的光线添加终了点 X 坐标。
 * @param {number} index - 光线的索引。
 * @param {number} endX - 光线的终了点 X 坐标。
 */
function finishRay(index, endX) {
    if (index >= 0 && index < rays.length) {
        rays[index].endX = endX;
    } else {
        console.error("Invalid index");
    }
}

/**
 * 读取指定索引的光线。
 * @param {number} index - 要读取的光线的索引。
 * @returns {[number, number, number, number?]|null} 返回光线的四元组 [startX, startY, slope, endX] 或 null（如果索引无效）。
 */
function readRay(index) {
    if (index >= 0 && index < rays.length) {
        const { startX, startY, slope, endX } = rays[index];
        return [startX, startY, slope, endX];
    } else {
        console.error("Invalid index");
        return null;
    }
}

/**
 * 计算基于输入参数的各种光学值。
 *
 * @param {number} x0 - 初始点的 x 坐标。
 * @param {number} y0 - 初始点的 y 坐标。
 * @param {number} k - 初始光线的斜率。
 * @param {number} k_m - 镜面线的斜率。
 * @param {number} c - 镜面线的 y 截距。
 * @param {number} n1 - 初始介质的折射率。
 * @param {number} n2 - 第二介质的折射率。
 * @returns {Object} 包含计算值的对象：
 * - `x_r` {number}: 反射点的 x 坐标。
 * - `y_r` {number}: 反射点的 y 坐标。
 * - `k_rfl` {number}: 反射光线的斜率。
 * - `k_rfr` {number}: 折射光线的斜率。
 */
function calculateValues(x0, y0, k, k_m, c, n1, n2) {
    // 计算 x_r 和 y_r
    let x_r = (k * x0 - y0 - c) / (k_m + k);
    let y_r = (-k_m * x_r - c);

    // 计算 x_sym 和 y_sym
    let x_sym = (x0 * (1 - k_m * k_m) - 2 * k_m * y0 - 2 * k_m * c) / (k_m * k_m + 1);
    let y_sym = (y0 * (k_m * k_m - 1) - 2 * k_m * x0 - 2 * c) / (k_m * k_m + 1);

    // 计算 k_rfl
    let k_rfl = (y_sym - y_r) / (x_sym - x_r);

    // 计算 alpha_i 和 alpha_r
    let alpha_i = Math.atan(( 1/k_m - k) / (1 + k / k_m));
    let alpha_r = Math.asin((Math.sin(alpha_i) * n1) / n2);

    // 计算 k_rfr
    let k_rfr = (-1 / k_m - Math.tan(alpha_r)) / (Math.tan(alpha_r) / (-k_m) - 1);

    return { x_r, y_r, k_rfl, k_rfr };
}

// 示例调用
let result = calculateValues(1, 2, 3, 4, 5, 6, 7);
console.log(result);