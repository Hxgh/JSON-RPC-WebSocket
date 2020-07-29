/**
 * 生成四位随机数
 * @returns {string}
 */
export const createFour = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

/**
 * 生成全局唯一标识符GUID
 * @returns {string}
 */
export const createGUID = () => {
  return `${createFour()}${createFour()}'-'${createFour()}'-'${createFour()}'-'${createFour()}'-'${createFour()}${createFour()}${createFour()}`;
};
