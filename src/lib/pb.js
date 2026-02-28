import PocketBase from "pocketbase";

// In dev, Vite proxies /pb -> http://127.0.0.1:8090
// In prod, set VITE_PB_URL to your deployed PocketBase URL
const pbUrl = import.meta.env.VITE_PB_URL || "/pb";

export const pb = new PocketBase(pbUrl);
export default pb;
