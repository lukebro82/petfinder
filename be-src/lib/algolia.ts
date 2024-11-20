// Default version (all methods)
import algoliasearch from "algoliasearch";

// Search-only version
// import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch("RKGFA8SB09", process.env.ALGOLIASEARCH);
const index = client.initIndex("pets");

export { index };
