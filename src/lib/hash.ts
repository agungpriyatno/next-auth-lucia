import "only-server";
import { hash, verify } from "@node-rs/argon2";


export const generateHashPassword = async ({password}: { password: string }) => {
    return await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
};

export const verifyHashPassword = async ({hash, password}: { password: string, hash: string }) => {
    return await verify(hash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
};
