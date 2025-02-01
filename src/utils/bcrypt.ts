import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 2);
  return hash;
};
const comparePassword = async (password: string, hash: string) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};
export { hashPassword, comparePassword };
