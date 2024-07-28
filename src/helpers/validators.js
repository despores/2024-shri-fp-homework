/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { __, all, allPass, anyPass, ap, apply, complement, compose, curry, equals, filter, gte, juxt, keys, length, nth, of, prop } from "ramda";

const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle');

const isRed = equals('red');
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');
const isWhite = equals('white');

const notRed = complement(isRed);
const notWhite = complement(isWhite);

const isRedStar = compose(isRed, getStar);
const isGreenSquare = compose(isGreen, getSquare);
const isGreenTriangle = compose(isGreen, getTriangle);
const isBlueCircle = compose(isBlue, getCircle);
const isOrangeSquare = compose(isOrange, getSquare);

const notWhiteStar = compose(notWhite, getStar);
const notRedStar = compose(notRed, getStar);
const notWhiteTriangle = compose(notWhite, getTriangle);

const filterByColor = (isColor) => curry(filter)(isColor);

const countShapeColor = (isColor) => compose(
    length,
    keys,
    filterByColor(isColor)
);

const countRedShapes = curry(countShapeColor)(isRed);
const countBlueShapes = curry(countShapeColor)(isBlue);

const equalsColorAmount = (isColor, amount) => compose(
    equals(amount),
    countShapeColor(isColor)
);

const gteColorAmount = (isColor, amount) => compose(
    gte(__, amount),
    countShapeColor(isColor)
);

const sameValuesInArray = compose(
    apply(equals),
    juxt([nth(0), nth(1)])
);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => {
    const twoWhiteShapes = equalsColorAmount(isWhite, 2);
    const validator = allPass([
        twoWhiteShapes, 
        isRedStar, 
        isGreenSquare
    ]);
    return validator(shapes);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
    const atLeastTwoGreen = gteColorAmount(isGreen, 2);
    return atLeastTwoGreen(shapes);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
    const redEqualsToGreen = compose(
        sameValuesInArray,
        ap([countRedShapes, countBlueShapes]),
        of
    );
    return redEqualsToGreen(shapes);
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (shapes) => {
    const validator = allPass([
        isBlueCircle,
        isRedStar,
        isOrangeSquare
    ]);
    return validator(shapes);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
    const atLeastThreeColors = (isColor) => gteColorAmount(isColor, 3);
    const validator = anyPass([
        atLeastThreeColors(isGreen),
        atLeastThreeColors(isRed),
        atLeastThreeColors(isOrange),
        atLeastThreeColors(isBlue)
    ])
    return validator(shapes);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
    const validator = allPass([
        isGreenTriangle,
        equalsColorAmount(isGreen, 2),
        equalsColorAmount(isRed, 1)
    ]);
    return validator(shapes);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shapes) => {
    const allOrange = equalsColorAmount(isOrange, 4);
    return allOrange(shapes);
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (shapes) => {
    const validator = allPass([
        notWhiteStar,
        notRedStar
    ])
    return validator(shapes);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shapes) => {
    const allGreen = equalsColorAmount(isGreen, 4);
    return allGreen(shapes);
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (shapes) => {
    const triangleEqualToSquare = compose(
        sameValuesInArray,
        ap([getTriangle, getSquare]),
        of
    )
    const validator = allPass([
        triangleEqualToSquare,
        notWhiteTriangle
    ])
    return validator(shapes);
};
