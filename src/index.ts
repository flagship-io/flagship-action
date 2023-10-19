/**
 * The entrypoint for the action.
 */
import { run } from './main'


(async ()=> {
    try {
        await run()
    } catch (e) {
        console.log(e)
    }
})();
