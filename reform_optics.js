//全文代码规范：使用含ABCDDEF的一般式表示二次曲线，用作元件的表面
//使用y-y0=a(x-x0)表示光线，其中a为方向向量，(x0,y0)为光线的起始点，光线应该具有终了位置（特殊情况除外）
//使用kx+y+c=0表示直线工作面，曲线工作面问题应该化为直线工作面问题求解。

import * as ConicSectionCalc from 'https://tzzx.maizi20.com/ConicSectionCalc.js';

/**
 * 进行几何光学计算，计算反射和折射光线的斜率和起始点。
 *
 * @param {number} x0 - 入射光线初始点的 x 坐标。
 * @param {number} y0 - 入射光线初始点的 y 坐标。
 * @param {number} k - 入射光线的斜率。
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
function geometricOptics(x0, y0, k, k_m, c, n1, n2) {
    // 计算 x_r 和 y_r
    let x_r = (k * x0 - y0 - c) / (k_m + k);
    let y_r = (-1 * k_m * x_r - c);

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

    return { x_r, y_r, k_rfl, k_rfr};
}


/**
 * 进行几何光学计算，计算反射和折射光线的斜率和起始点（适用于曲面）。
 *
 * @param {number} x0 - 入射光线初始点的 x 坐标。
 * @param {number} y0 - 入射光线初始点的 y 坐标。
 * @param {Object} k - 入射光线的方向向量。
 * @param {Object} surface - 表示曲面的对象，包含 。
 * @param {number} n1 - 初始介质的折射率。
 * @param {number} n2 - 第二介质的折射率。
 * @returns {Object|null} 包含计算值的对象：
 * - `x_r` {number}: 反射点的 x 坐标。
 * - `y_r` {number}: 反射点的 y 坐标。
 * - `k_rfl` {number}: 反射光线的斜率。
 * - `k_rfr` {number}: 折射光线的斜率。
 */
function geometricOpticsSurface(x0, y0, k, surface, n1, n2) {
    const { A, B, C, D, E, F } = surface;
    const {dx ,dy} = k;
    let kl = dy/dx;
    if (kl == Infinity || kl == -Infinity){
        kl = 3e6;
    }


    // 求入射光线与曲面的交点
    const intersection = ConicSectionCalc.solveQuadratic(A, B, C, D, E, F, kl, x0, y0);
    if (intersection === "No real roots") {
        return null; // 无交点
    }

    // 选择合理的入射点
    let x_r, y_r;
    const dotProduct1 = (intersection.x1 - x0) * dx + (intersection.y1 - y0) * dy;
    const dotProduct2 = (intersection.x2 - x0) * dx + (intersection.y2 - y0) * dy;

    if (dotProduct1 > 0 && (dotProduct1 < dotProduct2 || dotProduct2 <= 0)) {
        x_r = intersection.x1;
        y_r = intersection.y1;
    } else if (dotProduct2 > 0) {
        x_r = intersection.x2;
        y_r = intersection.y2;
    } else {
        return null; // 无合理的入射点
    }

    // 计算曲面在交点处的斜率（镜面斜率）
    const Derivative = ConicSectionCalc.calculateDerivative(A, B, C, D, E, F, x_r, y_r);

    // 调用几何光学计算
    return geometricOptics(x0, y0, kl, Derivative,-1*Derivative * x_r + y_r, n1, n2);
}


export { geometricOptics, geometricOpticsSurface };