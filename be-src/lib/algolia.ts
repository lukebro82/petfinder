// Default version (all methods)
import algoliasearch from "algoliasearch";

// Search-only version
// import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch("LSBNQVA3H9", process.env.ALGOLIASEARCH);
const algolia = client.initIndex("pets");

export { algolia };
