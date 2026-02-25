/// <reference types="node" />
import { defineConfig } from "cypress";
import webpackPreprocessor from "@cypress/webpack-preprocessor";
import path from "path";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    viewportWidth: 600,
    viewportHeight: 800,
    supportFile: "cypress/support/commands.ts",
    setupNodeEvents(on) {
      const options = {
        webpackOptions: {
          resolve: {
            extensions: [".ts", ".js"],
            alias: {
              "@shared/*": path.resolve(__dirname, "src/shared/*"),
            },
          },
          module: {
            rules: [
              {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                  {
                    loader: "ts-loader",
                    options: {
                      transpileOnly: true,
                      configFile: path.resolve(
                        __dirname,
                        "cypress/tsconfig.json",
                      ),
                    },
                  },
                ],
              },
            ],
          },
        },
      };
      on("file:preprocessor", webpackPreprocessor(options));
    },
  },
});
