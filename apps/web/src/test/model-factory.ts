function createMockRequest(overrides?: Partial<Request>): Request {
  const mockedRequest = {
    ...overrides,
  } as Request satisfies Request

  return mockedRequest
}

const modelFactory = {
  request: createMockRequest,
}

export default modelFactory
