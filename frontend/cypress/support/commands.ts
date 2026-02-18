/// <reference types="cypress" />
import {
  IRegisterUserDto,
  IUser,
  ILoginUserDto,
  ICollectionResponse,
  ICollectionDto,
  AUTH_ENDPOINTS,
  COLLECTION_ENDPOINTS,
} from "@shared/api";

type UserOptionsOverridesType = {
  [k in keyof IRegisterUserDto]?: IRegisterUserDto[k];
};

type CollectionNameType = "animals" | "food";
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      createUser(
        overrides?: UserOptionsOverridesType,
      ): Chainable<{ user: IUser; password: string }>;
      loginUser(
        credentials: ILoginUserDto,
      ): Chainable<Response<{ message: "Login successful" }>>;
      loginNewUser(
        overrides?: UserOptionsOverridesType,
      ): Chainable<{ user: IUser; password: string }>;
      loginNewUserWithSession(
        overrides?: UserOptionsOverridesType,
      ): Chainable<{ user: IUser; password: string }>;
      createCollection(
        name: CollectionNameType,
      ): Chainable<ICollectionResponse>;
      createUserWithCollection(
        collectionName: CollectionNameType,
        overrides?: UserOptionsOverridesType,
      ): Chainable<{
        user: IUser;
        password: string;
        collection: ICollectionResponse;
      }>;
      resetDatabase(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", "/api/test/reset-db").then(() => {
    cy.log("🗑️ Database reset complete");
  });
});

Cypress.Commands.add(
  "createUser",
  (overrides: UserOptionsOverridesType = {}) => {
    return cy.fixture("user").then((defaultUser) => {
      return cy
        .request("POST", `api${AUTH_ENDPOINTS.REGISTER}`, {
          ...defaultUser,
          ...overrides,
        })
        .then((response) => ({
          user: response.body as IUser,
          password: overrides.password || defaultUser.password,
        }));
    });
  },
);

Cypress.Commands.add("loginUser", (credentials: ILoginUserDto) =>
  cy.request("POST", `api${AUTH_ENDPOINTS.LOGIN}`, credentials),
);

Cypress.Commands.add(
  "loginNewUser",
  (overrides: UserOptionsOverridesType = {}) => {
    return cy.createUser(overrides).then((userData) => {
      return cy
        .loginUser({
          email: userData.user.email,
          password: userData.password,
        })
        .then(() => userData);
    });
  },
);

Cypress.Commands.add(
  "loginNewUserWithSession",
  (overrides: UserOptionsOverridesType = {}) => {
    return cy.createUser(overrides).then((userData) => {
      const sessionId = `user-${userData.user.email}`;
      return cy
        .session(sessionId, () =>
          cy.loginUser({
            email: userData.user.email,
            password: userData.password,
          }),
        )
        .then(() => userData);
    });
  },
);

Cypress.Commands.add("createCollection", (name: CollectionNameType) => {
  return cy
    .fixture(`collections/${name}`)
    .then((collection: ICollectionDto) => {
      return cy
        .request("POST", `api${COLLECTION_ENDPOINTS.CREATE}`, {
          name: collection.name,
          cards: collection.cards,
        })
        .then(
          (response) =>
            ({
              id: response.body.id,
              name: response.body.name,
            }) as ICollectionResponse,
        );
    });
});

Cypress.Commands.add(
  "createUserWithCollection",
  (
    collectionName: CollectionNameType,
    overrides: UserOptionsOverridesType = {},
  ) => {
    return cy.createUser(overrides).then(({ user, password }) => {
      return cy.createCollection(collectionName).then((collection) => ({
        user,
        password,
        collection,
      }));
    });
  },
);
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
