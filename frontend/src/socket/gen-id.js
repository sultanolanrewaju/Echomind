import axios from "axios";

const genUserID = () => {
  const hexChars = "0123456789abcdef";
  let randomHex = "";
  for (let i = 0; i < 12; i++) {
    randomHex += hexChars[Math.floor(Math.random() * 16)];
  }
  return `user_id_${randomHex}`;
};

const api = axios.create({
  withCredentials: true,
});

export const createUser = async () => {
  try {
    const url = "http://localhost:3000/api/gen-user";
    const response = await api.post(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error While Creating User:", error);
    throw error;
  }
};

export default genUserID;
