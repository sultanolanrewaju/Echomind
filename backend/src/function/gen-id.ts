
const genUserID = (): string => {
  const hexChars = "0123456789abcdef";
  let randomHex = "";
  for (let i = 0; i < 12; i++) {
    randomHex += hexChars[Math.floor(Math.random() * 16)];
  }
  return `user_id_${randomHex}`;
};


export default genUserID;
