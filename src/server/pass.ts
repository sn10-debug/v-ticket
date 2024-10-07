import { createHash } from "crypto";

let convert = (pass: string) => {
    const hash = createHash("sha384");
    return hash.update(pass).digest("hex");
};

export default convert;
