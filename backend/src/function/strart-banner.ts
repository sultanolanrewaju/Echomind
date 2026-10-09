import config from "../config/app.config.js"

const LINE = "-".repeat(56);
const printBanner = (): void => {
    console.log(LINE);
    console.log(`\n[+] Node ENV : ${config.NODE_ENV}`);
    console.log("\n[+] MongoDB  : Connected successfully");
    console.log(`\n[+] Server   : http://localhost:${config.PORT}\n`);
    console.log(LINE);
}


export default printBanner