import gopher from "./gopher.png";
import duke from "./duke.png";
import unoffical_kt from "./unoffical_kt.png";

export const PROTOCOL = "http://";
export const HOSTS = ["localhost:",
    "ec2-18-192-156-217.eu-central-1.compute.amazonaws.com:",
    "ec2-3-64-31-58.eu-central-1.compute.amazonaws.com:",
    "ec2-3-68-243-90.eu-central-1.compute.amazonaws.com:"];
export const PORTS = ["8080", "8090", "8100"];

export const USERS = "/api/users/";
export const ADVICES = "/api/advices/";

export const EXTERNAL_ADVICE_API = "https://api.adviceslip.com/advice";

export const HEADERS = {
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
}

export const images = [
    gopher,
    unoffical_kt,
    duke
]


export const DEFAULT_USER = { id: "", name: "", age: 0, greeting: "", salary: 0, power: "", newUser: true }
export const SERVICES_DOWN = "Oops! Looks like services for the selected backend is not running.";