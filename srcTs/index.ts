import "reflect-metadata";
import 'dotenv/config';
import { addAliases } from "module-alias";

addAliases({
  "@handlers": `${__dirname}/handlers`,
  "@type": `../${__dirname}/types`,
  "@client": `${__dirname}/client`,
  "@base": `${__dirname}/base`,
  "@util": `${__dirname}/util`,
  "@util/s": `${__dirname}/utils.js`,
  "@log": `${__dirname}/log`,
  "@database": `${__dirname}/database`,
  "@schema": `${__dirname}/database/schema`
});

import "module-alias/register";
import "./client";