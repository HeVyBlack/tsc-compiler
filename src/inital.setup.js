import { findSwcrc } from "./libs/swc";
import config from "./utils/config";
import { initArgv } from "./utils/functions";

export async function initialSetup() {
  config.setSwcrc(await findSwcrc());
  await initArgv();
}
