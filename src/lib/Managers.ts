import UsersManager from "./Users";
import SlugsManager from "./Slugs";
import Database from "./Database";

export default () => {
    /* Database */
    new Database();

    /* Start Slugs */
    new SlugsManager();

    /* Start Users */
    new UsersManager();
}