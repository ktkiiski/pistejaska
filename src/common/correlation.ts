/**
 * Returns a Pearson correlation coefficent [-1...1] for the given two datasets. Based on:
 * http://stevegardner.net/2012/06/11/javascript-code-to-calculate-the-pearson-correlation-coefficient/
 */
export function calculatePearsonCorrelation(x: number[], y: number[]): number {
    let length = 0;

    if (x.length === y.length) {
        length = x.length;
    } else if (x.length > y.length) {
        length = y.length;
        console.error(`x has more items in it, the last ${x.length - length} item(s) will be ignored`);
    } else {
        length = x.length;
        console.error(`y has more items in it, the last ${y.length - length} item(s) will be ignored`);
    }

    const xy = [];
    const x2 = [];
    const y2 = [];

    for (let i = 0; i < length; i += 1) {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);
    }

    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_x2 = 0;
    let sum_y2 = 0;

    for (let i = 0; i < length; i += 1) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += xy[i];
        sum_x2 += x2[i];
        sum_y2 += y2[i];
    }

    const step1 = (length * sum_xy) - (sum_x * sum_y);
    const step2 = (length * sum_x2) - (sum_x * sum_x);
    const step3 = (length * sum_y2) - (sum_y * sum_y);
    const step4 = Math.sqrt(step2 * step3);
    const answer = step1 / step4;

    return answer;
}

export function renderCorrelation(coefficent: number | null | undefined): string {
    if (coefficent == null || Number.isNaN(coefficent)) {
        return '–';
    }
    let str = coefficent.toFixed(2);
    if (str[0] !== '-') {
        str = `+${str}`;
    }
    const abs = Math.abs(coefficent);
    if (abs >= 0.99) {
        return `${str} (perfect)`;
    }
    if (abs >= 0.8) {
        return `${str} (strong)`;
    }
    if (abs >= 0.6) {
        return `${str} (moderate)`;
    }
    return `${str} (no relation)`;
}
