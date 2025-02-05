/**
 * This file is used to add aliases for easier imports in the codebase.
 * You should add aliases for any folders that you want to be able to import from directly.
 */
import { addAliases } from "module-alias";

// Define the aliases for the folders in your codebase
addAliases({ //aliases
  "@handlers": `${__dirname}/handlers`,
  "@type": `../${__dirname}/types`,
  "@client": `${__dirname}/client`,
  "@constants": `${__dirname}/constants`,
  "@utils": `${__dirname}/utils`,
  "@log": `${__dirname}/log`,
});

// Register the aliases
import "module-alias/register";
