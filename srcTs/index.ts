import { addAliases } from "module-alias";

// eslint-disable-next-line import-x/no-named-as-default-member
addAliases({
  "@handlers": `${__dirname}/handlers`,
  "@type": `../${__dirname}/types`,
  "@client": `${__dirname}/client`,
  "@base": `${__dirname}/base`,
  "@util": `${__dirname}/util`,
  "@util/s": `${__dirname}/utils.js`,
  "@log": `${__dirname}/log`,
  "@database": `${__dirname}/database`
});

import "module-alias/register";
import "./client";