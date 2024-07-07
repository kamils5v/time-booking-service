export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>;
};

export const MockRepoFactory: () => MockType<any> = jest.fn(() => ({
  create: jest.fn((entity) => entity),
  findOne: jest.fn((entity) => entity),
  findAll: jest.fn((entity) => entity),
  update: jest.fn((entity) => entity),
  remove: jest.fn((entity) => entity),
}));

export const MockServiceFactory: () => MockType<any> = jest.fn(() => ({
  create: jest.fn((entity) => entity),
  upsert: jest.fn((entity) => entity),
  findOne: jest.fn((entity) => entity),
  findAll: jest.fn((entity) => entity),
  update: jest.fn((entity) => entity),
  remove: jest.fn((entity) => entity),
}));
